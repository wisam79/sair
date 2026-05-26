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
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export default function PaymentScreen() {
  const { top } = useSafeAreaInsets();
  const { routeId, route_id } = useLocalSearchParams<{
    routeId?: string;
    route_id?: string;
  }>();
  const activeRouteId = route_id || routeId;
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const router = useRouter();
  const { t, isRTL } = useTranslation();

  useEffect(() => {
    const initPayment = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        if (!activeRouteId) throw new Error('Route ID is missing');

        // Call the ZainCash checkout edge function
        const { data, error } = await supabase.functions.invoke('zaincash-checkout', {
          body: { route_id: activeRouteId },
        });

        if (error) throw error;

        setPaymentUrl(data.paymentUrl);
      } catch (err: unknown) {
        console.error('Payment Error:', err);
        Alert.alert(t('error'), err instanceof Error ? err.message : t('something_went_wrong'));
        router.back();
      } finally {
        setLoading(false);
      }
    };

    initPayment();
  }, [activeRouteId, router, t]);

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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Custom Header */}
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
        <Text style={styles.headerTitle}>{t('zaincash_checkout')}</Text>
      </View>

      <View style={styles.content}>
        {paymentUrl ? (
          <Text style={styles.text}>{t('redirecting_to_zaincash')}</Text>
        ) : (
          <Text style={styles.text}>{t('payments_disabled')}</Text>
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
});
