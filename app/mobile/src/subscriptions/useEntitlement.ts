import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/api/client';

export function useEntitlement() {
  return useQuery({
    queryKey: ['entitlement'],
    queryFn: () => api.get('/subscriptions/me'),
  });
}