// 대화 설정 유효성 검사

import { CONVERSATION_SETUP_TEXT } from '@/constants/conversationSetup';

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const validateConversationSetup = (
  topic: string,
  userRole: string,
  aiRole: string
): ValidationResult => {
  if (!topic.trim()) {
    return {
      isValid: false,
      errorMessage: CONVERSATION_SETUP_TEXT.VALIDATION.TOPIC_REQUIRED,
    };
  }

  if (!userRole.trim()) {
    return {
      isValid: false,
      errorMessage: CONVERSATION_SETUP_TEXT.VALIDATION.USER_ROLE_REQUIRED,
    };
  }

  if (!aiRole.trim()) {
    return {
      isValid: false,
      errorMessage: CONVERSATION_SETUP_TEXT.VALIDATION.AI_ROLE_REQUIRED,
    };
  }

  return { isValid: true };
};
