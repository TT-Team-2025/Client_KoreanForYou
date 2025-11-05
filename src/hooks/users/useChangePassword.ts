import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/api/usersApi';
import type { ChangePasswordRequest } from '@/types/user';

export const useChangePassword = () => {
  return useMutation<void, Error, ChangePasswordRequest>({
    mutationFn: changePassword,
  });
};
