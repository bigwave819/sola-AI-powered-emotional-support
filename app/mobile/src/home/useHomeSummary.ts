import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { useAuthStore } from '@/src/auth/authStore';

export function useHomeSummary() {
  const ready = useAuthStore((s) => s.status === 'ready');
  return useQuery({
    queryKey: ['home-summary'],
    queryFn: () => api.get('/home/summary'),
    enabled: ready,
  });
}