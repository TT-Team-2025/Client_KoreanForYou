# 와이어프레임 피드백 및 개선사항

## 개요
2025년 10월 16일 기준 와이어프레임 검토 결과 개선이 필요한 사항을 정리한 문서입니다.

---

## 1. Input Box 처리 방식 명확화 필요

### 현재 상황
- 각 화면의 입력 필드가 어떤 형태로 구현될지 명시되지 않음
- 구현 방식에 대한 프론트-백엔드 간 합의 필요

### 필요한 작업

#### 입력 형태 표시
각 입력 필드에 대해 다음 중 하나로 명시:
- **Text Input**: 일반 텍스트 입력
- **Select Box**: 드롭다운 선택
- **Radio Button**: 단일 선택
- **Checkbox**: 다중 선택
- **Textarea**: 긴 텍스트 입력
- **Date Picker**: 날짜 선택
- **Number Input**: 숫자 입력

#### 현재 결정 사항
- **기본 입력 방식**: 텍스트 박스로 생각했습니다

#### 액션 아이템
- [ ] 백엔드 팀과 입력 필드 타입 공유
- [ ] 프론트엔드 팀과 UI 컴포넌트 선택 협의
- [ ] 각 화면별 입력 필드 명세서 작성

### 화면별 입력 필드 체크리스트

#### 로그인 화면 (LoginScreen.tsx)
- [x] 이메일: Text Input (email type)
- [x] 비밀번호: Text Input (password type)

#### 회원가입 화면 (SignupScreen.tsx)
- [x] 이메일: Text Input (email type)
- [x] 비밀번호: Text Input (password type)
- [x] 비밀번호 확인: Text Input (password type)
- [x] 닉네임: Text Input (text type)
- [x] 국적: Select Box
- [ ] **직무: Select Box** ⚠️ 명시 필요
  - 옵션: 주방보조, 서빙, 바리스타, 캐셔, 배달, 주방장, 설거지

#### 레벨 테스트 화면 (LevelTestScreen.tsx)
- [ ] **답변 입력 방식** ⚠️ 명시 필요
  - Radio Button (객관식) or
  - Text Input (주관식) or
  - 음성 입력?

#### 문장 학습 화면 (SentenceLearningScreen.tsx)
- [ ] **발음 녹음**: Audio Input (녹음 버튼)
- [ ] **사용자 답변**: ⚠️ 방식 결정 필요
  - 음성만? 텍스트도?

#### 커뮤니티 화면 (CommunityScreen.tsx)
- [ ] **검색**: Text Input (search type)
- [ ] **카테고리 필터**: Select Box or Tabs

#### 게시글 작성 (PostCreateScreen.tsx)
- [x] 제목: Text Input
- [x] 내용: Textarea
- [ ] **카테고리**: Select Box ⚠️ 명시 필요
- [ ] **이미지 업로드**: File Input ⚠️ 지원 여부 결정

#### 마이페이지 (MyPageScreen.tsx)
- [x] 닉네임: Text Input
- [x] 국적: Select Box
- [x] 직무: Select Box

---

## 2. 페이지 종류 구분 필요

### 현재 상황
- 전체 페이지 화면인지, 모달/팝업인지 구분이 불명확
- 네비게이션 플로우 파악에 어려움

### 페이지 타입 분류

#### 전체 화면 (Full Screen)
독립적인 화면으로 전체를 차지:
- ✅ LoginScreen
- ✅ SignupScreen
- ✅ HomeScreen
- ✅ LevelTestScreen
- ✅ LevelTestResultScreen
- ✅ ChapterListScreen
- ✅ SentenceLearningScreen
- ✅ PronunciationScreen
- ✅ ScenarioSelectScreen
- ✅ ConversationSetupScreen
- ✅ ConversationScreen
- ✅ FeedbackScreen
- ✅ ProgressScreen
- ✅ CommunityScreen
- ✅ PostDetailScreen
- ✅ PostCreateScreen
- ✅ MyPageScreen
- ✅ PasswordChangeScreen
- ✅ LanguageSettingsScreen
- ✅ LevelUpScreen

#### 모달/팝업 (Modal/Popup)
기존 화면 위에 떠서 표시:
- ⚠️ **현재 없음** - 필요한 경우 추가 검토 필요

#### 가능한 모달 후보
다음 화면들은 모달로 전환 검토 가능:
- 레벨 업 화면 (LevelUpScreen) → 축하 팝업
- 비밀번호 변경 (PasswordChangeScreen) → 설정 모달
- 언어 설정 (LanguageSettingsScreen) → 설정 모달

#### 액션 아이템
- [ ] 각 화면에 페이지 타입 명시 (Full Screen / Modal / Drawer / Dialog)
- [ ] 모달이 필요한 경우 구체화
- [ ] 네비게이션 플로우 다이어그램 작성

---

## 3. 시작 페이지 - "오늘의 문장" 관리 주체

