import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '@/api/usersApi';
import type { User } from '@/types/userTypes';

/**
 * 로그인한 사용자의 프로필 정보를 조회하는 hook
 */
export const useUserProfile = () => {
  return useQuery<User, Error>({
    queryKey: ['userProfile'],
    queryFn: getMyProfile,
  });
};
