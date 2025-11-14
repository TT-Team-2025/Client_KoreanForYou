

import { BaseResponse, DateString } from "./commonTypes";


export enum CompletionsStatus {
    IN_PROGRESS = "진행중",
    COMPLETED = "완료",
    CANCELLED = "중단"
}


export interface Scenario{
    scenario_id : number,
    title: string,
    description: string,
    created_at: DateString
}

export interface Message {
  id: number;
  speaker: "ai" | "user";
  text: string;
  translation: string;
  timestamp: string;
}



export interface Role{
    role_id: number,
    role_name: string
}

export interface ScenarioProgress{
    progress_id: number,
    user_id: number,
    scenario_id: number,
    user_role_id: number,
    ai_role_id: number,
    turn_count: number,
    description: string,
    thread_id: string,
    assistant_id: string,
    start_time: DateString,
    end_time: DateString,
    completion_status: CompletionsStatus,
}

// 개별 턴(발화)의 상세 정보
export interface TurnDetail {
    recorded_at: string;
    user_text: string;
    scores: {
        pronunciation: number;
        fluency: number;
        grammar: number | null;
        overall: number;
    };
    details: {
        pronunciation: {
            word_count: number;
            metrics_source: string;
            duration_count: number;
            average_duration: number;
            short_duration_ratio: number;
            long_duration_ratio: number;
            duration_outlier_words: string[];
        };
        fluency: {
            word_count: number;
            words_per_minute: number;
            pause_count: number;
            average_pause: number;
            filler_count: number;
            speaking_duration: number;
            total_duration: number;
        };
        grammar: {
            grammar_score: number | null;
            mistakes: string[];
            suggestions: string[];
        };
        transcript: string;
    };
}

// 주요 문장 리뷰
export interface KeySentenceReview {
    sentence: string;
    issue: string;
    suggestion: string;
}

// 피드백 상세 코멘트
export interface DetailComment {
    improvements: string[];
    key_sentence_reviews: KeySentenceReview[];
    highlights: string[];
    ai_comment: string;
    metrics_summary: {
        pronunciation_score: number;
        fluency_score: number;
        grammar_score: number;
        overall_score: number;
        evaluated_turns: number;
        word_count: number;
        speaking_duration: number;
        total_audio_duration: number;
        per_turn: TurnDetail[];
        grammar_detail: Record<string, any>;
    };
    session_stats: {
        evaluated_turns: number;
        word_count: number;
        speaking_duration_seconds: number;
        total_audio_duration_seconds: number;
        turn_count: number;
        total_time_seconds: number;
    };
}

export interface ScenarioFeedback {
    feedback_id: number;
    user_id?: number;
    log_id: number;
    pronunciation_score?: number;
    accuracy_score?: number | null;
    fluency_score?: number;
    total_score?: number | null;
    comment?: string;
    detail_comment?: DetailComment;
    created_at: DateString;
}

export interface StartScenarioRequest {
    topic: string; // 대화 주제 (예: "편의점에서 계산하기")
    my_role: string; // 나의 역할
    ai_role: string; // AI의 역할
    description?: string; // [수정] 상황 설명 (선택사항) - 서버에서 Optional로 정의됨
}


export interface SendMessageRequest {
    thread_id: string; // OpenAI Thread ID
    message: string; // 전송할 메시지
}


export interface EndScenarioRequest {
    thread_id: string; // OpenAI Thread ID
}


export interface SendVoiceMessageRequest {
    thread_id: string; // OpenAI Thread ID
    file: File; // 음성 파일 (mp4, m4a, mp3, amr, flac, wav)
}

export interface StartScenarioResponse {
    session_id: string; // Thread ID (세션 식별자)
    assistant: string; // AI의 첫 응답 메시지
    assistant_id: string; // OpenAI Assistant ID
    tts_filename: string
}




// STT 전용 응답 (음성 -> 텍스트 변환)
export interface SendVoiceMessageResponse {
    user_text: string; // STT로 변환된 사용자 음성 텍스트
}

// AI 메시지 응답 (텍스트 -> AI 응답)
export interface SendMessageResponse {
    assistant: string; // AI 응답 메시지
    tts_filename?: string; // AI 응답의 TTS 오디오 파일명 (Optional)
}

export interface EndScenarioResponse {
    thread_id: string; // OpenAI Thread ID
    completion_status: string; // 완료 상태
    end_time?: string; // 종료 시간
    turn_count: number; // 총 발화 횟수
    total_time: number; // 총 소요 시간 (초)
    feedback: ScenarioFeedback; // 피드백 정보
}

export interface ConversationSetup {
  topic: string;
  userRole: string;
  aiRole: string;
  situation: string;
}

// 시나리오 저장 응답
export interface SaveScenarioResponse {
  success: boolean;
  message: string;
  thread_id: string;
}

export interface SpeechCountResponse {
    user_id : number,
    total_turn_count : number,
    scenario_count : number
}

// 시나리오 기록 아이템
export interface ScenarioHistoryItem {
    progress_id: number;
    title: string;
    description: string;
    date: DateString;
    completion_status: string; // "완료" | "진행중" | "중단"
}

// 시나리오 기록 목록 응답
export interface ScenarioHistoryResponse extends BaseResponse<ScenarioHistoryItem[]> {
    success: boolean;
    message: string;
    data: ScenarioHistoryItem[];
}

