import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useRouteById } from '../src/hooks/useRoutes';
import { useSubscriptions } from '../src/hooks/useTrips';
import { useBookingStore } from '../src/hooks/useStore';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../src/hooks/useTranslation';
import { useFeatureFlags } from '../src/hooks/useFeatureFlags';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DriverBottomSheet } from '../src/components/DriverBottomSheet';
import { supabase } from '../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import CustomAlert from '../src/components/CustomAlert';
import { RouteCardSkeleton } from '../src/components/LoadingSkeleton';

interface SeatProgressBarProps {
  available: number;
  capacity: number;
  isRTL: boolean;
  t: (key: string) => string;
}

function SeatProgressBar({ available, capacity, isRTL, t }: SeatProgressBarProps) {
  const filledAnim = useRef(new Animated.Value(0)).current;

  const ratio = capacity > 0 ? available / capacity : 0;
  const percentage = Math.round(ratio * 100);

  useEffect(() => {
    Animated.timing(filledAnim, {
      toValue: ratio,
      duration: 600,
      easing: Easing.bezier(0.1, 0.76, 0.55, 0.94),
      useNativeDriver: false,
    }).start();
  }, [ratio, filledAnim]);

  const barColor = available <= 3 ? Colors.warning : Colors.primary;

  const widthInterpolation = filledAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressBarSection}>
      <View style={[styles.progressBarHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <Text style={styles.progressBarLabel}>{t('seats_available')}</Text>
        <Text style={[styles.progressBarValue, available <= 3 && { color: Colors.warning }]}>
          {available} / {capacity} {t('seat')} ({percentage}%)
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: widthInterpolation,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function BookingScreen() {
  const { t, isRTL } = useTranslation();
  const { isEnabled } = useFeatureFlags();
  const { top } = useSafeAreaInsets();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const { route, isLoading: routeLoading } = useRouteById(routeId || null);
  const { subscriptions, isLoading: subsLoading } = useSubscriptions();
  const { isBooking } = useBookingStore();
  const router = useRouter();
  const lastPressRef = useRef(0);
  const [driverModalVisible, setDriverModalVisible] = useState(false);

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | 'question'>(
    'info',
  );

  // Driver details state
  interface DriverDetails {
    full_name: string;
    phone: string;
    vehicle_model?: string;
    vehicle_plate?: string;
    capacity?: number;
    avg_rating?: number;
    completed_trips?: number;
  }
  const [driverProfile, setDriverProfile] = useState<DriverDetails | null>(null);
  const [driverLoading, setDriverLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const btnScale = useRef(new Animated.Value(1)).current;
  const zainBtnScale = useRef(new Animated.Value(1)).current;

  const activeSub = subscriptions.find((s) => s.status === 'active');
  const isSubscribedToThis = activeSub?.route_id === routeId;
  const isLoading = routeLoading || subsLoading;

  useEffect(() => {
    if (!route?.driver_id) {
      setDriverProfile(null);
      return;
    }

    let isMounted = true;
    setDriverLoading(true);

    const loadDriverData = async () => {
      try {
        const { data: driverRecord, error: driverErr } = await supabase
          .from('drivers')
          .select(
            'vehicle_model, vehicle_plate, capacity, profiles!drivers_user_id_fkey(id, full_name, phone)',
          )
          .eq('id', route.driver_id)
          .single();

        if (driverErr || !driverRecord) throw driverErr || new Error('Driver not found');

        const profileRow = driverRecord.profiles
          ? Array.isArray(driverRecord.profiles)
            ? driverRecord.profiles[0]
            : driverRecord.profiles
          : null;

        if (!profileRow) throw new Error('Driver profile not found');

        // Fetch completed trips count
        const { count: tripsCount } = await supabase
          .from('trips')
          .select('id', { count: 'exact', head: true })
          .eq('driver_id', route.driver_id)
          .eq('status', 'completed');

        // Fetch average rating
        const { data: ratingsData } = await supabase
          .from('ratings')
          .select('rating')
          .eq('driver_id', profileRow.id);

        let avgRating = 0;
        if (ratingsData && ratingsData.length > 0) {
          const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
          avgRating = Math.round((sum / ratingsData.length) * 10) / 10;
        }

        if (isMounted) {
          setDriverProfile({
            full_name: profileRow.full_name ?? '',
            phone: profileRow.phone ?? '',
            vehicle_model: driverRecord.vehicle_model ?? undefined,
            vehicle_plate: driverRecord.vehicle_plate ?? undefined,
            capacity: driverRecord.capacity ?? undefined,
            avg_rating: avgRating || undefined,
            completed_trips: tripsCount ?? 0,
          });
        }
      } catch (err) {
        console.error('Failed to load driver data:', err);
      } finally {
        if (isMounted) {
          setDriverLoading(false);
        }
      }
    };

    void loadDriverData();

    return () => {
      isMounted = false;
    };
  }, [route?.driver_id]);

  useEffect(() => {
    if (!isLoading && route) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, route, fadeAnim, slideAnim, scaleAnim]);

  const handleBook = useCallback(() => {
    const now = Date.now();
    if (now - lastPressRef.current < 2000) return;
    lastPressRef.current = now;
    if (isBooking) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Book scale bounce
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 150, friction: 5, useNativeDriver: true }),
    ]).start();

    if (isSubscribedToThis) {
      router.push('/subscriptions');
      return;
    }
    router.push('/activate');
  }, [isBooking, router, isSubscribedToThis, btnScale]);

  const handlePayZainCash = useCallback(() => {
    if (!route) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.timing(zainBtnScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(zainBtnScale, {
        toValue: 1,
        tension: 150,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    if (isEnabled('zaincash_payment')) {
      router.push({ pathname: '/payment', params: { route_id: route.id } });
    } else {
      setAlertTitle(t('alert'));
      setAlertMessage(t('payments_disabled'));
      setAlertType('warning');
      setAlertVisible(true);
    }
  }, [route, t, zainBtnScale, isEnabled, router]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Loading */}
      {isLoading && (
        <View style={{ padding: Spacing.lg }}>
          <RouteCardSkeleton />
        </View>
      )}

      {/* Not Found */}
      {!isLoading && !route && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{t('route_not_found')}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          <View
            style={[
              styles.header,
              { paddingTop: top + Spacing.md },
              isRTL && { flexDirection: 'row-reverse' },
            ]}
          >
            <TouchableOpacity
              style={styles.headerBackBtn}
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.ticketContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              {/* Ticket Accent Banner */}
              <View style={styles.ticketAccent} />

              <View style={styles.ticketContent}>
                {/* Header: Title */}
                <Text style={[styles.routeTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {route.title}
                </Text>

                {/* From → To Timeline Path */}
                <View
                  style={[styles.routePathContainer, isRTL && { flexDirection: 'row-reverse' }]}
                >
                  <View style={styles.timelineTrack}>
                    <Ionicons name="radio-button-on" size={18} color={Colors.primary} />
                    <View style={styles.verticalConnector} />
                    <Ionicons name="location" size={20} color={Colors.secondary} />
                  </View>
                  <View style={[styles.routeDetails, isRTL && { alignItems: 'flex-end' }]}>
                    <View style={[styles.stopContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.stopLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                          {t('start_point')}
                        </Text>
                        <Text style={[styles.stopText, { textAlign: isRTL ? 'right' : 'left' }]}>
                          {route.start_location}
                        </Text>
                      </View>
                      {route.departure_time && (
                        <View
                          style={[styles.stopTimeBadge, isRTL && { flexDirection: 'row-reverse' }]}
                        >
                          <Ionicons name="sunny-outline" size={14} color={Colors.warning} />
                          <Text style={styles.stopTimeText}>
                            {route.departure_time.substring(0, 5)}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={{ height: Spacing.lg }} />

                    <View style={[styles.stopContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.stopLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                          {t('end_point')}
                        </Text>
                        <Text style={[styles.stopText, { textAlign: isRTL ? 'right' : 'left' }]}>
                          {route.end_location}
                        </Text>
                      </View>
                      {route.return_time && (
                        <View
                          style={[styles.stopTimeBadge, isRTL && { flexDirection: 'row-reverse' }]}
                        >
                          <Ionicons name="moon-outline" size={14} color={Colors.secondary} />
                          <Text style={styles.stopTimeText}>
                            {route.return_time.substring(0, 5)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              {/* Dashed Separator with Ticket Cutouts */}
              <View style={styles.ticketDividerContainer}>
                <View style={styles.leftCutout} />
                <View style={styles.dashedLine} />
                <View style={styles.rightCutout} />
              </View>

              <View style={styles.ticketContent}>
                {/* Stats Strip */}
                <View style={[styles.statsStrip, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.statCol}>
                    <Ionicons name="cash-outline" size={18} color={Colors.primary} />
                    <Text style={styles.statLabel}>{t('price')}</Text>
                    <Text style={styles.statValue}>
                      {route.price.toLocaleString()} {t('currency')}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statCol}>
                    <Ionicons name="people-outline" size={18} color={Colors.primary} />
                    <Text style={styles.statLabel}>{t('seats_unit')}</Text>
                    <Text style={styles.statValue}>
                      {route.available_seats} / {route.capacity}
                    </Text>
                  </View>
                  {route.departure_time && (
                    <>
                      <View style={styles.statDivider} />
                      <View style={styles.statCol}>
                        <Ionicons name="time-outline" size={18} color={Colors.primary} />
                        <Text style={styles.statLabel}>{t('departure')}</Text>
                        <Text style={styles.statValue}>{route.departure_time.substring(0, 5)}</Text>
                      </View>
                    </>
                  )}
                </View>

                {/* Seat Progress Bar */}
                <SeatProgressBar
                  available={route.available_seats}
                  capacity={route.capacity}
                  isRTL={isRTL}
                  t={t}
                />

                {/* Mini Driver Card */}
                <View style={[styles.miniDriverSection, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.miniDriverAvatar}>
                    {driverLoading ? (
                      <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                      <Text style={styles.avatarText}>
                        {driverProfile?.full_name ? driverProfile.full_name[0].toUpperCase() : 'U'}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.miniDriverMeta,
                      { alignItems: isRTL ? 'flex-end' : 'flex-start' },
                    ]}
                  >
                    <Text style={styles.miniDriverName}>
                      {driverLoading ? t('loading') : driverProfile?.full_name || t('driver_sair')}
                    </Text>
                    <View style={[styles.ratingRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Ionicons name="star" size={14} color={Colors.warning} />
                      <Text style={styles.ratingText}>{driverProfile?.avg_rating || '4.8'}</Text>
                      <Text style={styles.tripsCountText}>
                        • {driverProfile?.completed_trips ?? 0} {t('completed_trips_count')}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.driverDetailButton, isRTL && { flexDirection: 'row-reverse' }]}
                    onPress={() => {
                      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setDriverModalVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.driverDetailText}>{t('view_details')}</Text>
                    <Ionicons
                      name={isRTL ? 'chevron-back' : 'chevron-forward'}
                      size={14}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* CTAs */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
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
                      size={22}
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
            </Animated.View>

            {!isSubscribedToThis && route.available_seats > 0 && (
              <Animated.View style={{ transform: [{ scale: zainBtnScale }] }}>
                <TouchableOpacity
                  style={[styles.bookButton, styles.zainCashBtn]}
                  onPress={handlePayZainCash}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="card-outline"
                    size={22}
                    color={Colors.white}
                    style={{ position: 'absolute', [isRTL ? 'left' : 'right']: Spacing.xl }}
                  />
                  <Text style={styles.bookButtonText}>{t('pay_with_zaincash')}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </ScrollView>
        </>
      )}

      <DriverBottomSheet
        visible={driverModalVisible}
        onClose={() => setDriverModalVisible(false)}
        driverName={driverProfile?.full_name}
        driverRating={driverProfile?.avg_rating}
        driverTrips={driverProfile?.completed_trips}
        vehicleModel={driverProfile?.vehicle_model}
        vehiclePlate={driverProfile?.vehicle_plate}
        vehicleCapacity={driverProfile?.capacity}
      />

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
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
    paddingBottom: Spacing.md,
    backgroundColor: '#EFECE9',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E2DE',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Shadow.sm,
    zIndex: 10,
  },
  headerBackBtn: {
    padding: 6,
    zIndex: 11,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
    zIndex: 1,
  },
  // Ticket Design
  ticketContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: '#E6E3DE',
    overflow: 'hidden',
    ...Shadow.lg,
    marginBottom: Spacing.md,
  },
  ticketAccent: {
    height: 6,
    backgroundColor: Colors.primary,
  },
  ticketContent: {
    padding: Spacing.xl,
  },
  routeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.secondary,
    marginBottom: Spacing.xl,
  },
  // Route Timeline
  routePathContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  timelineTrack: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    width: 24,
  },
  verticalConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: Spacing.sm,
  },
  stopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  stopText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
  },
  stopTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  stopTimeText: {
    fontFamily: FontFamily.bold,
    fontSize: 12.5,
    color: Colors.textSecondary,
  },
  // Ticket Divider
  ticketDividerContainer: {
    height: 20,
    justifyContent: 'center',
    position: 'relative',
  },
  leftCutout: {
    position: 'absolute',
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderRightWidth: 1,
    borderRightColor: '#E6E3DE',
    zIndex: 2,
  },
  rightCutout: {
    position: 'absolute',
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
    borderLeftWidth: 1,
    borderLeftColor: '#E6E3DE',
    zIndex: 2,
  },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: 1,
    marginHorizontal: 14,
  },
  // Stats Strip
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(194, 112, 62, 0.04)', // Warm tinted translucent card
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(194, 112, 62, 0.08)',
    marginBottom: Spacing.xl,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(194, 112, 62, 0.15)', // Softer divider
    height: '60%',
    alignSelf: 'center',
  },
  // Seat Progress Bar
  progressBarSection: {
    marginBottom: Spacing.xl,
  },
  progressBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressBarLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressBarValue: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: BorderRadius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.pill,
  },
  // Mini Driver Card
  miniDriverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  miniDriverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginLeft: Spacing.xs,
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.white,
  },
  miniDriverMeta: {
    flex: 1,
    gap: 2,
  },
  miniDriverName: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.text,
  },
  tripsCountText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  driverDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primarySurface,
    borderRadius: BorderRadius.pill,
  },
  driverDetailText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.primary,
  },
  // CTA buttons
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
  bookButtonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.6,
  },
  bookButtonText: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    fontSize: 17,
  },
  zainCashBtn: {
    backgroundColor: '#C2703E',
    marginTop: Spacing.md,
  },
});