### 현재 상황
HomeScreen에 "오늘의 문장" 섹션이 있으나, 관리 방법이 미정

### 논의 필요 사항

#### Option 1: 백엔드 관리
**장점:**
- 모든 사용자에게 동일한 문장 제공 가능
- 일정에 맞춰 자동 업데이트 가능
- 관리자 페이지에서 사전 등록/스케줄링 가능

**단점:**
- 백엔드 개발 필요
- 초기 데이터 세팅 필요

**API 예시:**
```typescript
GET /api/today-sentence
Response: {
  date: "2025-10-16",
  sentence_ko: "안녕하세요",
  sentence_en: "Hello",
  category: "greeting",
  tts_url: "https://cdn.../today_1016.mp3"
}
```

#### Option 2: 프론트엔드 관리 (Static)
**장점:**
- 빠른 구현
- 백엔드 부담 없음

**단점:**
- 업데이트를 위해 배포 필요
- 사용자별 맞춤화 불가

**구현 예시:**
```typescript
const todaySentences = [
  { date: "2025-10-16", ko: "안녕하세요", en: "Hello" },
  { date: "2025-10-17", ko: "감사합니다", en: "Thank you" },
  // ...
];

const today = new Date().toISOString().split('T')[0];
const todaySentence = todaySentences.find(s => s.date === today);
```

#### Option 3: 혼합 방식 (추천)
**프론트엔드:**
- 기본 문장 리스트 보유 (fallback)

**백엔드:**
- API로 오늘의 문장 제공
- 실패 시 프론트엔드 fallback 사용

#### 액션 아이템
- [ ] 관리 주체 결정 (백엔드 / 프론트 / 혼합)
- [ ] 선택한 방식에 따른 개발 계획 수립
- [ ] 데이터 구조 및 API 스펙 정의 (백엔드 선택 시)

---

## 4. 학습 페이지 - 정답/오답 피드백 화면 누락

### 현재 상황
- 문장 학습 후 정답/오답 표시 화면이 없음
- 한 문장 학습 완료 후 즉시 피드백 없이 다음 문장으로 이동

### 필요한 화면/기능

#### 4.1 즉시 피드백 화면
각 문장 학습 직후 표시:

**정답인 경우:**
```
┌─────────────────────────────┐
│   ✅ 정답입니다!            │
│                             │
│   발음 점수: 95점           │
│   🎯 완벽해요!              │
│                             │
│   [다음 문장으로] 버튼      │
└─────────────────────────────┘
```

**오답인 경우:**
```
┌─────────────────────────────┐
│   ❌ 아쉬워요               │
│                             │
│   발음 점수: 65점           │
│   💡 다시 한번 연습해볼까요?│
│                             │
│   정답: "안녕하세요"        │
│   내 답: "안녕하새요"       │
│                             │
│   [다시 듣기] [재시도]      │
│   [다음 문장으로]           │
└─────────────────────────────┘
```

#### 4.2 문장 학습 결과 페이지
챕터 내 여러 문장 학습 후 표시:

```
┌─────────────────────────────┐
│   학습 완료!                │
│                             │
│   오늘의 학습 결과          │
│   ────────────────          │
│   학습 문장: 10개           │
│   정답: 8개                 │
│   오답: 2개                 │
│   평균 점수: 87점           │
│                             │
│   [틀린 문장 복습]          │
│   [다음 챕터로]             │
│   [학습 종료]               │
└─────────────────────────────┘
```

#### 4.3 구현 필요 사항

**프론트엔드:**
- [ ] 즉시 피드백 컴포넌트 생성 (`SentenceResultCard.tsx`)
- [ ] 문장 학습 결과 페이지 생성 (`SentenceLearningResultScreen.tsx`)
- [ ] 애니메이션 효과 (정답: 초록색 체크, 오답: 빨간색 X)
- [ ] 음성 재생 기능 (다시 듣기)
- [ ] 재시도 로직

**백엔드:**
- [ ] 문장별 정답/오답 판정 API
```typescript
POST /api/sentences/:id/check
Body: {
  user_audio: "base64_encoded_audio",
  // or
  user_text: "안녕하새요"
}
Response: {
  is_correct: false,
  score: 65,
  expected: "안녕하세요",
  actual: "안녕하새요",
  feedback: "'세'를 '세요'로 발음해주세요"
}
```

- [ ] 학습 세션 완료 API
```typescript
POST /api/learning-sessions/:id/complete
Body: {
  chapter_id: "c1",
  results: [
    { sentence_id: 1, is_correct: true, score: 95 },
    { sentence_id: 2, is_correct: false, score: 65 },
    // ...
  ]
}
Response: {
  session_id: 123,
  total_sentences: 10,
  correct_count: 8,
  average_score: 87,
  completed_at: "2025-10-16T10:30:00Z"
}
```

#### 4.4 UX 플로우

