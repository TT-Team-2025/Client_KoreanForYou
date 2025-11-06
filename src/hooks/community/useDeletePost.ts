import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePostById } from '@/api/commnuity';


export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void, // 성공 시 반환 타입 (삭제는 보통 void)
    Error, // 에러 타입
    number // mutate 함수의 파라미터 타입 (postId)
  >({
    mutationFn: (postId: number) => deletePostById(postId),
    onSuccess: (_, postId) => {
      // 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // 삭제된 특정 게시글 캐시 제거
      queryClient.removeQueries({ queryKey: ['posts', postId] });
    },
  });
};
