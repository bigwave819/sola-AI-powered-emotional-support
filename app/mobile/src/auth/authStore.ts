import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
  setSession: (userId: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  isAuthenticated: false,
  setSession: (userId) => set({ userId, isAuthenticated: true }),
  clearSession: () => set({ userId: null, isAuthenticated: false }),
}));