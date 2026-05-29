import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useCallback, useState, useRef } from 'react';
import { supabase } from '../src/lib/supabase';
import * as Sentry from '@sentry/react-native';
import {
  useAuthStore,
  useTripStore,
  useBookingStore,
  useI18nStore,
  validateActiveTripOnBoot,
} from '../src/hooks/useStore';
import { useRealtimeHealth } from '../src/hooks/useRealtimeHealth';
import '../src/lib/i18n';
import { useTranslation } from '../src/hooks/useTranslation';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import { useNotifications } from '../src/hooks/useNotifications';
import { logger } from '../src/lib/logger';
import {
  I18nManager,
  DevSettings,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { Colors } from '../src/theme';
import {
  useFonts,
  NotoSansArabic_400Regular,
  NotoSansArabic_500Medium,
  NotoSansArabic_700Bold,
} from '@expo-google-fonts/noto-sans-arabic';
import { Gulzar_400Regular } from '@expo-google-fonts/gulzar';
import { Lemonada_400Regular, Lemonada_700Bold } from '@expo-google-fonts/lemonada';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatedSplashScreen } from '../src/components/AnimatedSplashScreen';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
if (sentryDsn && Constants.appOwnership !== 'expo') {
  Sentry.init({
    dsn: sentryDsn,
    debug: __DEV__,
  });
}

// Keep the splash screen visible while fonts load
// NOTE: On web, preventAutoHideAsync injects a white overlay — skip it to avoid blank page
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

