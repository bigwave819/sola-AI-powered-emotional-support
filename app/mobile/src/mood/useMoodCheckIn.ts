import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/api/client';

interface MoodPayload {
  score: number;
  tags?: string[];
  note?: string;
}

export function useMoodCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MoodPayload) => api.post('/mood', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-summary'] });
    },
  });
}