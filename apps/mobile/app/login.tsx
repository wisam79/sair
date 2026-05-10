import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useTranslation } from '../src/hooks/useTranslation';
import { UserRole } from '@uniride/core';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const { t, isRTL } = useTranslation();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert(t('login'), error.message);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password || !fullName) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: selectedRole,
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert(t('signup'), error.message);
    } else if (data.session) {
      Alert.alert(t('welcome'), t('welcome'));
    } else {
      Alert.alert(t('welcome'), t('check_inbox'));
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, isRTL && styles.textRTL]}>{t('welcome')}</Text>
        <Text style={[styles.subtitle, isRTL && styles.textRTL]}>UniRide v2</Text>

        {isSignup && (
          <TextInput
            style={[styles.input, isRTL && styles.inputRTL]}
            placeholder={t('profile')}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          placeholder={t('email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          placeholder={t('password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {isSignup && (
          <View style={styles.roleContainer}>
            {(['student', 'driver'] as UserRole[]).map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.roleButton, selectedRole === role && styles.roleButtonActive]}
                onPress={() => setSelectedRole(role)}
              >
                <Text
                  style={[styles.roleText, selectedRole === role && styles.roleTextActive]}
                >
                  {role === 'student' ? 'طالب' : 'سائق'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={isSignup ? handleSignup : handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t('loading') : isSignup ? t('signup') : t('login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignup(!isSignup)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isSignup ? t('login') : t('signup')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#fff' },
  inner: { padding: 30 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#007AFF' },
  subtitle: { fontSize: 16, marginBottom: 40, textAlign: 'center', color: '#666' },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 25,
    fontSize: 16,
  },
  inputRTL: { textAlign: 'right' },
  textRTL: { textAlign: 'right' },
  roleContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 12 },
  roleButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  roleButtonActive: { backgroundColor: '#007AFF' },
  roleText: { color: '#007AFF', fontWeight: '600' },
  roleTextActive: { color: '#fff' },
  button: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switchButton: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#007AFF', fontSize: 14 },
});
