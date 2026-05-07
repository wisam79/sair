import FeatherIcon from '@/components/FeatherIcon';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore, type UserRole } from '@/stores';
import { useColors } from '@/hooks/useColors';
import { IRAQI_UNIVERSITIES } from '@/lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Screen = 'welcome' | 'role' | 'auth';
type AuthMode = 'login' | 'register';

export default function Onboarding() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, registerProfile, user, isAuthenticated, isLoading } = useAuthStore();

  const [screen, setScreen] = useState<Screen>('welcome');
  const [role, setRole] = useState<UserRole>('student');
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleColor, setVehicleColor] = useState('أبيض');
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    name?: string;
    password?: string;
  }>({});

  const logoAnim = useRef(new Animated.Value(0)).current;
  const featuresAnims = useRef([0, 0, 0, 0].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (screen === 'welcome') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(logoAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ]),
      ).start();
      featuresAnims.forEach((anim, i) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: 400 + i * 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [screen]);

  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'unassigned') {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user]);

  const logoRotation = logoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });
  const logoScale = logoAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.1, 1] });

  function goToRole() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setScreen('role');
  }

  function selectRole(r: UserRole) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRole(r);
    setScreen('auth');
  }

  function validate(): boolean {
    const errs: { email?: string; name?: string; password?: string } = {};
    const trimEmail = email.trim();

    if (!trimEmail) {
      errs.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^\S+@\S+\.\S+$/.test(trimEmail)) {
      errs.email = 'صيغة البريد غير صحيحة';
    }

    if (authMode === 'register' && !name.trim()) {
      errs.name = 'الاسم مطلوب';
    } else if (authMode === 'register' && name.trim().length < 2) {
      errs.name = 'الاسم يجب أن يكون حرفين على الأقل';
    }

    if (!password) {
      errs.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      errs.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError('يرجى تصحيح الأخطاء');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
    setError('');
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
        await registerProfile({
          fullName: name.trim(),
          role,
          institutionId: role === 'student' ? universityId || undefined : undefined,
          vehicleInfo:
            role === 'driver'
              ? `${vehicleType.trim() || ''} ${vehicleColor} ${vehiclePlate.trim() || ''}`.trim()
              : undefined,
        });
      }
      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => router.replace('/(tabs)'), 1500);
    } catch (err: any) {
      setError(err?.message ?? 'حدث خطأ، حاول مرة أخرى');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) {
    return (
      <LinearGradient colors={['#0D2847', '#1A3C6E']} style={styles.loadingContainer}>
        <Animated.View style={{ transform: [{ rotate: logoRotation }, { scale: logoScale }] }}>
          <FeatherIcon name="navigation" size={60} color="#FF6B35" />
        </Animated.View>
        <Text style={styles.loadingText}>جاري التحميل</Text>
      </LinearGradient>
    );
  }

  if (showSuccess) {
    return (
      <View style={[styles.successContainer, { backgroundColor: colors.background }]}>
        <FeatherIcon name="check-circle" size={80} color="#22C55E" />
        <Text style={[styles.successTitle, { color: colors.foreground }]}>
          مرحباً بك في يونيرايد!
        </Text>
      </View>
    );
  }

  if (screen === 'welcome') {
    return (
      <LinearGradient
        colors={['#0D2847', '#1A3C6E', '#1A3C6E']}
        style={[styles.welcomeContainer, { paddingTop: insets.top + 40 }]}
      >
        <View style={styles.logoArea}>
          <Animated.View
            style={[
              styles.logoCircle,
              {
                backgroundColor: 'rgba(255,107,53,0.15)',
                transform: [{ rotate: logoRotation }, { scale: logoScale }],
              },
            ]}
          >
            <FeatherIcon name="navigation" size={40} color="#FF6B35" />
          </Animated.View>
          <Text style={styles.appName}>يونيرايد</Text>
          <Text style={styles.appNameEn}>UniRide Iraq</Text>
          <Text style={styles.tagline}>ربط طلاب الجامعات بالسائقين{'\n'}بشكل آمن وموثوق</Text>
        </View>

        <View style={styles.featuresGrid}>
          {[
            { icon: 'shield', text: 'رحلات آمنة' },
            { icon: 'map-pin', text: 'تتبع مباشر' },
            { icon: 'credit-card', text: 'اشتراك شهري' },
            { icon: 'star', text: 'سائقون موثوقون' },
          ].map((f, i) => (
            <Animated.View
              key={f.text}
              style={[
                styles.featureItem,
                {
                  opacity: featuresAnims[i],
                  transform: [
                    {
                      translateY: featuresAnims[i]!.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <FeatherIcon name={f.icon as any} size={20} color="#FF9E7A" />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={[styles.welcomeBottom, { paddingBottom: insets.bottom + 32 }]}>
          <TouchableOpacity
            onPress={goToRole}
            activeOpacity={0.85}
            style={styles.gradientBtnWrapper}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF8C5A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startBtn}
            >
              <Text style={styles.startBtnText}>ابدأ الآن</Text>
              <FeatherIcon name="arrow-left" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>
            بالمتابعة، أنت توافق على شروط الاستخدام وسياسة الخصوصية
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (screen === 'role') {
    return (
      <LinearGradient
        colors={['#0D2847', '#1A3C6E']}
        style={[styles.roleContainer, { paddingTop: insets.top + 20 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('welcome')}>
          <FeatherIcon name="arrow-right" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.roleTitle}>من أنت؟</Text>
        <Text style={styles.roleSubtitle}>اختر نوع حسابك للمتابعة</Text>
        <View style={[styles.roleCards, { paddingBottom: insets.bottom + 40 }]}>
          {[
            {
              r: 'student' as UserRole,
              icon: 'book-open',
              color: '#FF6B35',
              bg: 'rgba(255,107,53,0.2)',
              title: 'طالب جامعي',
              desc: 'اشترك مع سائق وتابع رحلتك اليومية إلى الجامعة بأمان',
            },
            {
              r: 'driver' as UserRole,
              icon: 'truck',
              color: '#5B8DEF',
              bg: 'rgba(91,141,239,0.2)',
              title: 'سائق',
              desc: 'قدم خدمات النقل للطلاب واكسب دخلاً ثابتاً شهرياً',
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.r}
              style={[styles.roleCard, { backgroundColor: 'rgba(255,255,255,0.1)' }]}
              onPress={() => selectRole(item.r)}
              activeOpacity={0.8}
            >
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>✓ مجاني للتسجيل</Text>
              </View>
              <View style={[styles.roleIconBig, { backgroundColor: item.bg }]}>
                <FeatherIcon name={item.icon as any} size={36} color={item.color} />
              </View>
              <Text style={styles.roleCardTitle}>{item.title}</Text>
              <Text style={styles.roleCardDesc}>{item.desc}</Text>
              <View style={[styles.roleArrow, { backgroundColor: item.color }]}>
                <FeatherIcon name="arrow-left" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.authContainer, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={['#0D2847', '#1A3C6E']}
        style={[styles.authHeader, { paddingTop: insets.top + 16 }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('role')}>
          <FeatherIcon name="arrow-right" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={styles.authHeaderContent}>
          <View
            style={[
              styles.roleTag,
              { backgroundColor: role === 'student' ? '#FF6B35' : '#5B8DEF' },
            ]}
          >
            <FeatherIcon name={role === 'student' ? 'book-open' : 'truck'} size={14} color="#fff" />
            <Text style={styles.roleTagText}>{role === 'student' ? 'طالب' : 'سائق'}</Text>
          </View>
          <Text style={styles.authTitle}>
            {authMode === 'login' ? 'مرحباً بعودتك' : 'إنشاء حساب جديد'}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.authForm}
        contentContainerStyle={[styles.authFormContent, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.authToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, authMode === 'login' && { backgroundColor: colors.primary }]}
            onPress={() => {
              setAuthMode('login');
              setError('');
              setFieldErrors({});
            }}
          >
            <Text
              style={[
                styles.toggleBtnText,
                { color: authMode === 'login' ? '#fff' : colors.mutedForeground },
              ]}
            >
              تسجيل الدخول
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              authMode === 'register' && { backgroundColor: colors.primary },
            ]}
            onPress={() => {
              setAuthMode('register');
              setError('');
              setFieldErrors({});
            }}
          >
            <Text
              style={[
                styles.toggleBtnText,
                { color: authMode === 'register' ? '#fff' : colors.mutedForeground },
              ]}
            >
              حساب جديد
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <FeatherIcon name="alert-circle" size={14} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {authMode === 'register' && (
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>الاسم الكامل</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: fieldErrors.name ? '#EF4444' : colors.border,
                  color: colors.foreground,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="أدخل اسمك الكامل"
              placeholderTextColor={colors.mutedForeground}
              textAlign="right"
            />
            {fieldErrors.name && <Text style={styles.fieldError}>{fieldErrors.name}</Text>}
          </View>
        )}

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>البريد الإلكتروني</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: fieldErrors.email ? '#EF4444' : colors.border,
                color: colors.foreground,
              },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="student@example.com"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            textAlign="right"
            autoCapitalize="none"
          />
          {fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>كلمة المرور</Text>
          <View
            style={[
              styles.passwordRow,
              {
                borderColor: fieldErrors.password ? '#EF4444' : colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <TextInput
              style={[styles.passwordInput, { color: colors.foreground }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              placeholderTextColor={colors.mutedForeground}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <FeatherIcon
                name={showPassword ? 'eye-off' : 'eye'}
                size={18}
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>
          {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}
        </View>

        {authMode === 'register' && role === 'student' && (
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>الجامعة</Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.dropdownTrigger,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setShowUniDropdown(!showUniDropdown)}
            >
              <FeatherIcon
                name={showUniDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.mutedForeground}
              />
                    <Text
                  style={[
                    styles.dropdownValue,
                    { color: universityName ? colors.foreground : colors.mutedForeground },
                  ]}
                >
                  {universityName || 'اختر الجامعة'}
              </Text>
            </TouchableOpacity>
            {showUniDropdown && (
              <View
                style={[
                  styles.dropdownList,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                  {IRAQI_UNIVERSITIES.map((uni) => (
                    <TouchableOpacity
                      key={uni.id}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setUniversityId(uni.id);
                        setUniversityName(uni.name);
                        setShowUniDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, { color: colors.foreground }]}>
                        {uni.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {authMode === 'register' && role === 'driver' && (
          <>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>لون السيارة</Text>
              <View style={styles.colorPicker}>
                {[
                  { hex: 'white', label: 'أبيض' },
                  { hex: 'black', label: 'أسود' },
                  { hex: '#C0C0C0', label: 'فضي' },
                  { hex: '#DC2626', label: 'أحمر' },
                  { hex: '#2563EB', label: 'أزرق' },
                ].map((c) => (
                  <TouchableOpacity
                    key={c.hex}
                    style={[
                      styles.colorCircle,
                      {
                        backgroundColor:
                          c.hex === 'white' ? '#F8F8F8' : c.hex === 'black' ? '#111' : c.hex,
                        borderColor: vehicleColor === c.label ? colors.primary : 'transparent',
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setVehicleColor(c.label)}
                  />
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>نوع السيارة</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                value={vehicleType}
                onChangeText={setVehicleType}
                placeholder="مثال: تويوتا كامري"
                placeholderTextColor={colors.mutedForeground}
                textAlign="right"
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>رقم اللوحة</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.foreground,
                  },
                ]}
                value={vehiclePlate}
                onChangeText={setVehiclePlate}
                placeholder="مثال: ب 1234 بغداد"
                placeholderTextColor={colors.mutedForeground}
                textAlign="right"
              />
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.authBtn, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <Text style={styles.authBtnText}>جارٍ المتابعة...</Text>
          ) : (
            <>
              <Text style={styles.authBtnText}>
                {authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
              </Text>
              <FeatherIcon name="arrow-left" size={18} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Inter_400Regular' },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 24,
  },
  successTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  welcomeContainer: { flex: 1, paddingHorizontal: 24 },
  logoArea: { alignItems: 'center', marginBottom: 30, zIndex: 1 },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appName: { fontSize: 36, fontFamily: 'Inter_700Bold', color: '#FFFFFF', marginBottom: 4 },
  appNameEn: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 26,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginVertical: 20,
  },
  featureItem: { width: '44%', alignItems: 'center', gap: 8 },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  welcomeBottom: { alignItems: 'center', gap: 14 },
  gradientBtnWrapper: { width: '100%', borderRadius: 30, overflow: 'hidden' },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    gap: 10,
  },
  startBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
  disclaimer: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  roleContainer: { flex: 1, paddingHorizontal: 24 },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'right',
  },
  roleSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 24,
    textAlign: 'right',
  },
  roleCards: { flex: 1, gap: 16 },
  roleCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    position: 'relative',
  },
  roleBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(34,197,94,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleBadgeText: { color: '#22C55E', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  roleIconBig: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  roleCardTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'right',
  },
  roleCardDesc: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 16,
  },
  roleArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  authContainer: { flex: 1 },
  authHeader: { paddingHorizontal: 20, paddingBottom: 24 },
  authHeaderContent: { alignItems: 'flex-end' },
  authTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#fff' },
  roleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    marginBottom: 10,
  },
  roleTagText: { color: '#fff', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  authForm: { flex: 1 },
  authFormContent: { padding: 20, gap: 16 },
  authToggle: {
    flexDirection: 'row',
    backgroundColor: '#E8EDF5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 4,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBtnText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    flex: 1,
    textAlign: 'right',
  },
  field: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'right' },
  fieldError: {
    color: '#EF4444',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
    textAlign: 'right',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },
  eyeBtn: { padding: 10 },
  dropdownTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownValue: { fontSize: 15, fontFamily: 'Inter_400Regular', flex: 1, textAlign: 'right' },
  dropdownList: { borderRadius: 12, borderWidth: 1, marginTop: 4, overflow: 'hidden' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemText: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'right' },
  colorPicker: { flexDirection: 'row-reverse' as any, gap: 12, marginTop: 4 },
  colorCircle: { width: 36, height: 36, borderRadius: 18 },
  authBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  authBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_700Bold' },
});