function Layout() {
  const {
    user,
    role,
    initialized,
    hasHydrated: authHydrated,
    hasSeenOnboarding,
    setAuth,
    setProfile,
    setInitialized,
  } = useAuthStore();
  const tripHydrated = useTripStore((state) => state.hasHydrated);
  const bookingHydrated = useBookingStore((state) => state.hasHydrated);
  const i18nHydrated = useI18nStore((state) => state.hasHydrated);

  const allStoresHydrated = authHydrated && tripHydrated && bookingHydrated && i18nHydrated;
  const segments = useSegments();
  const router = useRouter();
  const { isRTL, t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const { top } = useSafeAreaInsets();

  const { status: realtimeStatus } = useRealtimeHealth();
  const [forceUpdateRequired, setForceUpdateRequired] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [hydrationTimedOut, setHydrationTimedOut] = useState(false); // Prevent infinite refresh loop: only attempt session refresh once per mount
  const refreshAttemptedRef = useRef(false);

  // Initialize push notifications globally
  useNotifications();

  const [fontsLoaded, fontError] = useFonts({
    NotoSansArabic_400Regular,
    NotoSansArabic_500Medium,
    NotoSansArabic_700Bold,
    Gulzar_400Regular,
    Lemonada_400Regular,
    Lemonada_700Bold,
  });

  // RTL setup
  useEffect(() => {
    if (!i18nHydrated) return; // Wait until language store is fully hydrated from AsyncStorage!
    if (Platform.OS === 'web') return; // RTL via DevSettings.reload() is not supported on web

    const shouldBeRTL = isRTL;
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);

      // Force reload to apply RTL layout direction
      setTimeout(() => {
        try {
          DevSettings.reload();
        } catch (err) {
          console.error('[I18n] Failed to auto-reload for RTL alignment:', err);
        }
      }, 150);
    }
  }, [isRTL, i18nHydrated]);

  // Phase 5: Force Update Check
  useEffect(() => {
    /** Compare semver versions correctly (e.g. '1.2.3' < '1.10.0') */
    function isVersionLessThan(current: string, minimum: string): boolean {
      const a = current.split('.').map(Number);
      const b = minimum.split('.').map(Number);
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const av = a[i] ?? 0;
        const bv = b[i] ?? 0;
        if (av < bv) return true;
        if (av > bv) return false;
      }
      return false;
    }

    async function checkVersion() {
      try {
        const { data, error } = await supabase.rpc('get_app_config');
        if (data && !error) {
          const currentVersion = Constants.expoConfig?.version || '1.0.0';
          if (data.min_version && isVersionLessThan(currentVersion, data.min_version)) {
            setForceUpdateRequired(true);
          }
        }
      } catch (e) {
        // Ignore errors on version check
      }
    }
    checkVersion();
  }, []);

  // Hydration safety net: if AsyncStorage is corrupted or very slow on a low-end device,
  // force the app to render after 10s instead of showing an infinite loading spinner.
  useEffect(() => {
    if (Platform.OS === 'web' || allStoresHydrated) return;
    const timer = setTimeout(() => {
      if (!allStoresHydrated) {
        logger.error('[Boot] Store hydration timed out after 10s', {
          auth: authHydrated,
          trip: tripHydrated,
          booking: bookingHydrated,
          i18n: i18nHydrated,
        });
        setHydrationTimedOut(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [allStoresHydrated, authHydrated, tripHydrated, bookingHydrated, i18nHydrated]);

  // Auth listener
  useEffect(() => {
    // Safety net: if Supabase getSession takes too long (e.g. network issue),
    // force initialized=true so the loading spinner doesn't show forever.
    // Web: 5s (synchronous localStorage), Native: 8s (slower AsyncStorage)
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;
    const timeout = Platform.OS === 'web' ? 5000 : 8000;
    safetyTimer = setTimeout(() => {
      if (!useAuthStore.getState().initialized) {
        logger.warn('[Boot] Auth initialization timed out — forcing ready state');
        setInitialized(true);
      }
    }, timeout);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        try {
          if (session?.user) {
            const jwtRole = session.user.app_metadata?.role || 'student'; // SECURITY: app_metadata only

            setAuth(
              {
                id: session.user.id,
                email: session.user.email,
              },
              jwtRole,
            );
            setInitialized(true);

            // Fetch full profile and check role promotions in the background
            const fetchProfile = async () => {
              try {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('full_name, phone, institution_id, role')
                  .eq('id', session.user.id)
                  .single();

                if (profileData) {
                  const dbRole = profileData.role as string | undefined;

                  // If the DB role differs from the JWT role, the admin promoted/demoted this user.
                  // Refresh the session so the new JWT reflects the updated app_metadata role.
                  if (dbRole && dbRole !== jwtRole && !refreshAttemptedRef.current) {
                    refreshAttemptedRef.current = true;
                    console.warn(
                      `[Auth] Role mismatch detected: JWT=${jwtRole}, DB=${dbRole}. Refreshing session...`,
                    );
                    supabase.auth.refreshSession();
                  }

                  setProfile({
                    full_name: profileData.full_name || '',
                    phone: profileData.phone || '',
                    institution_id: profileData.institution_id,
                  });
                }
              } catch (err) {
                console.warn('[Auth] Background profile fetch failed:', err);
              }
            };
            fetchProfile();
          } else {
            setInitialized(true);
          }
        } catch (error) {
          console.warn('[Auth] getSession inner error:', error);
          setInitialized(true);
        }
      })
      .catch((error) => {
        console.warn('[Auth] getSession error:', error);
        setInitialized(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      try {
        if (session?.user) {
          const jwtRole = session.user.app_metadata?.role || 'student'; // SECURITY: app_metadata only

          // Reset refresh guard when a fresh session arrives so future promotions can be caught
          refreshAttemptedRef.current = false;

          setAuth(
            {
              id: session.user.id,
              email: session.user.email,
            },
            jwtRole,
          );
          setInitialized(true);

          // Fetch full profile from DB in the background
          const fetchProfile = async () => {
            try {
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
            } catch (err) {
              console.warn('[Auth] Background auth state change profile fetch failed:', err);
            }
          };
          fetchProfile();
        } else {
          useAuthStore.getState().logout();
          setInitialized(true);
          // Disconnect Stream Chat user on logout
          import('../src/lib/stream').then(({ disconnectStreamUser }) => {
            disconnectStreamUser().catch((err) => console.warn('[Stream] Disconnect failed:', err));
          });
        }
      } catch (error) {
        console.warn('[Auth] onAuthStateChange inner error:', error);
        setInitialized(true);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, []);

  // Navigation guard
  useEffect(() => {
    if (!initialized || !allStoresHydrated) return;

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
  }, [initialized, allStoresHydrated, segments, user, hasSeenOnboarding, role]);

  // Validate active trip status on server after hydration
  useEffect(() => {
    if (initialized && allStoresHydrated) {
      validateActiveTripOnBoot();
    }
  }, [initialized, allStoresHydrated]);

  // Hide splash screen once fonts are ready
  // On web: don't block on allStoresHydrated — localStorage is synchronous and hydration
  // should complete near-instantly. If it somehow doesn't, the spinner would show forever.
  const appIsReady =
    (fontsLoaded || fontError) &&
    initialized &&
    (Platform.OS === 'web' ? true : allStoresHydrated || hydrationTimedOut);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [appIsReady]);

  // Safety net: on web, force-hide splash after 3s to avoid permanent white screen
  useEffect(() => {
    if (Platform.OS === 'web') {
      const timeout = setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {});
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [appIsReady]);

  if (!appIsReady) {
    // On web, return a centered spinner instead of null to avoid blank white page
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
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
          onPress={() => Linking.openURL('market://details?id=com.wisam99sr.sair')}
        >
          <Text style={styles.updateButtonText}>{t('update_now') || 'تحديث الآن'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Skip the AnimatedSplashScreen on web — it uses native-only features
  // (StatusBar with backgroundColor, non-loaded fonts, etc.) that break in browser
  if (!animationFinished && Platform.OS !== 'web') {
    return <AnimatedSplashScreen onAnimationFinished={() => setAnimationFinished(true)} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ErrorBoundary>
            <View style={styles.root} onLayout={onLayoutRootView}>
              {!isOnline && (
                <View style={[styles.offlineBanner, { paddingTop: top }]}>
                  <Text style={styles.offlineText}>{t('no_internet')}</Text>
                </View>
              )}
              {isOnline && realtimeStatus === 'degraded' && (
                <View style={[styles.degradedBanner, { paddingTop: top }]}>
                  <Text style={styles.degradedText}>
                    {t('connection_unstable') || 'الاتصال غير مستقر...'}
                  </Text>
                </View>
              )}
              <Stack screenOptions={{ headerShown: true, headerBackTitle: t('go_back_short') }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="booking" options={{ headerShown: false }} />
                <Stack.Screen
                  name="login"
                  options={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.backgroundDark },
                  }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                  }}
                />
                <Stack.Screen name="tracking/[tripId]" options={{ headerShown: false }} />
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
      </QueryClientProvider>
    </GestureHandlerRootView>
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
    fontFamily: 'NotoSansArabic_500Medium',
  },
  degradedBanner: {
    backgroundColor: '#F59E0B',
    paddingVertical: 6,
    alignItems: 'center',
  },
  degradedText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'NotoSansArabic_500Medium',
  },
  updateContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.background,
  },
  updateTitle: {
    fontFamily: 'NotoSansArabic_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  updateSubtitle: {
    fontFamily: 'NotoSansArabic_400Regular',
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
    fontFamily: 'NotoSansArabic_700Bold',
    fontSize: 16,
    color: Colors.white,
  },
});

export default Sentry.wrap(Layout);
