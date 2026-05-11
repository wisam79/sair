import React, { useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useRouteById } from '../src/hooks/useRoutes';
import { useBookingStore } from '../src/hooks/useStore';
import { useTranslation } from '../src/hooks/useTranslation';
import { BookingRequest } from '@uniride/core';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'حدث خطأ غير معروف';
}

export default function BookingScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { route, isLoading } = useRouteById(routeId || null);
  const { isBooking, setBooking, setBookingResult } = useBookingStore();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const lastPressRef = useRef(0);

  const handleBook = useCallback(async () => {
    const now = Date.now();
    if (now - lastPressRef.current < 2000) return;
    lastPressRef.current = now;

    if (isBooking) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('تنبيه', 'يجب تسجيل الدخول أولاً');
      return;
    }

    const parsed = BookingRequest.safeParse({ routeId, studentId: user.id });
    if (!parsed.success) {
      Alert.alert('فشل الحجز', parsed.error.issues.map((i) => i.message).join(', '));
      return;
    }

    setBooking(true);

    try {
      const { data, error } = await supabase.functions.invoke('atomic-booking', {
        body: { routeId, studentId: user.id },
      });

      if (error) {
        setBookingResult(null, error.message);
        Alert.alert('فشل الحجز', error.message);
      } else {
        setBookingResult(data?.subscriptionId || 'success', null);
        Alert.alert('نجاح', 'تم حجز المقعد بنجاح', [
          { text: 'حسناً', onPress: () => router.push('/subscriptions') },
        ]);
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setBookingResult(null, msg);
      Alert.alert('فشل الحجز', msg);
    }
  }, [routeId, isBooking, router]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>لم يتم العثور على الخط</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.routeCard}>
        <Text style={styles.routeTitle}>{route.title}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.label}>من</Text>
          <Text style={styles.value}>{route.start_location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>إلى</Text>
          <Text style={styles.value}>{route.end_location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>السعر</Text>
          <Text style={styles.priceValue}>{route.price.toLocaleString()} د.ع</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>المقاعد المتاحة</Text>
          <View style={styles.seatBadge}>
            <Ionicons name="people-outline" size={16} color={Colors.primary} />
            <Text
              style={[
                styles.seatsValue,
                route.available_seats <= 2 && styles.seatsWarning,
              ]}
            >
              {route.available_seats}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookButton, (isBooking || route.available_seats <= 0) && styles.bookButtonDisabled]}
        onPress={handleBook}
        disabled={isBooking || route.available_seats <= 0}
        activeOpacity={0.85}
      >
        {isBooking ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Ionicons name="ticket-outline" size={20} color={Colors.white} style={{ position: 'absolute', right: Spacing.xl }} />
            <Text style={styles.bookButtonText}>
              {route.available_seats <= 0 ? 'لا توجد مقاعد متاحة' : 'تأكيد الحجز'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  // Card
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  routeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'right',
  },
  // Details
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
  },
  value: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.text,
  },
  priceValue: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.success,
  },
  seatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  seatsValue: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.primary,
  },
  seatsWarning: { color: Colors.warning },
  // Book Button
  bookButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xl,
    ...Shadow.md,
  },
  bookButtonDisabled: { backgroundColor: Colors.textMuted, opacity: 0.6 },
  bookButtonText: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    fontSize: 17,
  },
  // Error
  errorText: {
    fontFamily: FontFamily.medium,
    color: Colors.error,
    fontSize: 15,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  backText: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    fontSize: 14,
  },
});
