# 컴포넌트 구조 개선 계획

## 📊 현재 상태
- 24개의 Screen 컴포넌트가 `components/` 폴더에 평면적으로 나열
- 반복되는 UI 패턴이 각 Screen에 중복 구현
- 데이터와 로직이 컴포넌트에 하드코딩

## 🎯 개선 목표
1. **기능별 폴더 구조**: 관련된 Screen들을 기능별로 그룹화
2. **재사용 컴포넌트 추출**: 반복되는 UI 패턴을 공통 컴포넌트로
3. **데이터 분리**: 상수와 타입을 별도 파일로 관리
4. **import 경로 단순화**: 상대 경로 대신 alias 사용 고려

## 📁 제안하는 폴더 구조

```
src/
├── components/
│   ├── screens/              # 🆕 Screen 컴포넌트 (기능별 분류)
│   │   ├── auth/            # 인증 관련
│   │   │   ├── LoginScreen.tsx
│   │   │   └── SignupScreen.tsx
│   │   ├── learning/        # 학습 관련
│   │   │   ├── ChapterListScreen.tsx
│   │   │   ├── SentenceLearningScreen.tsx
│   │   │   └── PronunciationScreen.tsx
│   │   ├── conversation/    # 대화 관련
│   │   │   ├── ScenarioSelectScreen.tsx
│   │   │   ├── ConversationSetupScreen.tsx
│   │   │   ├── ConversationScreen.tsx
│   │   │   └── FeedbackScreen.tsx
│   │   ├── community/       # 커뮤니티
│   │   │   ├── CommunityScreen.tsx
│   │   │   ├── PostDetailScreen.tsx
│   │   │   └── PostCreateScreen.tsx
│   │   ├── profile/         # 마이페이지
│   │   │   ├── MyPageScreen.tsx
│   │   │   ├── MyPostsScreen.tsx
│   │   │   ├── MyCommentsScreen.tsx
│   │   │   ├── PasswordChangeScreen.tsx
│   │   │   └── LanguageSettingsScreen.tsx
│   │   ├── progress/        # 진도/레벨
│   │   │   ├── ProgressScreen.tsx
│   │   │   ├── LevelTestScreen.tsx
│   │   │   ├── LevelTestResultScreen.tsx
│   │   │   └── LevelUpScreen.tsx
│   │   └── home/            # 메인 화면
│   │       ├── LandingPage.tsx
│   │       └── HomeScreen.tsx
│   │
│   ├── layout/              # 🆕 레이아웃 컴포넌트
│   │   ├── Navigation.tsx
│   │   ├── ScreenHeader.tsx      # ✅ 생성됨
│   │   └── BackButton.tsx
│   │
│   ├── shared/              # 🆕 공통 재사용 컴포넌트
│   │   ├── StudyCalendar.tsx
│   │   ├── LearningRecordCard.tsx   # ✅ 생성됨
│   │   ├── SentenceCard.tsx         # ✅ 생성됨
│   │   ├── ConversationBubble.tsx   # ✅ 생성됨
│   │   ├── StatCard.tsx             # ✅ 생성됨
│   │   ├── QuickAccessCard.tsx      # ✅ 생성됨
│   │   ├── LevelBadge.tsx           # ✅ 생성됨
│   │   ├── JobBadge.tsx             # ✅ 생성됨
│   │   └── PostCard.tsx
│   │
│   └── ui/                  # ShadCN 컴포넌트 (유지)
│
├── constants/               # 🆕 상수 데이터
│   ├── jobs.ts             # ✅ 생성됨
│   ├── levels.ts           # ✅ 생성됨
│   └── chapterData.ts
│
├── types/                   # 타입 정의 (기존)
│   └── index.ts
│
└── App.tsx                  # 메인 앱
```

## ✅ 완료된 작업

### 1. 재사용 컴포넌트 생성
- ✅ `ScreenHeader` - 화면 헤더 공통 컴포넌트
- ✅ `LearningRecordCard` - 학습 기록 카드
- ✅ `SentenceCard` - 문장 표시 카드
- ✅ `ConversationBubble` - 대화 말풍선
- ✅ `StatCard` - 통계 카드
- ✅ `QuickAccessCard` - 빠른 접근 카드
- ✅ `LevelBadge` - 레벨 배지
- ✅ `JobBadge` - 직무 배지

### 2. 상수 파일 생성
- ✅ `constants/jobs.ts` - 직무 정보
- ✅ `constants/levels.ts` - 레벨 정보

### 3. 컴포넌트 리팩토링
- ✅ `HomeScreen` - 새 컴포넌트 사용하도록 업데이트

## 🚀 다음 단계 (선택사항)

