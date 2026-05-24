import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useCallback, useState, useRef } from 'react';
import { supabase } from '../src/lib/supabase';
import { useAuthStore, useTripStore, useBookingStore, useI18nStore } from '../src/hooks/useStore';
import '../src/lib/i18n';
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
import { Gulzar_400Regular } from '@expo-google-fonts/gulzar';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function Layout() {
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

  const [forceUpdateRequired, setForceUpdateRequired] = useState(false);
  // Prevent infinite refresh loop: only attempt session refresh once per mount
  const refreshAttemptedRef = useRef(false);

  // Initialize push notifications globally
  useNotifications();

  const [fontsLoaded, fontError] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_700Bold,
    Gulzar_400Regular,
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
            const jwtRole = session.user.app_metadata?.role || 'student'; // SECURITY: app_metadata only

            // Fetch full profile from DB (includes institution_id for smart matching)
            // Also fetch role to detect admin-side promotions (e.g. student → driver)
            const { data: profileData } = await supabase
              .from('profiles')
              .select('full_name, phone, institution_id, role, is_verified')
              .eq('id', session.user.id)
              .single();

            const dbRole = profileData?.role as string | undefined;

            // If the DB role differs from the JWT role, the admin promoted/demoted this user.
            // Refresh the session so the new JWT reflects the updated app_metadata role.
            if (dbRole && dbRole !== jwtRole && !refreshAttemptedRef.current) {
              refreshAttemptedRef.current = true;
              console.log(
                `[Auth] Role mismatch detected: JWT=${jwtRole}, DB=${dbRole}. Refreshing session...`,
              );
              const { data: refreshed } = await supabase.auth.refreshSession();
              if (refreshed?.session?.user) {
                // onAuthStateChange will fire automatically with the new session
                return;
              }
            }

            setAuth(
              {
                id: session.user.id,
                email: session.user.email,
                user_metadata: session.user.user_metadata,
              },
              jwtRole,
            );
            if (profileData) {
              setProfile({
                full_name: profileData.full_name || '',
                phone: profileData.phone || '',
                institution_id: profileData.institution_id,
                is_verified: profileData.is_verified,
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
          const jwtRole = session.user.app_metadata?.role || 'student'; // SECURITY: app_metadata only

          // Reset refresh guard when a fresh session arrives so future promotions can be caught
          refreshAttemptedRef.current = false;

          setAuth(
            {
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata,
            },
            jwtRole,
          );
          // Fetch full profile from DB (includes institution_id for smart matching)
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, phone, institution_id, is_verified')
            .eq('id', session.user.id)
            .single();
          if (profileData) {
            setProfile({
              full_name: profileData.full_name || '',
              phone: profileData.phone || '',
              institution_id: profileData.institution_id,
              is_verified: profileData.is_verified,
            });
          }
        } else {
          useAuthStore.getState().logout();
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

  // Hide splash screen once fonts are ready
  const appIsReady = (fontsLoaded || fontError) && initialized && allStoresHydrated;

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
          onPress={() => Linking.openURL('market://details?id=com.wisam99sr.sair')}
        >
          <Text style={styles.updateButtonText}>{t('update_now') || 'تحديث الآن'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
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
