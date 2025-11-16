import { useQuery } from "@tanstack/react-query";
import { getScenarioHistory } from "@/api/scenario";
import { ScenarioHistoryResponse } from "@/types/scenario";

export const useScenarioHistory = () => {
  return useQuery<ScenarioHistoryResponse, Error>({
    queryKey: ["scenarioHistory"],
    queryFn: () => getScenarioHistory(),
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 fresh 상태로 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
    retry: false, // 404 에러 시 재시도하지 않음
    // 에러 발생 시에도 앱이 정상 동작하도록 함
  });
};
