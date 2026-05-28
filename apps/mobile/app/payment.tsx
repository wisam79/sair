import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useTranslation } from '../src/hooks/useTranslation';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';

// Ensure the WebBrowser can handle redirects correctly
WebBrowser.maybeCompleteAuthSession();

export default function PaymentScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { routeId, route_id, status, reason } = useLocalSearchParams<{
    routeId?: string;
    route_id?: string;
    status?: string;
    reason?: string;
  }>();

  const activeRouteId = route_id || routeId;
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Trigger haptic feedback depending on status
  useEffect(() => {
    if (status === 'success') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (status === 'failed') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [status]);

  // 2. Initiates ZainCash payment checkout session
  const startCheckout = useCallback(async () => {
    if (!activeRouteId) {
      setErrorMsg(isRTL ? 'معرف الخط غير موجود' : 'Route ID is missing');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase.functions.invoke('zaincash-checkout', {
        body: { route_id: activeRouteId },
      });

      if (error || !data) {
        throw new Error(error?.message || 'Failed to initialize checkout');
      }

      if (data.paymentUrl) {
        setPaymentUrl(data.paymentUrl);
        await WebBrowser.openBrowserAsync(data.paymentUrl);
      } else {
        throw new Error('ZainCash did not return a payment URL');
      }
    } catch (err: any) {
      console.error('[PaymentScreen] Checkout failed:', err);
      setErrorMsg(err.message || t('error_generic'));
    } finally {
      setLoading(false);
    }
  }, [activeRouteId, t, isRTL]);

  // 3. Automatically trigger checkout if opened without status
  useEffect(() => {
    if (!status && !paymentUrl) {
      startCheckout();
    }
  }, [status, paymentUrl, startCheckout]);

  const handleOpenBrowser = async () => {
    if (paymentUrl) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await WebBrowser.openBrowserAsync(paymentUrl);
    }
  };

  const handleGoHome = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/');
  };

  // --- RENDERS ---

  // Loading State
  if (loading && !paymentUrl) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          {t('initializing_zaincash') || (isRTL ? 'جاري تهيئة الدفع عبر زين كاش...' : 'Initializing ZainCash checkout...')}
        </Text>
      </View>
    );
  }

  // Payment Success Screen
  if (status === 'success') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent />
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: top + Spacing.xxl }]}>
          <View style={styles.successIconWrapper}>
            <Ionicons name="checkmark-circle" size={100} color={Colors.success} />
          </View>
          <Text style={styles.title}>{isRTL ? 'تم الاشتراك بنجاح!' : 'Subscription Successful!'}</Text>
          <Text style={styles.subtitle}>
            {isRTL
              ? 'تهانينا! تم تفعيل اشتراكك وحجز مقعدك بنجاح في الحافلة لمدة 30 يوماً.'
              : 'Congratulations! Your subscription is active and your seat is reserved for 30 days.'}
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={handleGoHome}>
            <Text style={styles.primaryButtonText}>{isRTL ? 'الذهاب للرئيسية' : 'Go to Home'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Payment Failed Screen
  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent />
        <ScrollView contentContainerStyle={[styles.content, { paddingTop: top + Spacing.xxl }]}>
          <View style={styles.errorIconWrapper}>
            <Ionicons name="close-circle" size={100} color={Colors.error} />
          </View>
          <Text style={styles.title}>{isRTL ? 'فشلت عملية الدفع' : 'Payment Failed'}</Text>
          <Text style={styles.subtitle}>
            {reason === 'signature_invalid'
              ? isRTL
                ? 'فشل التحقق من صحة توقيع المعاملة المالية.'
                : 'Transaction signature verification failed.'
              : isRTL
              ? 'عذراً، لم تكتمل المعاملة المالية. يرجى التحقق من رصيد محفظتك والمحاولة مرة أخرى.'
              : 'Sorry, we could not complete the transaction. Please check your wallet balance and try again.'}
          </Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.primaryButton} onPress={startCheckout}>
              <Text style={styles.primaryButtonText}>{isRTL ? 'إعادة المحاولة' : 'Try Again'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
              <Text style={styles.secondaryButtonText}>{isRTL ? 'إلغاء والعودة' : 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Checkout Session Active (Browser closed or pending callback)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent />

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
        <Text style={styles.headerTitle}>{isRTL ? 'بوابة زين كاش' : 'ZainCash Gateway'}</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottom + Spacing.md }]}>
        <View style={styles.browserIconWrapper}>
          <Ionicons name="logo-chrome" size={80} color={Colors.primary} />
        </View>

        {errorMsg ? (
          <>
            <Text style={styles.errorTitle}>{isRTL ? 'حدث خطأ ما' : 'An error occurred'}</Text>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={startCheckout}>
              <Text style={styles.primaryButtonText}>{isRTL ? 'إعادة المحاولة' : 'Retry'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>{isRTL ? 'صفحة الدفع نشطة' : 'Payment Page Active'}</Text>
            <Text style={styles.subtitle}>
              {isRTL
                ? 'تم فتح بوابة الدفع الآمنة لزين كاش في متصفحك. يرجى إتمام عملية الدفع هناك.'
                : 'ZainCash secure payment gateway has been opened. Please complete the transaction there.'}
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.primaryButton} onPress={handleOpenBrowser}>
                <Text style={styles.primaryButtonText}>{isRTL ? 'فتح صفحة الدفع' : 'Open Payment Page'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
                <Text style={styles.secondaryButtonText}>{isRTL ? 'الرجوع للرئيسية' : 'Go to Home'}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    fontFamily: FontFamily.medium,
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  // Header
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
    fontSize: 16,
    color: Colors.text,
    zIndex: 1,
  },
  // Icons
  successIconWrapper: {
    marginBottom: Spacing.lg,
  },
  errorIconWrapper: {
    marginBottom: Spacing.lg,
  },
  browserIconWrapper: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.primarySurface,
    borderRadius: BorderRadius.xl,
  },
  // Typography
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  errorTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  // Buttons
  buttonGroup: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.md,
  },
  primaryButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: 16,
  },
  secondaryButton: {
    width: '100%',
    height: 52,
    backgroundColor: Colors.white,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontFamily: FontFamily.medium,
    fontSize: 15,
  },
});
