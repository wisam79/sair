import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTripHistory } from '../src/hooks/useTrips';
import { useTranslation } from '../src/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';

interface TripHistoryRecord {
  id: string;
  ended_at: string;
  routes?: { title: string } | null;
  drivers?: { profiles?: { full_name: string } | null } | null;
}

export default function TripHistoryScreen() {
  const { trips, loading, refreshing, refetch } = useTripHistory();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item }: { item: TripHistoryRecord }) => {
      const routeTitle = item.routes?.title || t('unknown_route');
      const driverName = item.drivers?.profiles?.full_name || t('unknown_driver');
      const date = new Date(item.ended_at).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      return (
        <View style={styles.card}>
          <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={[styles.routeContainer, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="bus-outline" size={20} color={Colors.primary} />
              <Text style={[styles.routeTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {routeTitle}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{t('completed')}</Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
              <Text style={[styles.detailText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {date}
              </Text>
            </View>
            <View style={[styles.detailRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
              <Text style={[styles.detailText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {driverName}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [t, isRTL],
  );

  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={64} color={Colors.border} />
        <Text style={styles.emptyText}>{t('no_trips_found')}</Text>
      </View>
    ),
    [t],
  );

  const keyExtractor = useCallback((item: TripHistoryRecord) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Custom Header for Stack */}
      <View
        style={[
          styles.navHeader,
          { paddingTop: top + Spacing.md },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.backBtn}
        >
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{t('trip_history')}</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                refetch();
              }}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={ListEmpty}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navHeader: {
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
  backBtn: {
    padding: Spacing.xs,
    zIndex: 11,
  },
  navTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
    zIndex: 1,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  routeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
    flexShrink: 1,
  },
  statusBadge: {
    backgroundColor: Colors.surfaceMuted,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  details: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
