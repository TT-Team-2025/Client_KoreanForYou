import { DateString } from "./commonTypes";
import { WordTimestamp } from "./progress";

/**
 * 챕터 피드백
 */
export interface ChapterFeedback {
  feedback_id: number;
  user_id: number;
  chapter_id: number;
  total_score?: number;              // 0-100
  pronunciation_score?: number;      // 0-100
  accuracy_score?: number;           // 0-100
  completion_time?: number;          // 초 단위
  total_sentences: number;
  completed_sentences: number;
  summary_feedback?: string;
  weaknesses?: string[];
  total_time?: number;
  created_at: DateString;
}

/**
 * 챕터 피드백 생성 요청
 */
export interface ChapterFeedbackCreate {
  // 백엔드에서 자동으로 생성하므로 빈 객체 또는 필요한 필드만
}

/**
 * 문장 피드백
 */
export interface SentenceFeedback {
  feedback_id: number;
  user_id: number;
  sentence_id: number;
  sentence_progress_id: number;
  weaknesses?: string[];             // 약점 목록
  word_timestamps?: WordTimestamp[]; // 단어별 타임스탬프
  pronunciation_score?: number;      // 발음 점수 (0-100)
  accuracy_score?: number;           // 정확도 점수 (0-100)
  overall_score?: number;            // 전체 점수 (0-100)
}

/**
 * 문장 피드백 생성 요청
 */
export interface SentenceFeedbackCreate {
  user_id: number;
  sentence_id: number;
  sentence_progress_id: number;
}

/**
 * GET /feedback/sentences/{sentence_id} 응답 타입
 */
export interface SentenceFeedbackResponse extends SentenceFeedback {}

/**
 * POST /feedback/sentences/{sentence_id} 요청 타입
 */
export interface CreateSentenceFeedbackRequest {
  sentence_progress_id: number;
}
