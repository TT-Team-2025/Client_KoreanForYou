import { useMutation } from "@tanstack/react-query";
import { saveScenario } from "@/api/scenario";
import type { SaveScenarioResponse } from "@/types/scenario";

export const useSaveScenario = () => {
  return useMutation<SaveScenarioResponse, Error, string>({
    mutationFn: saveScenario,
  });
};
