import { useMutation } from '@tanstack/react-query';
import { logout } from '@/api/authApi';

export const useLogout = () => {
  return useMutation<void, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  });
};
