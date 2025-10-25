// 직무 정보
export const JOB_INFO = {
  'kitchen-assistant': { 
    name: '주방보조', 
    emoji: '👨‍🍳',
    color: 'bg-orange-100 text-orange-700'
  },
  'server': { 
    name: '서빙', 
    emoji: '🍽️',
    color: 'bg-blue-100 text-blue-700'
  },
  'barista': { 
    name: '바리스타', 
    emoji: '☕',
    color: 'bg-amber-100 text-amber-700'
  },
  'cashier': { 
    name: '캐셔', 
    emoji: '💰',
    color: 'bg-green-100 text-green-700'
  },
  'delivery': { 
    name: '배달', 
    emoji: '🚴',
    color: 'bg-purple-100 text-purple-700'
  },
  'head-chef': { 
    name: '주방장', 
    emoji: '👨‍🍳',
    color: 'bg-red-100 text-red-700'
  },
  'dishwasher': { 
    name: '설거지', 
    emoji: '🧽',
    color: 'bg-cyan-100 text-cyan-700'
  }
} as const;

export type JobKey = keyof typeof JOB_INFO;

export const JOBS = Object.keys(JOB_INFO) as JobKey[];
