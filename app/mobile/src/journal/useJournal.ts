import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/api/client';

export function useJournalEntry(id: string) {
  return useQuery({
    queryKey: ['journal', id],
    queryFn: () => api.get(`/journal/${id}`),
    enabled: !!id && id !== 'new',
  });
}

export function useCreateJournalEntry() {
  return useMutation({
    mutationFn: (moodEntryId?: string) =>
      api.post(`/journal${moodEntryId ? `?moodEntryId=${moodEntryId}` : ''}`),
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: string }) =>
      api.patch(`/journal/${id}`, { body }),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['journal', vars.id] });
    },
  });
}

export function useReflect() {
  return useMutation({
    mutationFn: (id: string) => api.post(`/journal/${id}/reflect`),
  });
}

export function useFinalizeJournalEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/journal/${id}/finalize`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-summary'] });
    },
  });
}