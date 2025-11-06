import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReply } from '@/api/commnuity';

export const useDeleteReply = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void, // 성공 시 반환 타입 (삭제는 보통 void)
    Error, // 에러 타입
    { replyId: number; postId: number } // mutate 함수의 파라미터 타입 (postId는 캐시 무효화에 필요)
  >({
    mutationFn: ({ replyId }) => deleteReply(replyId),
    onSuccess: (_, variables) => {
      // 해당 게시글의 댓글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ['posts', variables.postId, 'replies']
      });
    },
  });
};
