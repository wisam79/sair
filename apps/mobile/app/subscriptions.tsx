import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { supabase } from '../src/lib/supabase';
import { useSubscriptions } from '../src/hooks/useTrips';
import { useTranslation } from '../src/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { SubscriptionStatus } from '@uniride/core';

interface SubscriptionWithRoute {
  id: string;
  student_id: string;
  route_id: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  routes: {
    id: string;
    title: string;
    start_location: string;
    end_location: string;
    price: number;
  } | null;
}

const STATUS_COLORS: Record<string, string> = {
  active: '#34C759',
  pending: '#FF9500',
  expired: '#999',
  cancelled: '#FF3B30',
};

export default function SubscriptionsScreen() {
  const { subscriptions, isLoading, error, refetch } = useSubscriptions();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  const getStatusLabel = (status: string): string => {
    const map: Record<string, string> = {
      active: t('subscription_active'),
      pending: t('subscription_pending'),
      expired: t('subscription_expired'),
      cancelled: t('subscription_cancelled'),
    };
    return map[status] || status;
  };

  const handleCancelSubscription = useCallback(async (subscriptionId: string) => {
    Alert.alert(t('cancel_trip'), t('cancel_confirmation'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('subscriptions')
              .update({ status: 'cancelled' })
              .eq('id', subscriptionId);

            if (error) throw error;
            refetch();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : t('error_generic');
            Alert.alert(t('error_generic'), msg);
          }
        },
      },
    ]);
  }, [refetch, t]);

  const renderItem = ({ item }: { item: SubscriptionWithRoute }) => (
    <View style={[styles.card, isRTL && styles.cardRTL]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.routeTitle, isRTL && styles.textRTL]}>
          {item.routes?.title || t('route_details')}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#999' }]}>
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      {item.routes && (
        <>
          <Text style={[styles.location, isRTL && styles.textRTL]}>
            {item.routes.start_location} → {item.routes.end_location}
          </Text>
          <Text style={styles.price}>{item.routes.price?.toLocaleString()} IQD</Text>
        </>
      )}

      <Text style={[styles.dateText, isRTL && styles.textRTL]}>
        {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
      </Text>

      <View style={styles.actionRow}>
        {item.status === 'active' && item.routes && (
          <TouchableOpacity
            style={styles.trackButton}
            onPress={async () => {
              if (item.route_id) {
                const { data: activeTrip } = await supabase
                  .from('trips')
                  .select('id')
                  .eq('route_id', item.route_id)
                  .in('status', ['driver_waiting', 'in_transit'])
                  .order('scheduled_at', { ascending: false })
                  .limit(1)
                  .single();
                if (activeTrip) {
                  router.push({ pathname: '/tracking/[tripId]', params: { tripId: activeTrip.id } });
                } else {
                  Alert.alert(t('live_tracking'), t('no_active_trips'));
                }
              }
            }}
          >
            <Text style={styles.trackButtonText}>{t('live_tracking')}</Text>
          </TouchableOpacity>
        )}

        {(item.status === 'active' || item.status === 'pending') && (
          <TouchableOpacity
            style={styles.cancelSubButton}
            onPress={() => handleCancelSubscription(item.id)}
          >
            <Text style={styles.cancelSubButtonText}>{t('cancel_trip')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading && subscriptions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subscriptions as SubscriptionWithRoute[]}
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
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  listContent: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRTL: { direction: 'rtl' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeTitle: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  location: { fontSize: 14, color: '#424242', marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '600', color: '#2e7d32', marginBottom: 8 },
  dateText: { fontSize: 12, color: '#999' },
  textRTL: { textAlign: 'right' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  trackButton: {
    flex: 1,
    backgroundColor: '#5856D6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButtonText: { color: '#fff', fontWeight: '600' },
  cancelSubButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    alignItems: 'center',
  },
  cancelSubButtonText: { color: '#FF3B30', fontWeight: '600' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center' },
});
