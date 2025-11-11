import { useQuery } from "@tanstack/react-query";
import { getScenarioFeedback } from "@/api/scenario";

export const useScenarioFeedback = (progressId?: number) => {
  return useQuery({
    queryKey: ["scenarioFeedback", progressId],
    queryFn: () => getScenarioFeedback(progressId!),
    enabled: !!progressId && progressId > 0, // progressId가 유효할 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh 상태로 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
};
