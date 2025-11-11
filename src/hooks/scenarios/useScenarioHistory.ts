import { useQuery } from "@tanstack/react-query";
import { getScenarioHistory } from "@/api/scenario";
import { ScenarioHistoryResponse } from "@/types/scenario";

export const useScenarioHistory = () => {
  return useQuery<ScenarioHistoryResponse, Error>({
    queryKey: ["scenarioHistory"],
    queryFn: () => getScenarioHistory(),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh 상태로 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
};
