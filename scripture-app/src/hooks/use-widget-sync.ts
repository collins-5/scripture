import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSettings } from '@/hooks/use-settings';
import { buildWeek } from '@/lib/widgets/daily';
import { syncWidget } from '@/lib/widgets/sync';
import { readLastSync, writeLastSync } from '@/lib/widgets/store';
import { WIDGET_APP_GROUP, WIDGET_SCHEME } from '@/lib/widgets/config';
import { dayKey } from '@/lib/dates';

export function useWidgetSync() {
  const { settings } = useSettings();

  useEffect(() => {
    if (Platform.OS === 'web') return;
    let cancelled = false;

    (async () => {
      const marker = [
        WIDGET_APP_GROUP,
        WIDGET_SCHEME,
        dayKey(),
        settings.translation,
        settings.accent,
      ].join('|');
      if ((await readLastSync()) === marker) return;
      const week = await buildWeek(settings.translation, settings.accent);
      if (cancelled || week.length === 0) return;
      await syncWidget(week);
      await writeLastSync(marker);
    })().catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [settings.translation, settings.accent]);
}