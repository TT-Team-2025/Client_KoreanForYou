import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/api/usersApi';
import type { User } from '@/types/userTypes';
import { useEffect } from 'react';
import { getAccessToken } from '@/utils/token';

/**
 * 로그인한 사용자의 프로필 정보를 조회하는 hook
 */
export const useUserProfile = () => {
  const hasToken = !!getAccessToken();

  const query = useQuery<User, Error>({
    queryKey: ['userProfile'],
    queryFn: getMyProfile,
    enabled: hasToken, // 토큰이 있을 때만 쿼리 실행
  });

  useEffect(() => {
    if (query.data) {
      console.log('[USER] 👤 사용자 프로필 로드 완료:', {
        userId: query.data.user_id,
        email: query.data.email,
        nickname: query.data.nickname,
        timestamp: new Date().toISOString()
      });
    }
    if (query.error) {
      console.error('[USER] ❌ 사용자 프로필 로드 실패:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};
