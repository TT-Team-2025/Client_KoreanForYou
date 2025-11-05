// src/api/authApi.ts
import apiClient from "./client";
import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from "@/types/userTypes";

// 로그인
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

// 회원가입
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await apiClient.post("/auth/signup", data);
  return response.data;
};

// 토큰 갱신
export const refreshToken = async (refresh_token: string): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/refresh", { refresh_token });
  return response.data;
};

// 로그아웃
export const logout = async (): Promise<void> => {
  try {
    // 서버에 refresh token 무효화 요청
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      await apiClient.post("/auth/logout", { refresh_token: refreshToken });
    }

    // 클라이언트 저장소 정리
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    console.log("✅ 로그아웃 완료");
  } catch (error) {
    console.error("🚫 로그아웃 실패:", error);
    throw error;
  }
};
