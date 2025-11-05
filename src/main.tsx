import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";
import { getAccessToken, getRefreshToken } from "@/utils/token";

// 앱 시작 시 토큰 상태 로그
const accessToken = getAccessToken();
const refreshToken = getRefreshToken();

console.log('========================================');
console.log('[APP] 🚀 애플리케이션 시작');
console.log('[APP] 📍 경로:', window.location.pathname);
console.log('[APP] 🔑 토큰 상태:', {
  hasAccessToken: !!accessToken,
  hasRefreshToken: !!refreshToken,
  accessTokenLength: accessToken?.length,
  timestamp: new Date().toISOString()
});
console.log('========================================');

// 페이지 새로고침 감지
window.addEventListener('beforeunload', () => {
  const at = getAccessToken();
  const rt = getRefreshToken();
  console.log('[APP] 🔄 페이지 종료 - 토큰 상태:', {
    hasAccessToken: !!at,
    hasRefreshToken: !!rt
  });
});

// QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 fresh로 간주
      gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (이전 cacheTime)
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);