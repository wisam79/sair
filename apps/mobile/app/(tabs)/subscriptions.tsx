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
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useSubscriptions } from '../../src/hooks/useTrips';
import { useTranslation } from '../../src/hooks/useTranslation';
import { ClientRateLimiter } from '../../src/lib/rateLimiter';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { SubscriptionCardSkeleton } from '../../src/components/LoadingSkeleton';
import { EmptyState } from '../../src/components/EmptyState';

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

const STATUS_CONFIG: Record<string, { color: string; bg: string; labelKey: string; icon: string }> =
  {
    active: {
      color: Colors.success,
      bg: Colors.successSurface,
      labelKey: 'active',
      icon: 'checkmark-circle',
    },
    pending: {
      color: Colors.warning,
      bg: Colors.warningSurface,
      labelKey: 'subscription_pending',
      icon: 'time',
    },
    expired: {
      color: Colors.textMuted,
      bg: Colors.surfaceMuted,
      labelKey: 'subscription_expired',
      icon: 'close-circle',
    },
    cancelled: {
      color: Colors.error,
      bg: Colors.errorSurface,
      labelKey: 'subscription_cancelled',
      icon: 'ban',
    },
  };

export default function SubscriptionsScreen() {
  const { subscriptions, isLoading, error, refetch } = useSubscriptions();
  const { t, isRTL } = useTranslation();
  const router = useRouter();

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      if (!ClientRateLimiter.canProceed(`cancel_sub_${subscriptionId}`, 3000)) return;

      Alert.alert(t('cancel'), t('cancel_confirmation'), [
        { text: t('no'), style: 'cancel' },
        {
          text: t('yes'),
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            try {
              const { error } = await supabase.rpc('cancel_subscription', {
                p_subscription_id: subscriptionId,
              });
              if (error) throw error;
              refetch();
            } catch (err: unknown) {
              Alert.alert(
                t('error'),
                err instanceof Error ? err.message : t('something_went_wrong'),
              );
            }
          },
        },
      ]);
    },
    [refetch, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: SubscriptionWithRoute }) => {
      const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.expired;
      const startDate = new Date(item.start_date).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US');
      const endDate = new Date(item.end_date).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US');

      return (
        <View style={styles.card}>
          {/* Header */}
          <View style={[styles.cardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: status.bg },
                isRTL && { flexDirection: 'row-reverse' },
              ]}
            >
              <Ionicons name={status.icon as any} size={13} color={status.color} />
              <Text style={[styles.statusText, { color: status.color }]}>{t(status.labelKey)}</Text>
            </View>
            <Text
              style={[styles.routeTitle, { textAlign: isRTL ? 'right' : 'left' }]}
              numberOfLines={1}
            >
              {item.routes?.title || t('route')}
            </Text>
          </View>

          {/* Route Path */}
          {item.routes && (
            <View style={styles.routePath}>
              <View
                style={[
                  styles.pathStop,
                  {
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    justifyContent: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                <Ionicons name="radio-button-on" size={12} color={Colors.primary} />
                <Text style={styles.pathText}>{item.routes.start_location}</Text>
              </View>
              <View
                style={[
                  styles.pathDivider,
                  isRTL
                    ? { alignSelf: 'flex-end', marginRight: 5 }
                    : { alignSelf: 'flex-start', marginLeft: 5 },
                ]}
              />
              <View
                style={[
                  styles.pathStop,
                  {
                    flexDirection: isRTL ? 'row-reverse' : 'row',
                    justifyContent: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              >
                <Ionicons name="location" size={12} color={Colors.secondary} />
                <Text style={styles.pathText}>{item.routes.end_location}</Text>
              </View>
            </View>
          )}

          {/* Details Row */}
          <View style={[styles.detailsRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.dateText}>
              {startDate} — {endDate}
            </Text>
            {item.routes && (
              <Text style={styles.priceText}>
                {item.routes.price.toLocaleString()} {t('currency')}
              </Text>
            )}
          </View>

          {/* Actions */}
          <View style={[styles.actions, isRTL && { flexDirection: 'row-reverse' }]}>
            {item.status === 'active' && item.routes && (
              <TouchableOpacity
                style={[styles.trackButton, isRTL && { flexDirection: 'row-reverse' }]}
                activeOpacity={0.85}
                onPress={async () => {
                  const { data: activeTrip } = await supabase
                    .from('trips')
                    .select('id')
                    .eq('route_id', item.route_id)
                    .in('status', ['driver_waiting', 'in_transit'])
                    .order('scheduled_at', { ascending: false })
                    .limit(1)
                    .single();
                  if (activeTrip) {
                    router.push({
                      pathname: '/tracking/[tripId]',
                      params: { tripId: activeTrip.id },
                    });
                  } else {
                    Alert.alert(t('tracking'), t('no_active_trips'));
                  }
                }}
              >
                <Ionicons name="navigate-outline" size={14} color={Colors.white} />
                <Text style={styles.trackButtonText}>{t('track_trip')}</Text>
              </TouchableOpacity>
            )}

            {(item.status === 'active' || item.status === 'pending') && (
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.85}
                onPress={() => handleCancelSubscription(item.id)}
              >
                <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    },
    [router, t, handleCancelSubscription],
  );

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        icon="ticket-outline"
        title={t('no_subscriptions')}
        subtitle={t('book_route_prompt')}
        iconColor={Colors.primary}
      />
    ),
    [t],
  );

  const keyExtractor = useCallback((item: SubscriptionWithRoute) => item.id, []);

  if (isLoading && subscriptions.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <SubscriptionCardSkeleton />
        <SubscriptionCardSkeleton />
        <SubscriptionCardSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={subscriptions as SubscriptionWithRoute[]}
        keyExtractor={keyExtractor}
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
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
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
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  pageTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  // Card
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  routeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
  },
  // Route
  routePath: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  pathStop: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  pathText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  pathDivider: {
    width: 2,
    height: 8,
    backgroundColor: Colors.border,
  },
  // Details
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
  },
  priceText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.success,
  },
  // Actions
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  trackButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.white,
  },
  cancelButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.error,
  },
  // Empty
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.textSecondary,
  },
  emptySubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textMuted,
  },
});
