import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { colorScheme as nativeWindColorScheme } from 'react-native-css-interop';
import { getStoredString, setStoredString } from '@/lib/storage';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemePreferenceContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolvedScheme: 'light' | 'dark';
  isDark: boolean;
  hasHydrated: boolean;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

const STORAGE_KEY = '@appearance';

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  // React Native's hook — reliably updates when the OS dark/light mode changes
  const deviceScheme = useDeviceColorScheme() ?? 'light';
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [hasHydrated, setHasHydrated] = useState(false);

  // Hydrate stored preference on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await getStoredString(STORAGE_KEY);
        if (!mounted) return;
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      } finally {
        if (mounted) setHasHydrated(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // When mode is 'system', follow the device; otherwise use the explicit choice
  const resolvedScheme: 'light' | 'dark' =
    mode === 'system' ? deviceScheme : mode;

  const isDark = resolvedScheme === 'dark';

  // Keep NativeWind Tailwind dark: variants in sync. In system mode, pass
  // "system" through so any previous light/dark app override is cleared and
  // React Native can report the real OS appearance again.
  useEffect(() => {
    nativeWindColorScheme.set(mode === 'system' ? 'system' : resolvedScheme);
  }, [mode, resolvedScheme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    setStoredString(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const value = useMemo<ThemePreferenceContextValue>(
    () => ({ mode, setMode, resolvedScheme, isDark, hasHydrated }),
    [hasHydrated, isDark, mode, resolvedScheme, setMode],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within ThemePreferenceProvider');
  }
  return ctx;
}

export function useAppColorScheme(): 'light' | 'dark' {
  return useThemePreference().resolvedScheme;
}
