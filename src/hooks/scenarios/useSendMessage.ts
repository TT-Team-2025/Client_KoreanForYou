import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/api/scenario";
import type {
  SendMessageRequest,
  SendMessageResponse,
} from "@/types/scenario";

export const useSendMessage = () => {
  return useMutation<SendMessageResponse, Error, SendMessageRequest>({
    mutationFn: (data: SendMessageRequest) => sendMessage(data)
  });
};
