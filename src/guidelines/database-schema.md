# 데이터베이스 스키마 가이드

## 개요
요식업 외국인 근로자를 위한 한국어 학습 플랫폼의 데이터베이스 스키마 설계 문서입니다.

---

## 1. 레벨 시스템 (member_lev)

### 테이블 구조
```sql
CREATE TABLE member_lev (
  lev_id TINYINT PRIMARY KEY,             -- 1,2,3
  level_name_ko VARCHAR(10) NOT NULL,     -- 초급/중급/고급
  level_name_en VARCHAR(20) NULL,         -- Beginner/Intermediate/Advanced
  passing_rule JSON NULL,                 -- 예: {"min_pron":80,"wpm":[120,160]}
  sort_order TINYINT NOT NULL DEFAULT 1
);
```

### 데이터 예시
```json
[
  {
    "lev_id": 1,
    "level_name_ko": "초급",
    "level_name_en": "Beginner",
    "passing_rule": {"min_pron": 70, "wpm": [100, 120]},
    "sort_order": 1
  },
  {
    "lev_id": 2,
    "level_name_ko": "중급",
    "level_name_en": "Intermediate",
    "passing_rule": {"min_pron": 80, "wpm": [120, 160]},
    "sort_order": 2
  },
  {
    "lev_id": 3,
    "level_name_ko": "고급",
    "level_name_en": "Advanced",
    "passing_rule": {"min_pron": 85, "wpm": [160, 200]},
    "sort_order": 3
  }
]
```

### 연관 관계
```sql
-- Member 테이블에 레벨 추가
ALTER TABLE member ADD COLUMN level_id TINYINT NOT NULL DEFAULT 1;
ALTER TABLE member ADD CONSTRAINT fk_member_level
  FOREIGN KEY (level_id) REFERENCES member_lev(lev_id);

-- Chapter 테이블에 레벨 추가
ALTER TABLE chapter ADD COLUMN level_id TINYINT NOT NULL;
ALTER TABLE chapter ADD CONSTRAINT fk_chapter_level
  FOREIGN KEY (level_id) REFERENCES member_lev(lev_id);
```

### 게이팅 로직
사용자에게 허용되는 챕터:
```
chapter.level_id <= member.level_id
```

**예시:**
- 초급 사용자 (level_id=1): 초급 챕터만 접근 가능
- 중급 사용자 (level_id=2): 초급, 중급 챕터 접근 가능
- 고급 사용자 (level_id=3): 모든 챕터 접근 가능

---

## 2. 피드백 시스템 (feedback)

### 단일 테이블 + 다형 참조 방식

```sql
CREATE TABLE feedback (
  feedback_id INT PRIMARY KEY AUTO_INCREMENT,
  member_id   INT NOT NULL,
  context_type ENUM('scenario','chapter','sentence') NOT NULL,
  context_id  INT NOT NULL,                 -- 해당 타입의 PK
  pron_score  TINYINT,                      -- 0~100
  fluency_score TINYINT NULL,               -- 선택
  intonation_score TINYINT NULL,            -- 선택
  comment    TEXT NULL,                     -- AI 코멘트(선택)
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_ctx (context_type, context_id),
  FOREIGN KEY (member_id) REFERENCES member(member_id)
);
```

### Context Type별 의미

| context_type | context_id 참조 | 용도 |
|-------------|----------------|------|
| `scenario` | scenario_id | AI 대화 시나리오 피드백 |
| `chapter` | chapter_id | 챕터 단위 피드백 |
| `sentence` | sentence_id | 개별 문장 피드백 |

### 피드백 항목별 사용

| 피드백 항목 | scenario | chapter | sentence |
|-----------|----------|---------|----------|
| pron_score | ✓ | ✓ | ✓ |
| fluency_score | ✓ | ✓ | - |
| intonation_score | ✓ | - | - |
| comment | ✓ | ✓ | - |

### 진행도 테이블 연동

```sql
-- 최근 피드백 참조 추가 (선택)
ALTER TABLE user_sentence_progress 
  ADD COLUMN last_feedback_id INT NULL;

ALTER TABLE user_sentence_progress 
  ADD CONSTRAINT fk_last_feedback
  FOREIGN KEY (last_feedback_id) REFERENCES feedback(feedback_id);
```

### 데이터 예시

**AI 대화 피드백:**
```json
{
  "feedback_id": 1,
  "member_id": 101,
  "context_type": "scenario",
  "context_id": 5,
  "pron_score": 88,
  "fluency_score": 90,
  "intonation_score": 85,
  "comment": "전반적으로 훌륭한 대화였습니다!",
  "created_at": "2025-10-14 10:30:00"
}
```

