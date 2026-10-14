import { useCallback, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import {
  registerForPushNotifications,
  sendTokenToServer,
  clearTokenOnServer,
} from '@/lib/notifications';
import { useAuth } from '@/hooks/use-auth';

export function usePushNotifications() {
  const router = useRouter();
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);
  const registered = useRef(false);

  const register = useCallback(async () => {
    if (registered.current) return;
    setLoading(true);
    try {
      const result = await registerForPushNotifications();
      setGranted(result.granted);
      if (result.token) {
        setToken(result.token);
        await sendTokenToServer(result.token);
        registered.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const unregister = useCallback(async () => {
    try {
      await clearTokenOnServer();
    } catch {
      return;
    } finally {
      setToken(null);
      registered.current = false;
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    register();
  }, [user, register]);

  useEffect(() => {
    const received = Notifications.addNotificationReceivedListener(() => {});
    const response = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        const data = event.notification.request.content.data as
          | { book?: string; chapter?: number; verse?: number }
          | undefined;
        if (data?.book && data?.chapter) {
          router.push({
            pathname: '/read',
            params: {
              book: data.book,
              chapter: String(data.chapter),
              ...(data.verse ? { verse: String(data.verse) } : {}),
            },
          });
        }
      },
    );

    return () => {
      received.remove();
      response.remove();
    };
  }, [router]);

  return { token, granted, loading, register, unregister };
}