import { useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { useAuthStore } from './useStore';

/**
 * useNotifications — Safe for both Expo Go and Development Builds.
 *
 * Since SDK 53, expo-notifications removed Android push notification
 * support from Expo Go. We detect Expo Go at runtime and skip all
 * notification logic to prevent crashes.
 */

// Detect if running in Expo Go
function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

export function useNotifications() {
  const cleanupRef = useRef<(() => void) | null>(null);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    // Skip notifications entirely in Expo Go — they are not supported since SDK 53
    if (isExpoGo()) {
      console.warn('[Notifications] Skipping — not supported in Expo Go (SDK 53+)');
      return;
    }

    let isMounted = true;

    async function initPushNotifications() {
      try {
        // Only import expo-notifications in development builds / standalone apps
        const Notifications = require('expo-notifications') as typeof import('expo-notifications');
        const Device = require('expo-device') as typeof import('expo-device');

        // Set notification handler
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#C2703E',
          });
        }

        if (!Device.isDevice) {
          console.warn('[Notifications] Must use physical device for Push Notifications');
          Alert.alert(
            'Push Notifications',
            '⚠️ Must use a physical device for Push Notifications.',
          );
          return;
        }

        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();
        if (!supabaseUser || !isMounted) return;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.warn('[Notifications] Permission not granted');
          Alert.alert('Push Notifications', '❌ Permission not granted for Push Notifications.');
          return;
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const token = (
          await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)
        ).data;

        if (token && isMounted) {
          const { error } = await supabase.rpc('register_push_token', {
            p_token: token,
          });
          if (error) {
            console.warn('[Notifications] Error saving push token:', error.message);
            Alert.alert(
              'Push Notifications',
              `❌ Failed to save token in Database: ${error.message}`,
            );
          } else {
            console.log('[Notifications] Push token registered successfully:', token);
          }
        } else if (!token) {
          Alert.alert(
            'Push Notifications',
            '❌ Failed to retrieve Expo Push Token (token is empty).',
          );
        }

        // Setup listeners
        if (isMounted) {
          const notifSub = Notifications.addNotificationReceivedListener((notification) => {
            console.warn('[Notifications] Received:', notification.request.content.title);
          });

          const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
            console.warn(
              '[Notifications] Interaction:',
              response.notification.request.content.body,
            );
            const data = response.notification.request.content.data;
            if (data?.type === 'trip_update' && data.trip_id) {
              router.push({
                pathname: '/tracking/[tripId]',
                params: { tripId: String(data.trip_id) },
              });
            } else if (data?.type === 'message' && data.conversation_id) {
              router.push({ pathname: '/chat/[id]', params: { id: String(data.conversation_id) } });
            }
          });

          cleanupRef.current = () => {
            notifSub.remove();
            responseSub.remove();
          };
        }
      } catch (error: any) {
        console.warn('[Notifications] Init failed:', error);
        Alert.alert('Push Notifications Error', error?.message || String(error));
      }
    }

    initPushNotifications();

    return () => {
      isMounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [router, userId]);
}
