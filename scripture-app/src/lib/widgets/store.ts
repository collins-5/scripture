import { getStoredString, setStoredString } from '@/lib/storage';
import { ACCENT_ORDER, AccentKey } from '@/lib/theme/accents';
import { DEFAULT_TRANSLATION } from '@/lib/bible/translations';
import { LAST_SYNC_KEY, SNAPSHOT_KEY, WidgetSnapshot } from '@/lib/widgets/snapshot';

const SETTINGS_KEY = '@reader-settings';

export async function readSnapshot(): Promise<WidgetSnapshot | null> {
  try {
    const raw = await getStoredString(SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as WidgetSnapshot) : null;
  } catch {
    return null;
  }
}

export async function writeSnapshot(snapshot: WidgetSnapshot): Promise<void> {
  try {
    await setStoredString(SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    return;
  }
}

export async function readSettings(): Promise<{ translation: string; accent: AccentKey }> {
  try {
    const raw = await getStoredString(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      translation:
        typeof parsed.translation === 'string' && parsed.translation
          ? parsed.translation
          : DEFAULT_TRANSLATION,
      accent: ACCENT_ORDER.includes(parsed.accent) ? parsed.accent : 'gold',
    };
  } catch {
    return { translation: DEFAULT_TRANSLATION, accent: 'gold' };
  }
}

export async function readLastSync(): Promise<string | null> {
  try {
    return (await getStoredString(LAST_SYNC_KEY)) ?? null;
  } catch {
    return null;
  }
}

export async function writeLastSync(value: string): Promise<void> {
  try {
    await setStoredString(LAST_SYNC_KEY, value);
  } catch {
    return;
  }
}