### Phase 1: 추가 공통 컴포넌트 추출
- [ ] `PostCard` - 커뮤니티 게시물 카드
- [ ] `ChapterCard` - 챕터 선택 카드
- [ ] `BackButton` - 뒤로가기 버튼 표준화
- [ ] `LoadingSpinner` - 로딩 상태 표시

### Phase 2: 데이터 분리
- [ ] `constants/chapterData.ts` - 챕터/문장 데이터
- [ ] `constants/scenarios.ts` - 대화 시나리오 데이터
- [ ] `utils/formatters.ts` - 날짜/시간 포맷팅 유틸

### Phase 3: 폴더 구조 재조직 (선택사항)
현재 구조도 충분히 관리 가능하므로, 프로젝트가 더 커지면 고려:
- [ ] Screen 파일들을 `screens/` 하위 폴더로 이동
- [ ] `Navigation` → `layout/` 폴더로 이동
- [ ] `StudyCalendar` → `shared/` 폴더로 이동

## 📈 개선 효과

### 1. 코드 재사용성 증가
- HomeScreen: 321줄 → 237줄 (**26% 감소**)
- 반복되는 UI 패턴을 컴포넌트로 추출
- 다른 Screen에서도 재사용 가능

### 2. 유지보수성 향상
- 공통 UI 변경 시 한 곳만 수정
- 타입 안전성 향상 (JobKey, LevelId)
- 관심사 분리 (UI, 데이터, 로직)

### 3. 일관성 향상
- 동일한 UI 요소는 동일한 컴포넌트 사용
- 직무/레벨 표시가 전체 앱에서 일관됨

### 4. 개발 속도 향상
- 새 기능 추가 시 기존 컴포넌트 재사용
- 보일러플레이트 코드 감소

## 💡 사용 예시

### Before (기존 코드)
```tsx
<div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg...">
  <div className="flex items-center justify-center w-12 h-12...">
    <BookOpen className="w-6 h-6 text-blue-500" />
  </div>
  <div className="flex-1">
    <div className="flex items-center gap-2 mb-1">
      <span>{record.title}</span>
      <Badge variant="outline" className="text-xs">문장학습</Badge>
    </div>
    // ... 20+ lines more
  </div>
</div>
```

### After (개선된 코드)
```tsx
<LearningRecordCard
  record={record}
  onClick={() => handleRecordClick(record)}
/>
```

## 🎨 컴포넌트 재사용 맵

```
LearningRecordCard
├── HomeScreen (최근 학습 기록)
├── ProgressScreen (전체 학습 기록)
└── FeedbackScreen (관련 기록)

StatCard
├── HomeScreen (통계 그리드)
├── ProgressScreen (상세 통계)
└── MyPageScreen (개인 통계)

SentenceCard
├── SentenceLearningScreen (문장 학습)
├── HomeScreen (오늘의 문장)
└── PronunciationScreen (발음 연습)

QuickAccessCard
├── HomeScreen (빠른 접근)
└── LandingPage (기능 소개)

JobBadge & LevelBadge
├── HomeScreen (사용자 정보)
├── SignupScreen (선택)
├── MyPageScreen (프로필)
└── 모든 헤더 (사용자 상태)
```

## 📝 참고사항

### 현재 구조의 장점
현재의 평면적 구조도 다음과 같은 장점이 있습니다:
- 파일 찾기 쉬움 (알파벳 순서)
- import 경로가 짧음
- 프로젝트 규모가 적당함 (22개 화면)

### 언제 폴더로 분리해야 할까?
다음 경우에 폴더 구조 재조직을 고려하세요:
- Screen이 30개 이상으로 늘어날 때
- 같은 기능군의 Screen이 5개 이상일 때
- 팀원이 파일 찾기 어려워할 때

## 🔄 마이그레이션 전략 (선택)

폴더 구조를 변경하려면:

1. **점진적 이동**: 한 번에 한 기능군씩
2. **테스트 유지**: 각 이동 후 앱 동작 확인
3. **import 업데이트**: 자동 import 정리 활용
4. **문서화**: 변경사항 팀과 공유

### 예시 마이그레이션 스크립트
```bash
# 1. 폴더 생성
mkdir -p components/screens/{auth,learning,conversation,community,profile,progress,home}

# 2. 파일 이동
mv components/LoginScreen.tsx components/screens/auth/
mv components/SignupScreen.tsx components/screens/auth/
# ... (나머지 파일들도 동일)

# 3. import 경로 업데이트
# (IDE의 자동 import 업데이트 기능 사용)
```

## 결론

현재 단계에서는 **재사용 컴포넌트 추출**이 가장 큰 효과를 냅니다. 폴더 재조직은 프로젝트가 더 커지면 고려하면 됩니다. 

이미 완료된 작업만으로도:
- 코드 중복 감소
- 유지보수성 향상
- 일관성 증가

의 효과를 얻을 수 있습니다! 🎉
