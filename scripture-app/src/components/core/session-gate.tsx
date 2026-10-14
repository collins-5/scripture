import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
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

    const group = segments[0];
    const inAuthGroup = group === '(auth)';
    const inOnboardingGroup = group === '(onboarding)';
    const inTabs = group === '(tabs)';

    if (!seenOnboarding) {
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)');
      }
      return;
    }

    if (status === 'authenticated') {
      if (!inTabs) {
        router.replace('/(tabs)');
      }
      return;
    }

    if (status === 'unauthenticated') {
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
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
        <SessionLoading/>
      </View>
    );
  }

  return <>{children}</>;
}