import { useQuery } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { useAuthStore } from '@/src/auth/authStore';

export interface Me {
  id: string;
  email: string;
  preferredName: string | null;
}

export function useMe() {
  const ready = useAuthStore((s) => s.status === 'ready');
  return useQuery<Me>({
    queryKey: ['me'],
    queryFn: () => api.get('/users/me'),
    enabled: ready,
  });
}

// "waveb6133@gmail.com" -> "Waveb"
export function displayName(me?: Me | null) {
  if (me?.preferredName) return me.preferredName;
  const local = (me?.email ?? '').split('@')[0];
  const words = local.replace(/\d+/g, ' ').replace(/[._-]+/g, ' ').trim();
  return (words || local).replace(/\b\w/g, (c) => c.toUpperCase());
}