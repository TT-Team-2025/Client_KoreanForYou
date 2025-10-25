// 레벨 정보
export const LEVEL_INFO = {
  1: {
    name: '초급',
    description: '기본적인 한국어 인사와 간단한 문장을 익힙니다.',
    color: 'bg-green-100 text-green-700',
    icon: '🌱'
  },
  2: {
    name: '중급',
    description: '실무에서 자주 사용하는 표현을 학습합니다.',
    color: 'bg-blue-100 text-blue-700',
    icon: '🌿'
  },
  3: {
    name: '고급',
    description: '복잡한 상황에서 능숙하게 대응합니다.',
    color: 'bg-purple-100 text-purple-700',
    icon: '🌳'
  }
} as const;

export type LevelId = keyof typeof LEVEL_INFO;

export const LEVELS = Object.keys(LEVEL_INFO).map(Number) as LevelId[];
