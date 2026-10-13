import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/lib/services/authService';
import { queryClient } from '@/providers/query-client';

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
};

export type SessionStatus =
    | 'idle'
    | 'loading'
    | 'authenticated'
    | 'unauthenticated';

type AuthState = {
    user: User | null;
    status: SessionStatus;
    hydrated: boolean;
    setHydrated: (value: boolean) => void;
    signIn: (user: User, token: string) => Promise<void>;
    signOut: () => Promise<void>;
    bootstrap: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            status: 'idle',
            hydrated: false,

            setHydrated: (value) => set({ hydrated: value }),

            signIn: async (user, token) => {
                set({ user, status: 'authenticated' });
            },

            signOut: async () => {
                await authService.logout();
                queryClient.clear();
                set({ user: null, status: 'unauthenticated' });
            },

            bootstrap: async () => {
                set({ status: 'loading' });

                const token = await authService.getToken();
                if (!token) {
                    set({ user: null, status: 'unauthenticated' });
                    return;
                }

                try {
                    const { user } = await authService.me();
                    set({ user, status: 'authenticated' });
                } catch {
                    await authService.logout();
                    set({ user: null, status: 'unauthenticated' });
                }
            },
        }),
        {
            name: 'scripture-auth-profile',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ user: state.user }),
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        },
    ),
);

export const selectIsAuthenticated = (s: AuthState) =>
    s.status === 'authenticated' && !!s.user;