# KoreanForYou - 외국인을 위한 한국어 학습 플랫폼

KoreanForYou는 외국인 학습자들이 효과적으로 한국어를 학습할 수 있도록 돕는 인터랙티브 학습 플랫폼입니다.

## 바로가기

**배포된 사이트**: [http://3.106.179.223/](http://3.106.179.223/)

> ⚠️ **주의**: 현재 HTTP로 배포되어 있어 브라우저의 보안 정책으로 인해 음성 인식(STT) 기능이 제한될 수 있습니다. 음성 인식 기능을 사용하려면 HTTPS 환경이 필요합니다.

## 주요 기능

### 학습 기능
- **레벨 테스트**: 사용자의 한국어 실력을 평가하여 적절한 학습 레벨 제공
- **챕터별 학습**: 공통 챕터와 직무별 챕터로 구성된 체계적인 학습 과정
- **문장 학습**: 개별 문장 학습 및 발음 연습
- **발음 평가**: STT 기술을 활용한 발음 평가 및 피드백
- **시나리오 기반 대화**: AI와의 실전 대화 연습
- **학습 진도 추적**: 학습 기록 및 진행률 관리

### 커뮤니티 기능
- **게시판**: 학습자 간 정보 교류
- **댓글 시스템**: 게시글별 댓글 작성 및 관리
- **내 활동**: 작성한 게시글 및 댓글 관리

### 마이페이지
- **프로필 관리**: 사용자 정보 수정
- **비밀번호 변경**: 보안 관리
- **언어 설정**: 다국어 지원

## 기술 스택

### Core
- **React 19.1.1**: UI 라이브러리
- **Vite 7.1.7**: 빌드 도구
- **TypeScript**: 타입 안정성

### State Management & Data Fetching
- **TanStack Query 5.90.8**: 서버 상태 관리 및 데이터 페칭
- **Axios 1.13.1**: HTTP 클라이언트

### UI Components & Styling
- **Radix UI**: 접근성을 고려한 UI 컴포넌트 라이브러리
- **Tailwind CSS**: 유틸리티 기반 스타일링
- **Lucide React**: 아이콘 라이브러리
- **shadcn/ui**: 커스텀 가능한 UI 컴포넌트

### 기타 라이브러리
- **React Hook Form 7.66.0**: 폼 관리
- **Recharts 3.3.0**: 차트 및 데이터 시각화
- **Embla Carousel**: 캐러셀 컴포넌트
## 프로젝트 구조

```
src/
├── api/              # API 클라이언트 및 엔드포인트
├── components/       # React 컴포넌트
│   ├── ui/          # 재사용 가능한 UI 컴포넌트
│   ├── shared/      # 공유 컴포넌트
│   └── layout/      # 레이아웃 컴포넌트
├── hooks/           # 커스텀 React 훅
│   ├── auth/        # 인증 관련 훅
│   ├── chapters/    # 챕터 관련 훅
│   ├── community/   # 커뮤니티 관련 훅
│   ├── scenarios/   # 시나리오 관련 훅
│   └── users/       # 사용자 관련 훅
├── types/           # TypeScript 타입 정의
├── utils/           # 유틸리티 함수
└── constants/       # 상수 정의
```

## 시작하기

### 요구사항
- Node.js >= 22.12.0
- npm >= 10.0.0

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

### 프로덕션 미리보기

```bash
npm run preview
```

### 린팅

```bash
npm run lint
```

## 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
VITE_API_BASE_URL=your_api_base_url
```

## 주요 화면

- **Landing**: 랜딩 페이지
- **Login/Signup**: 로그인 및 회원가입
- **Home**: 메인 홈 화면
- **Chapter List**: 챕터 목록
- **Sentence Learning**: 문장 학습
- **Pronunciation**: 발음 연습
- **Conversation**: AI 대화 연습
- **Progress**: 학습 진도 확인
- **Community**: 커뮤니티 게시판
- **My Page**: 마이페이지

## 라이센스

This project is private and proprietary.
