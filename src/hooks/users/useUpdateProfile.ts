import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/api/usersApi';
import type { UpdateProfileRequest, UserProfile } from '@/types/user';

export const useUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, UpdateProfileRequest>({
    mutationFn: (data) => updateUserProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] });
    },
  });
};
