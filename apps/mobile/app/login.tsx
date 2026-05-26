import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useTranslation } from '../src/hooks/useTranslation';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import { LoginSchema, SignupSchema, SignupRequest } from '@sair/core';
import { Colors, Spacing, BorderRadius, Shadow, FontFamily } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomAlert from '../src/components/CustomAlert';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '../src/components/FormInput';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<'fullName' | 'email' | 'password' | null>(null);
  const { t, isRTL, language, setLanguage } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const { top, bottom } = useSafeAreaInsets();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const { control, handleSubmit, reset, getValues } = useForm<SignupRequest>({
    resolver: zodResolver(isSignup ? SignupSchema : LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      full_name: '',
    },
  });

  // Reset form errors and fields when switching forms
  useEffect(() => {
    reset({
      email: '',
      password: '',
      full_name: '',
    });
  }, [isSignup, reset]);

  useEffect(() => {
    const isExpoGo = Constants.appOwnership === 'expo' || Platform.OS === 'web';
    if (!isExpoGo) {
      GoogleSignin.configure({
        webClientId: '1018318788548-idbv8r142c656grivv7btuqc3r352kt1.apps.googleusercontent.com',
        offlineAccess: true,
      });
    }
  }, []);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'question';
  }>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = (
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info',
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
    });
  };

  const handleFocus = (field: 'fullName' | 'email' | 'password') => {
    setFocusedField(field);
    let scrollY = 60;
    if (field === 'password') {
      scrollY = isSignup ? 200 : 140;
    } else if (field === 'email') {
      scrollY = isSignup ? 130 : 60;
    }
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: scrollY, animated: true });
    }, 100);
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true, speed: 50 }),
      Animated.spring(buttonScale, { toValue: 1.0, useNativeDriver: true, speed: 30 }),
    ]).start();
  };

  const onSubmit = async (data: SignupRequest) => {
    animateButton();
    if (!isOnline) {
      showAlert(t('error'), t('no_internet'), 'error');
      return;
    }
    setLoading(true);
    if (isSignup) {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name?.trim(),
            role: 'student',
          },
        },
      });

      if (error) {
        showAlert(t('error'), error.message, 'error');
      } else if (signUpData.session) {
        showAlert(t('success'), t('account_created'), 'success');
      } else {
        showAlert(t('check_inbox_title'), t('check_inbox_msg'), 'info');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        showAlert(t('error'), error.message, 'error');
      }
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!isOnline) {
      showAlert(t('error'), t('no_internet'), 'error');
      return;
    }
    const email = getValues('email');
    if (!email || !email.trim()) {
      showAlert(t('alert'), t('enter_email_first'), 'warning');
      return;
    }

    const redirectUrl = makeRedirectUri({
      scheme: 'sair',
      path: 'login',
    });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    if (error) {
      showAlert(t('error'), error.message, 'error');
    } else {
      showAlert(t('sent'), t('reset_link_sent'), 'success');
    }
  };

  // Helper: extract tokens from a redirect URL (handles both # fragment and ? query)
  const extractSessionFromUrl = useCallback(async (url: string) => {
    // Supabase puts tokens in the URL fragment (#access_token=...&refresh_token=...)
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      const fragment = url.substring(hashIndex + 1);
      const params = new URLSearchParams(fragment);
      accessToken = params.get('access_token') ?? undefined;
      refreshToken = params.get('refresh_token') ?? undefined;
    }

    // Fallback: try query params
    if (!accessToken || !refreshToken) {
      const parsed = Linking.parse(url);
      accessToken = (parsed.queryParams?.access_token as string) ?? undefined;
      refreshToken = (parsed.queryParams?.refresh_token as string) ?? undefined;
    }

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) throw error;
      return true;
    }
    return false;
  }, []);

  // Listen for deep link redirects (fallback when openAuthSessionAsync can't intercept)
  useEffect(() => {
    const subscription = Linking.addEventListener('url', (event) => {
      if (event.url && event.url.includes('access_token')) {
        void extractSessionFromUrl(event.url);
      }
    });
    return () => subscription.remove();
  }, [extractSessionFromUrl]);

  const handleGoogleSignIn = async () => {
    if (!isOnline) {
      showAlert(t('error'), t('no_internet'), 'error');
      return;
    }

    const isExpoGo = Constants.appOwnership === 'expo' || Platform.OS === 'web';

    if (isExpoGo) {
      // Fallback: Web OAuth for Expo Go environment
      try {
        setLoading(true);

        const redirectUrl = makeRedirectUri({
          scheme: 'sair',
          path: 'login',
        });

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: true,
          },
        });

        if (error) throw error;
        if (!data?.url) throw new Error('Could not generate authentication URL');

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

        if (result.type === 'success' && result.url) {
          const success = await extractSessionFromUrl(result.url);
          if (!success) {
            throw new Error('Authentication tokens not found in URL response');
          }
        }
      } catch (err: unknown) {
        showAlert(
          t('error'),
          err instanceof Error ? err.message : t('something_went_wrong'),
          'error',
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Production: Native Google Sign-In
      try {
        setLoading(true);
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        
        if (userInfo.type === 'success') {
          const idToken = userInfo.data.idToken;

          if (!idToken) {
            throw new Error('No ID token returned from Google Sign-In');
          }

          const { error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
          });

          if (error) throw error;
        } else {
          console.log('Google Sign-In response type:', userInfo.type);
        }
      } catch (err: unknown) {
        // Only alert if the user did not cancel the sign-in flow manually
        const code = (err as { code?: string | number })?.code;
        const isCancel =
          code === statusCodes.SIGN_IN_CANCELLED ||
          code === statusCodes.IN_PROGRESS ||
          code === '12501' ||
          code === 12501;

        if (!isCancel) {
          showAlert(
            t('error'),
            err instanceof Error ? err.message : t('something_went_wrong'),
            'error',
          );
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      {/* Ambient background glowing orbs */}
      <View style={styles.orb1} pointerEvents="none" />
      <View style={styles.orb2} pointerEvents="none" />

      {/* Language Switcher */}
      <View style={[styles.langContainer, { top: top + Spacing.xs }]} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.langButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          activeOpacity={0.8}
        >
          <Ionicons name="globe-outline" size={16} color={Colors.primary} />
          <Text style={styles.langText}>{language === 'ar' ? 'English' : 'العربية'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: top,
            paddingBottom: bottom + Spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: Spacing.xl }} />

        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="bus" size={52} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>Sair</Text>
          <Text style={styles.appNameAr}>{t('welcome').split(' ')[0]}</Text>
          <Text style={styles.tagline}>{t('sair_tagline')}</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isSignup ? t('signup') : t('login')}</Text>

          {isSignup && (
            <FormInput
              control={control}
              name="full_name"
              placeholder={t('full_name')}
              icon="person-outline"
              autoCapitalize="words"
              isRTL={isRTL}
              onFocus={() => handleFocus('fullName')}
            />
          )}

          <FormInput
            control={control}
            name="email"
            placeholder={t('email')}
            icon="mail-outline"
            keyboardType="email-address"
            isRTL={isRTL}
            onFocus={() => handleFocus('email')}
          />

          <FormInput
            control={control}
            name="password"
            placeholder={t('password')}
            icon="lock-closed-outline"
            secureTextEntry
            isRTL={isRTL}
            onFocus={() => handleFocus('password')}
          />

          {isSignup && (
            <View style={styles.roleSection}>
              <Text style={[styles.roleLabel, { textAlign: 'center', color: Colors.primary }]}>
                {t('role_assignment_note')}
              </Text>
            </View>
          )}

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>{isSignup ? t('signup') : t('login')}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {!isSignup && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() => {
                void handleForgotPassword();
              }}
            >
              <Text style={styles.forgotText}>{t('forgot_password')}</Text>
            </TouchableOpacity>
          )}

          {/* Separator */}
          <View
            style={[styles.separatorContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          >
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>{t('or')}</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={() => void handleGoogleSignIn()}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Ionicons name="logo-google" size={20} color="#EA4335" style={styles.googleIcon} />
            <Text style={styles.googleButtonText}>{t('sign_in_with_google')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xl }} />

        {/* Switch Mode */}
        <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isSignup ? t('already_have_account') : t('dont_have_account')}
            <Text style={styles.switchLink}> {isSignup ? t('login') : t('signup')}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
    position: 'relative',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#16A34A',
    opacity: 0.15,
  },
  orb2: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#4ADE80',
    opacity: 0.1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  // Logo
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.circle,
    backgroundColor: '#2D2D2D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(22, 163, 74, 0.18)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    color: Colors.white,
    letterSpacing: 1,
  },
  appNameAr: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.primary,
    marginTop: 2,
  },
  tagline: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  // Card
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1.5,
    borderColor: 'rgba(22, 163, 74, 0.18)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  cardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  // Input
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.text,
  },
  inputRTL: {
    textAlign: 'right',
  },
  inputPassword: {
    flex: 1,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
    marginHorizontal: Spacing.xs,
  },
  // Role
  roleSection: {
    marginBottom: Spacing.lg,
  },
  roleLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    gap: Spacing.xs,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
  },
  roleChipText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.primary,
  },
  roleChipTextActive: {
    color: Colors.white,
  },
  // Button
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  forgotText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.primary,
  },
  // Switch
  switchButton: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  switchText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  switchLink: {
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  langContainer: {
    position: 'absolute',
    end: Spacing.xl,
    zIndex: 10,
  },
  langButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.25)',
    gap: Spacing.xs,
  },
  langText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.primary,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  separatorText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textMuted,
    marginHorizontal: Spacing.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DADCE0',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIcon: {
    marginHorizontal: Spacing.xs,
  },
  googleButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: '#3C4043',
  },
});
