// types/commonTypes.ts
// 공통 타입을 정의했습니다.
/**
 * 기본 API 응답 형식
 */
export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * 에러 응답 형식
 */
export interface ErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  details?: Record<string, any>;
}

/**
 * 페이지네이션 파라미터
 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

/**
 * 페이지네이션 응답
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  total_pages?: number;
}

/**
 * 정렬 옵션
 */
export type SortOrder = 'asc' | 'desc';

/**
 * 날짜 문자열 (ISO 8601 형식)
 */
export type DateString = string;
