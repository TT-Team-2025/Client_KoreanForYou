// ==========================================================
// 📁 파일명: src/api/authApi.ts
// 📜 역할: 인증(로그인 / 회원가입 / 토큰 / 로그아웃) 관련 API 모듈
// ==========================================================

import api from "./axiosInstance";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  User,
} from "@/types/userTypes";
import type { BaseResponse } from "@/types/commonTypes";

// ==========================================================
// ✅ 로그인 (POST /auth/login)
// ==========================================================
export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};

// ==========================================================
// ✅ 회원가입 (POST /auth/signup)
// ==========================================================
export const signup = async (
  data: SignupRequest
): Promise<BaseResponse<User>> => {
  const res = await api.post<BaseResponse<User>>("/auth/signup", data);
  return res.data;
};

// ==========================================================
// ✅ 토큰 갱신 (POST /auth/refresh)
// ==========================================================
export const refreshToken = async (
  refresh_token: string
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/refresh", { refresh_token });
  return res.data;
};

// ==========================================================
// ✅ 로그아웃 (POST /auth/logout)
// ==========================================================
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      await api.post("/auth/logout", { refresh_token: refreshToken });
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
