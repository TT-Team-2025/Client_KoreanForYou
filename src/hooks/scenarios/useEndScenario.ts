import { useMutation } from "@tanstack/react-query";
import { endScenarioSession } from "@/api/scenario";
import type {
  EndScenarioRequest,
  EndScenarioResponse,
} from "@/types/scenario";

export const useEndScenario = () => {
  return useMutation<EndScenarioResponse, Error, EndScenarioRequest>({
    mutationFn: endScenarioSession,
  });
};
