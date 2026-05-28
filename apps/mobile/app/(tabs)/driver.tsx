import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore, useTripStore } from '../../src/hooks/useStore';
import { useDriverTrips, useLocationTracker, TripWithRoute } from '../../src/hooks/useTrips';
import { useTranslation } from '../../src/hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ClientRateLimiter } from '../../src/lib/rateLimiter';
import { TripStatus, canTransition, getErrorMessage } from '@sair/core';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

function getInitials(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return (first + last).toUpperCase();
}

const STATUS_DISPLAY: Record<
  string,
  { labelKey: string; color: string; bg: string; icon: string }
> = {
  scheduled: {
    labelKey: 'scheduled',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    icon: 'calendar-outline',
  },
  driver_waiting: {
    labelKey: 'driver_waiting',
    color: '#4ADE80',
    bg: 'rgba(74, 222, 128, 0.12)',
    icon: 'time-outline',
  },
  in_transit: {
    labelKey: 'in_transit',
    color: '#3B82F6',
    bg: 'rgba(59, 130, 246, 0.12)',
    icon: 'navigate-outline',
  },
  completed: {
    labelKey: 'completed',
    color: '#9CA3AF',
    bg: 'rgba(156, 163, 175, 0.12)',
    icon: 'checkmark-circle-outline',
  },
  absent: {
    labelKey: 'absent',
    color: '#E5E7EB',
    bg: 'rgba(229, 231, 235, 0.12)',
    icon: 'person-remove-outline',
  },
  cancelled: {
    labelKey: 'cancelled',
    color: '#EF4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    icon: 'ban-outline',
  },
};

async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  } catch {
    return null;
  }
}

