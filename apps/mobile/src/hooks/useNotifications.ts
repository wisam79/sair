import { useEffect } from 'react';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useAuthStore } from './useStore';

/**
 * useNotifications — Integration with OneSignal (Safe for both Expo Go and Dev Builds).
 *
 * If running in Expo Go, it safely warns and skips to prevent crashes.
 * Automatically handles mapping the user UUID to OneSignal's External ID on login/logout.
 */

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export function useNotifications() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    if (isExpoGo()) {
      console.warn('[Notifications] Skipping — OneSignal is not supported in Expo Go.');
      return;
    }

    // Lazy load react-native-onesignal to prevent import-time crashes in Expo Go
    let OneSignal: typeof import('react-native-onesignal').OneSignal;
    try {
      OneSignal = require('react-native-onesignal').OneSignal;
    } catch (e) {
      console.warn('[Notifications] Failed to load OneSignal module:', e);
      return;
    }

    const appId = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId) {
      console.warn(
        '[Notifications] EXPO_PUBLIC_ONESIGNAL_APP_ID is not defined in environment variables.',
      );
      return;
    }

    // Initialize OneSignal
    try {
      OneSignal.initialize(appId);
      OneSignal.Notifications.requestPermission(true);
    } catch (err) {
      console.error('[Notifications] Initialization error:', err);
      return;
    }

    // Map database User UUID to OneSignal's external ID
    if (userId) {
      console.warn('[Notifications] OneSignal logging in user:', userId);
      OneSignal.login(userId);
    } else {
      console.warn('[Notifications] OneSignal logging out user');
      OneSignal.logout();
    }

    const handleNotificationClick = (event: import('react-native-onesignal').NotificationClickEvent) => {
      console.warn('[Notifications] Notification Clicked:', event);
      const data = event.notification?.additionalData as Record<string, unknown> | undefined;
      if (data?.type === 'trip_update' && data.trip_id) {
        router.push({
          pathname: '/tracking/[tripId]',
          params: { tripId: String(data.trip_id) },
        });
      } else if (data?.type === 'message' && data.conversation_id) {
        router.push({
          pathname: '/chat/[id]',
          params: { id: String(data.conversation_id) },
        });
      }
    };

    OneSignal.Notifications.addEventListener('click', handleNotificationClick);

    return () => {
      try {
        OneSignal.Notifications.removeEventListener('click', handleNotificationClick);
      } catch (err) {
        // Safe cleanup
      }
    };
  }, [router, userId]);
}
