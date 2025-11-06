/**
 * 시나리오 AI 대화 관련 타입 정의
 * 서버: Server_KoreanForYou/app/schemas/scenario_dto.py, app/models/scenario.py
 */

import { BaseResponse, DateString } from "./commonTypes";

// ============================================
// Enums
// ============================================

/**
 * 시나리오 완료 상태
 * 서버: CompletionStatus enum (scenario.py:11-15)
 */
export enum CompletionsStatus {
    IN_PROGRESS = "진행중",
    COMPLETED = "완료",
    CANCELLED = "중단"
}

// ============================================
// Database Models (서버 DB 테이블과 매핑)
// ============================================

/**
 * 시나리오 정보
 * 서버: Scenario model (scenario.py:18-34)
 */
export interface Scenario{
    scenario_id : number,
    title: string,
    description: string,
    created_at: DateString
}

/**
 * 역할 정보 (사용자/AI 역할)
 * 서버: Role model (scenario.py:37-47)
 */
export interface Role{
    role_id: number,
    role_name: string
}

/**
 * 시나리오 진행 상황
 * 서버: ScenarioProgress model (scenario.py:50-77)
 */
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

/**
 * 시나리오 피드백 정보
 * 서버: ScenarioFeedback model (scenario.py:80-103)
 *
 * 변경사항:
 * - completeness_score 추가: 서버 DB에는 있지만 프론트 타입에 누락되어 있었음
 * - detail_comment를 string[]로 변경: 서버에서 JSON 배열로 저장되고 ScenarioFeedbackResponse에서도 List[str]로 정의됨
 * - 모든 점수 필드를 optional로 변경: 서버 스키마(scenario_dto.py:60-64)에서 Optional로 정의됨
 */
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

// ============================================
// API Request Types (클라이언트 → 서버)
// ============================================

/**
 * 시나리오 시작 요청
 * 서버: StartScenarioRequest (scenario_dto.py:10-15)
 * API: POST /api/v1/scenarios/start
 *
 * 변경사항:
 * - 이름 변경: CreateScenario → StartScenarioRequest (서버 스키마명과 일치)
 * - description을 optional로 변경: 서버에서 Optional[str]로 정의됨
 */
export interface StartScenarioRequest {
    topic: string; // 대화 주제 (예: "편의점에서 계산하기")
    my_role: string; // 나의 역할
    ai_role: string; // AI의 역할
    description?: string; // [수정] 상황 설명 (선택사항) - 서버에서 Optional로 정의됨
}

/**
 * 텍스트 메시지 전송 요청
 * 서버: SendMessageRequest (scenario_dto.py:25-28)
 * API: POST /api/v1/scenarios/message
 *
 * 변경사항:
 * - 이름 변경: ThreadMessage → SendMessageRequest (서버 스키마명과 일치)
 */
export interface SendMessageRequest {
    thread_id: string; // OpenAI Thread ID
    message: string; // 전송할 메시지
}

/**
 * 시나리오 종료 요청
 * 서버: EndScenarioRequest (scenario_dto.py:43-45)
 * API: POST /api/v1/scenarios/end
 *
 * 변경사항:
 * - 이름 변경: EndScenario → EndScenarioRequest (서버 스키마명과 일치하도록)
 */
export interface EndScenarioRequest {
    thread_id: string; // OpenAI Thread ID
}

/**
 * 음성 메시지 전송 요청 (FormData)
 * 서버: POST /api/v1/scenarios/message/voice (scenario_controller.py:110-116)
 *
 * [새로 추가]
 * 이유: 서버에 음성 메시지 API가 있지만 프론트 타입이 없었음
 *
 * 주의: 이 인터페이스는 FormData로 전송해야 함
 * - thread_id: Form 필드
 * - file: UploadFile (mp4, m4a, mp3, amr, flac, wav)
 *
 * 기존 STTService 제거 이유:
 * - 서버 API와 맞지 않는 타입이었음 (file이 string으로 정의됨)
 * - 실제로는 FormData 형식으로 파일을 업로드해야 함
 */
export interface SendVoiceMessageRequest {
    thread_id: string; // OpenAI Thread ID
    file: File; // 음성 파일 (mp4, m4a, mp3, amr, flac, wav)
}

// ============================================
// API Response Types (서버 → 클라이언트)
// ============================================

/**
 * 시나리오 시작 응답
 * 서버: StartScenarioResponse (scenario_dto.py:18-22)
 *
 * [새로 추가]
 * 이유: 서버에 정의되어 있지만 프론트 타입이 없었음
 */
export interface StartScenarioResponse {
    session_id: string; // Thread ID (세션 식별자)
    assistant: string; // AI의 첫 응답 메시지
    assistant_id: string; // OpenAI Assistant ID
}

/**
 * 메시지 전송 응답 (텍스트)
 * 서버: SendMessageResponse (scenario_dto.py:31-33)
 *
 * [새로 추가]
 * 이유: 서버에 정의되어 있지만 프론트 타입이 없었음
 */
export interface SendMessageResponse {
    assistant: string; // AI 응답 메시지
}

/**
 * 음성 메시지 전송 응답 (STT + LLM + TTS)
 * 서버: SendVoiceMessageResponse (scenario_dto.py:36-40)
 *
 * [새로 추가]
 * 이유: 서버에 정의되어 있지만 프론트 타입이 없었음
 */
export interface SendVoiceMessageResponse {
    assistant: string; // AI 응답 텍스트
    user_text: string; // STT로 변환된 사용자 음성 텍스트
    tts_filename?: string; // AI 응답의 TTS 오디오 파일명 (Optional)
}

/**
 * 시나리오 종료 응답
 * 서버: EndScenarioResponse (scenario_dto.py:48-53)
 *
 * [새로 추가]
 * 이유: 서버에 정의되어 있지만 프론트 타입이 없었음
 */
export interface EndScenarioResponse {
    thread_id: string; // OpenAI Thread ID
    completion_status: string; // 완료 상태
    end_time?: string; // 종료 시간 (Optional)
    turn_count: number; // 총 발화 횟수
}

// ============================================
// 제거된 타입들
// ============================================

/**
 * [제거] STTService
 * 이유: 서버 API에 이런 형태의 요청이 없음
 * - 실제 음성 메시지는 SendVoiceMessageRequest 사용
 * - file이 string이 아닌 File 객체여야 함
 * - FormData 형식으로 전송해야 함
 */

/**
 * [제거] AudioTTS
 * 이유: 서버에서 TTS 파일을 다운로드하는 API는 단순히 filename을 URL 파라미터로 받음
 * - API: GET /api/v1/scenarios/audio/{filename}
 * - 별도 타입 정의가 필요 없음 (URL에 직접 filename 사용)
 *
 * 사용 예시:
 * const audioUrl = `/api/v1/scenarios/audio/${tts_filename}`
 */