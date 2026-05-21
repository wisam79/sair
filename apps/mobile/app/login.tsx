import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
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
import { LoginSchema, SignupSchema } from '@uniride/core';
import { z } from 'zod';
import { Colors, Spacing, BorderRadius, Shadow, FontFamily } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomAlert from '../src/components/CustomAlert';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<'fullName' | 'email' | 'password' | null>(null);
  const { t, isRTL, language, setLanguage } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();
  const buttonScale = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

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

  const validate = () => {
    try {
      const data = { email, password, ...(isSignup && { full_name: fullName }) };
      if (isSignup) {
        SignupSchema.parse(data);
      } else {
        LoginSchema.parse(data);
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            fieldErrors[e.path[0].toString()] = e.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showAlert(t('error'), error.message, 'error');
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          role: 'student',
        },
      },
    });

    if (error) {
      showAlert(t('error'), error.message, 'error');
    } else if (data.session) {
      showAlert(t('success'), t('account_created'), 'success');
    } else {
      showAlert(t('check_inbox_title'), t('check_inbox_msg'), 'info');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showAlert(t('alert'), t('enter_email_first'), 'warning');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
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
      // If result.type === 'dismiss', user closed the browser — do nothing
    } catch (err: unknown) {
      showAlert(
        t('error'),
        err instanceof Error ? err.message : t('something_went_wrong'),
        'error',
      );
    } finally {
      setLoading(false);
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
          <Text style={styles.tagline}>{t('uniride_tagline')}</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isSignup ? t('signup') : t('login')}</Text>

          {isSignup && (
            <View style={{ marginBottom: Spacing.md }}>
              <View
                collapsable={false}
                style={[
                  styles.inputWrapper,
                  { flexDirection: isRTL ? 'row-reverse' : 'row' },
                  errors.fullName && styles.inputError,
                  focusedField === 'fullName' && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={focusedField === 'fullName' ? Colors.primary : Colors.textMuted}
                  style={[
                    styles.inputIcon,
                    {
                      marginRight: isRTL ? 0 : Spacing.xs,
                      marginLeft: isRTL ? Spacing.xs : 0,
                    },
                  ]}
                />
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder={t('full_name')}
                  placeholderTextColor={Colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  onFocus={() => handleFocus('fullName')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>
          )}

          <View style={{ marginBottom: Spacing.md }}>
            <View
              collapsable={false}
              style={[
                styles.inputWrapper,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
                errors.email && styles.inputError,
                focusedField === 'email' && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={focusedField === 'email' ? Colors.primary : Colors.textMuted}
                style={[
                  styles.inputIcon,
                  {
                    marginRight: isRTL ? 0 : Spacing.xs,
                    marginLeft: isRTL ? Spacing.xs : 0,
                  },
                ]}
              />
              <TextInput
                style={[styles.input, { textAlign: 'left' }]}
                placeholder={t('email')}
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => handleFocus('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={{ marginBottom: Spacing.md }}>
            <View
              collapsable={false}
              style={[
                styles.inputWrapper,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
                errors.password && styles.inputError,
                focusedField === 'password' && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={focusedField === 'password' ? Colors.primary : Colors.textMuted}
                style={[
                  styles.inputIcon,
                  {
                    marginRight: isRTL ? 0 : Spacing.xs,
                    marginLeft: isRTL ? Spacing.xs : 0,
                  },
                ]}
              />
              <TextInput
                style={[styles.input, styles.inputPassword, { textAlign: 'left' }]}
                placeholder={t('password')}
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => handleFocus('password')}
                onBlur={() => setFocusedField(null)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

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
              onPress={() => {
                animateButton();
                if (isSignup) {
                  void handleSignup();
                } else {
                  void handleLogin();
                }
              }}
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
    top: -60,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.primary,
    opacity: 0.12,
  },
  orb2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.primary,
    opacity: 0.08,
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
    borderColor: 'rgba(194, 112, 62, 0.15)',
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
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E6E3DE',
    ...Shadow.lg,
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
    borderColor: 'rgba(194, 112, 62, 0.25)',
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
