import { useQuery } from '@tanstack/react-query';
import { getUserReply } from '@/api/commnuity';
import type { RepliesResponse } from '@/types/community';
import { useEffect } from 'react';
import { getAccessToken } from '@/utils/token';

/**
 * 로그인한 사용자가 작성한 댓글 목록을 조회하는 hook
 */
export const useUserReply = () => {
  const hasToken = !!getAccessToken();

  const query = useQuery<RepliesResponse, Error>({
    queryKey: ['userReplies'],
    queryFn: getUserReply,
    enabled: hasToken, // 토큰이 있을 때만 쿼리 실행
  });

  useEffect(() => {
    if (query.error) {
      console.error('[USER] ❌ 사용자 댓글 목록 로드 실패:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};
