import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import SessionLoading from './session-loading';

export function SessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const t = useAppTheme();

  const status = useAuthStore((s) => s.status);
  const hydrated = useAuthStore((s) => s.hydrated);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  const onboardingHydrated = useOnboardingStore((s) => s.hydrated);
  const seenOnboarding = useOnboardingStore((s) => s.seen);

  const authReady = hydrated && status !== 'idle' && status !== 'loading';
  const allReady = authReady && onboardingHydrated;

  useEffect(() => {
    if (hydrated && status === 'idle') {
      bootstrap();
    }
  }, [hydrated, status, bootstrap]);

  useEffect(() => {
    if (!allReady) return;

    const group = segments[0] as string | undefined;
    const inAuthGroup = group === '(auth)';
    const inOnboardingGroup = group === '(onboarding)';

    // 1. Onboarding gate — highest priority
    if (!seenOnboarding) {
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)');
      }
      return;
    }

    // 2. Unauthenticated gate — must reach auth
    if (status === 'unauthenticated') {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
      return;
    }

    // 3. Authenticated — block only the auth/onboarding groups,
    //    allow everything else (tabs, note, reading-fonts, saved-verses, ...)
    if (status === 'authenticated') {
      if (inAuthGroup || inOnboardingGroup) {
        router.replace('/(tabs)');
      }
      return;
    }
  }, [allReady, seenOnboarding, status, segments, router]);

  if (!allReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.c.bg,
        }}
      >
        <SessionLoading />
      </View>
    );
  }

  return <>{children}</>;
}