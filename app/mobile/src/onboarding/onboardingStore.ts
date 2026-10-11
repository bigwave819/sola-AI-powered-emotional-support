import { create } from 'zustand';

interface OnboardingState {
  ageConfirmed: boolean;
  motivations: string[];
  baselineMood: number | null;
  reflectionPreference: string | null;
  timeCommitment: string | null;
  notificationsEnabled: boolean;

  setAgeConfirmed: (v: boolean) => void;
  toggleMotivation: (m: string) => void;
  setBaselineMood: (v: number) => void;
  setReflectionPreference: (v: string) => void;
  setTimeCommitment: (v: string) => void;
  setNotificationsEnabled: (v: boolean) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ageConfirmed: false,
  motivations: [],
  baselineMood: null,
  reflectionPreference: null,
  timeCommitment: null,
  notificationsEnabled: false,

  setAgeConfirmed: (v) => {
    console.log('[ONBOARDING] setAgeConfirmed:', v);
    set({ ageConfirmed: v });
  },
  toggleMotivation: (m) => {
    const current = get().motivations;
    const next = current.includes(m)
      ? current.filter((x) => x !== m)
      : [...current, m];
    console.log('[ONBOARDING] toggleMotivation:', m, '→ motivations now:', next);
    set({ motivations: next });
  },
  setBaselineMood: (v) => {
    console.log('[ONBOARDING] setBaselineMood:', v);
    set({ baselineMood: v });
  },
  setReflectionPreference: (v) => {
    console.log('[ONBOARDING] setReflectionPreference:', v);
    set({ reflectionPreference: v });
  },
  setTimeCommitment: (v) => {
    console.log('[ONBOARDING] setTimeCommitment:', v);
    set({ timeCommitment: v });
  },
  setNotificationsEnabled: (v) => {
    console.log('[ONBOARDING] setNotificationsEnabled:', v);
    set({ notificationsEnabled: v });
  },
  reset: () => {
    console.log('[ONBOARDING] reset called — clearing all onboarding state');
    set({
      ageConfirmed: false,
      motivations: [],
      baselineMood: null,
      reflectionPreference: null,
      timeCommitment: null,
      notificationsEnabled: false,
    });
  },
}));