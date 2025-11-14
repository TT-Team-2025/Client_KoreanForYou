// 댓글 조회
import { useQuery } from "@tanstack/react-query";
import { getReplies } from "@/api/commnuity";
import type { RepliesResponse } from "@/types/community";

export const useGetReplies = (postId: number) => {
  return useQuery<RepliesResponse, Error>({
    queryKey: ["posts", postId, "replies"], // postId를 포함해야 각 게시글의 댓글을 구분
    queryFn: () => getReplies(postId),
    enabled: !!postId, // postId가 있을 때만 쿼리 실행
  });
};
