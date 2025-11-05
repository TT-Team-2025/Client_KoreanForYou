import { useMutation } from '@tanstack/react-query';
import { signup } from '@/api/authApi';
import type { SignupRequest, SignupResponse } from '@/types/auth';

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signup,
  });
};
