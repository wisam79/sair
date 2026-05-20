import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRouteById } from '../src/hooks/useRoutes';
import { useSubscriptions } from '../src/hooks/useTrips';
import { useBookingStore } from '../src/hooks/useStore';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../src/hooks/useTranslation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverBottomSheet } from '../src/components/DriverBottomSheet';
import * as Haptics from 'expo-haptics';

export default function BookingScreen() {
  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { route, isLoading: routeLoading } = useRouteById(routeId || null);
  const { subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { isBooking } = useBookingStore();
  const router = useRouter();
  const lastPressRef = useRef(0);
  const [driverModalVisible, setDriverModalVisible] = useState(false);

  const activeSub = subscriptions.find((s) => s.status === 'active');
  const isSubscribedToThis = activeSub?.route_id === routeId;
  const isLoading = routeLoading || subsLoading;

  const handleBook = useCallback(async () => {
    const now = Date.now();
    if (now - lastPressRef.current < 2000) return;
    lastPressRef.current = now;
    if (isBooking) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isSubscribedToThis) {
      router.push('/subscriptions');
      return;
    }
    router.push('/activate');
  }, [isBooking, router, isSubscribedToThis]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Loading */}
      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}

      {/* Not Found */}
      {!isLoading && !route && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{t('route_not_found')}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Text style={styles.backText}>{t('go_back')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {!isLoading && route && (
        <>
          <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
            >
              <Ionicons
                name={isRTL ? 'arrow-forward' : 'arrow-back'}
                size={24}
                color={Colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('route_details')}</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.routeCard}>
              <Text style={[styles.routeTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {route.title}
              </Text>

              <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.label}>{t('from')}</Text>
                <Text style={styles.value}>{route.start_location}</Text>
              </View>

              <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.label}>{t('to')}</Text>
                <Text style={styles.value}>{route.end_location}</Text>
              </View>

              <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.label}>{t('price')}</Text>
                <Text style={styles.priceValue}>
                  {route.price.toLocaleString()} {t('currency')}
                </Text>
              </View>

              <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.label}>{t('seats_available')}</Text>
                <View style={[styles.seatBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="people-outline" size={16} color={Colors.primary} />
                  <Text
                    style={[styles.seatsValue, route.available_seats <= 2 && styles.seatsWarning]}
                  >
                    {route.available_seats}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDriverModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.label}>{t('driver')}</Text>
                <View style={[styles.driverBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.driverBadgeText}>{t('view_details')}</Text>
                  <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.bookButton,
                (isBooking || route.available_seats <= 0) && styles.bookButtonDisabled,
              ]}
              onPress={handleBook}
              disabled={isBooking || route.available_seats <= 0}
              activeOpacity={0.85}
            >
              {isBooking ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons
                    name="ticket-outline"
                    size={20}
                    color={Colors.white}
                    style={{ position: 'absolute', [isRTL ? 'left' : 'right']: Spacing.xl }}
                  />
                  <Text style={styles.bookButtonText}>
                    {route.available_seats <= 0
                      ? t('no_seats')
                      : isSubscribedToThis
                        ? t('view_subscription')
                        : t('activate_license')}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {!isSubscribedToThis && route.available_seats > 0 && (
              <TouchableOpacity
                style={[styles.bookButton, { backgroundColor: '#C2703E', marginTop: Spacing.md }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push({
                    pathname: '/payment',
                    params: { routeId: route.id, amount: route.price },
                  });
                }}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={Colors.white}
                  style={{ position: 'absolute', [isRTL ? 'left' : 'right']: Spacing.xl }}
                />
                <Text style={styles.bookButtonText}>{t('pay_with_zaincash')}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </>
      )}
      <DriverBottomSheet
        visible={driverModalVisible}
        onClose={() => setDriverModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  scrollView: { flex: 1 },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  errorText: {
    fontFamily: FontFamily.medium,
    color: Colors.error,
    fontSize: 15,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  backText: {
    fontFamily: FontFamily.bold,
    color: Colors.primary,
    fontSize: 14,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl + 20,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
  },
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
  driverBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverBadgeText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.primary,
  },
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
});
