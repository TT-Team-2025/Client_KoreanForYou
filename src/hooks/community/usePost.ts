// 목록 상세조회
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "@/api/commnuity";
import type { Post } from "@/types/community";

export const useGetPost = (postId:number) =>{

    return useQuery< Post, Error>({
        queryKey : ['posts', postId], //cashkey
        queryFn : ()=> getPostById(postId),
        enabled: !!postId, // postId가 있을 때만 쿼리 실행
        staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh 상태로 유지
        gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지

    })
}