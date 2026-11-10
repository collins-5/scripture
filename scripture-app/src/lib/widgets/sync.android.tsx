import React from 'react';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { VerseWidget } from '@/widgets/android/verse-widget';
import { ANDROID_WIDGET_NAME } from '@/lib/widgets/config';
import { writeSnapshot } from '@/lib/widgets/store';
import { WidgetSnapshot } from '@/lib/widgets/snapshot';

export async function syncWidget(week: WidgetSnapshot[]): Promise<void> {
  const today = week[0];
  if (!today) return;
  await writeSnapshot(today);
  await requestWidgetUpdate({
    widgetName: ANDROID_WIDGET_NAME,
    renderWidget: () => <VerseWidget snapshot={today} />,
    widgetNotFound: () => undefined,
  });
}