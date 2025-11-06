import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePostById } from '@/api/commnuity';
import type { UpdatePostRequest, Post } from '@/types/community';



export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Post, // 성공 시 반환 타입
    Error, // 에러 타입
    { postId: number; data: UpdatePostRequest } // mutate 함수의 파라미터 타입
  >({
    mutationFn: ({ postId, data }) => updatePostById(postId, data),
    onSuccess: (updatedPost, variables) => {
      // 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // 수정된 특정 게시글 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.postId]
      });
    },
  });
};
