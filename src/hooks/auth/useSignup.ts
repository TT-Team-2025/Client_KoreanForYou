import { useMutation } from '@tanstack/react-query';
import { signup } from '@/api/authApi';
import type { SignupRequest, User } from '@/types/userTypes';
import type { BaseResponse } from '@/types/commonTypes';

export const useSignup = () => {
  return useMutation<BaseResponse<User>, Error, SignupRequest>({
    mutationFn: signup,
  });
};
