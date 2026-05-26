import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Animated,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../src/lib/supabase';
import { useSubscriptions } from '../../src/hooks/useTrips';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/hooks/useStore';
import { ClientRateLimiter } from '../../src/lib/rateLimiter';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { SubscriptionCardSkeleton } from '../../src/components/LoadingSkeleton';
import { EmptyState } from '../../src/components/EmptyState';
import CustomAlert, { AlertButton } from '../../src/components/CustomAlert';

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

interface SubscriptionCardProps {
  item: SubscriptionWithRoute;
  isRTL: boolean;
  t: (key: string) => string;
  onCancel: (id: string) => void;
  onTrack: (routeId: string) => void;
  onShowBoardingPass: (item: SubscriptionWithRoute) => void;
}

const SubscriptionCard = React.memo(
  ({ item, isRTL, t, onCancel, onTrack, onShowBoardingPass }: SubscriptionCardProps) => {
    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.expired;
    const startDate = new Date(item.start_date).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US');
    const endDate = new Date(item.end_date).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US');

    const handleCancel = useCallback(() => {
      onCancel(item.id);
    }, [item.id, onCancel]);

    const handleTrack = useCallback(() => {
      onTrack(item.route_id);
    }, [item.route_id, onTrack]);

    const handleShowBoardingPass = useCallback(() => {
      onShowBoardingPass(item);
    }, [item, onShowBoardingPass]);

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
        {item.status === 'active' && item.routes && (
          <View style={[styles.actions, isRTL && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              style={[styles.trackButton, isRTL && { flexDirection: 'row-reverse' }]}
              activeOpacity={0.85}
              onPress={handleTrack}
            >
              <Ionicons name="navigate-outline" size={14} color={Colors.white} />
              <Text style={styles.trackButtonText}>{t('track_trip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.boardingPassButton, isRTL && { flexDirection: 'row-reverse' }]}
              activeOpacity={0.85}
              onPress={handleShowBoardingPass}
            >
              <Ionicons name="qr-code-outline" size={14} color={Colors.white} />
              <Text style={styles.boardingPassButtonText}>{t('show_boarding_pass')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {(item.status === 'active' || item.status === 'pending') && (
          <TouchableOpacity style={styles.cancelButton} activeOpacity={0.8} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>{t('cancel_subscription')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

export default function SubscriptionsScreen() {
  const { subscriptions, isLoading, error, refetch } = useSubscriptions();
  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);

  // Boarding Pass Modal states
  const [boardingPassVisible, setBoardingPassVisible] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubscriptionWithRoute | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Alert states
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info' | 'question'>(
    'info',
  );
  const [alertButtons, setAlertButtons] = useState<AlertButton[]>([]);

  // Animate heartbeat/pulse ring and tick current time
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let animation: Animated.CompositeAnimation;

    if (boardingPassVisible) {
      setCurrentTime(new Date());
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 650,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (animation) animation.stop();
    };
  }, [boardingPassVisible, pulseAnim]);

  const handleShowBoardingPass = useCallback((item: SubscriptionWithRoute) => {
    setSelectedSub(item);
    setBoardingPassVisible(true);
  }, []);

  const getVerificationCode = useCallback((subId: string) => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const yearShort = now.getFullYear().toString().slice(-2);
    const cleanSubId = subId.replace(/-/g, '').slice(0, 4).toUpperCase();
    return `SA-${cleanSubId}-${dayOfYear}-${yearShort}`;
  }, []);

  const handleCancelSubscription = useCallback(
    async (subscriptionId: string) => {
      if (!ClientRateLimiter.canProceed(`cancel_sub_${subscriptionId}`, 3000)) return;

      setAlertTitle(t('cancel'));
      setAlertMessage(t('cancel_confirmation'));
      setAlertType('warning');
      setAlertButtons([
        {
          text: t('no'),
          style: 'cancel',
          onPress: () => {},
        },
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
              setTimeout(() => {
                setAlertTitle(t('error'));
                setAlertMessage(err instanceof Error ? err.message : t('something_went_wrong'));
                setAlertType('error');
                setAlertButtons([{ text: t('ok'), style: 'default' }]);
                setAlertVisible(true);
              }, 100);
            }
          },
        },
      ]);
      setAlertVisible(true);
    },
    [refetch, t],
  );

  const handleTrackTrip = useCallback(
    async (routeId: string) => {
      const { data: activeTrip } = await supabase
        .from('trips')
        .select('id')
        .eq('route_id', routeId)
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
        setAlertTitle(t('tracking'));
        setAlertMessage(t('no_active_trips'));
        setAlertType('info');
        setAlertButtons([{ text: t('ok'), style: 'default' }]);
        setAlertVisible(true);
      }
    },
    [router, t],
  );

  const renderItem = useCallback(
    ({ item }: { item: SubscriptionWithRoute }) => (
      <SubscriptionCard
        item={item}
        isRTL={isRTL}
        t={t}
        onCancel={handleCancelSubscription}
        onTrack={handleTrackTrip}
        onShowBoardingPass={handleShowBoardingPass}
      />
    ),
    [isRTL, t, handleCancelSubscription, handleTrackTrip, handleShowBoardingPass],
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
        <StatusBar style="light" translucent />
        <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
          {/* Glassmorphic Background Effects */}
          <View style={styles.glassOverlay} />
          <View style={styles.glassHighlight} />

          <Text style={styles.headerTitle}>
            {t('my_subscriptions')}
          </Text>
          <TouchableOpacity
            style={[styles.headerShortcutBtn, { [isRTL ? 'left' : 'right']: Spacing.md }]}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/activate');
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="card-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, padding: Spacing.md, gap: Spacing.md }}>
          <SubscriptionCardSkeleton />
          <SubscriptionCardSkeleton />
          <SubscriptionCardSkeleton />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />
      <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
        {/* Glassmorphic Background Effects */}
        <View style={styles.glassOverlay} />
        <View style={styles.glassHighlight} />

        <Text style={styles.headerTitle}>
          {t('my_subscriptions')}
        </Text>
        <TouchableOpacity
          style={[styles.headerShortcutBtn, { [isRTL ? 'left' : 'right']: Spacing.md }]}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/activate');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="card-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>
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
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        buttons={alertButtons}
        onClose={() => setAlertVisible(false)}
      />

      {/* Boarding Pass Modal */}
      <Modal
        visible={boardingPassVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setBoardingPassVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ticketCard}>
            {/* Ticket Header */}
            <View style={styles.ticketHeader}>
              <View style={[styles.ticketHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="bus-outline" size={20} color={Colors.white} />
                <Text style={styles.ticketHeaderTitle}>{t('boarding_pass')}</Text>
              </View>
              <Text style={styles.ticketHeaderSubtitle}>{t('live_ticket')}</Text>
            </View>

            <View style={styles.ticketBody}>
              {/* Student Info */}
              <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
                <View
                  style={[
                    styles.infoTextContainer,
                    isRTL
                      ? { marginRight: Spacing.sm, alignItems: 'flex-end' }
                      : { marginLeft: Spacing.sm },
                  ]}
                >
                  <Text style={styles.infoLabel}>{t('passenger')}</Text>
                  <Text style={styles.infoValue}>{profile?.full_name || ''}</Text>
                </View>
              </View>

              {/* Route Info */}
              {selectedSub?.routes && (
                <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="git-compare-outline" size={16} color={Colors.textSecondary} />
                  <View
                    style={[
                      styles.infoTextContainer,
                      isRTL
                        ? { marginRight: Spacing.sm, alignItems: 'flex-end' }
                        : { marginLeft: Spacing.sm },
                    ]}
                  >
                    <Text style={styles.infoLabel}>{t('route')}</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>
                      {selectedSub.routes.title}
                    </Text>
                    <Text style={styles.infoRouteDetail} numberOfLines={1}>
                      {selectedSub.routes.start_location} → {selectedSub.routes.end_location}
                    </Text>
                  </View>
                </View>
              )}

              {/* Status Info */}
              <View style={[styles.infoRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={16}
                  color={Colors.textSecondary}
                />
                <View
                  style={[
                    styles.infoTextContainer,
                    isRTL
                      ? { marginRight: Spacing.sm, alignItems: 'flex-end' }
                      : { marginLeft: Spacing.sm },
                  ]}
                >
                  <Text style={styles.infoLabel}>{t('status')}</Text>
                  <View
                    style={[styles.ticketStatusBadge, isRTL && { flexDirection: 'row-reverse' }]}
                  >
                    <View style={styles.statusDot} />
                    <Text style={styles.ticketStatusText}>{t('subscription_active')}</Text>
                  </View>
                </View>
              </View>

              {/* Ticket Dashed Separator */}
              <View style={styles.ticketDividerContainer}>
                <View style={styles.ticketDividerLeftCircle} />
                <View style={styles.ticketDividerLine} />
                <View style={styles.ticketDividerRightCircle} />
              </View>

              {/* Code Verification Section */}
              <View style={styles.verificationSection}>
                <Text style={styles.verificationLabel}>{t('validation_code')}</Text>
                <View style={styles.codeContainer}>
                  <Animated.View
                    style={[
                      styles.pulseRing,
                      {
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />
                  <Text style={styles.codeText}>
                    {selectedSub ? getVerificationCode(selectedSub.id) : ''}
                  </Text>
                </View>

                {/* Clock Ticker */}
                <View style={styles.clockContainer}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={Colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.clockTime}>
                    {currentTime.toLocaleTimeString(isRTL ? 'ar-IQ' : 'en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
                <Text style={styles.clockDate}>
                  {currentTime.toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>

                {/* Locally Verified Shield */}
                <View style={[styles.verifiedBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
                  <Text style={styles.verifiedText}>{t('verified_device')}</Text>
                </View>

                <Text style={styles.instructionsText}>{t('scan_instructions')}</Text>
              </View>
            </View>

            {/* Modal Close Action */}
            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.85}
              onPress={() => setBoardingPassVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBanner: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
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
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
    zIndex: 2,
    textAlign: 'center',
    width: '100%',
  },
  headerShortcutBtn: {
    position: 'absolute',
    bottom: 12,
    zIndex: 3,
    padding: 6,
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
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  cancelButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.error,
    textDecorationLine: 'underline',
  },
  boardingPassButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.secondary,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  boardingPassButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.white,
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
  // Modal & Ticket Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    width: '100%',
    maxWidth: 340,
    ...Shadow.lg,
    overflow: 'hidden',
  },
  ticketHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  ticketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ticketHeaderTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 17,
    color: Colors.white,
  },
  ticketHeaderSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.primarySurface,
    opacity: 0.9,
  },
  ticketBody: {
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
  },
  infoRouteDetail: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ticketStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successSurface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-start',
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  ticketStatusText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.success,
  },
  // Dashed Separator
  ticketDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
    position: 'relative',
    height: 20,
  },
  ticketDividerLeftCircle: {
    position: 'absolute',
    left: -Spacing.md - 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.overlay,
  },
  ticketDividerRightCircle: {
    position: 'absolute',
    right: -Spacing.md - 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.overlay,
  },
  ticketDividerLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  // Verification Section
  verificationSection: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  verificationLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  codeContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primarySurface,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderRadius: BorderRadius.md + 4,
    opacity: 0.35,
  },
  codeText: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: Colors.primaryDark,
    letterSpacing: 1.5,
  },
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  clockTime: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
  },
  clockDate: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  verifiedText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.success,
  },
  instructionsText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  closeButton: {
    backgroundColor: Colors.surfaceMuted,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  closeButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
