import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, Pressable } from 'react-native';
import { Route } from '@sair/core';
import { Colors, Spacing, BorderRadius, Shadow, FontFamily } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface RouteCardProps {
  item: Route;
  isSubscribed?: boolean;
  driverRating?: number;
  flat?: boolean;
}

export const RouteCard: React.FC<RouteCardProps> = React.memo(
  ({ item, isSubscribed, driverRating, flat = false }) => {
    const { t, isRTL } = useTranslation();
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(16)).current;
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]).start();
    }, [fadeAnim, slideAnim]);

    const handlePressIn = () => {
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 200,
        friction: 14,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 14,
      }).start();
    };

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: '/booking', params: { routeId: item.id } });
    };

    const seatsLow = item.available_seats <= 3;

    return (
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale }] }}
      >
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
          <View style={[styles.card, isRTL && styles.cardRTL, flat && styles.flatCard]}>
            {/* Accent bar with gradient effect */}
            {!flat && (
              <View style={styles.cardAccentWrapper}>
                <View style={styles.cardAccentTop} />
                <View style={styles.cardAccentBottom} />
              </View>
            )}

            <View style={[styles.cardContent, flat && styles.flatCardContent]}>
              {/* Header: Title + Badges */}
              <View style={[styles.cardHeaderRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text
                  style={[styles.routeName, { textAlign: isRTL ? 'right' : 'left', flex: 1 }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {isSubscribed && (
                  <View style={styles.subscribedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
                    <Text style={styles.subscribedText}>{t('subscribed')}</Text>
                  </View>
                )}
                {driverRating && (
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Colors.warning} />
                    <Text style={styles.ratingText}>{driverRating}</Text>
                  </View>
                )}
              </View>

              {/* From → To Timeline Path */}
              <View style={[styles.routePathContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.timelineTrack}>
                  <View style={styles.startDot}>
                    <View style={styles.startDotInner} />
                  </View>
                  <View style={styles.verticalConnector} />
                  <Ionicons name="location" size={14} color={Colors.error} />
                </View>
                <View style={styles.routeDetails}>
                  <Text
                    style={[styles.routeStopText, { textAlign: isRTL ? 'right' : 'left' }]}
                    numberOfLines={1}
                  >
                    {item.start_location}
                  </Text>
                  <View style={{ height: Spacing.sm }} />
                  <Text
                    style={[styles.routeStopText, { textAlign: isRTL ? 'right' : 'left' }]}
                    numberOfLines={1}
                  >
                    {item.end_location}
                  </Text>
                </View>
              </View>

              {/* Schedule */}
              <View style={[styles.scheduleRow, isRTL && { flexDirection: 'row-reverse' }]}>
                {item.departure_time && (
                  <View
                    style={[
                      styles.timeBadge,
                      flat && styles.flatTimeBadge,
                      isRTL && { flexDirection: 'row-reverse' },
                    ]}
                  >
                    <Ionicons name="sunny-outline" size={14} color={Colors.warning} />
                    <Text style={styles.timeText}>
                      {t('departure')}: {item.departure_time.substring(0, 5)}
                    </Text>
                  </View>
                )}
                {item.return_time && (
                  <View
                    style={[
                      styles.timeBadge,
                      flat && styles.flatTimeBadge,
                      isRTL && { flexDirection: 'row-reverse' },
                    ]}
                  >
                    <Ionicons name="moon-outline" size={14} color={Colors.secondary} />
                    <Text style={styles.timeText}>
                      {t('return')}: {item.return_time.substring(0, 5)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Footer */}
              <View style={[styles.cardFooter, isRTL && { flexDirection: 'row-reverse' }]}>
                <View
                  style={[
                    styles.seatBadge,
                    seatsLow && styles.seatBadgeLow,
                    isRTL && { flexDirection: 'row-reverse' },
                  ]}
                >
                  <Ionicons
                    name="people-outline"
                    size={13}
                    color={seatsLow ? Colors.warning : Colors.primary}
                  />
                  <Text style={[styles.seatText, seatsLow && styles.seatTextLow]}>
                    {item.available_seats} {t('seat')}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    {item.price.toLocaleString()} {t('currency')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.md,
  },
  cardRTL: {
    flexDirection: 'row-reverse',
  },
  cardAccentWrapper: {
    width: 5,
    overflow: 'hidden',
  },
  cardAccentTop: {
    flex: 1,
    backgroundColor: Colors.primaryDeep,
  },
  cardAccentBottom: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  routeName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  subscribedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    gap: 3,
    ...Shadow.sm,
  },
  subscribedText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningSurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    gap: 3,
    borderWidth: 1,
    borderColor: Colors.warning + '25',
  },
  ratingText: {
    color: Colors.warning,
    fontFamily: FontFamily.bold,
    fontSize: 10,
  },
  routePathContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginVertical: Spacing.sm,
    gap: Spacing.md,
  },
  timelineTrack: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    width: 18,
  },
  startDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  startDotInner: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  verticalConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 3,
    borderRadius: 1,
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  routeStopText: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    marginTop: Spacing.xs,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceMuted,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  timeText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
    marginTop: Spacing.xs,
  },
  seatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
  seatBadgeLow: {
    backgroundColor: Colors.warningSurface,
  },
  seatText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.primary,
  },
  seatTextLow: {
    color: Colors.warning,
  },
  priceContainer: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.pill,
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.primaryDeep,
  },
  flatCard: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    elevation: 0,
  },
  flatCardContent: {
    padding: Spacing.md,
  },
  flatTimeBadge: {
    backgroundColor: Colors.white,
  },
});
