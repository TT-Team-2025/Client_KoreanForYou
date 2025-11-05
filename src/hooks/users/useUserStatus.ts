import { useQuery } from '@tanstack/react-query';
import { getUserStatus } from '@/api/usersApi';
import type { UserStatus } from '@/types/userTypes';

/**
 * 사용자의 학습 상태를 조회하는 hook
 */
export const useUserStatus = (userId: number) => {
  return useQuery<UserStatus, Error>({
    queryKey: ['userStatus', userId],
    queryFn: () => getUserStatus(userId),
    enabled: !!userId && userId > 0, // userId가 유효할 때만 쿼리 실행
    // refetchInterval 제거 - 필요시 수동으로 refetch 호출
  });
};
