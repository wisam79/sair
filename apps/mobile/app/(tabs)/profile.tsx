import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  DevSettings,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/hooks/useStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, profile, setProfile, logout } = useAuthStore();
  const { t, isRTL, language, setLanguage } = useTranslation();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ tripCount: 0, avgRating: 0 });
  const [focusedField, setFocusedField] = useState<'fullName' | 'phone' | null>(null);

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

  const initials = (profile?.full_name || user?.email || 'U')[0].toUpperCase();

  const roleLabel = t(role || 'student');
  const roleIcon =
    role === 'driver' ? 'car-outline' : role === 'admin' ? 'shield-outline' : 'school-outline';

  const handleSave = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim(), phone: phone.trim() })
        .eq('id', user?.id);

      if (error) throw error;
      setProfile({ full_name: fullName.trim(), phone: phone.trim() });
      Alert.alert(t('success'), t('updated_successfully'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('error_generic');
      Alert.alert(t('error'), msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(t('logout'), t('logout_question'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          logout();
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />

      {/* Header */}
      <View style={styles.header}>
        {/* Avatar Ring */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
        </View>
        <Text style={styles.headerName}>{profile?.full_name || t('user')}</Text>
        <View style={[styles.roleBadge, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name={roleIcon as any} size={13} color={Colors.primary} />
          <Text style={styles.roleBadgeText}>{roleLabel}</Text>
        </View>
        <Text style={styles.headerEmail}>{user?.email}</Text>
      </View>

      {/* Info Form */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('personal_info')}
        </Text>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('full_name')}
          </Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === 'fullName' && styles.inputFocused,
              isRTL && { flexDirection: 'row-reverse' },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={16}
              color={focusedField === 'fullName' ? Colors.primary : Colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              value={fullName}
              onChangeText={setFullName}
              placeholder={t('enter_full_name')}
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('phone')}
          </Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === 'phone' && styles.inputFocused,
              isRTL && { flexDirection: 'row-reverse' },
            ]}
          >
            <Ionicons
              name="call-outline"
              size={16}
              color={focusedField === 'phone' ? Colors.primary : Colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, isRTL && styles.inputRTL]}
              value={phone}
              onChangeText={setPhone}
              placeholder="+964 7XX XXX XXXX"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
            />
          </View>
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
          onPress={handleSave}
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
      {role === 'student' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('trip_history')}
          </Text>
          <TouchableOpacity
            style={[styles.navLinkCard, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => router.push('/trip-history')}
            activeOpacity={0.7}
          >
            <View style={[styles.navLinkLeft, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.navIconContainer}>
                <Ionicons name="time-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.navLinkText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('trip_history')}
              </Text>
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
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('withdraw_request')}
          </Text>
          <TouchableOpacity
            style={[styles.navLinkCard, isRTL && { flexDirection: 'row-reverse' }]}
            onPress={() => router.push('/payouts')}
            activeOpacity={0.7}
          >
            <View style={[styles.navLinkLeft, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.navIconContainer}>
                <Ionicons name="cash-outline" size={20} color={Colors.primary} />
              </View>
              <Text style={[styles.navLinkText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('withdraw_request')}
              </Text>
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
        <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('support')}
        </Text>
        <TouchableOpacity
          style={[styles.navLinkCard, isRTL && { flexDirection: 'row-reverse' }]}
          onPress={() => router.push('/help')}
          activeOpacity={0.7}
        >
          <View style={[styles.navLinkLeft, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.navIconContainer}>
              <Ionicons name="help-circle-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.navLinkText, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('help_center')}
            </Text>
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
                Alert.alert(t('alert'), t('language_change_restart'), [
                  { text: t('cancel'), style: 'cancel' },
                  {
                    text: t('ok'),
                    onPress: async () => {
                      setLanguage(lang.code as 'ar' | 'en');
                      try {
                        await Updates.reloadAsync();
                      } catch (e) {
                        DevSettings.reload();
                      }
                    },
                  },
                ]);
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
        style={[styles.logoutButton, isRTL && { flexDirection: 'row-reverse' }]}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Ionicons name="log-out-outline" size={18} color={Colors.error} />
        <Text style={styles.logoutText}>{t('logout')}</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
    </ScrollView>
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
  // Header
  header: {
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 36,
    color: Colors.white,
  },
  headerName: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  roleBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.primaryLight,
  },
  headerEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  // Section
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E6E3DE',
    ...Shadow.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.lg,
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
    marginBottom: Spacing.md,
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
    marginTop: Spacing.lg,
    padding: Spacing.md,
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
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
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
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
});
