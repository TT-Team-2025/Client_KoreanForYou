import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/usersApi';
import type { UserProfile } from '@/types/user';

export const useUserProfile = (userId: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
};
