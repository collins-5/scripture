import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingState = {
  seen: boolean;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  markSeen: () => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      seen: false,
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),

      markSeen: () => set({ seen: true }),

      reset: () => set({ seen: false }),
    }),
    {
      name: 'scripture-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ seen: state.seen }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);