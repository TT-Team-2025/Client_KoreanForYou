// api/users_api.ts
// User관련 api함수들입니다.
import apiClient from './client';
import {
  User,
  UserUpdate,
  UserPasswordChange,
  UserLanguageChange,
  UserJobChange,
  UserStatus,
} from '@/types/userTypes';
import { BaseResponse } from '@/types/commonTypes';

/**
 * 내 정보 조회
 */
export const getMyProfile = async (): Promise<User> => {
  const response = await apiClient.get('/users/');
  return response.data;
};

/**
 * 사용자 정보 수정
 */
export const updateProfile = async (data: UserUpdate): Promise<BaseResponse> => {
  const response = await apiClient.put('/users/', data);
  return response.data;
};

/**
 * 비밀번호 변경
 */
export const changePassword = async (data: UserPasswordChange): Promise<BaseResponse> => {
  const response = await apiClient.patch('/users/password', data);
  return response.data;
};

/**
 * 모국어 변경
 */
export const changeLanguage = async (data: UserLanguageChange): Promise<BaseResponse> => {
  const response = await apiClient.patch('/users/language', data);
  return response.data;
};

/**
 * 직무 변경
 */
export const changeJob = async (data: UserJobChange): Promise<BaseResponse> => {
  const response = await apiClient.patch('/users/job', data);
  return response.data;
};

/**
 * 사용자 학습 상태 조회
 */
export const getUserStatus = async (userId: number): Promise<UserStatus> => {
  const response = await apiClient.get(`/users/${userId}/status`);
  return response.data;
};
