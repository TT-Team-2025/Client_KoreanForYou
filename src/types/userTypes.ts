// ==========================================================
// 📁 파일명: src/types/userTypes.ts
// 📜 역할: 사용자 정보 및 인증 관련 타입 정의
// ==========================================================

import { BaseResponse, DateString } from "./commonTypes";

/* ==========================================================
   👤 사용자 정보 관련 타입
   ========================================================== */

/**
 * 사용자 정보
 */
export interface User {
  user_id: number;
  email: string;
  nickname?: string;
  nationality?: string;
  job_id?: number;
  level_id?: number;
  profile_img?: string;
  description?: string;
  created_at: DateString;
  updated_at: DateString;
}

/**
 * 사용자 정보 수정
 */
export interface UserUpdate {
  nickname?: string;
  nationality?: string;
  job_id?: number;
  level_id?: number;
  description?: string;
}

/**
 * 비밀번호 변경
 */
export interface UserPasswordChange {
  current_password: string;
  new_password: string; // 최소 8자 이상
}

/**
 * 모국어 변경
 */
export interface UserLanguageChange {
  nationality: string;
}

/**
 * 직무 변경
 */
export interface UserJobChange {
  job_id: number;
}

/**
 * 사용자 학습 상태
 */
export interface UserStatus {
  user_id: number;
  total_study_time: number;
  total_sentences_completed: number;
  total_scenarios_completed: number;
  average_score?: number;
  current_access_days: number;
  longest_access_days: number;
  last_study_date?: DateString;
}

/* ==========================================================
   🔐 인증 (Auth) 관련 타입
   ========================================================== */

/**
 * 로그인 요청
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답 (서버 JWT 발급 결과)
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: number;
}

/**
 * 회원가입 요청
 */
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  nationality: string;
  job_id: number;
  level_id: number;
  description?: string;
}

/**
 * 회원가입 응답 (BaseResponse 구조)
 */
export interface SignupResponse extends BaseResponse<User> {}

