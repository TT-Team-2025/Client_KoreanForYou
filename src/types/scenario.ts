

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

export interface ScenarioFeedback {
    feedback_id: number;
    user_id?: number; // Optional: 서버에서 nullable
    log_id: number;
    pronunciation_score?: number; // 발음 점수 (0-100)
    accuracy_score?: number; // 정확도 점수 (0-100)
    fluency_score?: number; // 유창성 점수 (0-100)
    completeness_score?: number; // [추가] 완성도 점수 (0-100) - 서버 DB에 존재하지만 프론트 타입에 누락됨
    total_score?: number; // 총점 (0-100)
    comment?: string; // AI 피드백 코멘트
    detail_comment?: string[]; // [수정] 개선 제안 사항 (string에서 string[]로 변경) - 서버에서 JSON 배열로 저장
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
}


export interface SendMessageResponse {
    assistant: string; // AI 응답 메시지
}


export interface SendVoiceMessageResponse {
    assistant: string; // AI 응답 텍스트
    user_text: string; // STT로 변환된 사용자 음성 텍스트
    tts_filename?: string; // AI 응답의 TTS 오디오 파일명 (Optional)
}

export interface EndScenarioResponse {
    thread_id: string; // OpenAI Thread ID
    completion_status: string; // 완료 상태
    end_time?: string; // 종료 시간 (Optional)
    turn_count: number; // 총 발화 횟수
}

