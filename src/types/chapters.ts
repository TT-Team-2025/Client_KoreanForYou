import { DateString } from "./commonTypes";

/**
 * 챕터 정보
 */
export interface Chapter {
  chapter_id: string;
  chapter_name: string;
  chapter_type: "common" | "job"; // 공통 or 직무별
  job_id: number; // ✅ 공통=0, 직무별=1~7
  level_id: number;
  level_name?: string;
  is_locked?: boolean;
  required_level?: string;
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
  tts_url?: string;
  order_num: number;
  mastery?: number; // 숙련도 (0-100)
}

export interface ChapterSentencesResponse {
  sentences: Sentence[];
  total: number;
  page: number;
  size: number;
}

export interface GetSentence {
  chapter_id: number;
  content: string;
  translated_content?: string | null;
  tts_url?: string | null;
  sentence_id: number;
  created_at?: DateString;
}
