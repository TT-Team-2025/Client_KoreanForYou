import { BaseResponse, DateString } from "./commonTypes";

/**
 * 외부 API 서비스 관련 타입 정의 (TTS/STT/LLM)
 */

// ==================== TTS 관련 타입 ====================

/**
 * TTS 요청 스키마
 */
export interface TTSRequest {
  text: string;
  speaker?: string;
  speed?: number;
  volume?: number;
  pitch?: number;
  emotion?: string;
  format?: string;
}

/**
 * TTS 파일 생성 응답 데이터
 */
export interface TTSFileResponseData {
  file_path: string;
  filename: string;
  text: string;
  speaker: string;
  format: string;
}

/**
 * TTS 파일 생성 응답
 */
export type TTSFileResponse = BaseResponse<TTSFileResponseData>;

// ==================== STT 관련 타입 ====================

/**
 * STT 설정 옵션
 */
export interface STTConfig {
  model_name?: string;
  language?: string;
  use_itn?: boolean;
  use_disfluency_filter?: boolean;
  use_profanity_filter?: boolean;
  use_paragraph_splitter?: boolean;
  use_word_timestamp?: boolean;
}

/**
 * STT 결과 아이템 (단어 타임스탬프)
 */
export interface STTWordTimestamp {
  word: string;
  start_time: number;
  end_time: number;
  confidence?: number;
}

/**
 * STT 전사 결과
 */
export interface STTTranscriptionResult {
  text: string;
  confidence?: number;
  words?: STTWordTimestamp[];
  start_time?: number;
  end_time?: number;
}

/**
 * STT 파일 업로드 응답 데이터
 */
export interface STTFileResponseData {
  transcribe_id: string;
  results?: STTTranscriptionResult[];
  status?: string;
}

/**
 * STT 파일 업로드 응답
 */
export type STTFileResponse = BaseResponse<STTFileResponseData>;

/**
 * STT 전사 결과 조회 응답 데이터
 */
export interface STTTranscribeResultData {
  id: string;
  status: string;
  results?: STTTranscriptionResult[];
  message?: string;
}

/**
 * STT 전사 결과 조회 응답
 */
export type STTTranscribeResultResponse = BaseResponse<STTTranscribeResultData>;

// ==================== LLM 관련 타입 ====================

/**
 * LLM 요청 스키마
 */
export interface LLMRequest {
  prompt: string;
  prompt_role?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * LLM 사용량 정보
 */
export interface LLMUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

/**
 * LLM 생성 응답 데이터
 */
export interface LLMGenerateResponseData {
  generated_text: string;
  model: string;
  max_tokens?: number;
  usage?: LLMUsage;
  finish_reason?: string;
  full_response?: any;
  prompt: string;
  prompt_role: string;
  request_model?: string;
  request_max_tokens?: number;
}

/**
 * LLM 텍스트 생성 응답
 */
export type LLMGenerateResponse = BaseResponse<LLMGenerateResponseData>;

// ==================== 에러 관련 타입 ====================

/**
 * API 에러 응답
 */
export interface ErrorResponse {
  detail: string;
}

// ==================== 파일 업로드 관련 타입 ====================

/**
 * 지원되는 오디오 파일 확장자
 */
export type AudioFileExtension = '.mp4' | '.m4a' | '.mp3' | '.amr' | '.flac' | '.wav';

/**
 * 지원되는 오디오 포맷
 */
export type AudioFormat = 'mp3' | 'wav' | 'ogg';

/**
 * TTS 화자 타입
 */
export type TTSSpeaker = 'nara' | string;

/**
 * TTS 감정 타입
 */
export type TTSEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | string;

/**
 * LLM 프롬프트 역할
 */
export type LLMPromptRole = 'user' | 'system' | 'assistant';

/**
 * 전사 상태
 */
export type TranscriptionStatus = 'completed' | 'failed' | 'processing' | 'pending';
