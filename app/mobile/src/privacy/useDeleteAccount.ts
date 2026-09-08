import { useMutation } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { tokenStorage } from '@/src/auth/tokenStorage';

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => api.delete('/privacy/account'),
    onSuccess: async () => {
      await tokenStorage.clear();
    },
  });
}