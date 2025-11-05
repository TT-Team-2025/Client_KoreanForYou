import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/authApi';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    },
  });
};
