import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { supabase } from '../lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C2703E',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }
    
    // Using default Expo project ID resolution
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    console.warn('Must use physical device for Push Notifications');
  }

  return token;
}

export function useNotifications() {
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    let isMounted = true;

    async function initPushNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const token = await registerForPushNotificationsAsync();
      
      if (token && isMounted) {
        // Register token in Supabase
        const { error } = await supabase.rpc('register_push_token', {
          p_token: token,
        });
        
        if (error) {
          console.warn('Error saving push token:', error.message);
        }
      }
    }

    initPushNotifications();

    // Listeners for foreground and interaction events
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.warn('Received notification:', notification.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.warn('User interacted with notification:', response.notification.request.content.body);
    });

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
}