**문장 학습 피드백:**
```json
{
  "feedback_id": 2,
  "member_id": 101,
  "context_type": "sentence",
  "context_id": 42,
  "pron_score": 95,
  "fluency_score": null,
  "intonation_score": null,
  "comment": null,
  "created_at": "2025-10-14 11:00:00"
}
```

---

## 3. TTS (Text-to-Speech) 정책

### 정책 구분

| 항목 | 저장 방식 | 이유 |
|-----|---------|------|
| **챕터 문장** | 영구 URL 저장 | 재사용률 높음, 변경 거의 없음 |
| **시나리오 대화** | 텍스트만 저장 | 동적 생성, 1회성, 변동 多 |

### 챕터 문장 TTS

```sql
-- 사전 생성한 TTS 파일 URL 저장
ALTER TABLE sentences 
  ADD COLUMN tts_url VARCHAR(255) NULL;

-- 예시 데이터
-- tts_url: "https://cdn.example.com/tts/ko-female-01/sentence_42.mp3"
```

**처리 프로세스:**
1. 관리자가 문장 등록 시 TTS 자동 생성
2. 생성된 오디오를 CDN에 영구 저장
3. `tts_url` 필드에 URL 저장
4. 클라이언트는 해당 URL로 직접 재생

### 시나리오 대화 TTS

```sql
-- 텍스트만 저장, TTS 프리셋만 추가
ALTER TABLE message 
  ADD COLUMN tts_preset VARCHAR(32) NULL;  -- ex) "ko-female-01"
```

**처리 프로세스:**
1. 클라이언트가 TTS 필요 시 API 호출
2. 서버가 실시간 TTS 생성 또는 캐시 확인
3. CDN 단기 캐시 (24~72시간 TTL)
4. 영구 저장 없음

### TTS 중복 방지 (선택)

```
cache_key = hash(text + voice + speed)
```

동일한 텍스트+보이스 조합은 캐시에서 재사용, TTL로 수명 관리

---

## 4. 프론트엔드 연동 가이드

### API 응답 구조 예시

**챕터 목록 조회:**
```typescript
GET /api/chapters?member_id=101

Response:
{
  "member_level": 2,  // 사용자 현재 레벨
  "chapters": [
    {
      "chapter_id": 1,
      "chapter_name": "기본 인사·상태",
      "level_id": 1,
      "level_name": "초급",
      "is_locked": false,  // 접근 가능
      "progress": 100
    },
    {
      "chapter_id": 5,
      "chapter_name": "불만 대응하기",
      "level_id": 3,
      "level_name": "고급",
      "is_locked": true,   // 잠김
      "required_level": "고급",
      "progress": 0
    }
  ]
}
```

**피드백 조회:**
```typescript
GET /api/feedback?member_id=101&context_type=scenario&context_id=5

Response:
{
  "feedback_id": 1,
  "context_type": "scenario",
  "context_id": 5,
  "scores": {
    "pronunciation": 88,
    "fluency": 90,
    "intonation": 85
  },
  "comment": "전반적으로 훌륭한 대화였습니다!",
  "created_at": "2025-10-14T10:30:00Z"
}
```

**TTS 요청:**
```typescript
// 챕터 문장 - 직접 URL 사용
GET /api/sentences/42
Response: {
  "sentence_id": 42,
  "text": "안녕하세요",
  "tts_url": "https://cdn.example.com/tts/sentence_42.mp3"
}

// 시나리오 - 동적 생성
POST /api/tts/generate
Body: {
  "text": "주문하시겠어요?",
  "voice": "ko-female-01",
  "speed": 1.0
}
Response: {
  "audio_url": "https://cdn.example.com/tts/temp/abc123.mp3",
  "expires_at": "2025-10-16T10:30:00Z"
}
```

---

## 5. 확장 고려사항

### 레벨 시스템 확장
- **세분화**: 초A/초B, 중A/중B 등
- **다국어**: level_name_vi, level_name_th 추가
- **통과 기준**: passing_rule JSON 활용

### 피드백 시스템 확장
- **상세 항목 추가**: 
  ```sql
  CREATE TABLE feedback_detail (
    detail_id INT PRIMARY KEY AUTO_INCREMENT,
    feedback_id INT NOT NULL,
    key VARCHAR(50) NOT NULL,    -- "grammar", "vocab", etc.
    value VARCHAR(255),
    FOREIGN KEY (feedback_id) REFERENCES feedback(feedback_id)
  );
  ```

### TTS 시스템 확장
- **다국어 지원**: 베트남어, 태국어 TTS
- **음성 선택**: 남성/여성, 속도 조절
- **감정 표현**: 친절/중립/단호 등

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|-----|------|----------|
| 2025-10-16 | 1.0 | 초기 문서 작성 |
