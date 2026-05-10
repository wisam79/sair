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
} from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useAuthStore } from '../src/hooks/useStore';
import { useTranslation } from '../src/hooks/useTranslation';

export default function ProfileScreen() {
  const { user, role, profile, setProfile, logout } = useAuthStore();
  const { t, isRTL, language, setLanguage } = useTranslation();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);

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
      Alert.alert(t('profile'), t('updated_successfully'));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t('error_generic');
      Alert.alert(t('error_generic'), msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.avatarContainer, isRTL && styles.avatarContainerRTL]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile?.full_name || 'U')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.roleBadge, isRTL && styles.textRTL]}>
          {role === 'driver' ? 'سائق' : role === 'admin' ? 'مدير' : 'طالب'}
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isRTL && styles.textRTL]}>{t('profile')}</Text>
        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isRTL && styles.textRTL]}>{t('phone')}</Text>
        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, isRTL && styles.textRTL]}>{t('email')}</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled, isRTL && styles.inputRTL]}
          value={user?.email || ''}
          editable={false}
        />
      </View>

      <View style={styles.langContainer}>
        <Text style={[styles.label, isRTL && styles.textRTL]}>Language / اللغة</Text>
        <View style={styles.langButtons}>
          <TouchableOpacity
            style={[styles.langButton, language === 'ar' && styles.langButtonActive]}
            onPress={() => setLanguage('ar')}
          >
            <Text style={[styles.langText, language === 'ar' && styles.langTextActive]}>
              العربية
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.langButton, language === 'en' && styles.langButtonActive]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
              English
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('logout')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatarContainerRTL: { direction: 'rtl' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  roleBadge: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#888', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputRTL: { textAlign: 'right' },
  inputDisabled: { backgroundColor: '#f9f9f9', color: '#999' },
  textRTL: { textAlign: 'right' },
  langContainer: { marginBottom: 24 },
  langButtons: { flexDirection: 'row', gap: 12 },
  langButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  langButtonActive: { backgroundColor: '#007AFF' },
  langText: { color: '#007AFF', fontWeight: '600' },
  langTextActive: { color: '#fff' },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