export default function DriverDashboard() {
  const { trips, isLoading, refetch } = useDriverTrips();
  const { profile, logout } = useAuthStore();
  const { startTracking, stopTracking } = useLocationTracker();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [updatingTripId, setUpdatingTripId] = useState<string | null>(null);
  const { activeTripId, setActiveTrip, updateStatus, clearTrip } = useTripStore();

  const getNextAction = (
    status: TripStatus,
  ): { labelKey: string; newStatus: TripStatus } | null => {
    switch (status) {
      case 'scheduled':
        return { labelKey: 'start_receiving_students', newStatus: 'driver_waiting' as TripStatus };
      case 'driver_waiting':
        return { labelKey: 'start_trip_action', newStatus: 'in_transit' as TripStatus };
      case 'in_transit':
        return { labelKey: 'end_trip', newStatus: 'completed' as TripStatus };
      default:
        return null;
    }
  };

  const handleStatusUpdate = useCallback(
    async (tripId: string, currentStatus: TripStatus, newStatus: TripStatus) => {
      if (!canTransition(currentStatus, newStatus)) {
        Alert.alert(t('error'), t('invalid_transition'));
        return;
      }

      if (!ClientRateLimiter.canProceed(`trip_status_${tripId}`, 2000)) return;

      setUpdatingTripId(tripId);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      try {
        let lat: number | null = null;
        let lng: number | null = null;

        const loc = await getCurrentLocation();
        if (loc) {
          lat = loc.lat;
          lng = loc.lng;
        }

        const netState = await NetInfo.fetch();
        const isOnline = !!netState.isConnected && netState.isInternetReachable !== false;
        const isLocalTrip = tripId.startsWith('local_trip_');

        if (!isOnline || isLocalTrip) {
          // Queue the status update locally
          const statusKey = 'pending_status_updates';
          const rawStatus = await AsyncStorage.getItem(statusKey);
          const statusUpdates = rawStatus ? JSON.parse(rawStatus) : [];
          statusUpdates.push({
            tripId,
            newStatus,
            lat,
            lng,
            timestamp: Date.now(),
          });
          await AsyncStorage.setItem(statusKey, JSON.stringify(statusUpdates));

          // Apply state transitions locally
          if (newStatus === 'in_transit') {
            setActiveTrip(tripId, newStatus, '');
            startTracking(tripId);
          } else if (
            newStatus === 'completed' ||
            newStatus === 'absent' ||
            newStatus === 'cancelled'
          ) {
            stopTracking();
            if (activeTripId === tripId) {
              clearTrip();
            }
          } else {
            updateStatus(newStatus);
          }

          refetch();
          setUpdatingTripId(null);
          return;
        }

        const { error } = await supabase.functions.invoke('trip-engine', {
          body: {
            trip_id: tripId,
            new_status: newStatus,
            lat,
            lng,
          },
        });

        if (error) {
          // Fallback to local queue on network failure
          const isNetworkError = error.message?.includes('network') || !error.status;
          if (isNetworkError) {
            const statusKey = 'pending_status_updates';
            const rawStatus = await AsyncStorage.getItem(statusKey);
            const statusUpdates = rawStatus ? JSON.parse(rawStatus) : [];
            statusUpdates.push({
              tripId,
              newStatus,
              lat,
              lng,
              timestamp: Date.now(),
            });
            await AsyncStorage.setItem(statusKey, JSON.stringify(statusUpdates));

            if (newStatus === 'in_transit') {
              setActiveTrip(tripId, newStatus, '');
              startTracking(tripId);
            } else if (
              newStatus === 'completed' ||
              newStatus === 'absent' ||
              newStatus === 'cancelled'
            ) {
              stopTracking();
              if (activeTripId === tripId) {
                clearTrip();
              }
            } else {
              updateStatus(newStatus);
            }

            refetch();
            return;
          }
          throw error;
        }

        if (newStatus === 'in_transit') {
          setActiveTrip(tripId, newStatus, '');
          startTracking(tripId);
        } else if (
          newStatus === 'completed' ||
          newStatus === 'absent' ||
          newStatus === 'cancelled'
        ) {
          stopTracking();
          if (activeTripId === tripId) {
            clearTrip();
          }
        } else {
          updateStatus(newStatus);
        }

        refetch();
      } catch (err: unknown) {
        Alert.alert(t('error'), t(getErrorMessage(err)));
      } finally {
        setUpdatingTripId(null);
      }
    },
    [activeTripId, startTracking, stopTracking, setActiveTrip, clearTrip, updateStatus, refetch, t],
  );

  const handleCancelTrip = useCallback(
    async (tripId: string, currentStatus: TripStatus) => {
      Alert.alert(t('cancel_trip'), t('cancel_trip_confirm'), [
        { text: t('go_back_short'), style: 'cancel' },
        {
          text: t('yes_cancel'),
          style: 'destructive',
          onPress: () => handleStatusUpdate(tripId, currentStatus, 'cancelled' as TripStatus),
        },
      ]);
    },
    [handleStatusUpdate, t],
  );

  const handleLogout = async () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    stopTracking();
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore offline network errors during sign out
    }
    logout();
  };

  const renderItem = useCallback(
    ({ item }: { item: TripWithRoute }) => {
      const statusDisplay = STATUS_DISPLAY[item.status] || STATUS_DISPLAY.scheduled;
      const nextAction = getNextAction(item.status as TripStatus);
      const isUpdating = updatingTripId === item.id;
      const tripDate = new Date(item.scheduled_at).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US');
      const tripTime = new Date(item.scheduled_at).toLocaleTimeString(isRTL ? 'ar-IQ' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return (
        <View style={styles.tripCard}>
          {/* Header */}
          <View style={[styles.tripHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusDisplay.bg, borderColor: statusDisplay.color },
                isRTL && { flexDirection: 'row-reverse' },
              ]}
            >
              <Ionicons
                name={statusDisplay.icon as React.ComponentProps<typeof Ionicons>['name']}
                size={14}
                color={statusDisplay.color}
              />
              <Text style={[styles.statusText, { color: statusDisplay.color }]}>
                {t(statusDisplay.labelKey)}
              </Text>
            </View>
            <Text style={styles.tripTime}>
              {tripDate} {tripTime}
            </Text>
          </View>

          {/* Route Info */}
          {item.routes && (
            <View style={styles.routeDetailCard}>
              <View style={[styles.routeHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="map-outline" size={18} color={Colors.primary} />
                <Text style={[styles.routeTitleText, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {item.routes.title}
                </Text>
              </View>

              {/* Route path diagram */}
              <View style={styles.pathDiagram}>
                <View style={[styles.pathRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.bulletContainer}>
                    <View style={styles.startBullet} />
                    <View style={styles.verticalLine} />
                  </View>
                  <View
                    style={[
                      styles.pathTextContainer,
                      { alignItems: isRTL ? 'flex-end' : 'flex-start' },
                    ]}
                  >
                    <Text style={styles.pathLabel}>{t('start_point')}</Text>
                    <Text
                      style={[styles.pathValue, { textAlign: isRTL ? 'right' : 'left' }]}
                      numberOfLines={1}
                    >
                      {item.routes.start_location}
                    </Text>
                  </View>
                </View>

                <View style={[styles.pathRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.bulletContainer}>
                    <View style={styles.endBullet} />
                  </View>
                  <View
                    style={[
                      styles.pathTextContainer,
                      { alignItems: isRTL ? 'flex-end' : 'flex-start' },
                    ]}
                  >
                    <Text style={styles.pathLabel}>{t('end_point')}</Text>
                    <Text
                      style={[styles.pathValue, { textAlign: isRTL ? 'right' : 'left' }]}
                      numberOfLines={1}
                    >
                      {item.routes.end_location}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Actions */}
          {nextAction && (
            <View style={[styles.actionRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: statusDisplay.color }]}
                onPress={() => handleStatusUpdate(item.id, item.status, nextAction.newStatus)}
                disabled={isUpdating}
                activeOpacity={0.85}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.actionText}>{t(nextAction.labelKey)}</Text>
                )}
              </TouchableOpacity>

              {(item.status === 'scheduled' ||
                item.status === 'driver_waiting' ||
                item.status === 'in_transit') && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelTrip(item.id, item.status)}
                  disabled={isUpdating}
                  activeOpacity={0.85}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      );
    },
    [t, handleStatusUpdate, handleCancelTrip, updatingTripId],
  );

  const ListEmpty = useCallback(
    () => (
      <View style={styles.center}>
        <Ionicons name="car-outline" size={64} color={Colors.border} />
        <Text style={styles.emptyText}>{t('no_scheduled_trips')}</Text>
      </View>
    ),
    [t],
  );

  const keyExtractor = useCallback((item: TripWithRoute) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: top + Spacing.sm },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        {/* Glassmorphic Background Effects */}
        <View style={styles.glassOverlay} />
        <View style={styles.glassHighlight} />

        {/* Left: Profile Avatar */}
        <TouchableOpacity
          style={styles.profileAvatarContainer}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/profile');
          }}
          activeOpacity={0.85}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{getInitials(profile?.full_name || '')}</Text>
          </View>
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>

        {/* Center: Title & Subtitle */}
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {t('driver_dashboard')}
          </Text>
          {profile?.full_name && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {t('hello')}
              {isRTL ? '، ' : ', '}
              {profile.full_name}
            </Text>
          )}
        </View>

        {/* Right: Actions */}
        <View style={[styles.headerActions, isRTL && { flexDirection: 'row-reverse' }]}>
          <TouchableOpacity
            style={styles.headerShortcutBtnFlex}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/payouts');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="wallet-outline" size={22} color={Colors.white} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={trips}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={async () => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              refetch();
            }}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { [isRTL ? 'left' : 'right']: Spacing.xl } as import('react-native').ViewStyle,
        ]}
        activeOpacity={0.9}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/create-trip');
        }}
      >
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Spread left, center, and right blocks
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#054024',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
    zIndex: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#0A5C36',
  },
  glassHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.22)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
    zIndex: 1,
    minWidth: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    zIndex: 2,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    width: '100%',
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    textAlign: 'center',
    width: '100%',
  },
  profileAvatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    position: 'relative',
    zIndex: 2,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  profileAvatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: 'rgba(10, 92, 54, 0.95)',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerShortcutBtnFlex: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  // List
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.textMuted,
  },
  // Card
  tripCard: {
    backgroundColor: '#1E2522', // Deep premium dark green-charcoal hybrid
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(22, 163, 74, 0.25)', // Elegant subtle green border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
  },
  tripTime: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: '#D8D4CF', // Soft readable off-white
  },
  routeDetailCard: {
    backgroundColor: '#262D29', // Lighter green-charcoal container for contrast
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    paddingBottom: Spacing.sm,
  },
  routeTitleText: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.white, // White text
  },
  pathDiagram: {
    gap: Spacing.sm,
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  bulletContainer: {
    alignItems: 'center',
    width: 16,
  },
  startBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  endBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryLight,
    marginTop: 4,
  },
  verticalLine: {
    width: 1.5,
    height: 28,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)', // Dotted/dashed connection line
    marginTop: 4,
    marginBottom: -4,
  },
  pathTextContainer: {
    flex: 1,
  },
  pathLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: '#9CA3AF', // Muted grey
  },
  pathValue: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.white, // White text
    marginTop: 2,
  },
  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  actionText: {
    fontFamily: FontFamily.bold,
    color: Colors.white,
    fontSize: 15,
  },
  cancelButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xxxl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
});
