import React, { useState, useCallback, useRef } from 'react';
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

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unknown error occurred';
}

export default function BookingScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { route, isLoading } = useRouteById(routeId || null);
  const { isBooking, setBooking, setBookingResult, resetBooking } = useBookingStore();
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
      Alert.alert(t('login'), t('error_generic'));
      return;
    }

    const parsed = BookingRequest.safeParse({ routeId, studentId: user.id });
    if (!parsed.success) {
      Alert.alert(t('booking_failed'), parsed.error.issues.map((i) => i.message).join(', '));
      return;
    }

    setBooking(true);

    try {
      const { data, error } = await supabase.functions.invoke('atomic-booking', {
        body: { routeId, studentId: user.id },
      });

      if (error) {
        setBookingResult(null, error.message);
        Alert.alert(t('booking_failed'), error.message);
      } else {
        setBookingResult(data?.subscriptionId || 'success', null);
        Alert.alert(t('book_now'), t('seat_reserved'), [
          { text: 'OK', onPress: () => router.push('/subscriptions') },
        ]);
      }
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setBookingResult(null, msg || t('booking_failed'));
      Alert.alert(t('booking_failed'), msg || t('error_generic'));
    }
  }, [routeId, isBooking]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!route) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('error_generic')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.routeCard, isRTL && styles.cardRTL]}>
        <Text style={[styles.routeTitle, isRTL && styles.textRTL]}>{route.title}</Text>

        <View style={styles.detailRow}>
          <Text style={[styles.label, isRTL && styles.textRTL]}>{t('from')}</Text>
          <Text style={[styles.value, isRTL && styles.textRTL]}>{route.start_location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.label, isRTL && styles.textRTL]}>{t('to')}</Text>
          <Text style={[styles.value, isRTL && styles.textRTL]}>{route.end_location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.label, isRTL && styles.textRTL]}>{t('price')}</Text>
          <Text style={styles.priceValue}>{route.price.toLocaleString()} IQD</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={[styles.label, isRTL && styles.textRTL]}>{t('seats_available')}</Text>
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

      <TouchableOpacity
        style={[styles.bookButton, (isBooking || route.available_seats <= 0) && styles.bookButtonDisabled]}
        onPress={handleBook}
        disabled={isBooking || route.available_seats <= 0}
      >
        {isBooking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.bookButtonText}>
            {route.available_seats <= 0 ? t('no_seats') : t('confirm_booking')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardRTL: { direction: 'rtl' },
  routeTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  textRTL: { textAlign: 'right' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: { fontSize: 14, color: '#888' },
  value: { fontSize: 16, fontWeight: '500', color: '#333' },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  seatsValue: { fontSize: 18, fontWeight: 'bold', color: '#1976d2' },
  seatsWarning: { color: '#FF9500' },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  bookButtonDisabled: { backgroundColor: '#ccc' },
  bookButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  errorText: { color: '#FF3B30', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backText: { color: '#fff', fontWeight: 'bold' },
});
