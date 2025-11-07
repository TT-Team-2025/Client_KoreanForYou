import { useMutation } from '@tanstack/react-query';
import { refreshToken } from '@/api/authApi';
import type { LoginResponse } from '@/types/userTypes';

export const useRefreshToken = () => {
  return useMutation<LoginResponse, Error, string>({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      // Update access token
      localStorage.setItem('access_token', data.access_token);
    },
  });
};
