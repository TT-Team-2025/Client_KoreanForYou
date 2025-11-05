import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 프록시 덕분에 /api만 써도 됨
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

/*
axiosInstance.ts는 모든 API 요청의 공통 설정을 한 곳에 모아둔 중앙 axios 클라이언트

다른 컴포넌트들이 axios.post, axios.get을 직접 쓰는 대신
→ 공통 설정이 들어간 api 객체를 import해서 쓰는 구조예요.

“HTTP 요청을 대신 운전해주는 차(axios)를,
네 프로젝트 환경에 맞게 커스터마이징한 운전기사(api)”

axiosInstance.ts → 공통 설정

authApi.ts → endpoint별 모듈

vite.config.js → 개발 환경용 proxy

이 3개로 완전히 분리되어 있으면,
프론트에서 API 통신 구현할 준비가 100% 완료된 상태예요 ✅
*/