import { create } from 'zustand';
import { api, ApiError } from '@/src/api/client';
import { tokenStorage } from './tokenStorage';

export type AuthStatus = 'loading' | 'signedOut' | 'onboarding' | 'ready';

interface Me {
  id: string;
  onboardingCompleted: boolean;
}

function isAuthError(err: unknown) {
  if (err instanceof ApiError) return err.status === 401;
  const msg = err instanceof Error ? err.message : '';
  return msg === 'Unauthorized' || msg === 'Session expired';
}

interface AuthState {
  status: AuthStatus;
  userId: string | null;
  isAuthenticated: boolean;
  bootstrap: () => Promise<void>;
  signIn: (t: { accessToken: string; refreshToken: string; userId: string }) => Promise<AuthStatus>;
  markOnboardingDone: () => void;
  setSession: (userId: string) => void; // kept for older call sites
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',
  userId: null,
  isAuthenticated: false,

  bootstrap: async () => {
    const token = await tokenStorage.getAccessToken();
    if (!token) {
      set({ status: 'signedOut', userId: null, isAuthenticated: false });
      return;
    }
    try {
      const me: Me = await api.get('/users/me');
      set({
        status: me.onboardingCompleted ? 'ready' : 'onboarding',
        userId: me.id,
        isAuthenticated: true,
      });
    } catch (err) {
      if (isAuthError(err)) {
        await tokenStorage.clear();
        set({ status: 'signedOut', userId: null, isAuthenticated: false });
      } else {
        // network/server problem: keep the session instead of logging the user out
        set({ status: 'ready', isAuthenticated: true });
      }
    }
  },

  signIn: async ({ accessToken, refreshToken, userId }) => {
    await tokenStorage.save(accessToken, refreshToken);
    let status: AuthStatus = 'onboarding';
    try {
      const me: Me = await api.get('/users/me');
      status = me.onboardingCompleted ? 'ready' : 'onboarding';
    } catch {
      // if /users/me fails right after sign-in, treat it as a new account
    }
    set({ status, userId, isAuthenticated: true });
    return status;
  },

  markOnboardingDone: () => set({ status: 'ready' }),
  setSession: (userId) => set({ userId, isAuthenticated: true }),
  clearSession: () => set({ status: 'signedOut', userId: null, isAuthenticated: false }),
}));