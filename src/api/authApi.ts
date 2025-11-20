// ==========================================================
// 📁 파일명: src/api/authApi.ts
// 📜 역할: 인증(로그인 / 회원가입 / 토큰 / 로그아웃) 관련 API 모듈
// ==========================================================

import apiClient from "./client";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/types/userTypes";
import type { BaseResponse } from "@/types/commonTypes";
import { createChaptersByCategory } from "./chapter";

// ==========================================================
// ✅ 로그인 (POST /auth/login)
// FastAPI OAuth2 Password 방식은 form-data 형식 요구
// ==========================================================
export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  // URLSearchParams로 form-data 형식 생성
  const formData = new URLSearchParams();
  formData.append("username", data.email);
  formData.append("password", data.password);

  const res = await apiClient.post<LoginResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data;
};

// ==========================================================
// ✅ 회원가입 (POST /auth/signup)
// 회원가입 후 공통 챕터(job_id=0)와 개별 직무 챕터를 자동 생성
// ==========================================================
export const signup = async (
  data: SignupRequest
): Promise<BaseResponse<User>> => {
  // 1. 회원가입 처리
  const res = await apiClient.post<BaseResponse<User>>("/auth/signup", data);

  // 2. 회원가입 성공 후 자동 로그인하여 토큰 획득
  try {
    const loginFormData = new URLSearchParams();
    loginFormData.append("username", data.email);
    loginFormData.append("password", data.password);

    const loginRes = await apiClient.post<LoginResponse>("/auth/login", loginFormData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 토큰 저장
    localStorage.setItem("access_token", loginRes.data.access_token);
    localStorage.setItem("refresh_token", loginRes.data.refresh_token);

    console.log('✅ 회원가입 후 자동 로그인 완료');

    // 3. 공통 챕터(job_id=0) 생성
    await createChaptersByCategory(0);
    console.log('✅ 공통 챕터 생성 완료 (job_id=0)');

    // 4. 선택한 직무 챕터 생성
    if (data.job_id) {
      await createChaptersByCategory(data.job_id);
      console.log(`✅ 직무 챕터 생성 완료 (job_id=${data.job_id})`);
    }
  } catch (error) {
    console.error('⚠️ 챕터 생성 중 오류 발생:', error);
    // 챕터 생성 실패 시에도 회원가입은 완료된 상태로 유지
  }

  return res.data;
};

// ==========================================================
// ✅ 토큰 갱신 (POST /auth/refresh)
// ==========================================================
export const refreshToken = async (
  refresh_token: string
): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>("/auth/refresh", { refresh_token });
  return res.data;
};

// ==========================================================
// ✅ 로그아웃 (POST /auth/logout)
// ==========================================================
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      await apiClient.post("/auth/logout", { refresh_token: refreshToken });
    }

    // 🔒 로컬 토큰 및 유저정보 삭제
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    console.log("✅ 로그아웃 완료");
  } catch (error) {
    console.error("🚫 로그아웃 실패:", error);
    throw error;
  }
};
