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
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/hooks/useStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useSubscriptions } from '../../src/hooks/useTrips';
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

// Helper to extract initials from full name
function getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  const first = parts[0]?.charAt(0) || '';
  const last = parts[parts.length - 1]?.charAt(0) || '';
  return `${first}${last}`.toUpperCase();
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, profile, setProfile, logout } = useAuthStore();
  const { t, isRTL, language, setLanguage } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ tripCount: 0, avgRating: 0 });
  const [institutionName, setInstitutionName] = useState<string | null>(null);

  // Fetch student subscriptions to display active summary card
  const { subscriptions, isLoading: loadingSubs } = useSubscriptions(0);
  const activeSub =
    role === 'student' ? subscriptions.find((sub: any) => sub.status === 'active') : null;

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

  // Fetch institution name if institution_id exists
  useEffect(() => {
    if (!profile?.institution_id) {
      setInstitutionName(null);
      return;
    }
    async function loadInstitution() {
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('name')
          .eq('id', profile!.institution_id!)
          .single();
        if (error) throw error;
        if (data?.name) {
          setInstitutionName(data.name);
        }
      } catch (err) {
        console.warn('[Profile] Error loading institution:', err);
      }
    }
    loadInstitution();
  }, [profile?.institution_id]);

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
      setProfile({
        ...profile,
        full_name: data.full_name.trim(),
        phone: data.phone?.trim() || null,
      });
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
          await supabase.auth.signOut();
          logout();
        },
      },
    ]);
  };

  const initials = profile?.full_name ? getInitials(profile.full_name) : '';

  return (
    <View style={styles.container}>
      {/* Background Decorative Glass Blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar style="dark" translucent />

        {/* Premium Header */}
        <View style={[styles.header, { paddingTop: top + Spacing.md }]}>
          {/* Avatar Ring */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              {initials ? (
                <Text style={styles.avatarInitialsText}>{initials}</Text>
              ) : (
                <Ionicons name="person" size={32} color={Colors.white} />
              )}
            </View>
            {profile?.is_verified && (
              <View style={styles.verifiedBadgeFloating}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.info} />
              </View>
            )}
          </View>

          <View style={[styles.nameRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.headerName}>{profile?.full_name || t('user')}</Text>
            {profile?.is_verified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={Colors.info}
                style={styles.verifiedInlineIcon}
              />
            )}
          </View>

          <View style={[styles.roleBadge, isRTL && { flexDirection: 'row-reverse' }]}>
            <Ionicons name={roleIcon} size={13} color={Colors.primary} />
            <Text style={styles.roleBadgeText}>{roleLabel}</Text>
          </View>

          {institutionName ? (
            <View style={[styles.institutionBadge, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="school-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.institutionText}>{institutionName}</Text>
            </View>
          ) : profile?.institution_id ? (
            <ActivityIndicator
              size="small"
              color={Colors.textMuted}
              style={{ marginVertical: 2 }}
            />
          ) : null}

          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>

        {/* Student Active Subscription summary card */}
        {role === 'student' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('active_subscription')}
            </Text>

            {loadingSubs ? (
              <ActivityIndicator
                color={Colors.primary}
                size="small"
                style={{ padding: Spacing.md }}
              />
            ) : activeSub ? (
              <View style={styles.subCard}>
                <View style={[styles.subCardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={[styles.subCardTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                    {activeSub.routes?.title || t('route')}
                  </Text>
                  <View style={[styles.activeBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
                    <Text style={styles.activeBadgeText}>{t('active')}</Text>
                  </View>
                </View>

                <Text style={[styles.subCardDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {activeSub.routes?.start_location} ➔ {activeSub.routes?.end_location}
                </Text>

                <View style={[styles.subCardFooter, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.subCardDate}>
                    {t('expires')}:{' '}
                    {new Date(activeSub.end_date).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US')}
                  </Text>
                  <TouchableOpacity
                    style={[styles.subTrackBtn, isRTL && { flexDirection: 'row-reverse' }]}
                    onPress={() => {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push('/subscriptions');
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="eye-outline" size={12} color={Colors.white} />
                    <Text style={styles.subTrackText}>{t('view_subscription')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.noSubCard}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="ticket-outline" size={28} color={Colors.textMuted} />
                <Text style={styles.noSubText}>{t('no_active_subscription')}</Text>
                <Text style={styles.noSubAction}>{t('book_route_prompt')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Driver Stats */}
        {role === 'driver' && stats.tripCount > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('my_stats')}
            </Text>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: Spacing.md }}>
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

        {/* Personal Info Form Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('personal_info')}
          </Text>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('full_name')}
            </Text>
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
            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('phone')}
            </Text>
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
            <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('email')}
            </Text>
            <View
              style={[
                styles.inputWrapper,
                styles.inputDisabled,
                isRTL && { flexDirection: 'row-reverse' },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={16}
                color={Colors.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, isRTL && styles.inputRTL, { color: Colors.textMuted }]}
                value={user?.email || ''}
                editable={false}
              />
              <Ionicons name="lock-closed-outline" size={14} color={Colors.textMuted} />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving && { opacity: 0.7 },
              isRTL && { flexDirection: 'row-reverse' },
            ]}
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

        {/* Account Settings List Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('account')}
          </Text>

          <View style={styles.menuContainer}>
            {/* Trip History for student */}
            {role === 'student' && (
              <>
                <TouchableOpacity
                  style={[styles.menuItem, isRTL && { flexDirection: 'row-reverse' }]}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/trip-history');
                  }}
                  activeOpacity={0.6}
                >
                  <View style={[styles.menuItemLeft, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.menuIconContainer}>
                      <Ionicons name="time-outline" size={20} color={Colors.primary} />
                    </View>
                    <Text style={styles.menuItemText}>{t('trip_history')}</Text>
                  </View>
                  <Ionicons
                    name={isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={16}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
                <View style={styles.divider} />
              </>
            )}

            {/* Withdraw Request for driver */}
            {role === 'driver' && (
              <>
                <TouchableOpacity
                  style={[styles.menuItem, isRTL && { flexDirection: 'row-reverse' }]}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/payouts');
                  }}
                  activeOpacity={0.6}
                >
                  <View style={[styles.menuItemLeft, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={styles.menuIconContainer}>
                      <Ionicons name="cash-outline" size={20} color={Colors.primary} />
                    </View>
                    <Text style={styles.menuItemText}>{t('withdraw_request')}</Text>
                  </View>
                  <Ionicons
                    name={isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={16}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
                <View style={styles.divider} />
              </>
            )}

            {/* Help Center */}
            <TouchableOpacity
              style={[styles.menuItem, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/help');
              }}
              activeOpacity={0.6}
            >
              <View style={[styles.menuItemLeft, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemText}>{t('help_center')}</Text>
              </View>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={16}
                color={Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Section Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('language')}
          </Text>
          <View style={[styles.langRow, isRTL && { flexDirection: 'row-reverse' }]}>
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
                  showAlert(t('alert'), t('language_change_restart'), 'warning', [
                    { text: t('cancel'), style: 'cancel' },
                    {
                      text: t('ok'),
                      onPress: () => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setLanguage(lang.code as 'ar' | 'en');
                        try {
                          DevSettings.reload();
                        } catch {
                          // ignore
                        }
                      },
                    },
                  ]);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="language-outline"
                  size={16}
                  color={language === lang.code ? Colors.primary : Colors.textMuted}
                />
                <Text
                  style={[styles.langChipText, language === lang.code && styles.langChipTextActive]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isRTL && { flexDirection: 'row-reverse' }]}
          onPress={handleLogout}
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
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xxxl + 60, // added extra padding for floating tabs safety
  },
  // Blobs
  blob1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(194, 112, 62, 0.16)', // warm earthy orange tint
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    top: 360,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(45, 45, 45, 0.08)', // charcoal neutral tint
    zIndex: 0,
  },
  // Header
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.45)', // Translucent glass backdrop
    alignItems: 'center',
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.6)', // Glowing edge
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarInitialsText: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.white,
  },
  verifiedBadgeFloating: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  verifiedInlineIcon: {
    marginLeft: 2,
  },
  headerName: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.text,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(253, 240, 232, 0.6)', // glassified primary surface
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  roleBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.primary,
  },
  institutionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  institutionText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  headerEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 12.5,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  // Glassmorphic Section Cards
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Translucent glass look
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Light reflection border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  // Glass Active Sub Card
  subCard: {
    backgroundColor: 'rgba(194, 112, 62, 0.08)', // Tinted translucent subcard
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  subCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  subCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  activeBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.white,
  },
  subCardDesc: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  subCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subCardDate: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  subTrackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  subTrackText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.white,
  },
  noSubCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
  },
  noSubText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  noSubAction: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  // Menu settings list
  menuContainer: {
    backgroundColor: 'transparent',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(253, 240, 232, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  menuItemText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    opacity: 0.5,
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  inputDisabled: {
    opacity: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
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
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    backgroundColor: 'rgba(255, 235, 238, 0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
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
    backgroundColor: 'rgba(253, 240, 232, 0.6)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
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
