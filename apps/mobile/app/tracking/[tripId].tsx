import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useTripTracking } from '../../src/hooks/useTrips';
import { useTranslation } from '../../src/hooks/useTranslation';
import { TripStatus } from '@uniride/core';

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'scheduled',
  driver_waiting: 'driver_waiting',
  in_transit: 'in_transit',
  completed: 'completed',
  absent: 'absent',
  cancelled: 'cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: '#FF9500',
  driver_waiting: '#5856D6',
  in_transit: '#34C759',
  completed: '#007AFF',
  absent: '#999',
  cancelled: '#FF3B30',
};

export default function TrackingScreen() {
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trip, isLoading } = useTripTracking(tripId);
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [routeTitle, setRouteTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!trip?.route_id) return;
    supabase
      .from('routes')
      .select('title')
      .eq('id', trip.route_id)
      .single()
      .then(({ data }) => {
        if (data) setRouteTitle(data.title);
      });
  }, [trip?.route_id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{t('no_active_trips')}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>{t('go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.statusCard, isRTL && styles.cardRTL]}>
        <View style={[styles.statusIndicator, { backgroundColor: STATUS_COLORS[trip.status] || '#999' }]}>
          <Text style={styles.statusLabel}>{t(STATUS_LABELS[trip.status] || 'scheduled')}</Text>
        </View>

        <View style={styles.mapPlaceholder}>
          {trip.last_lat && trip.last_lng ? (
            <>
              <Text style={styles.coordsText}>
                Lat: {parseFloat(trip.last_lat).toFixed(4)}
              </Text>
              <Text style={styles.coordsText}>
                Lng: {parseFloat(trip.last_lng).toFixed(4)}
              </Text>
            </>
          ) : (
            <Text style={styles.noLocation}>{t('waiting_for_driver')}</Text>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.infoLabel, isRTL && styles.textRTL]}>{t('route_details')}</Text>
          <Text style={[styles.infoValue, isRTL && styles.textRTL]}>
            {routeTitle || trip.route_id}
          </Text>
        </View>

        {trip.started_at && (
          <View style={styles.infoSection}>
            <Text style={[styles.infoLabel, isRTL && styles.textRTL]}>{t('trip_started')}</Text>
            <Text style={[styles.infoValue, isRTL && styles.textRTL]}>
              {new Date(trip.started_at).toLocaleTimeString()}
            </Text>
          </View>
        )}

        {trip.ended_at && (
          <View style={styles.infoSection}>
            <Text style={[styles.infoLabel, isRTL && styles.textRTL]}>{t('completed')}</Text>
            <Text style={[styles.infoValue, isRTL && styles.textRTL]}>
              {new Date(trip.ended_at).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardRTL: { direction: 'rtl' },
  statusIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusLabel: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E8F4FD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  coordsText: { fontSize: 16, color: '#333', fontWeight: '500' },
  noLocation: { color: '#888', fontSize: 16 },
  infoSection: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: '500', color: '#333' },
  textRTL: { textAlign: 'right' },
  errorText: { color: '#FF3B30', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backText: { color: '#fff', fontWeight: 'bold' },
});
