// api/client.ts
// axios인스턴스 및 인터셉터 설정하는 공간입니다.
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/token';

// 개발 환경에서는 Vite 프록시를 사용하므로 /api만 사용
// 프로덕션 환경에서는 환경변수로 전체 URL 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 일반 요청은 로그 생략 (너무 많은 로그 방지)
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] ❌ 요청 에러:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 토큰 갱신 및 에러 처리
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 로그 생략 (너무 많은 로그 방지)
    return response;
  },
  async (error: AxiosError) => {
    // 에러만 로그 출력
    console.warn('[API] ⚠️ 응답 에러:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    });

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 에러 && 재시도 안함
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('[AUTH] 🔐 401 에러 감지 - 토큰 갱신 시도');
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          console.log('[AUTH] 🔄 토큰 갱신 API 호출 중...');
          // 토큰 갱신 API 호출
          const refreshUrl = BASE_URL.startsWith('http') ? `${BASE_URL}/auth/refresh` : '/api/auth/refresh';
          const { data } = await axios.post(refreshUrl, {
            refresh_token: refreshToken,
          });

          console.log('[AUTH] ✅ 토큰 갱신 성공');
          // 새 토큰 저장
          setTokens(data.access_token, data.refresh_token);

          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          }
          console.log('[AUTH] 🔁 원래 요청 재시도:', originalRequest.url);
          return apiClient.request(originalRequest);
        } catch (refreshError) {
          console.error('[AUTH] ❌ 토큰 갱신 실패 - 로그아웃 처리', refreshError);
          // 토큰 갱신 실패 → 로그아웃 처리
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        console.warn('[AUTH] ⚠️ Refresh Token 없음 - 로그인 페이지로 이동');
        // refresh token 없음 → 로그인 페이지로
        clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
