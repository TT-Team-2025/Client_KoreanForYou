/**
 * 챕터 정보
 */
export interface Chapter {
  chapter_id: string;
  chapter_name: string;
  chapter_type: "common" | "job"; // 공통 or 직무별
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
