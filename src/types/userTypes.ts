// types/userTypes.ts
// 사용자 관련 타입을 정의했습니다.
import { BaseResponse, DateString } from './commonTypes';

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
}

/**
 * 비밀번호 변경
 */
export interface UserPasswordChange {
  current_password: string;
  new_password: string; // 최소 8자
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
