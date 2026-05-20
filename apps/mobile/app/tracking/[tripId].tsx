import React, { useEffect, useState } from 'react';
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

// ─── Trip Timeline Component ────────────────────────────────────────────────

const TIMELINE_STEPS = [
  { key: 'scheduled', label: 'مجدولة' },
  { key: 'driver_waiting', label: 'السائق ينتظر' },
  { key: 'in_transit', label: 'في الطريق' },
  { key: 'completed', label: 'اكتملت' },
];
const STATUS_ORDER = ['scheduled', 'driver_waiting', 'in_transit', 'completed'];

function TripTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_ORDER.indexOf(status);
  const { t, isRTL } = useTranslation();
  return (
    <View style={[timelineStyles.container, isRTL && { flexDirection: 'row-reverse' }]}>
      {TIMELINE_STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isLast = idx === TIMELINE_STEPS.length - 1;
        return (
          <View key={step.key} style={timelineStyles.stepWrapper}>
            <View
              style={[
                timelineStyles.dot,
                done && { backgroundColor: Colors.primary, borderColor: Colors.primary },
              ]}
            >
              {done && <Ionicons name="checkmark" size={10} color={Colors.white} />}
            </View>
            <Text style={[timelineStyles.label, done && { color: Colors.primary }]}>
              {t(step.key)}
            </Text>
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

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: string }> = {
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
  const { trip, isLoading } = useTripTracking(tripId);
  const { getOrCreate } = useConversationForTrip(tripId);
  const router = useRouter();
  const [driverModalVisible, setDriverModalVisible] = useState(false);

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
        .replace('{{driver}}', trip.driver?.full_name || t('driver_uniride'));
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.statusCard}>
        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: status.bg },
            isRTL && { flexDirection: 'row-reverse', alignSelf: 'flex-end' },
          ]}
        >
          <Ionicons name={status.icon as any} size={16} color={status.color} />
          <Text style={[styles.statusLabel, { color: status.color }]}>{t(trip.status)}</Text>
        </View>

        {/* Real Map */}
        <View style={styles.mapPlaceholder}>
          {trip.routes &&
          trip.routes.start_lat &&
          trip.routes.start_lng &&
          trip.routes.end_lat &&
          trip.routes.end_lng ? (
            <TripMap
              startLat={trip.routes.start_lat}
              startLng={trip.routes.start_lng}
              endLat={trip.routes.end_lat}
              endLng={trip.routes.end_lng}
              driverLat={trip.last_lat}
              driverLng={trip.last_lng}
            />
          ) : (
            <>
              <Ionicons name="map-outline" size={48} color={Colors.primaryLight} />
              <Text style={styles.noLocation}>{t('no_coordinates')}</Text>
            </>
          )}
        </View>

        <View style={[styles.driverCard, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity
            style={[styles.driverInfo, isRTL && { flexDirection: 'row-reverse' }]}
            activeOpacity={0.7}
            onPress={() => setDriverModalVisible(true)}
          >
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={Colors.white} />
            </View>
            <View style={{ alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={styles.driverName}>{trip.driver?.full_name || t('driver_uniride')}</Text>
              <Text style={styles.driverLabel}>{t('current_driver_hint')}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10 }}>
            {trip.driver?.phone && (
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => Linking.openURL(`tel:${trip.driver!.phone}`)}
                activeOpacity={0.7}
              >
                <Ionicons name="call-outline" size={20} color={Colors.success} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleOpenChat}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.7}>
              <Ionicons name="share-social-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Timeline */}
        <TripTimeline status={trip.status as string} />

        {/* Phase 5: SOS Button */}
        {trip.status === 'in_transit' && <SOSButton tripId={trip.id} />}

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.infoIconBox}>
              <Ionicons name="bus-outline" size={20} color={Colors.secondary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('route_details')}
              </Text>
              <Text style={[styles.infoValue, { textAlign: isRTL ? 'right' : 'left' }]}>
                {trip.routes?.title || t('route')}
              </Text>
            </View>
          </View>

          {trip.started_at && (
            <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.infoIconBox}>
                <Ionicons name="time-outline" size={20} color={Colors.secondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('departure_time')}
                </Text>
                <Text style={[styles.infoValue, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {new Date(trip.started_at).toLocaleTimeString(isRTL ? 'ar-IQ' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          )}

          {trip.ended_at && (
            <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={styles.infoIconBox}>
                <Ionicons name="flag-outline" size={20} color={Colors.secondary} />
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
        </View>
      </View>
      <DriverBottomSheet
        visible={driverModalVisible}
        onClose={() => setDriverModalVisible(false)}
        driverName={trip.driver?.full_name}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  // Card
  statusCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.lg,
  },
  statusLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xl,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
  },
  driverLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  shareText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.primary,
  },
  detailsContainer: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  // Map
  mapPlaceholder: {
    height: 220,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coordsBox: {
    marginTop: Spacing.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    ...Shadow.sm,
  },
  coordsText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.text,
    textAlign: 'center',
  },
  noLocation: {
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: Spacing.sm,
  },
  // Details (merged — was duplicated)
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceMuted,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  infoIconBox: {
    width: 40,
    height: 40,
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
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
  },
  // Error
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
});
