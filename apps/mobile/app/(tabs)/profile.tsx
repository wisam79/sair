import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  DevSettings,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/hooks/useStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import Constants from 'expo-constants';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import CustomAlert from '../../src/components/CustomAlert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormInput } from '../../src/components/FormInput';

const ProfileEditSchema = z.object({
  full_name: z.string().min(1, 'full_name_required'),
  phone: z.string().optional().or(z.literal('')),
});
type ProfileEditRequest = z.infer<typeof ProfileEditSchema>;

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, profile, setProfile, logout } = useAuthStore();
  const { t, isRTL, language, setLanguage } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const { top } = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ tripCount: 0, avgRating: 0 });
  const scrollViewRef = React.useRef<ScrollView>(null);

  const { control, handleSubmit, reset } = useForm<ProfileEditRequest>({
    resolver: zodResolver(ProfileEditSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile, reset]);

  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'question';
    buttons?: Array<{
      text: string;
      style?: 'cancel' | 'destructive' | 'default';
      onPress?: () => void | Promise<void>;
    }>;
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
    buttons?: Array<{
      text: string;
      style?: 'cancel' | 'destructive' | 'default';
      onPress?: () => void | Promise<void>;
    }>,
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message,
      type,
      buttons,
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('trips')
      .select('id', { count: 'exact', head: true })
      .eq('driver_id', user.id)
      .eq('status', 'completed')
      .then(({ count }) => {
        setStats((s) => ({ ...s, tripCount: count ?? 0 }));
      });
    supabase
      .from('ratings')
      .select('rating')
      .eq('driver_id', user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const avg =
            data.reduce((a: number, r: { rating: number }) => a + r.rating, 0) / data.length;
          setStats((s) => ({ ...s, avgRating: Math.round(avg * 10) / 10 }));
        }
      });
  }, [user?.id]);

  const roleLabel = t(role || 'student');
  const roleIcon: keyof typeof Ionicons.glyphMap =
    role === 'driver' ? 'car-outline' : role === 'admin' ? 'shield-outline' : 'school-outline';

  const handleSave = async (data: ProfileEditRequest) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isOnline) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showAlert(t('error'), t('no_internet'), 'error');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name.trim(),
          phone: data.phone?.trim() || null,
        })
        .eq('id', user?.id);

      if (error) throw error;
      setProfile({ full_name: data.full_name.trim(), phone: data.phone?.trim() || null });
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showAlert(t('success'), t('updated_successfully'), 'success');
    } catch (err: unknown) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const msg = err instanceof Error ? err.message : t('error_generic');
      showAlert(t('error'), msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    showAlert(t('logout'), t('logout_question'), 'question', [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          try {
            await supabase.auth.signOut();
          } catch (e) {
            // Ignore offline network errors during sign out
          }
          logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />

      {/* Branded Header Banner (Fixed at the top) */}
      <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
        {/* Glassmorphic Background Effects */}
        <View style={styles.glassOverlay} />
        <View style={styles.glassHighlight} />

        <TouchableOpacity
          style={styles.headerShortcutLeftBtn}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={22} color={Colors.primaryDeep} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('profile')}</Text>

        <TouchableOpacity
          style={styles.headerShortcutRightBtn}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/help');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={22} color={Colors.primaryDeep} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>
                  {(profile?.full_name || t('user')).charAt(0).toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          {/* Name, email, badge */}
          <Text style={styles.headerName} numberOfLines={1} adjustsFontSizeToFit>
            {profile?.full_name || t('user')}
          </Text>
          <Text style={styles.headerEmail} numberOfLines={1}>{user?.email}</Text>

          <View style={styles.roleBadge}>
            <Ionicons name={roleIcon} size={12} color={Colors.primaryDeep} />
            <Text style={styles.roleBadgeText}>{roleLabel}</Text>
          </View>
        </View>
        {/* Info Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('personal_info')}</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{t('full_name')}</Text>
            <FormInput
              control={control}
              name="full_name"
              placeholder={t('enter_full_name')}
              icon="person-outline"
              autoCapitalize="words"
              isRTL={isRTL}
              style={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{t('phone')}</Text>
            <FormInput
              control={control}
              name="phone"
              placeholder={t('phone_placeholder')}
              icon="call-outline"
              keyboardType="phone-pad"
              isRTL={isRTL}
              style={{ marginBottom: 0 }}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{t('email')}</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <Ionicons
                name="mail-outline"
                size={16}
                color={Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: Colors.textMuted }]}
                value={user?.email || ''}
                editable={false}
              />
              <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && { opacity: 0.7 }]}
            onPress={handleSubmit(handleSave)}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Ionicons name="checkmark-outline" size={18} color={Colors.white} />
                <Text style={styles.saveButtonText}>{t('save_changes')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Navigation Links */}
        {role === 'driver' && stats.tripCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('my_stats')}</Text>
            <View style={{ flexDirection: 'row', gap: Spacing.md }}>
              <View style={styles.statBox}>
                <Ionicons name="car-outline" size={22} color={Colors.primary} />
                <Text style={styles.statNumber}>{stats.tripCount}</Text>
                <Text style={styles.statLabel}>{t('completed_trips')}</Text>
              </View>
              {stats.avgRating > 0 && (
                <View style={styles.statBox}>
                  <Ionicons name="star" size={22} color={Colors.warning} />
                  <Text style={styles.statNumber}>{stats.avgRating}</Text>
                  <Text style={styles.statLabel}>{t('avg_rating')}</Text>
                </View>
              )}
            </View>
          </View>
        )}
        {role === 'student' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('trip_history')}</Text>
            <TouchableOpacity
              style={styles.navLinkCard}
              onPress={() => router.push('/trip-history')}
              activeOpacity={0.7}
            >
              <View style={styles.navLinkLeft}>
                <View style={styles.navIconContainer}>
                  <Ionicons name="time-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.navLinkText}>{t('trip_history')}</Text>
              </View>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        )}

        {role === 'driver' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('withdraw_request')}</Text>
            <TouchableOpacity
              style={styles.navLinkCard}
              onPress={() => router.push('/payouts')}
              activeOpacity={0.7}
            >
              <View style={styles.navLinkLeft}>
                <View style={styles.navIconContainer}>
                  <Ionicons name="cash-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.navLinkText}>{t('withdraw_request')}</Text>
              </View>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={18}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Help Center */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support')}</Text>
          <TouchableOpacity
            style={styles.navLinkCard}
            onPress={() => router.push('/help')}
            activeOpacity={0.7}
          >
            <View style={styles.navLinkLeft}>
              <View style={styles.navIconContainer}>
                <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.navLinkText}>{t('help_center')}</Text>
            </View>
            <Ionicons
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={18}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('language')}</Text>
          <View style={styles.langRow}>
            {[
              { code: 'ar', label: t('arabic') },
              { code: 'en', label: t('english') },
            ].map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langChip, language === lang.code && styles.langChipActive]}
                onPress={() => {
                  if (language === lang.code) return;
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setLanguage(lang.code as 'ar' | 'en');
                }}
              >
                <Text
                  style={[styles.langChipText, language === lang.code && styles.langChipTextActive]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            handleLogout();
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>v{Constants.expoConfig?.version ?? '1.0.0'}</Text>

        <CustomAlert
          visible={alertConfig.visible}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          buttons={alertConfig.buttons}
          onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxxl + 60, // added extra padding for floating tabs safety
  },
  // ── Glassmorphic Header ──────────────────────────────────
  headerBanner: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
    ...Shadow.sm,
    zIndex: 10,
    position: 'relative',
  },
  glassOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.white,
  },
  glassHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
    zIndex: 2,
    textAlign: 'center',
    width: '100%',
  },
  headerShortcutLeftBtn: {
    position: 'absolute',
    bottom: 12,
    start: Spacing.md,
    zIndex: 3,
    padding: 6,
  },
  headerShortcutRightBtn: {
    position: 'absolute',
    bottom: 12,
    end: Spacing.md,
    zIndex: 3,
    padding: 6,
  },
  // ── Profile Card ─────────────────────────────────────────
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.md,
    zIndex: 10,
  },
  // ── Avatar ────────────────────────────────────────────────
  avatarWrapper: {
    marginTop: 0,
    marginBottom: Spacing.sm,
  },
  avatarRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    ...Shadow.md,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontFamily: FontFamily.bold,
    fontSize: 28,
    color: Colors.white,
    lineHeight: 34,
  },
  headerName: {
    fontFamily: FontFamily.bold,
    fontSize: 19,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  headerEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    alignSelf: 'center',
    marginTop: Spacing.xs,
  },
  roleBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.primaryDeep,
  },
  scrollContainer: {
    flex: 1,
  },
  // Section
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  // Navigation Links
  navLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  navIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLinkText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.text,
  },
  // Field
  field: {
    marginBottom: Spacing.sm,
  },
  fieldLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputFocused: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputDisabled: {
    opacity: 0.7,
    backgroundColor: Colors.surfaceMuted,
  },
  inputIcon: {
    marginHorizontal: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
  },
  inputRTL: {
    textAlign: 'right',
  },
  // Save
  saveButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    ...Shadow.glow,
  },
  saveButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.white,
  },
  // Language
  langRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  langChip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  langChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  langChipText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textMuted,
  },
  langChipTextActive: {
    color: Colors.primary,
  },
  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.errorSurface,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  logoutText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.error,
  },
  // Stats
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.primarySurface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary + '12',
  },
  statNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.primary,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  // Version
  versionText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
});
