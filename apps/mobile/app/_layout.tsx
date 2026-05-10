import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/hooks/useStore';
import { useTranslation } from '../src/hooks/useTranslation';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import { I18nManager, View, Text, StyleSheet } from 'react-native';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

export default function Layout() {
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const { user, role, setAuth, setProfile } = useAuthStore();
  const { isRTL, t } = useTranslation();
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    if (isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, [isRTL]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const role = session.user.app_metadata?.role || session.user.user_metadata?.role || 'student';
        const fullName = session.user.user_metadata?.full_name || '';
        setAuth({ id: session.user.id, email: session.user.email, user_metadata: session.user.user_metadata }, role);
        if (fullName) {
          setProfile({ full_name: fullName, phone: session.user.phone || '' });
        }
      }
      setInitialized(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const role = session.user.app_metadata?.role || session.user.user_metadata?.role || 'student';
        const fullName = session.user.user_metadata?.full_name || '';
        setAuth({ id: session.user.id, email: session.user.email, user_metadata: session.user.user_metadata }, role);
        if (fullName) {
          setProfile({ full_name: fullName, phone: session.user.phone || '' });
        }
      } else {
        setAuth(null, null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === 'login';

    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      if (role === 'driver') {
        router.replace('/driver');
      } else {
        router.replace('/');
      }
    }
  }, [initialized, segments, user]);

  if (!initialized) return null;

  return (
    <ErrorBoundary>
    <>
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>{t('no_internet')}</Text>
        </View>
      )}
      <Stack screenOptions={{ headerShown: true, headerBackTitle: 'Back' }}>
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="booking" options={{ title: 'Book a Ride' }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
        <Stack.Screen name="subscriptions" options={{ title: 'My Subscriptions' }} />
        <Stack.Screen name="tracking/[tripId]" options={{ title: 'Live Tracking' }} />
        <Stack.Screen
          name="driver"
          options={{ title: 'Driver Dashboard', headerShown: false }}
        />
      </Stack>
    </>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: '#FF9500',
    paddingVertical: 6,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
