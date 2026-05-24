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
        toValue: 0.98,
        useNativeDriver: true,
        tension: 150,
        friction: 12,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 12,
      }).start();
    };

    const handlePress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.push({ pathname: '/booking', params: { routeId: item.id } });
    };

    return (
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale }] }}
      >
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
          <View style={[styles.card, isRTL && styles.cardRTL, flat && styles.flatCard]}>
            {/* Orange accent bar */}
            {!flat && <View style={styles.cardAccent} />}

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
                  <Ionicons name="radio-button-on" size={13} color={Colors.primary} />
                  <View style={styles.verticalConnector} />
                  <Ionicons name="location" size={13} color={Colors.secondary} />
                </View>
                <View style={styles.routeDetails}>
                  <Text
                    style={[styles.routeStopText, { textAlign: isRTL ? 'right' : 'left' }]}
                    numberOfLines={1}
                  >
                    {item.start_location}
                  </Text>
                  <View style={{ height: Spacing.xs }} />
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
                <View style={[styles.seatBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="people-outline" size={13} color={Colors.primary} />
                  <Text style={styles.seatText}>
                    {item.available_seats} {t('seat')}
                  </Text>
                </View>
                <Text style={styles.price}>
                  {item.price.toLocaleString()} {t('currency')}
                </Text>
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
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Translucent glass card background
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Light reflection border
    ...Shadow.md,
  },
  cardRTL: {
    flexDirection: 'row-reverse',
  },
  cardAccent: {
    width: 4,
    backgroundColor: Colors.primary,
  },
  cardContent: {
    flex: 1,
    padding: Spacing.md,
  },
  routeName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
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
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 2,
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
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
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
    gap: Spacing.sm,
  },
  timelineTrack: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    width: 16,
  },
  verticalConnector: {
    width: 1.5,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginVertical: 2,
  },
  routeDetails: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  routeStopText: {
    fontFamily: FontFamily.medium,
    fontSize: 13.5,
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
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Translucent time badge
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  seatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.pill,
  },
  seatText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.primary,
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.success,
  },
  flatCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Translucent flat nested card
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: BorderRadius.md,
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
});
