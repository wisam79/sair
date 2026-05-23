import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../src/lib/supabase';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../src/hooks/useTranslation';
import * as Haptics from 'expo-haptics';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '../src/components/FormInput';

const ActivationSchema = z.object({
  code: z.string().length(8, 'invalid_code_length'),
});
type ActivationRequest = z.infer<typeof ActivationSchema>;

export default function ActivateLicenseScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch } = useForm<ActivationRequest>({
    resolver: zodResolver(ActivationSchema),
    defaultValues: {
      code: '',
    },
  });

  const code = watch('code');

  const handleActivate = async (data: ActivationRequest) => {
    try {
      setIsLoading(true);
      const { data: resData, error } = await supabase.rpc('activate_license', {
        p_code: data.code.trim().toUpperCase(),
      });

      if (error) throw error;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('success'), t('activation_success'), [
        { text: t('ok'), onPress: () => router.push('/') },
      ]);
    } catch (err: unknown) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('error'), err instanceof Error ? err.message : t('activation_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: top + Spacing.md },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('activate_subscription')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="card-outline" size={80} color={Colors.primary} />
        </View>

        <Text style={styles.title}>{t('enter_license_code')}</Text>
        <Text style={styles.subtitle}>{t('license_code_subtitle')}</Text>

        <FormInput
          control={control}
          name="code"
          placeholder={t('license_placeholder')}
          maxLength={8}
          autoCapitalize="characters"
          autoCorrect={false}
          isRTL={isRTL}
          inputStyle={styles.input}
          style={{ width: '100%', marginBottom: Spacing.xxxl }}
        />

        <TouchableOpacity
          style={[styles.button, (!code || code.length < 8 || isLoading) && styles.buttonDisabled]}
          onPress={handleSubmit((data) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            void handleActivate(data);
          })}
          disabled={!code || code.length < 8 || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>{t('activate')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: '#EFECE9',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E2DE',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Shadow.sm,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surfaceMuted,
    zIndex: 11,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.xxxl,
    ...Shadow.sm,
  },
  input: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 4,
    height: 60,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  buttonDisabled: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.white,
  },
});
