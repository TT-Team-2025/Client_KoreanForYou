import { useQuery } from "@tanstack/react-query";
import { GetSentence } from "@/types/chapters";
import { getRandomSentence } from "@/api/chapter";

export const useRandomSentence = () => {
  return useQuery<GetSentence, Error>({
    queryKey: ["sentences"],
    queryFn: () => getRandomSentence(),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh 상태로 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
};
