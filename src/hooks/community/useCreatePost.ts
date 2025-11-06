import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/commnuity";
import type { CreatePostRequest, Post } from "@/types/community";


export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Post, // 성공 시 반환 타입
    Error, // 에러 타입
    CreatePostRequest // mutate 함수의 파라미터 타입
  >({
    mutationFn: (data) => createPost(data),
    onSuccess: () => {
      // 게시글 목록 캐시 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};//end useCreatePost()
