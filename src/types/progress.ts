import { BaseResponse, DateString } from "./commonTypes";

export interface UserProgress {
  progress_id: number;
  user_id: number;
  chapter_id: number;
  completion_rate: number;
  last_access_at: number;
  created_at: DateString;
}

/**
 * 단어별 타임스탬프 정보
 */
export interface WordTimestamp {
  text: string;
  start?: number;
  end?: number;
  duration?: number;
  confidence?: number;
}

/**
 * 문장 진행 상태 (기본)
 */
export interface SentenceProgress {
  progress_id: number;
  user_id: number;
  sentence_id: number;
  is_completed: boolean;
  stt_audio_url?: string;
  stt_transcript?: string;
  word_timestamps?: WordTimestamp[];
  total_word_count?: number;
  correct_word_count?: number;
  recognized_word_count?: number;
  total_time?: number;
  start_time?: DateString;
  end_time?: DateString;
  created_at: DateString;
}

/**
 * PATCH /progress/sentences/{sentence_id} 응답 타입
 */
export interface UpdateSentenceProgressResponse extends BaseResponse {
  data: {
    progress_id: number;
    target_sentence: string;           // 원본 문장
    stt_transcript: string;            // STT 변환 결과
    stt_audio_url: string;             // 오디오 파일 URL
    word_timestamps: WordTimestamp[];  // 단어별 타임스탬프
    // 단어 분석 정보
    total_word_count: number;
    recognized_word_count: number;
    correct_word_count: number;
    // 시간 정보
    start_time: DateString;
    end_time: DateString;
    total_time: number;                // 초 단위
    // 상세 분석
    missing_words: string[];           // 누락된 단어들
    extra_words: string[];             // 추가로 말한 단어들
    utterances: any[];                 // 원시 발화 데이터
    // 점수 정보
    pronunciation_score?: number;      // 발음 점수 (0-100)
    pronunciation_detail?: any;        // 발음 상세 정보
    accuracy_score?: number;           // 정확도 점수 (0-100)
    overall_score?: number;            // 전체 점수 (0-100)
  };
}

