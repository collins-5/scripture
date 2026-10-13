import { Platform } from 'react-native';

const IDENTIFIER = 'daily-verse';
const CHANNEL = 'daily-verse';

async function loadNotifications() {
  try {
    return await import('expo-notifications');
  } catch {
    return null;
  }
}

export async function scheduleDailyVerse(hour: number, minute: number): Promise<boolean> {
  const Notifications = await loadNotifications();
  if (!Notifications) return false;

  try {
    let status = await Notifications.getPermissionsAsync();
    if (!status.granted) {
      status = await Notifications.requestPermissionsAsync();
    }
    if (!status.granted) return false;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL, {
        name: 'Daily verse',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.cancelScheduledNotificationAsync(IDENTIFIER).catch(() => undefined);

    await Notifications.scheduleNotificationAsync({
      identifier: IDENTIFIER,
      content: {
        title: 'Verse of the day',
        body: 'Open the app to read today’s verse.',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: CHANNEL,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelDailyVerse(): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(IDENTIFIER);
  } catch {
    return;
  }
}