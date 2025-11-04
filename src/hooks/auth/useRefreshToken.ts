import { useMutation } from '@tanstack/react-query';
import { refreshToken } from '@/api/authApi';
import type { RefreshTokenResponse } from '@/types/auth';

export const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, Error, void>({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      // Update access token
      localStorage.setItem('accessToken', data.accessToken);
    },
  });
};
