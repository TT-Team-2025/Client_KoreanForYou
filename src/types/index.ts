// 데이터베이스 스키마 기반 타입 정의

// 📦 새로운 타입 모듈 export
export * from './progress';
export * from './feedback';

/**
 * 레벨 시스템
 */
export interface MemberLevel {
  lev_id: number; // 1=초급, 2=중급, 3=고급
  level_name_ko: string;
  level_name_en?: string;
  passing_rule?: {
    min_pron: number; // 최소 발음 점수
    wpm: [number, number]; // [최소, 최대] 분당 단어수
  };
  sort_order: number;
}

/**
 * 회원 정보
 */
export interface Member {
  member_id: number;
  nickname: string;
  email: string;
  job: string; // 직무 코드
  level_id: number; // 현재 레벨
  created_at: string;
}

/**
 * 챕터 정보
 */
export interface Chapter {
  chapter_id: string;
  chapter_name: string;
  chapter_type: 'common' | 'job'; // 공통 or 직무별
  level_id: number; // 필요 레벨
  level_name?: string; // UI용
  is_locked?: boolean; // 잠김 여부 (프론트 계산)
  required_level?: string; // 필요 레벨명
  order_num: number;
  total_sentences?: number;
  completed_sentences?: number;
  progress?: number; // 진행률 (%)
}

/**
 * 문장 정보
 */
export interface Sentence {
  sentence_id: number;
  chapter_id: string;
  text_ko: string;
  text_en: string;
  text_vi?: string;
  tts_url?: string; // 사전 생성된 TTS URL
  order_num: number;
  mastery?: number; // 숙련도 (0-100)
}

/**
 * 피드백 컨텍스트 타입
 */
export type FeedbackContextType = 'scenario' | 'chapter' | 'sentence';

/**
 * 피드백 정보
 */
export interface Feedback {
  feedback_id: number;
  member_id: number;
  context_type: FeedbackContextType;
  context_id: number;
  pron_score?: number; // 발음 점수 (0-100)
  fluency_score?: number; // 유창성 점수
  intonation_score?: number; // 억양 점수
  comment?: string; // AI 코멘트
  created_at: string;
}

/**
 * 시나리오 메시지
 */
export interface ScenarioMessage {
  message_id: number;
  scenario_id: number;
  role: 'user' | 'ai';
  content: string;
  tts_preset?: string; // ex) "ko-female-01"
  order_num: number;
}

/**
 * TTS 요청
 */
export interface TTSRequest {
  text: string;
  voice?: string; // 음성 프리셋
  speed?: number; // 재생 속도 (0.5 ~ 2.0)
}

/**
 * TTS 응답
 */
export interface TTSResponse {
  audio_url: string;
  expires_at?: string; // 캐시 만료 시간
}

/**
 * 학습 기록 (UI용 통합 타입)
 */
export interface LearningRecord {
  id: number | string;
  type: 'conversation' | 'sentence';
  title: string;
  date: string;
  // AI 대화 관련
  score?: number;
  duration?: string;
  userRole?: string;
  aiRole?: string;
  situation?: string;
  // 문장 학습 관련
  progress?: number;
  completedSentences?: number;
  totalSentences?: number;
}

/**
 * API 응답: 챕터 목록
 */
export interface ChapterListResponse {
  member_level: number;
  chapters: Chapter[];
}

/**
 * API 응답: 피드백
 */
export interface FeedbackResponse {
  feedback_id: number;
  context_type: FeedbackContextType;
  context_id: number;
  scores: {
    pronunciation?: number;
    fluency?: number;
    intonation?: number;
  };
  comment?: string;
  created_at: string;
}

/**
 * 레벨 게이팅 헬퍼
 */
export const isChapterUnlocked = (
  userLevelId: number,
  chapterLevelId: number
): boolean => {
  return chapterLevelId <= userLevelId;
};

/**
 * 레벨 정보 맵 (UI용)
 */
export const LEVEL_MAP: Record<number, MemberLevel> = {
  1: {
    lev_id: 1,
    level_name_ko: '초급',
    level_name_en: 'Beginner',
    passing_rule: { min_pron: 70, wpm: [100, 120] },
    sort_order: 1,
  },
  2: {
    lev_id: 2,
    level_name_ko: '중급',
    level_name_en: 'Intermediate',
    passing_rule: { min_pron: 80, wpm: [120, 160] },
    sort_order: 2,
  },
  3: {
    lev_id: 3,
    level_name_ko: '고급',
    level_name_en: 'Advanced',
    passing_rule: { min_pron: 85, wpm: [160, 200] },
    sort_order: 3,
  },
};

/**
 * 레벨 ID로 레벨명 가져오기
 */
export const getLevelName = (levelId: number): string => {
  return LEVEL_MAP[levelId]?.level_name_ko || '알 수 없음';
};

/**
 * 직무 코드 맵
 */
export const JOB_MAP: Record<string, string> = {
  'kitchen-assistant': '주방보조',
  'server': '서빙',
  'barista': '바리스타',
  'cashier': '캐셔',
  'delivery': '배달',
  'head-chef': '주방장',
  'dishwasher': '설거지',
};
