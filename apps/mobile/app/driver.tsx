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
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { supabase } from '../src/lib/supabase';
import { useAuthStore, useTripStore } from '../src/hooks/useStore';
import { useDriverTrips, useLocationTracker } from '../src/hooks/useTrips';
import { useTranslation } from '../src/hooks/useTranslation';
import { canTransition, TripStatus, Route } from '@uniride/core';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'حدث خطأ غير معروف';
}

interface DriverTrip {
  id: string;
  route_id: string;
  driver_id: string;
  status: TripStatus;
  scheduled_at: string;
  started_at: string | null;
  ended_at: string | null;
  last_lat: number | null;
  last_lng: number | null;
  routes?: Route | null;
}

const STATUS_DISPLAY: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  scheduled:      { label: 'مجدولة',       color: Colors.warning, bg: Colors.warningSurface, icon: 'calendar-outline' },
  driver_waiting: { label: 'في الانتظار',   color: Colors.primary, bg: Colors.primarySurface, icon: 'time-outline' },
  in_transit:     { label: 'في الطريق',     color: Colors.success, bg: Colors.successSurface, icon: 'navigate-outline' },
  completed:      { label: 'مكتملة',       color: Colors.textMuted, bg: Colors.surfaceMuted, icon: 'checkmark-circle-outline' },
  absent:         { label: 'غائب',         color: Colors.textMuted, bg: Colors.surfaceMuted, icon: 'person-remove-outline' },
  cancelled:      { label: 'ملغاة',         color: Colors.error, bg: Colors.errorSurface, icon: 'ban-outline' },
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
  const { t } = useTranslation();
  const router = useRouter();
  const [updatingTripId, setUpdatingTripId] = useState<string | null>(null);
  const { activeTripId, setActiveTrip, updateStatus, clearTrip } = useTripStore();

  const getNextAction = (status: TripStatus): { label: string; newStatus: TripStatus } | null => {
    switch (status) {
      case 'scheduled':
        return { label: 'بدء استقبال الطلاب', newStatus: 'driver_waiting' as TripStatus };
      case 'driver_waiting':
        return { label: 'انطلاق الرحلة', newStatus: 'in_transit' as TripStatus };
      case 'in_transit':
        return { label: 'إنهاء الرحلة', newStatus: 'completed' as TripStatus };
      default:
        return null;
    }
  };

  const handleStatusUpdate = useCallback(
    async (tripId: string, currentStatus: TripStatus, newStatus: TripStatus) => {
      if (!canTransition(currentStatus, newStatus)) {
        Alert.alert('خطأ', 'انتقال حالة غير صالح');
        return;
      }

      setUpdatingTripId(tripId);

      try {
        let lat: number | null = null;
        let lng: number | null = null;

        const loc = await getCurrentLocation();
        if (loc) {
          lat = loc.lat;
          lng = loc.lng;
        }

        const { error } = await supabase.functions.invoke('trip-engine', {
          body: { tripId, newStatus, lat, lng },
        });

        if (error) throw error;

        if (newStatus === 'in_transit') {
          setActiveTrip(tripId, newStatus, '');
          startTracking(tripId);
        } else if (newStatus === 'completed' || newStatus === 'absent' || newStatus === 'cancelled') {
          stopTracking();
          if (activeTripId === tripId) {
            clearTrip();
          }
        } else {
          updateStatus(newStatus);
        }

        refetch();
      } catch (err: unknown) {
        Alert.alert('خطأ', getErrorMessage(err));
      } finally {
        setUpdatingTripId(null);
      }
    },
    [activeTripId, startTracking, stopTracking, setActiveTrip, clearTrip, updateStatus, refetch]
  );

  const handleCancelTrip = useCallback(
    async (tripId: string, currentStatus: TripStatus) => {
      Alert.alert('إلغاء الرحلة', 'هل أنت متأكد من إلغاء هذه الرحلة؟', [
        { text: 'تراجع', style: 'cancel' },
        {
          text: 'نعم، قم بالإلغاء',
          style: 'destructive',
          onPress: () => handleStatusUpdate(tripId, currentStatus, 'cancelled' as TripStatus),
        },
      ]);
    },
    [handleStatusUpdate]
  );

  const handleLogout = async () => {
    stopTracking();
    await supabase.auth.signOut();
    logout();
  };

  const renderItem = ({ item }: { item: DriverTrip }) => {
    const statusDisplay = STATUS_DISPLAY[item.status] || STATUS_DISPLAY.scheduled;
    const nextAction = getNextAction(item.status as TripStatus);
    const isUpdating = updatingTripId === item.id;
    const tripDate = new Date(item.scheduled_at).toLocaleDateString('ar-IQ');
    const tripTime = new Date(item.scheduled_at).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.tripCard}>
        {/* Header */}
        <View style={styles.tripHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusDisplay.bg }]}>
            <Ionicons name={statusDisplay.icon as any} size={14} color={statusDisplay.color} />
            <Text style={[styles.statusText, { color: statusDisplay.color }]}>{statusDisplay.label}</Text>
          </View>
          <Text style={styles.tripTime}>{tripDate} {tripTime}</Text>
        </View>

        {/* Route Info */}
        {item.routes && (
          <View style={styles.routeContainer}>
            <Ionicons name="bus-outline" size={24} color={Colors.secondaryLight} />
            <Text style={styles.routeInfo} numberOfLines={2}>
              {item.routes.title}
            </Text>
          </View>
        )}

        {/* Actions */}
        {nextAction && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: statusDisplay.color }]}
              onPress={() => handleStatusUpdate(item.id, item.status, nextAction.newStatus)}
              disabled={isUpdating}
              activeOpacity={0.85}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.actionText}>{nextAction.label}</Text>
              )}
            </TouchableOpacity>

            {(item.status === 'scheduled' || item.status === 'driver_waiting') && (
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
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>لوحة السائق</Text>
          {profile?.full_name && (
            <Text style={styles.headerSubtitle}>مرحباً، {profile.full_name}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')} activeOpacity={0.8}>
          <Ionicons name="person-circle-outline" size={36} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={24} color={Colors.errorSurface} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={trips as unknown as DriverTrip[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="car-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyText}>لا توجد رحلات مجدولة حالياً</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push('/create-trip')}
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
    backgroundColor: Colors.secondary,
    paddingTop: Spacing.xl + 12,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.white,
  },
  headerSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  profileButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  logoutButton: {
    padding: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.sm,
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
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadow.md,
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
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
  },
  tripTime: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textMuted,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceMuted,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  routeInfo: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'right',
  },
  // Actions
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Spacing.lg,
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
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.errorSurface,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xxxl,
    left: Spacing.xl, // FAB on the left for RTL
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
});
