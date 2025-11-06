import { useMutation } from "@tanstack/react-query";
import { sendVoiceMessage } from "@/api/scenario";
import type {
  SendVoiceMessageRequest,
  SendVoiceMessageResponse,
} from "@/types/scenario";

export const useSendVoiceMessage = () => {
  return useMutation<SendVoiceMessageResponse, Error, SendVoiceMessageRequest>({
    mutationFn: ({ thread_id, file }: SendVoiceMessageRequest) =>
      sendVoiceMessage(thread_id, file)
  });
};