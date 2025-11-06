// 대화 설정 관련 상수

export const CONVERSATION_SETUP_TEXT = {
  HEADER: {
    TITLE: 'AI 말하기 연습실',
  },
  CARD: {
    TITLE: '대화 설정',
    DESCRIPTION: 'AI와 연습할 대화 상황을 설정하세요',
  },
  FIELDS: {
    TOPIC: {
      LABEL: '주제',
      PLACEHOLDER: '예: 손님 맞이하기, 주문 받기, 전화 응대 등',
    },
    USER_ROLE: {
      LABEL: '나의 역할 (직무)',
      HELPER_TEXT: '회원가입 시 선택한 직무가 자동으로 설정됩니다.',
    },
    AI_ROLE: {
      LABEL: 'AI 역할',
      PLACEHOLDER: '예: 손님, 매니저, 동료, 신입직원 등',
    },
    SITUATION: {
      LABEL: '상황 설정 (프롬프트)',
      PLACEHOLDER: '예: 점심시간에 손님이 많이 몰려서 바쁜 상황입니다. 손님은 예약 없이 방문했고 4명입니다.',
      HELPER_TEXT: '대화의 배경이나 특별한 상황을 자세히 설명해주세요.',
    },
  },
  BUTTONS: {
    START: '대화 시작하기',
  },
  VALIDATION: {
    TOPIC_REQUIRED: '주제를 입력해주세요.',
    USER_ROLE_REQUIRED: '나의 역할을 입력해주세요.',
    AI_ROLE_REQUIRED: 'AI 역할을 입력해주세요.',
  },
} as const;

export const SITUATION_TEXTAREA_ROWS = 5;
