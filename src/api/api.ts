/*
src/
 ├─ api/
 │   └─ api.ts                ← ✅ 공통 Axios 인스턴스
 ├─ hooks/
 │   ├─ useAuth.ts            ← 로그인/회원가입 전용 훅
 │   ├─ useProgress.ts        ← 학습기록 데이터 훅
 │   ├─ useUser.ts            ← 마이페이지 훅
 │   ├─ useSentence.ts        ← 문장학습실 훅
 │   ├─ useScenario.ts        ← AI대화 훅
 │   └─ ...
 ├─ components/
 │   ├─ LoginScreen.tsx       ← api.ts 사용해서 POST /auth/login
 │   ├─ SignupScreen.tsx      ← api.ts 사용해서 POST /auth/signup
 │   ├─ ProgressScreen.tsx    ← api.ts 사용해서 GET /progress/users/{id}
 │   ├─ MyPageScreen.tsx      ← api.ts 사용해서 GET /users/, PATCH /users/job
 │   ├─ SentenceLearning.tsx  ← api.ts 사용해서 GET /sentences/{id}
 │   └─ ...
*/
import axios, { AxiosRequestConfig } from "axios";
import type { AxiosError } from "axios";

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
}

export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post<RefreshResponse>(
            "http://localhost:8000/api/auth/refresh",
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } }
          );

          const newAccessToken = refreshResponse.data.access_token;
          localStorage.setItem("access_token", newAccessToken);

          if (error.config) {
            error.config.headers = error.config.headers ?? {};
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(error.config);
          }
        } catch (refreshError) {
          console.error("🔁 토큰 재발급 실패:", refreshError);
          localStorage.clear();
          window.location.href = "/login";
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);