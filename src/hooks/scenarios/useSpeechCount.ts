import { useQuery } from "@tanstack/react-query";
import { countSpeech } from "@/api/scenario";
import { SpeechCountResponse } from "@/types/scenario";

export const useSpeechCount = () => {
  return useQuery<SpeechCountResponse, Error>({
    queryKey: ["speechCount"],
    queryFn: () => countSpeech(),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh 상태로 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
};
