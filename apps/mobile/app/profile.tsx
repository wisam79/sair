import React, { useState } from 'react';
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
} from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/hooks/useStore';
import { useTranslation } from '../src/hooks/useTranslation';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, role, profile, setProfile, logout } = useAuthStore();
  const { t, isRTL, language, setLanguage } = useTranslation();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);

  const initials = (profile?.full_name || user?.email || 'U')[0].toUpperCase();

  const roleLabel = role === 'driver' ? 'سائق' : role === 'admin' ? 'مدير' : 'طالب';
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
      Alert.alert('✓', 'تم حفظ التغييرات');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ';
      Alert.alert('خطأ', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('تسجيل الخروج', 'هل تريد تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'خروج',
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
        {/* Avatar */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.headerName}>{profile?.full_name || 'المستخدم'}</Text>
        <View style={styles.roleBadge}>
          <Ionicons name={roleIcon as any} size={13} color={Colors.primary} />
          <Text style={styles.roleBadgeText}>{roleLabel}</Text>
        </View>
        <Text style={styles.headerEmail}>{user?.email}</Text>
      </View>

      {/* Info Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>الاسم الكامل</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={16}
              color={Colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="أدخل اسمك الكامل"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>رقم الهاتف</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="call-outline"
              size={16}
              color={Colors.textMuted}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+964 7XX XXX XXXX"
              placeholderTextColor={Colors.textMuted}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>البريد الإلكتروني</Text>
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
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-outline" size={18} color={Colors.white} />
              <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>اللغة</Text>
        <View style={styles.langRow}>
          {[
            { code: 'ar', label: 'العربية' },
            { code: 'en', label: 'English' },
          ].map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[styles.langChip, language === lang.code && styles.langChipActive]}
              onPress={() => setLanguage(lang.code as 'ar' | 'en')}
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
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
        <Ionicons name="log-out-outline" size={18} color={Colors.error} />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: Spacing.xxxl,
  },
  // Header
  header: {
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.circle,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
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
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.sm,
  },
  roleBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.primary,
  },
  headerEmail: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  // Section
  section: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadow.sm,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'right',
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
    textAlign: 'right',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputDisabled: {
    opacity: 0.7,
  },
  inputIcon: {
    marginLeft: Spacing.xs,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
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
    marginTop: Spacing.xs,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  logoutText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.error,
  },
});
