import { useMutation } from "@tanstack/react-query";
import { startScenarioSession } from "@/api/scenario";
import type {
  StartScenarioRequest,
  StartScenarioResponse,
} from "@/types/scenario";

export const useStartScenario = () => {
  return useMutation<StartScenarioResponse, Error, StartScenarioRequest>({
    mutationFn: startScenarioSession,
  });
};
