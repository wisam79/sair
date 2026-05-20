import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/hooks/useStore';
import { useTranslation } from '../src/hooks/useTranslation';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import { useNotifications } from '../src/hooks/useNotifications';
import {
  I18nManager,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { Colors } from '../src/theme';
import {
  useFonts,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_700Bold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const {
    user,
    role,
    initialized,
    hasHydrated,
    hasSeenOnboarding,
    setAuth,
    setProfile,
    setInitialized,
  } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const { isRTL, t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const { top } = useSafeAreaInsets();

  const [forceUpdateRequired, setForceUpdateRequired] = useState(false);

  // Initialize push notifications globally
  useNotifications();

  const [fontsLoaded, fontError] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_700Bold,
  });

  // RTL setup
  useEffect(() => {
    if (isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, [isRTL]);

  // Phase 5: Force Update Check
  useEffect(() => {
    async function checkVersion() {
      try {
        const { data, error } = await supabase.rpc('get_app_config');
        if (data && !error) {
          const currentVersion = Constants.expoConfig?.version || '1.0.0';
          if (data.min_version && currentVersion < data.min_version) {
            setForceUpdateRequired(true);
          }
        }
      } catch (e) {
        // Ignore errors on version check
      }
    }
    checkVersion();
  }, []);

  // Auth listener
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        try {
          if (session?.user) {
            const role = session.user.app_metadata?.role || 'student'; // SECURITY: app_metadata only
            setAuth(
              {
                id: session.user.id,
                email: session.user.email,
                user_metadata: session.user.user_metadata,
              },
              role,
            );
            // Fetch full profile from DB (includes institution_id for smart matching)
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, phone, institution_id')
              .eq('id', session.user.id)
              .single();
            if (profileData) {
              setProfile({
                full_name: profileData.full_name || '',
                phone: profileData.phone || '',
                institution_id: profileData.institution_id,
              });
            }
          }
        } catch (error) {
          console.warn('[Auth] getSession inner error:', error);
        } finally {
          setInitialized(true);
        }
      })
      .catch((error) => {
        console.warn('[Auth] getSession error:', error);
        setInitialized(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const role = session.user.app_metadata?.role || 'student'; // SECURITY: app_metadata only
          setAuth(
            {
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata,
            },
            role,
          );
          // Fetch full profile from DB (includes institution_id for smart matching)
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, phone, institution_id')
            .eq('id', session.user.id)
            .single();
          if (profileData) {
            setProfile({
              full_name: profileData.full_name || '',
              phone: profileData.phone || '',
              institution_id: profileData.institution_id,
            });
          }
        } else {
          setAuth(null, null);
        }
      } catch (error) {
        console.warn('[Auth] onAuthStateChange inner error:', error);
      } finally {
        setInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Navigation guard
  useEffect(() => {
    if (!initialized || !hasHydrated) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'onboarding';

    if (!user && !inAuthGroup) {
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/login');
      }
    } else if (user && inAuthGroup) {
      if (role === 'driver') {
        router.replace('/driver');
      } else {
        router.replace('/');
      }
    }
  }, [initialized, hasHydrated, segments, user, hasSeenOnboarding]);

  // Hide splash screen once fonts are ready
  const appIsReady = (fontsLoaded || fontError) && initialized && hasHydrated;

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  if (forceUpdateRequired) {
    return (
      <View style={[styles.root, styles.updateContainer]} onLayout={onLayoutRootView}>
        <Ionicons name="cloud-download-outline" size={80} color={Colors.primary} />
        <Text style={styles.updateTitle}>{t('update_required') || 'تحديث مطلوب'}</Text>
        <Text style={styles.updateSubtitle}>
          {t('update_required_desc') ||
            'أطلقنا نسخة جديدة مليئة بالتحسينات! يرجى تحديث التطبيق للمتابعة.'}
        </Text>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => Linking.openURL('market://details?id=com.uniride.app')}
        >
          <Text style={styles.updateButtonText}>{t('update_now') || 'تحديث الآن'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View style={styles.root} onLayout={onLayoutRootView}>
          {!isOnline && (
            <View style={[styles.offlineBanner, { paddingTop: top }]}>
              <Text style={styles.offlineText}>{t('no_internet')}</Text>
            </View>
          )}
          <Stack screenOptions={{ headerShown: true, headerBackTitle: t('go_back_short') }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="booking" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="tracking/[tripId]" options={{ title: t('track_trip') }} />
            <Stack.Screen name="activate" options={{ headerShown: false }} />
            <Stack.Screen name="create-trip" options={{ headerShown: false }} />
            <Stack.Screen name="payment" options={{ headerShown: false }} />
            <Stack.Screen
              name="rating/[tripId]"
              options={{ title: t('rating'), headerShown: false }}
            />
            <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="trip-history" options={{ headerShown: false }} />
            <Stack.Screen name="payouts" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="help" options={{ headerShown: false }} />
          </Stack>
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundDark,
  },
  offlineBanner: {
    backgroundColor: Colors.warning,
    paddingVertical: 6,
    alignItems: 'center',
  },
  offlineText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'IBMPlexSansArabic_500Medium',
  },
  updateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.background,
  },
  updateTitle: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  updateSubtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  updateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  updateButtonText: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 16,
    color: Colors.white,
  },
});