```
문장 학습 시작
    ↓
문장 1 학습 (발음 녹음/입력)
    ↓
[NEW] 즉시 피드백 표시 (정답/오답)
    ↓
다음 문장으로 or 재시도
    ↓
... (반복)
    ↓
마지막 문장 완료
    ↓
[NEW] 학습 결과 페이지
    ↓
챕터 목록 or 복습 or 홈
```

#### 4.5 UI 컴포넌트 구조 제안

```tsx
// 즉시 피드백 컴포넌트
interface SentenceResultProps {
  isCorrect: boolean;
  score: number;
  expected: string;
  actual?: string;
  feedback?: string;
  onNext: () => void;
  onRetry: () => void;
  onPlayAudio: () => void;
}

// 학습 결과 페이지
interface SentenceLearningResultProps {
  totalSentences: number;
  correctCount: number;
  averageScore: number;
  incorrectSentences: Array<{
    id: number;
    korean: string;
    yourAnswer: string;
  }>;
  onReview: () => void;
  onNextChapter: () => void;
  onFinish: () => void;
}
```

#### 액션 아이템
- [ ] 즉시 피드백 UI/UX 디자인 완성
- [ ] 학습 결과 페이지 디자인 완성
- [ ] 정답 판정 로직 백엔드와 협의
  - 발음 점수 기준 (몇 점 이상 정답?)
  - 텍스트 매칭 방식 (완전 일치? 유사도?)
- [ ] 재시도 횟수 제한 여부 결정
- [ ] 틀린 문장 복습 기능 스펙 정의

---

## 5. 커뮤니티 활동 페이지 누락 (✅ 해결됨)

### 현재 상황
- ~~내가 작성한 글을 보는 페이지가 없음~~ ✅ 추가됨
- ~~내가 작성한 댓글을 보는 페이지가 없음~~ ✅ 추가됨

### 해결 내용 (2025-10-16)

#### 추가된 화면
1. **MyPostsScreen** - 내가 쓴 글 목록
   - 게시글 제목, 카테고리, 내용 미리보기
   - 조회수, 좋아요, 댓글 수 표시
   - 작성 날짜 표시
   - 빈 상태 처리 (작성한 글이 없을 때)

2. **MyCommentsScreen** - 내가 쓴 댓글 목록
   - 원글 제목 및 카테고리 표시
   - 댓글 내용
   - 작성 날짜/시간, 좋아요 수 표시
   - 빈 상태 처리 (작성한 댓글이 없을 때)

#### MyPageScreen 업데이트
- "커뮤니티 활동" 섹션 추가
  - "내가 쓴 글" 메뉴
  - "내가 쓴 댓글" 메뉴

#### 데이터 구조
```typescript
// 내가 쓴 글
interface MyPost {
  id: number;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
}

// 내가 쓴 댓글
interface MyComment {
  id: number;
  postTitle: string;
  postCategory: string;
  content: string;
  createdAt: string;
  likes: number;
}
```

---

## 6. 추가 개선 제안

### 6.1 에러 상태 처리
현재 화면들에 에러 상태 UI가 부족:
- [ ] 네트워크 오류 화면
- [ ] 데이터 로딩 실패 화면
- [ ] 권한 없음 화면 (403)
- [ ] 페이지 없음 화면 (404)

### 6.2 로딩 상태 표시
- [ ] 스켈레톤 UI 추가
- [ ] 로딩 스피너 일관성 확보
- [ ] 긴 작업 시 프로그레스 바 표시

### 6.3 접근성 (Accessibility)
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 지원 (ARIA 레이블)
- [ ] 색상 대비 검토 (WCAG 준수)

---

## 우선순위

### 🔴 High Priority (긴급)
1. **학습 페이지 정답/오답 피드백** - 핵심 기능
2. **Input Box 타입 명세** - 개발 시작 전 필수
3. **"오늘의 문장" 관리 주체 결정** - 아키텍처 영향

### 🟡 Medium Priority (중요)
4. **페이지 타입 분류** - 네비게이션 설계
5. **에러 상태 처리** - 사용자 경험

### 🟢 Low Priority (나중에)
6. **접근성 개선** - 품질 향상
7. **로딩 상태 개선** - UX 개선

### ✅ 완료
- **커뮤니티 활동 페이지** (2025-10-16)
  - 내가 쓴 글 페이지
  - 내가 쓴 댓글 페이지

---

## 다음 회의 안건

1. Input Box 타입 최종 확정 (백엔드 - 프론트엔드)
2. "오늘의 문장" 관리 방식 결정
3. 정답/오답 판정 로직 설계
4. 문장 학습 결과 페이지 스펙 정의
5. 모달/팝업이 필요한 화면 검토

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|-----|------|----------|
| 2025-10-16 | 1.0 | 초기 피드백 문서 작성 |
| 2025-10-16 | 1.1 | 커뮤니티 활동 페이지 추가 (내가 쓴 글, 내가 쓴 댓글) |
