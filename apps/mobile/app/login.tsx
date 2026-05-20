import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<'fullName' | 'email' | 'password' | null>(null);

  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const buttonScale = useRef(new Animated.Value(1)).current;

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
      Alert.alert(t('error'), error.message);
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
      Alert.alert(t('error'), error.message);
    } else if (data.session) {
      Alert.alert(t('success'), t('account_created'));
    } else {
      Alert.alert(t('check_inbox_title'), t('check_inbox_msg'));
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(t('alert'), t('enter_email_first'));
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      Alert.alert(t('error'), error.message);
    } else {
      Alert.alert(t('sent'), t('reset_link_sent'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />
      {/* Ambient background glowing orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: top }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="bus" size={52} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>UniRide</Text>
          <Text style={styles.appNameAr}>{t('welcome').split(' ')[0]}</Text>
          <Text style={styles.tagline}>{t('uniride_tagline')}</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{isSignup ? t('signup') : t('login')}</Text>

          {isSignup && (
            <View style={{ marginBottom: Spacing.md }}>
              <View
                style={[
                  styles.inputWrapper,
                  errors.fullName && styles.inputError,
                  focusedField === 'fullName' && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={focusedField === 'fullName' ? Colors.primary : Colors.textMuted}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder={t('full_name')}
                  placeholderTextColor={Colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>
          )}

          <View style={{ marginBottom: Spacing.md }}>
            <View
              style={[
                styles.inputWrapper,
                errors.email && styles.inputError,
                focusedField === 'email' && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={focusedField === 'email' ? Colors.primary : Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL]}
                placeholder={t('email')}
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={{ marginBottom: Spacing.md }}>
            <View
              style={[
                styles.inputWrapper,
                errors.password && styles.inputError,
                focusedField === 'password' && styles.inputFocused,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={focusedField === 'password' ? Colors.primary : Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.inputPassword, isRTL && styles.inputRTL]}
                placeholder={t('password')}
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
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
                if (isSignup) handleSignup();
                else handleLogin();
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
            <TouchableOpacity style={styles.forgotButton} onPress={handleForgotPassword}>
              <Text style={styles.forgotText}>{t('forgot_password')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Switch Mode */}
        <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isSignup ? t('already_have_account') : t('dont_have_account')}
            <Text style={styles.switchLink}> {isSignup ? t('login') : t('signup')}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxxl,
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
  },
  switchLink: {
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
});
