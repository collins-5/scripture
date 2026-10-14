import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { apiClient } from './services/apiClient';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Default',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#0d9488',
    sound: 'default',
  });
}

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    return { granted: false, token: null, reason: 'Must use a physical device.' };
  }

  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== 'granted') {
    return { granted: false, token: null, reason: 'Permission denied.' };
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  if (!projectId) {
    return { granted: true, token: null, reason: 'Missing projectId.' };
  }

  try {
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    return { granted: true, token: data };
  } catch (error: any) {
    return { granted: true, token: null, reason: error?.message };
  }
}

export async function sendTokenToServer(token: string): Promise<void> {
  await apiClient('/api/user/push-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function clearTokenOnServer(): Promise<void> {
  await apiClient('/api/user/push-token', {
    method: 'POST',
    body: JSON.stringify({ token: '' }),
  });
}

export async function scheduleLocalDailyVerse(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Daily Verse',
      body: "Read today's scripture and reflect.",
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelAllScheduled(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}