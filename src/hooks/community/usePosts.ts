// 목록 전체 조회
import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/api/commnuity";
import type { Post } from "@/types/community";

export const useGetPosts = () => {
  return useQuery<Post, Error>({
    queryKey: ["posts"],
    queryFn: () => getPost(),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
};