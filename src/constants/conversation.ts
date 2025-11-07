// 대화 화면 관련 상수

export const CONVERSATION_TEXT = {
  BUTTONS: {
    END_CALL: '종료',
  },
  MESSAGES: {
    DEFAULT_AI_GREETING: (userName: string) => `안녕하세요, ${userName}님! 오늘 기분은 어떠세요?`,
    DEFAULT_AI_GREETING_EN: (userName: string) => `Good evening, ${userName}! How are you feeling today?`,
  },
  ALERTS: {
    VOICE_SEND_FAILED: (errorMessage: string) => `음성 전송 실패: ${errorMessage}`,
    MIC_PERMISSION_REQUIRED: '마이크 접근 권한이 필요합니다.',
  },
  CONSOLE: {
    MIME_TYPE: '사용 중인 MIME 타입:',
    SENDING_FILE: '전송할 파일:',
    TTS_PLAY_FAILED: 'TTS 재생 실패:',
    MIC_ACCESS_FAILED: '마이크 접근 실패:',
  },
} as const;
