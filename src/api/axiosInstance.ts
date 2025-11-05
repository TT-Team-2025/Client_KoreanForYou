/**
 * ==========================================================
 * 📁 파일명: axiosInstance.ts
 * 📜 역할: 프로젝트 전체에서 사용할 Axios 클라이언트의 중앙 설정 파일
 * ==========================================================
 *
 * ✅ 핵심 기능 요약
 * 1️⃣ baseURL, 기본 헤더(Content-Type 등) 설정
 * 2️⃣ 모든 요청에 access_token 자동 추가
 * 3️⃣ access_token 만료 시 → refresh_token으로 재발급 자동 처리
 * 4️⃣ 재발급 실패 시 → 로그인 페이지로 자동 리다이렉트
 *
 * 📘 즉, 모든 API 통신의 "공통 운전기사" 역할을 함.
 * 각 화면(페이지)에서는 axios.post, axios.get을 직접 쓰지 않고
 * → 아래에서 export하는 api 인스턴스를 import해서 사용.
 *
 * ex)
 * import api from "@/api/axiosInstance";
 * const res = await api.get("/users/me");
 *
 * ==========================================================
 */

import axios from "axios";

/**
 * ✅ 1. Axios 인스턴스 기본 설정
 * - baseURL: vite.config.js에서 프록시가 /api → FastAPI 서버로 연결됨
 * - headers: 모든 요청의 기본 헤더 (JSON 형식)
 */
const api = axios.create({
  baseURL: "/api", // 예: http://localhost:8000/api (프록시 통해 자동 연결)
  headers: {
    "Content-Type": "application/json",
  },

});

/**
 * ✅ 2. 요청 인터셉터(Request Interceptor)
 * - 모든 요청 전에 실행됨
 * - localStorage에 저장된 access_token을 자동으로 Authorization 헤더에 추가
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ 3. 응답 인터셉터(Response Interceptor)
 * - 서버에서 응답이 돌아왔을 때 실행됨
 * - 401(Unauthorized) 에러 발생 시 → access_token 만료로 판단
 *   → refresh_token을 이용해 새 access_token을 자동으로 재발급 요청
 *   → 성공 시, 원래 요청을 다시 시도
 * - refresh_token마저 만료된 경우 → 자동 로그아웃 처리
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access_token 만료 시 한 번만 재시도하도록 제한
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      // refresh_token 존재 여부 확인
      if (refreshToken) {
        try {
          // ✅ refresh_token으로 access_token 재발급 요청
          const res = await axios.post("/api/auth/refresh", {
            refresh_token: refreshToken,
          });

          // 새 access_token 저장
          const newAccessToken = res.data.access_token;
          localStorage.setItem("access_token", newAccessToken);

          // 새 access_token으로 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error("❌ 토큰 재발급 실패:", refreshError);

          // 토큰 만료 → 완전 로그아웃 처리
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login";
        }
      } else {
        console.warn("⚠️ refresh_token이 없습니다. 로그인 페이지로 이동합니다.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

/**
 * ✅ 4. export
 * - 다른 컴포넌트에서 이 api 객체를 import하여 사용
 * - 예: import api from "@/api/axiosInstance";
 */
export default api;
