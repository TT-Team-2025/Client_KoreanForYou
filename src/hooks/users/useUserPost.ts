import { useQuery } from '@tanstack/react-query';
import { getUserPost } from '@/api/commnuity';
import type { PostsResponse } from '@/types/community';
import { useEffect } from 'react';
import { getAccessToken } from '@/utils/token';


export const useUserPost = () => {
  const hasToken = !!getAccessToken();

  const query = useQuery<PostsResponse, Error>({
    queryKey: ['userPosts'],
    queryFn: getUserPost,
    enabled: hasToken, 
  });

  useEffect(() => {
    if (query.error) {
      console.error('[USER] 사용자가 작성한 댓글을 조회할 수 없습니다.(:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};