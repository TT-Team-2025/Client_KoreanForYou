import { useQuery } from '@tanstack/react-query';
import { getUserStatus } from '@/api/usersApi';
import type { UserStatus } from '@/types/user';

export const useUserStatus = (userId: string) => {
  return useQuery<UserStatus, Error>({
    queryKey: ['userStatus', userId],
    queryFn: () => getUserStatus(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
