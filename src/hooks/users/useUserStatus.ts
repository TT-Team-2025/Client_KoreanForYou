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
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
