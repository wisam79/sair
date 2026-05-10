import React, { useState, useEffect, useCallback } from 'react';
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
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { supabase } from '../src/lib/supabase';
import { useAuthStore, useTripStore } from '../src/hooks/useStore';
import { useDriverTrips, useLocationTracker } from '../src/hooks/useTrips';
import { useTranslation } from '../src/hooks/useTranslation';
import { canTransition, TripStatus, Route } from '@uniride/core';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unknown error occurred';
}

interface DriverTrip {
  id: string;
  route_id: string;
  driver_id: string;
  status: TripStatus;
  scheduled_at: string;
  started_at: string | null;
  ended_at: string | null;
  last_lat: string | null;
  last_lng: string | null;
  routes: Route | null;
}

const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'مجدولة', color: '#FF9500' },
  driver_waiting: { label: 'في الانتظار', color: '#5856D6' },
  in_transit: { label: 'في الطريق', color: '#34C759' },
  completed: { label: 'مكتملة', color: '#007AFF' },
  absent: { label: 'غائب', color: '#999' },
  cancelled: { label: 'ملغاة', color: '#FF3B30' },
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
  const [updatingTripId, setUpdatingTripId] = useState<string | null>(null);
  const { activeTripId, currentStatus, setActiveTrip, updateStatus, clearTrip } = useTripStore();

  const getNextAction = (status: TripStatus): { label: string; newStatus: TripStatus } | null => {
    switch (status) {
      case 'scheduled':
        return { label: t('start_trip'), newStatus: 'driver_waiting' as TripStatus };
      case 'driver_waiting':
        return { label: t('start_trip'), newStatus: 'in_transit' as TripStatus };
      case 'in_transit':
        return { label: t('end_trip'), newStatus: 'completed' as TripStatus };
      default:
        return null;
    }
  };

  const handleStatusUpdate = useCallback(
    async (tripId: string, currentStatus: TripStatus, newStatus: TripStatus) => {
      if (!canTransition(currentStatus, newStatus)) {
        Alert.alert(t('error_generic'), t('invalid_transition'));
        return;
      }

      setUpdatingTripId(tripId);

      try {
        let lat: number | null = null;
        let lng: number | null = null;

        if (newStatus === 'driver_waiting') {
          const loc = await getCurrentLocation();
          if (loc) {
            lat = loc.lat;
            lng = loc.lng;
          }
        }

        const { error } = await supabase.functions.invoke('trip-engine', {
          body: {
            tripId,
            newStatus,
            lat,
            lng,
          },
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
        Alert.alert(t('error_generic'), getErrorMessage(err) || t('error_generic'));
      } finally {
        setUpdatingTripId(null);
      }
    },
    [activeTripId]
  );

  const handleCancelTrip = useCallback(
    async (tripId: string, currentStatus: TripStatus) => {
      Alert.alert(t('cancel_trip'), t('are_you_sure'), [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes'),
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

    return (
      <View style={[styles.tripCard, isRTL && styles.cardRTL]}>
        <View style={styles.tripHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusDisplay.color }]}>
            <Text style={styles.statusText}>{statusDisplay.label}</Text>
          </View>
          <Text style={styles.tripTime}>
            {new Date(item.scheduled_at).toLocaleDateString()}
          </Text>
        </View>

        {item.routes && (
          <Text style={[styles.routeInfo, isRTL && styles.textRTL]}>
            {item.routes.title}
          </Text>
        )}

        {nextAction && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: statusDisplay.color }]}
              onPress={() => handleStatusUpdate(item.id, item.status, nextAction.newStatus)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.actionText}>{nextAction.label}</Text>
              )}
            </TouchableOpacity>

            {(item.status === 'scheduled' || item.status === 'driver_waiting') && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelTrip(item.id, item.status)}
                disabled={isUpdating}
              >
                <Text style={styles.cancelText}>{t('cancel_trip')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>
            {t('driver_dashboard')}
          </Text>
          {profile?.full_name ? (
            <Text style={styles.headerSubtitle}>{profile.full_name}</Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabActive}>
          <Text style={styles.tabTextActive}>{t('driver_dashboard')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => router.push('/profile')}>
          <Text style={styles.tabText}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={trips as DriverTrip[]}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>{t('no_active_trips')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#007AFF',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: '#fff', fontWeight: '600' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#fff',
  },
  tabText: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  tabTextActive: { fontSize: 13, color: '#fff', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  listContent: { padding: 15 },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRTL: { direction: 'rtl' },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  tripTime: { fontSize: 12, color: '#999' },
  routeInfo: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRTL: { textAlign: 'right' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
  cancelText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 14 },
});
