import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Share,
  Alert,
  Linking,
  Animated,
  Easing,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useTripTracking } from '../../src/hooks/useTrips';
import { useConversationForTrip } from '../../src/hooks/useMessages';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { TripMap } from '../../src/components/TripMap';
import { useTranslation } from '../../src/hooks/useTranslation';
import { SOSButton } from '../../src/components/SOSButton';
import { DriverBottomSheet } from '../../src/components/DriverBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

// ─── Distance & ETA Helper Functions ─────────────────────────────────────────

function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
}

function getEstimatedTime(distanceInKm: number): number {
  // Assuming average city traffic speed of 30 km/h:
  // time (hours) = distance / speed => minutes = (distance / 30) * 60 = distance * 2
  return Math.max(1, Math.round(distanceInKm * 2));
}

// ─── ETA & Distance Indicator Card Component ────────────────────────────────

interface ETAIndicatorCardProps {
  status: string;
  driverLat: number | null;
  driverLng: number | null;
  startLat: number | null;
  startLng: number | null;
  endLat: number | null;
  endLng: number | null;
}

function ETAIndicatorCard({
  status,
  driverLat,
  driverLng,
  startLat,
  startLng,
  endLat,
  endLng,
}: ETAIndicatorCardProps) {
  const { t, isRTL } = useTranslation();

  if (status === 'completed' || status === 'cancelled' || status === 'absent') {
    return null;
  }

  if (driverLat === null || driverLng === null) {
    return (
      <View style={[styles.etaCard, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons name="location-outline" size={20} color={Colors.textMuted} />
        <Text style={[styles.etaInactiveText, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('driver_gps_inactive')}
        </Text>
      </View>
    );
  }

  const isGoingToPickup = status === 'scheduled' || status === 'driver_waiting';
  const targetLat = isGoingToPickup ? startLat : endLat;
  const targetLng = isGoingToPickup ? startLng : endLng;

  if (targetLat === null || targetLng === null) {
    return null;
  }

  const distance = getDistanceInKm(driverLat, driverLng, targetLat, targetLng);
  const etaMinutes = getEstimatedTime(distance);

  return (
    <View style={styles.etaCard}>
      <View style={[styles.etaHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.etaBadgeLive, isRTL && { flexDirection: 'row-reverse' }]}>
          <View style={styles.liveGreenDot} />
          <Text style={styles.etaLiveLabel}>{t('live')}</Text>
        </View>
        <Text style={[styles.etaTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {isGoingToPickup ? t('distance_to_pickup') : t('distance_to_destination')}
        </Text>
      </View>
      <View style={[styles.etaBodyRow, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={styles.etaCol}>
          <Text style={styles.etaLabel}>{t('estimated_arrival')}</Text>
          <Text style={styles.etaValue}>
            {etaMinutes} {t('minutes_short')}
          </Text>
        </View>
        <View style={styles.etaDivider} />
        <View style={styles.etaCol}>
          <Text style={styles.etaLabel}>{isGoingToPickup ? t('start_point') : t('end_point')}</Text>
          <Text style={styles.etaValue}>
            {distance} {t('km_short')}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Pulse Animation Dot Component ──────────────────────────────────────────

function PulseDot({ active }: { active: boolean }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.8,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
      opacityAnim.setValue(0);
    }
  }, [active, pulseAnim, opacityAnim]);

  if (!active) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Colors.primary,
        opacity: opacityAnim,
        transform: [{ scale: pulseAnim }],
      }}
    />
  );
}

// ─── Trip Timeline Component ────────────────────────────────────────────────

const TIMELINE_STEPS = ['scheduled', 'driver_waiting', 'in_transit', 'completed'] as const;

function TripTimeline({ status }: { status: string }) {
  const currentIdx = TIMELINE_STEPS.indexOf(status as any);
  const { t, isRTL } = useTranslation();
  return (
    <View style={[timelineStyles.container, isRTL && { flexDirection: 'row-reverse' }]}>
      {TIMELINE_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isLast = idx === TIMELINE_STEPS.length - 1;
        const isPulsing =
          idx === currentIdx &&
          status !== 'completed' &&
          status !== 'cancelled' &&
          status !== 'absent';
        return (
          <View key={step} style={timelineStyles.stepWrapper}>
            <View
              style={[
                timelineStyles.dot,
                done && { backgroundColor: Colors.primary, borderColor: Colors.primary },
              ]}
            >
              <PulseDot active={isPulsing} />
              {done && <Ionicons name="checkmark" size={10} color={Colors.white} />}
            </View>
            <Text style={[timelineStyles.label, done && { color: Colors.primary }]}>{t(step)}</Text>
            {!isLast && (
              <View
                style={[
                  timelineStyles.line,
                  done && { backgroundColor: Colors.primary },
                  isRTL ? { right: '50%', left: '-50%' } : { left: '50%', right: '-50%' },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const timelineStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    ...Shadow.sm,
  },
  stepWrapper: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  line: {
    position: 'absolute',
    top: 10,
    height: 2,
    backgroundColor: Colors.border,
    zIndex: 0,
  },
});

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    bg: string;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
  }
> = {
  scheduled: {
    color: Colors.warning,
    bg: Colors.warningSurface,
    label: 'مجدولة',
    icon: 'calendar-outline',
  },
  driver_waiting: {
    color: Colors.primary,
    bg: Colors.primarySurface,
    label: 'السائق بانتظارك',
    icon: 'bus-outline',
  },
  in_transit: {
    color: Colors.success,
    bg: Colors.successSurface,
    label: 'في الطريق',
    icon: 'navigate-outline',
  },
  completed: {
    color: Colors.textMuted,
    bg: Colors.surfaceMuted,
    label: 'مكتملة',
    icon: 'checkmark-circle-outline',
  },
  absent: {
    color: Colors.textMuted,
    bg: Colors.surfaceMuted,
    label: 'غائب',
    icon: 'person-remove-outline',
  },
  cancelled: { color: Colors.error, bg: Colors.errorSurface, label: 'ملغاة', icon: 'ban-outline' },
};

export default function TrackingScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { trip, isLoading } = useTripTracking(tripId);
  const { getOrCreate } = useConversationForTrip(tripId);
  const router = useRouter();
  const [driverModalVisible, setDriverModalVisible] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [mapStyle, setMapStyle] = useState<'streets' | 'dark' | 'satellite'>('streets');
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = (tooltipId: string) => {
    setActiveTooltip(tooltipId);
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
    tooltipTimerRef.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 1800);
  };

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (trip?.status === 'completed') {
      // Redirect to rating screen after a short delay
      const timer = setTimeout(() => {
        router.replace({ pathname: '/rating/[tripId]', params: { tripId: trip.id } });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trip?.status]);

  const handleShare = async () => {
    if (!trip) return;
    try {
      const message = t('share_trip_message')
        .replace('{{route}}', trip.routes?.title || t('route'))
        .replace('{{driver}}', trip.driver?.full_name || t('driver_sair'));
      await Share.share({ message });
    } catch (error: unknown) {
      Alert.alert(t('error'), t('share_failed'));
    }
  };

  const handleOpenChat = async () => {
    try {
      const conv = await getOrCreate();
      if (conv) {
        router.push({ pathname: '/chat/[id]', params: { id: conv.id } });
      }
    } catch (error) {
      Alert.alert(t('error'), t('chat_open_error'));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.border} />
        <Text style={styles.errorText}>{t('trip_not_found')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const status = STATUS_CONFIG[trip.status] || STATUS_CONFIG.scheduled;

  // Pre-calculate ETA & Distance
  const driverLat = trip.last_lat ? Number(trip.last_lat) : null;
  const driverLng = trip.last_lng ? Number(trip.last_lng) : null;
  const startLat = trip.routes?.start_lat ? Number(trip.routes.start_lat) : null;
  const startLng = trip.routes?.start_lng ? Number(trip.routes.start_lng) : null;
  const endLat = trip.routes?.end_lat ? Number(trip.routes.end_lat) : null;
  const endLng = trip.routes?.end_lng ? Number(trip.routes.end_lng) : null;

  const isGoingToPickup = trip.status === 'scheduled' || trip.status === 'driver_waiting';
  const targetLat = isGoingToPickup ? startLat : endLat;
  const targetLng = isGoingToPickup ? startLng : endLng;

  let etaText = '';
  let compactEta = '';
  let compactDistance = '';

  if (driverLat !== null && driverLng !== null && targetLat !== null && targetLng !== null) {
    const distance = getDistanceInKm(driverLat, driverLng, targetLat, targetLng);
    const etaMinutes = getEstimatedTime(distance);
    etaText = `${etaMinutes} ${t('minutes_short')} (${distance} ${t('km_short')})`;
    compactEta = `${etaMinutes} ${t('minutes_short')}`;
    compactDistance = `${distance} ${t('km_short')}`;
  } else if (
    trip.status !== 'completed' &&
    trip.status !== 'cancelled' &&
    trip.status !== 'absent'
  ) {
    etaText = t('driver_gps_inactive');
    compactEta = '--';
    compactDistance = '--';
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Static Solid Header (below StatusBar, not overlaying the map) */}
      <View
        style={[styles.header, { paddingTop: top + 12 }, isRTL && { flexDirection: 'row-reverse' }]}
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
            color={Colors.secondary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('live_tracking')}</Text>

        {/* Pulsing Live Badge */}
        {trip.status !== 'completed' && trip.status !== 'cancelled' && trip.status !== 'absent' ? (
          <View style={[styles.headerLiveBadge, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.livePulseContainer}>
              <View style={styles.livePulseDot} />
            </View>
            <Text style={styles.headerLiveText}>{t('live')}</Text>
          </View>
        ) : (
          <View style={{ width: 48 }} />
        )}
      </View>

      {/* Map & Overlays Container */}
      <View style={styles.mapContainer}>
        {/* Map Background */}
        <View style={styles.mapBackground}>
          {trip.routes &&
          trip.routes.start_lat &&
          trip.routes.start_lng &&
          trip.routes.end_lat &&
          trip.routes.end_lng ? (
            <TripMap
              startLat={Number(trip.routes.start_lat)}
              startLng={Number(trip.routes.start_lng)}
              endLat={Number(trip.routes.end_lat)}
              endLng={Number(trip.routes.end_lng)}
              driverLat={trip.last_lat ? Number(trip.last_lat) : null}
              driverLng={trip.last_lng ? Number(trip.last_lng) : null}
              mapStyle={mapStyle}
            />
          ) : (
            <View style={styles.mapPlaceholderInner}>
              <Ionicons name="map-outline" size={48} color={Colors.primaryLight} />
              <Text style={styles.noLocation}>{t('no_coordinates')}</Text>
            </View>
          )}
        </View>

        {/* Floating Side Panels (Left & Right) */}
        {!sheetExpanded && (
          <>
            {/* Left Side Panel (Driver Avatar, status dot, compact ETA / Distance) */}
            <View
              style={[
                styles.leftSideWrapper,
                isRTL ? { left: undefined, right: 16 } : { right: undefined, left: 16 },
              ]}
            >
              <TouchableOpacity
                style={styles.leftSidePanel}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  showTooltip('details');
                  setSheetExpanded(true);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.sideAvatar}>
                  {trip.driver?.full_name ? (
                    <Text style={styles.sideAvatarText}>
                      {trip.driver.full_name.charAt(0).toUpperCase()}
                    </Text>
                  ) : (
                    <Ionicons name="person" size={16} color={Colors.white} />
                  )}
                </View>

                {/* Status pulse dot */}
                <View style={[styles.sideStatusDot, { backgroundColor: status.color }]} />

                <View style={styles.sidePillContainer}>
                  {compactEta !== '--' && compactEta !== '' && (
                    <View style={[styles.sidePill, { backgroundColor: Colors.primarySurface }]}>
                      <Ionicons name="time" size={10} color={Colors.primary} />
                      <Text style={styles.sidePillText}>{compactEta}</Text>
                    </View>
                  )}

                  {compactDistance !== '--' && compactDistance !== '' && (
                    <View style={[styles.sidePill, { backgroundColor: Colors.successSurface }]}>
                      <Ionicons name="location" size={10} color={Colors.success} />
                      <Text style={styles.sidePillText}>{compactDistance}</Text>
                    </View>
                  )}

                  {compactEta === '--' && (
                    <View style={[styles.sidePill, { backgroundColor: Colors.surfaceMuted }]}>
                      <Ionicons name="location-outline" size={10} color={Colors.textMuted} />
                      <Text style={[styles.sidePillText, { color: Colors.textMuted }]}>
                        {t('no_gps') || 'لا يوجد GPS'}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.sideTapDetailsText}>{t('details') || 'تفاصيل'}</Text>
              </TouchableOpacity>

              {/* Tooltip for the Left Details Panel */}
              {activeTooltip === 'details' && (
                <View style={[styles.tooltipContainer, isRTL ? { right: 76 } : { left: 76 }]}>
                  <Text style={styles.tooltipText}>
                    {t('details') || (isRTL ? 'التفاصيل' : 'Details')}
                  </Text>
                </View>
              )}
            </View>

            {/* Right Side Panel (Controls) */}
            <View
              style={[
                styles.rightSidePanel,
                isRTL ? { right: undefined, left: 16 } : { left: undefined, right: 16 },
              ]}
            >
              {/* Map Style Selector Button & Panel */}
              <View style={styles.sideActionWrapper}>
                {showStyleSelector && (
                  <View
                    style={[
                      styles.styleSelectorPanel,
                      isRTL
                        ? { left: 56, flexDirection: 'row' }
                        : { right: 56, flexDirection: 'row-reverse' },
                    ]}
                  >
                    {/* Street Style Option */}
                    <TouchableOpacity
                      style={[
                        styles.styleOptionButton,
                        mapStyle === 'streets' && styles.styleOptionActive,
                      ]}
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setMapStyle('streets');
                        setShowStyleSelector(false);
                      }}
                    >
                      <Ionicons
                        name="map"
                        size={18}
                        color={mapStyle === 'streets' ? Colors.white : Colors.primary}
                      />
                    </TouchableOpacity>

                    {/* Dark Style Option */}
                    <TouchableOpacity
                      style={[
                        styles.styleOptionButton,
                        mapStyle === 'dark' && styles.styleOptionActive,
                      ]}
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setMapStyle('dark');
                        setShowStyleSelector(false);
                      }}
                    >
                      <Ionicons
                        name="moon"
                        size={18}
                        color={mapStyle === 'dark' ? Colors.white : Colors.primary}
                      />
                    </TouchableOpacity>

                    {/* Satellite Style Option */}
                    <TouchableOpacity
                      style={[
                        styles.styleOptionButton,
                        mapStyle === 'satellite' && styles.styleOptionActive,
                      ]}
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setMapStyle('satellite');
                        setShowStyleSelector(false);
                      }}
                    >
                      <Ionicons
                        name="earth"
                        size={18}
                        color={mapStyle === 'satellite' ? Colors.white : Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.sideActionButton,
                    showStyleSelector && styles.sideActionButtonActive,
                  ]}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setShowStyleSelector((prev) => !prev);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={mapStyle === 'streets' ? 'map' : mapStyle === 'dark' ? 'moon' : 'earth'}
                    size={22}
                    color={showStyleSelector ? Colors.white : Colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* Chat Button */}
              <View style={styles.sideActionWrapper}>
                <TouchableOpacity
                  style={styles.sideActionButton}
                  onPress={() => {
                    showTooltip('chat');
                    void handleOpenChat();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
                {activeTooltip === 'chat' && (
                  <View style={[styles.tooltipContainer, isRTL ? { left: 64 } : { right: 64 }]}>
                    <Text style={styles.tooltipText}>
                      {t('chat') || (isRTL ? 'الدردشة' : 'Chat')}
                    </Text>
                  </View>
                )}
              </View>

              {/* Call Button */}
              {trip.driver?.phone && (
                <View style={styles.sideActionWrapper}>
                  <TouchableOpacity
                    style={[styles.sideActionButton, styles.sideCallButton]}
                    onPress={() => {
                      showTooltip('call');
                      void Linking.openURL(`tel:${trip.driver!.phone}`);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="call-outline" size={22} color={Colors.success} />
                  </TouchableOpacity>
                  {activeTooltip === 'call' && (
                    <View style={[styles.tooltipContainer, isRTL ? { left: 64 } : { right: 64 }]}>
                      <Text style={styles.tooltipText}>
                        {t('call') || (isRTL ? 'اتصال' : 'Call')}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Share Button */}
              <View style={styles.sideActionWrapper}>
                <TouchableOpacity
                  style={styles.sideActionButton}
                  onPress={() => {
                    showTooltip('share');
                    void handleShare();
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="share-social-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
                {activeTooltip === 'share' && (
                  <View style={[styles.tooltipContainer, isRTL ? { left: 64 } : { right: 64 }]}>
                    <Text style={styles.tooltipText}>
                      {t('share') || (isRTL ? 'مشاركة' : 'Share')}
                    </Text>
                  </View>
                )}
              </View>

              {/* SOS Button (only when in_transit) */}
              {trip.status === 'in_transit' && (
                <View style={styles.sideActionWrapper}>
                  <TouchableOpacity
                    style={[styles.sideActionButton, styles.sideSOSButton]}
                    onPress={() => {
                      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                      showTooltip('sos');
                      setSheetExpanded(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="alert-circle" size={24} color={Colors.error} />
                  </TouchableOpacity>
                  {activeTooltip === 'sos' && (
                    <View style={[styles.tooltipContainer, isRTL ? { left: 64 } : { right: 64 }]}>
                      <Text style={styles.tooltipText}>
                        {t('sos') || (isRTL ? 'طوارئ' : 'SOS')}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </>
        )}

        {/* Floating Bottom Bar (Route & Trip Status) */}
        {!sheetExpanded && (
          <TouchableOpacity
            style={styles.floatingBottomBar}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSheetExpanded(true);
            }}
            activeOpacity={0.9}
          >
            {/* Drag Handle Indicator to indicate expandability */}
            <View style={styles.bottomBarDragHandle} />

            <View style={[styles.bottomBarContent, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.bottomBarIconBox, { backgroundColor: Colors.primarySurface }]}>
                <Ionicons name="bus-outline" size={22} color={Colors.primary} />
              </View>

              <View
                style={[
                  styles.bottomBarTextContainer,
                  { alignItems: isRTL ? 'flex-end' : 'flex-start' },
                ]}
              >
                <Text style={styles.bottomBarTitle}>{trip.routes?.title || t('route')}</Text>
                <Text style={styles.bottomBarSubtitle} numberOfLines={1}>
                  {trip.routes?.start_location} ⇄ {trip.routes?.end_location}
                </Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                <Text style={[styles.statusLabel, { color: status.color, fontSize: 10.5 }]}>
                  {t(trip.status)}
                </Text>
              </View>

              {/* Chevron Up is much more intuitive for sliding drawer expansion */}
              <Ionicons
                name="chevron-up"
                size={20}
                color={Colors.textMuted}
                style={{ marginLeft: 4 }}
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Detailed Expanded Overlay Card */}
        {sheetExpanded && (
          <View style={styles.overlayDimmer}>
            <View style={styles.expandedFloatingCard}>
              <View style={[styles.expandedCardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.expandedCardTitle}>{t('trip_details') || 'تفاصيل الرحلة'}</Text>
                <TouchableOpacity
                  style={styles.closeCardButton}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSheetExpanded(false);
                  }}
                >
                  <Ionicons name="close" size={20} color={Colors.secondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.expandedScroll} showsVerticalScrollIndicator={false}>
                {/* Route Header Info & Status Card */}
                <View style={[styles.sheetHeaderCard, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View
                    style={[
                      { flex: 1 },
                      isRTL ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
                    ]}
                  >
                    <Text style={[styles.routeTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {trip.routes?.title || t('route')}
                    </Text>
                    <Text style={[styles.routeSubtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {trip.routes?.start_location} ← {trip.routes?.end_location}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                    <Ionicons name={status.icon} size={14} color={status.color} />
                    <Text style={[styles.statusLabel, { color: status.color }]}>
                      {t(trip.status)}
                    </Text>
                  </View>
                </View>

                {/* Driver Section */}
                <View style={[styles.driverCard, isRTL && { flexDirection: 'row-reverse' }]}>
                  <TouchableOpacity
                    style={[styles.driverInfo, isRTL && { flexDirection: 'row-reverse' }]}
                    activeOpacity={0.7}
                    onPress={() => setDriverModalVisible(true)}
                  >
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={22} color={Colors.white} />
                    </View>
                    <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
                      <Text style={styles.driverName}>
                        {trip.driver?.full_name || t('driver_sair')}
                      </Text>
                      <Text style={styles.driverLabel}>{t('current_driver_hint')}</Text>
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: Spacing.sm }}>
                    {trip.driver?.phone && (
                      <TouchableOpacity
                        style={[styles.actionCircleButton, styles.callCircleButton]}
                        onPress={() => Linking.openURL(`tel:${trip.driver!.phone}`)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="call-outline" size={18} color={Colors.success} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.actionCircleButton}
                      onPress={handleOpenChat}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="chatbubble-outline" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionCircleButton}
                      onPress={handleShare}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="share-social-outline" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Detailed ETA indicator (inside the scrollview) */}
                <ETAIndicatorCard
                  status={trip.status}
                  driverLat={driverLat}
                  driverLng={driverLng}
                  startLat={startLat}
                  startLng={startLng}
                  endLat={endLat}
                  endLng={endLng}
                />

                {/* Trip Timeline */}
                <TripTimeline status={trip.status as string} />

                {/* SOS Button */}
                {trip.status === 'in_transit' && (
                  <View style={{ marginTop: Spacing.md }}>
                    <SOSButton tripId={trip.id} />
                  </View>
                )}

                {/* Expandable Details Header */}
                <TouchableOpacity
                  style={[styles.expandableHeader, isRTL && { flexDirection: 'row-reverse' }]}
                  onPress={() => {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDetailsExpanded(!detailsExpanded);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandableTitle}>{t('route_details')}</Text>
                  <Ionicons
                    name={detailsExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={Colors.secondary}
                  />
                </TouchableOpacity>

                {/* Expandable Details Content */}
                {detailsExpanded && (
                  <Animated.View style={styles.detailsList}>
                    <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <View style={styles.infoIconBox}>
                        <Ionicons name="bus-outline" size={18} color={Colors.secondary} />
                      </View>
                      <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                          {t('route')}
                        </Text>
                        <Text style={[styles.infoValue, { textAlign: isRTL ? 'right' : 'left' }]}>
                          {trip.routes?.title || t('route')}
                        </Text>
                      </View>
                    </View>

                    {trip.started_at && (
                      <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
                        <View style={styles.infoIconBox}>
                          <Ionicons name="time-outline" size={18} color={Colors.secondary} />
                        </View>
                        <View style={styles.infoTextContainer}>
                          <Text style={[styles.infoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                            {t('departure_time')}
                          </Text>
                          <Text style={[styles.infoValue, { textAlign: isRTL ? 'right' : 'left' }]}>
                            {new Date(trip.started_at).toLocaleTimeString(
                              isRTL ? 'ar-IQ' : 'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                          </Text>
                        </View>
                      </View>
                    )}

                    {trip.ended_at && (
                      <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
                        <View style={styles.infoIconBox}>
                          <Ionicons name="flag-outline" size={18} color={Colors.secondary} />
                        </View>
                        <View style={styles.infoTextContainer}>
                          <Text style={[styles.infoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                            {t('arrival_time')}
                          </Text>
                          <Text style={[styles.infoValue, { textAlign: isRTL ? 'right' : 'left' }]}>
                            {new Date(trip.ended_at).toLocaleTimeString(isRTL ? 'ar-IQ' : 'en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        </View>
                      </View>
                    )}
                  </Animated.View>
                )}
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      <DriverBottomSheet
        visible={driverModalVisible}
        onClose={() => setDriverModalVisible(false)}
        driverName={trip.driver?.full_name}
        driverRating={trip.driver?.avg_rating}
        driverTrips={trip.driver?.completed_trips}
        vehicleModel={trip.driver?.vehicle_model}
        vehiclePlate={trip.driver?.vehicle_plate}
        vehicleCapacity={trip.driver?.capacity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },

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
    ...Shadow.sm,
    zIndex: 10,
  },
  headerBackBtn: {
    padding: 6,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.secondary,
  },
  headerLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
  },
  livePulseContainer: {
    width: 8,
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  headerLiveText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.success,
  },

  // Map Container
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  mapPlaceholderInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },

  // Detailed ETA Card
  etaCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.md,
  },
  etaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  etaBadgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successSurface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  liveGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  etaLiveLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 9.5,
    color: Colors.success,
    textTransform: 'uppercase',
  },
  etaTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.text,
  },
  etaInactiveText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    marginLeft: Spacing.xs,
  },
  etaBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  etaCol: {
    flex: 1,
    alignItems: 'center',
  },
  etaLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  etaValue: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.primary,
  },
  etaDivider: {
    width: 1,
    height: '60%',
    backgroundColor: Colors.border,
  },

  // Floating Side Panels (Left & Right)
  leftSideWrapper: {
    position: 'absolute',
    top: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftSidePanel: {
    width: 68,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  sideAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  sideAvatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
  sideStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.white,
    position: 'absolute',
    top: 38,
    left: 42,
    zIndex: 11,
  },
  sidePillContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 6,
    marginVertical: 4,
  },
  sidePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    width: '85%',
  },
  sidePillText: {
    fontFamily: FontFamily.bold,
    fontSize: 8.5,
    color: Colors.text,
  },
  sideTapDetailsText: {
    fontFamily: FontFamily.medium,
    fontSize: 9,
    color: Colors.primary,
    marginTop: 4,
  },
  rightSidePanel: {
    position: 'absolute',
    top: 16,
    width: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
    gap: 12,
  },
  sideActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(194, 112, 62, 0.15)',
  },
  sideCallButton: {
    backgroundColor: Colors.successSurface,
    borderColor: 'rgba(76, 175, 80, 0.15)',
  },
  sideSOSButton: {
    backgroundColor: Colors.errorSurface,
    borderColor: 'rgba(229, 57, 53, 0.15)',
  },

  // Detailed Modal/Card
  overlayDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  expandedFloatingCard: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  expandedCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  expandedCardTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.secondary,
  },
  closeCardButton: {
    padding: 4,
  },
  expandedScroll: {
    flexGrow: 0,
  },

  // Compact sheet headers
  sheetHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceMuted,
  },
  routeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.secondary,
    marginBottom: 4,
  },
  routeSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
  },
  statusLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
  },

  // Driver Card
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
  },
  driverLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textSecondary,
  },

  // Action Buttons
  actionCircleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(194, 112, 62, 0.15)',
  },
  callCircleButton: {
    backgroundColor: Colors.successSurface,
    borderColor: 'rgba(76, 175, 80, 0.15)',
  },

  // Expandable Details
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceMuted,
  },
  expandableTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.secondary,
  },
  detailsList: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },

  // Details items
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  infoIconBox: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
  },

  // Miscellanous
  noLocation: {
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: Spacing.sm,
  },
  errorText: {
    fontFamily: FontFamily.bold,
    color: Colors.textSecondary,
    fontSize: 16,
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

  // Floating Bottom Bar
  floatingBottomBar: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  bottomBarDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 8,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomBarIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBarTextContainer: {
    flex: 1,
  },
  bottomBarTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14.5,
    color: Colors.text,
  },
  bottomBarSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },

  // Map Style Selector Panel
  styleSelectorPanel: {
    position: 'absolute',
    top: 0,
    width: 128,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    gap: 6,
  },
  styleOptionButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleOptionActive: {
    backgroundColor: Colors.primary,
  },
  styleOptionText: {
    fontSize: 11,
    fontFamily: FontFamily.medium,
    color: Colors.secondary,
  },
  styleOptionTextActive: {
    color: Colors.white,
  },
  sideActionButtonActive: {
    backgroundColor: Colors.primary,
  },

  // Tooltip Styles
  sideActionWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: 70,
  },
  tooltipText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
});
