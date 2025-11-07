import { useMutation } from '@tanstack/react-query';
import { login } from '@/api/authApi';
import type { LoginRequest, LoginResponse } from '@/types/auth';

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
    },
  });
};
