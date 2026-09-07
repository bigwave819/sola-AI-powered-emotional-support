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

  setAgeConfirmed: (v) => set({ ageConfirmed: v }),
  toggleMotivation: (m) => {
    const current = get().motivations;
    set({
      motivations: current.includes(m)
        ? current.filter((x) => x !== m)
        : [...current, m],
    });
  },
  setBaselineMood: (v) => set({ baselineMood: v }),
  setReflectionPreference: (v) => set({ reflectionPreference: v }),
  setTimeCommitment: (v) => set({ timeCommitment: v }),
  setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
  reset: () =>
    set({
      ageConfirmed: false,
      motivations: [],
      baselineMood: null,
      reflectionPreference: null,
      timeCommitment: null,
      notificationsEnabled: false,
    }),
}));