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
import { supabase } from '../src/lib/supabase';
import { useSubscriptions } from '../src/hooks/useTrips';
import { useTranslation } from '../src/hooks/useTranslation';
import { useRouter } from 'expo-router';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';

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

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: string }> = {
  active: {
    color: Colors.success,
    bg: Colors.successSurface,
    label: 'نشط',
    icon: 'checkmark-circle',
  },
  pending: { color: Colors.warning, bg: Colors.warningSurface, label: 'معلّق', icon: 'time' },
  expired: {
    color: Colors.textMuted,
    bg: Colors.surfaceMuted,
    label: 'منتهي',
    icon: 'close-circle',
  },
  cancelled: { color: Colors.error, bg: Colors.errorSurface, label: 'ملغي', icon: 'ban' },
};

export default function SubscriptionsScreen() {
  const { subscriptions, isLoading, error, refetch } = useSubscriptions();
  const { t } = useTranslation();
  const router = useRouter();

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      Alert.alert('إلغاء الاشتراك', 'هل أنت متأكد من إلغاء هذا الاشتراك؟', [
        { text: 'تراجع', style: 'cancel' },
        {
          text: 'إلغاء الاشتراك',
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
              Alert.alert('خطأ', err instanceof Error ? err.message : 'حدث خطأ');
            }
          },
        },
      ]);
    },
    [refetch],
  );

  const renderItem = ({ item }: { item: SubscriptionWithRoute }) => {
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.expired;
    const startDate = new Date(item.start_date).toLocaleDateString('ar-IQ');
    const endDate = new Date(item.end_date).toLocaleDateString('ar-IQ');

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon as any} size={13} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
          <Text style={styles.routeTitle} numberOfLines={1}>
            {item.routes?.title || 'خط نقل'}
          </Text>
        </View>

        {/* Route Path */}
        {item.routes && (
          <View style={styles.routePath}>
            <View style={styles.pathStop}>
              <Ionicons name="radio-button-on" size={12} color={Colors.primary} />
              <Text style={styles.pathText}>{item.routes.start_location}</Text>
            </View>
            <View style={styles.pathDivider} />
            <View style={styles.pathStop}>
              <Ionicons name="location" size={12} color={Colors.secondary} />
              <Text style={styles.pathText}>{item.routes.end_location}</Text>
            </View>
          </View>
        )}

        {/* Details Row */}
        <View style={styles.detailsRow}>
          <Text style={styles.dateText}>
            {startDate} — {endDate}
          </Text>
          {item.routes && (
            <Text style={styles.priceText}>{item.routes.price.toLocaleString()} د.ع</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {item.status === 'active' && item.routes && (
            <TouchableOpacity
              style={styles.trackButton}
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
                  Alert.alert('التتبع', 'لا توجد رحلة نشطة الآن');
                }
              }}
            >
              <Ionicons name="navigate-outline" size={14} color={Colors.white} />
              <Text style={styles.trackButtonText}>تتبع الرحلة</Text>
            </TouchableOpacity>
          )}

          {(item.status === 'active' || item.status === 'pending') && (
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.85}
              onPress={() => handleCancelSubscription(item.id)}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (isLoading && subscriptions.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={subscriptions as SubscriptionWithRoute[]}
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
        ListHeaderComponent={<Text style={styles.pageTitle}>اشتراكاتي</Text>}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>لا توجد اشتراكات</Text>
            <Text style={styles.emptySubtitle}>احجز خطاً من الصفحة الرئيسية</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
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
    textAlign: 'right',
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
    textAlign: 'right',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'flex-end',
  },
  pathText: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  pathDivider: {
    width: 1,
    height: 8,
    backgroundColor: Colors.border,
    alignSelf: 'flex-end',
    marginRight: 5,
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
