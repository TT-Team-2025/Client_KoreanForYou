import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReply } from '@/api/commnuity';
import type { CreateReplyRequest, Reply } from '@/types/community';


export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Reply, // 성공 시 반환 타입
    Error, // 에러 타입
    { postId: number; data: CreateReplyRequest } // mutate 함수의 파라미터 타입
  >({
    mutationFn: ({ postId, data }) => createReply(postId, data),
    onSuccess: (_, variables) => {
      // 해당 게시글의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.postId, 'replies']
      });
    },
  });
};
