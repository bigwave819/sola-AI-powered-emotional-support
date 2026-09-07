import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/api/client';

export function useHomeSummary() {
  return useQuery({
    queryKey: ['home-summary'],
    queryFn: () => api.get('/home/summary'),
  });
}