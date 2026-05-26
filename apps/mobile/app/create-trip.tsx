import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../src/lib/supabase';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Route } from '@sair/core';
import { useTranslation } from '../src/hooks/useTranslation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { useTripStore } from '../src/hooks/useStore';

interface RouteCardItemProps {
  item: Route;
  isSelected: boolean;
  isRTL: boolean;
  onPress: (id: string) => void;
  t: (key: string) => string;
}

const RouteCardItem = React.memo(({ item, isSelected, isRTL, onPress, t }: RouteCardItemProps) => {
  const handlePress = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item.id);
  }, [item.id, onPress]);

  return (
    <TouchableOpacity
      style={[styles.routeCard, isSelected && styles.routeCardSelected]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.routeHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <Ionicons
          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={isSelected ? Colors.primary : Colors.border}
        />
        <Text
          style={[
            styles.routeTitle,
            isSelected && styles.routeTitleSelected,
            { textAlign: isRTL ? 'right' : 'left' },
          ]}
        >
          {item.title}
        </Text>
      </View>

      <View
        style={[
          styles.routeDetails,
          isRTL && { flexDirection: 'row-reverse', justifyContent: 'flex-end' },
        ]}
      >
        <View style={[styles.detailItem, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="people-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {item.capacity} {t(item.capacity === 1 ? 'passenger' : 'passengers')}
          </Text>
        </View>
        <View style={[styles.detailItem, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="cash-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>
            {item.price} {t('currency')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default function CreateTripScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMyRoutes() {
      try {
        setIsLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('not_authenticated');

        const cacheKey = `driver_routes_${user.id}`;
        const netState = await NetInfo.fetch();
        const isOnline = !!netState.isConnected && netState.isInternetReachable !== false;

        if (!isOnline) {
          const cached = await AsyncStorage.getItem(cacheKey);
          if (cached) {
            setRoutes(JSON.parse(cached) as Route[]);
            setIsLoading(false);
            return;
          }
          throw new Error('no_internet');
        }

        const { data: driverData, error: driverError } = await supabase
          .from('drivers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (driverError || !driverData) throw driverError || new Error('driver_profile_not_found');

        // Fetch routes assigned to this driver
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('driver_id', driverData.id)
          .eq('is_active', true);

        if (error) throw error;
        const fetchedRoutes = (data as Route[]) || [];
        setRoutes(fetchedRoutes);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(fetchedRoutes));
      } catch (err: unknown) {
        // Fallback to cache on error
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const cached = await AsyncStorage.getItem(`driver_routes_${user.id}`);
            if (cached) {
              setRoutes(JSON.parse(cached) as Route[]);
              setIsLoading(false);
              return;
            }
          }
        } catch (_) {
          console.warn('[Cache] Failed to load offline fallback routes');
        }

        const msg = err instanceof Error ? err.message : 'unknown_error';
        // Don't show alert for auth errors, just navigate back
        if (msg !== 'not_authenticated') {
          Alert.alert(t('error'), t(msg) || msg);
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyRoutes();
  }, []); // Run once on mount only — t is stable and fetchMyRoutes captures it via closure

  const handleCreateTrip = async () => {
    if (!selectedRouteId) return;

    try {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsSubmitting(true);
      // Create trip scheduled for now
      const scheduledAt = new Date().toISOString();

      const netState = await NetInfo.fetch();
      const isOnline = !!netState.isConnected && netState.isInternetReachable !== false;

      if (!isOnline) {
        // Offline behavior: Generate a local trip ID and add to queue
        const localId = `local_trip_${selectedRouteId}_${Date.now()}`;
        const pendingQueueKey = 'pending_trips_creation_queue';
        const rawQueue = await AsyncStorage.getItem(pendingQueueKey);
        const queue = rawQueue ? JSON.parse(rawQueue) : [];
        queue.push({
          localId,
          routeId: selectedRouteId,
          scheduledAt,
        });
        await AsyncStorage.setItem(pendingQueueKey, JSON.stringify(queue));

        // Update local trip store status immediately
        useTripStore.getState().setActiveTrip(localId, 'driver_waiting', selectedRouteId);

        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(t('success'), t('trip_opened_success') + ' (وضع عدم الاتصال)', [
          { text: t('ok'), onPress: () => router.back() },
        ]);
        return;
      }

      const { error } = await supabase.rpc('create_trip', {
        p_route_id: selectedRouteId,
        p_scheduled_at: scheduledAt,
      });

      if (error) throw error;

      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(t('success'), t('trip_opened_success'), [
        { text: t('ok'), onPress: () => router.back() },
      ]);
    } catch (err: unknown) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(t('trip_creation_error'), err instanceof Error ? err.message : t('try_again'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRouteItem = useCallback(
    ({ item }: { item: Route }) => (
      <RouteCardItem
        item={item}
        isSelected={selectedRouteId === item.id}
        isRTL={isRTL}
        onPress={setSelectedRouteId}
        t={t}
      />
    ),
    [selectedRouteId, isRTL, t],
  );

  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="bus-outline" size={48} color={Colors.border} />
        <Text style={styles.emptyText}>{t('no_routes_assigned')}</Text>
      </View>
    ),
    [t],
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: top + Spacing.md },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('create_trip')}</Text>
      </View>

      <Text style={[styles.pageSubtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t('select_route_prompt')}
      </Text>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderRouteItem}
        ListEmptyComponent={ListEmpty}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, !selectedRouteId && styles.submitButtonDisabled]}
          onPress={handleCreateTrip}
          disabled={!selectedRouteId || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>{t('open_trip_now')}</Text>
          )}
        </TouchableOpacity>
      </View>
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
  header: {
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.surfaceMuted,
    zIndex: 11,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
    zIndex: 1,
  },
  pageSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textSecondary,
    padding: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  routeCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.sm,
  },
  routeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  routeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  routeTitleSelected: {
    color: Colors.primary,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    color: Colors.textMuted,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.md,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.border,
  },
  submitButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
  },
});
