import { useMutation } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { tokenStorage } from '@/src/auth/tokenStorage';
import { useAuthStore } from '@/src/auth/authStore';

export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => api.delete('/privacy/account'),
    onSuccess: async () => {
      await tokenStorage.clear();
      useAuthStore.getState().clearSession();
    },
  });
}