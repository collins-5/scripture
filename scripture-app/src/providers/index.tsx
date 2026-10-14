import React from 'react';
import { View, StatusBar } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  type Theme,
} from 'expo-router/react-navigation';
import { SheetProvider } from 'react-native-actions-sheet';
import * as SystemUI from 'expo-system-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  ThemePreferenceProvider,
  useThemePreference,
} from '@/hooks/use-theme-preference';
import { SettingsProvider, useSettings } from '@/hooks/use-settings';
import { LibraryProvider, useLibrary } from '@/hooks/use-library';
import { useAppFonts } from '@/hooks/use-app-fonts';
import { useThemeColors } from '@/hooks/useThemeColors';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import '@/components/ui/bottom-sheets';
import { SessionGate } from '@/components/core/session-gate';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function PushBridge() {
  usePushNotifications();
  return null;
}

function ReadyGate({ children }: { children: React.ReactNode }) {
  const { hasHydrated } = useThemePreference();
  const { hydrated: settingsReady } = useSettings();
  const { hydrated: libraryReady } = useLibrary();
  const fontsReady = useAppFonts();

  if (!hasHydrated || !settingsReady || !libraryReady || !fontsReady) {
    return null;
  }

  return <>{children}</>;
}

function ThemedProviders({ children }: { children: React.ReactNode }) {
  const { isDark } = useThemePreference();
  const { brand, surface, text, border } = useThemeColors();

  React.useEffect(() => {
    SystemUI.setBackgroundColorAsync(surface.appGray).catch(() => undefined);
  }, [surface.appGray]);

  const navigationTheme: Theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: brand.primary,
      background: surface.appGray,
      card: surface.card,
      text: text.dark,
      border: border.light,
      notification: brand.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
        <SheetProvider>
          <View className="flex-1" style={{ backgroundColor: surface.appGray }}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle={isDark ? 'light-content' : 'dark-content'}
            />
            <ReadyGate>
              <SessionGate>
                <PushBridge />
                {children}
              </SessionGate>
            </ReadyGate>
          </View>
        </SheetProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemePreferenceProvider>
          <SettingsProvider>
            <LibraryProvider>
              <ThemedProviders>{children}</ThemedProviders>
            </LibraryProvider>
          </SettingsProvider>
        </ThemePreferenceProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}