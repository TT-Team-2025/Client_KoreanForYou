// hooks/useTranslate.ts
import { useQuery } from '@tanstack/react-query';
import { translateText } from '@/utils/translate';

/**
 * 텍스트를 번역하는 Hook
 * @param text - 번역할 텍스트
 * @param targetNationality - 목표 nationality (예: 'VIETNAM', 'ENGLISH')
 * @param enabled - 번역 활성화 여부 (기본: true)
 */
export const useTranslate = (
  text: string | undefined,
  targetNationality: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['translate', text, targetNationality],
    queryFn: async () => {
      if (!text || !targetNationality) {
        return text || '';
      }
      return await translateText(text, targetNationality);
    },
    enabled: enabled && !!text && !!targetNationality,
    staleTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지 (같은 문장은 재번역 불필요)
    gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 보관
    retry: 1, // 번역 실패 시 1번만 재시도
  });
};
