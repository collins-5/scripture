import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getStoredString, setStoredString } from '@/lib/storage';
import { ACCENT_ORDER, AccentKey } from '@/lib/theme/accents';
import { FONT_OPTIONS, FontKey, LINE_STEPS, SIZE_STEPS } from '@/lib/theme/fonts';
import { DEFAULT_TRANSLATION } from '@/lib/bible/translations';

export type Settings = {
  accent: AccentKey;
  fontFamily: FontKey;
  sizeStep: number;
  lineStep: number;
  redLetters: boolean;
  translation: string;
  name: string;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
};

export const DEFAULT_SETTINGS: Settings = {
  accent: 'gold',
  fontFamily: 'lora',
  sizeStep: 1,
  lineStep: 1,
  redLetters: true,
  translation: DEFAULT_TRANSLATION,
  name: '',
  reminderEnabled: false,
  reminderHour: 7,
  reminderMinute: 0,
};

const STORAGE_KEY = '@reader-settings';

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function sanitize(input: any): Settings {
  const d = DEFAULT_SETTINGS;
  const src = input && typeof input === 'object' ? input : {};
  const name =
    typeof src.name === 'string' && src.name.trim() ? src.name.trim().slice(0, 40) : d.name;
  return {
    accent: ACCENT_ORDER.includes(src.accent) ? src.accent : d.accent,
    fontFamily: FONT_OPTIONS.some((f) => f.key === src.fontFamily) ? src.fontFamily : d.fontFamily,
    sizeStep: clampInt(src.sizeStep, 0, SIZE_STEPS.length - 1, d.sizeStep),
    lineStep: clampInt(src.lineStep, 0, LINE_STEPS.length - 1, d.lineStep),
    redLetters: typeof src.redLetters === 'boolean' ? src.redLetters : d.redLetters,
    translation:
      typeof src.translation === 'string' && src.translation.trim()
        ? src.translation.trim().slice(0, 60)
        : d.translation,
    name,
    reminderEnabled: typeof src.reminderEnabled === 'boolean' ? src.reminderEnabled : d.reminderEnabled,
    reminderHour: clampInt(src.reminderHour, 0, 23, d.reminderHour),
    reminderMinute: clampInt(src.reminderMinute, 0, 59, d.reminderMinute),
  };
}

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  hydrated: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await getStoredString(STORAGE_KEY);
        if (mounted && raw) setSettings(sanitize(JSON.parse(raw)));
      } catch {
        return;
      } finally {
        if (mounted) setHydrated(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStoredString(STORAGE_KEY, JSON.stringify(settings)).catch(() => undefined);
  }, [settings, hydrated]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => sanitize({ ...prev, ...patch }));
  }, []);

  const value = useMemo(() => ({ settings, update, hydrated }), [settings, update, hydrated]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}