import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useTranslation } from '../src/hooks/useTranslation';
import { Colors, FontFamily, Spacing, BorderRadius } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function PaymentScreen() {
  const { top } = useSafeAreaInsets();
  const { routeId, amount } = useLocalSearchParams<{ routeId: string; amount: string }>();
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [stubMessage, setStubMessage] = useState<string | null>(null);
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    const initPayment = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        // Call the ZainCash checkout edge function
        const { data, error } = await supabase.functions.invoke('zaincash-checkout', {
          body: { routeId, amount: Number(amount) },
        });

        if (error) throw error;

        if (data.stub) {
          setStubMessage(data.message);
          setPaymentUrl(data.paymentUrl);
        } else {
          setPaymentUrl(data.paymentUrl);
        }
      } catch (err: unknown) {
        console.error('Payment Error:', err);
        Alert.alert(t('error'), err instanceof Error ? err.message : t('something_went_wrong'));
        router.back();
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [routeId, amount]);

  const handleMockSuccess = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(t('success'), t('mock_payment_success'), [
      { text: t('ok'), onPress: () => router.replace('/subscriptions') },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>{t('initializing_zaincash')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Custom Header */}
      <View
        style={[
          styles.header,
          { paddingTop: top + Spacing.lg },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('zaincash_checkout')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {stubMessage ? (
          <View style={styles.stubContainer}>
            <Text style={styles.stubText}>{stubMessage}</Text>
            <TouchableOpacity
              style={styles.mockButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleMockSuccess();
              }}
            >
              <Text style={styles.mockButtonText}>{t('simulate_success')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.text}>{t('redirecting_to_zaincash')}</Text>
          // In a real implementation, you would use react-native-webview here:
          // <WebView source={{ uri: paymentUrl }} onNavigationStateChange={...} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: {
    fontFamily: FontFamily.medium,
    marginTop: Spacing.md,
    color: Colors.textSecondary,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surfaceMuted,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 24,
    color: Colors.text,
  },
  text: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  stubContainer: {
    alignItems: 'center',
    gap: Spacing.xl,
    backgroundColor: Colors.surfaceMuted,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  stubText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.warning,
    textAlign: 'center',
    lineHeight: 22,
  },
  mockButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  mockButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
  },
});
