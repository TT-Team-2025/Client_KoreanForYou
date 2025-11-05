// utils/token.ts
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Access Token 가져오기
 */
export const getAccessToken = (): string | null => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  // 조회는 너무 자주 발생하므로 로그 제거
  return token;
};

/**
 * Refresh Token 가져오기
 */
export const getRefreshToken = (): string | null => {
  const token = localStorage.getItem(REFRESH_TOKEN_KEY);
  // 조회는 너무 자주 발생하므로 로그 제거
  return token;
};

/**
 * 토큰 저장
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  console.log('[TOKEN] ✅ 토큰 저장 완료:', {
    accessTokenLength: accessToken.length,
    refreshTokenLength: refreshToken.length,
    timestamp: new Date().toISOString()
  });
};

/**
 * 토큰 삭제
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  console.log('[TOKEN] 🗑️ 토큰 삭제 완료:', new Date().toISOString());
};
