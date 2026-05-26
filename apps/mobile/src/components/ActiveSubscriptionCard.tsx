import React, { useRef } from 'react';
import { StyleSheet, Text, View, Animated, Pressable } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadow, FontFamily } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import { Subscription } from '@sair/core';

interface ActiveSubscriptionCardProps {
  activeSub: Partial<Subscription> & {
    routes?: {
      title?: string;
    } | null;
  };
  onTrackTrip: () => void;
}

export const ActiveSubscriptionCard: React.FC<ActiveSubscriptionCardProps> = React.memo(
  ({ activeSub, onTrackTrip }) => {
    const { t, isRTL, language } = useTranslation();
    const router = useRouter();
    const scale = useRef(new Animated.Value(1)).current;

    if (!activeSub.end_date) return null;

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
      router.push('/subscriptions');
    };

    const handleTrackPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onTrackTrip();
    };

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
          <View style={[styles.activeSubCard, isRTL && { flexDirection: 'row-reverse' }]}>
            {/* Status Glow Indicator */}
            <View style={styles.glowAccent} />

            <View style={styles.activeSubIcon}>
              <Ionicons name="checkmark-circle" size={26} color={Colors.success} />
            </View>
            <View style={[styles.activeSubInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.activeSubTitle}>{t('active_subscription')}</Text>
              <Text style={styles.activeSubRoute} numberOfLines={1}>
                {activeSub.routes?.title || t('route')}
              </Text>
              <View style={[styles.activeSubFooter, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.dateBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="calendar-outline" size={11} color={Colors.textMuted} />
                  <Text style={styles.activeSubDate}>
                    {t('expires')}:{' '}
                    {new Date(activeSub.end_date).toLocaleDateString(
                      language === 'ar' ? 'ar-IQ' : 'en-US',
                    )}
                  </Text>
                </View>
              </View>
            </View>
            <Pressable style={styles.trackMiniButton} onPress={handleTrackPress}>
              <Ionicons name="navigate" size={18} color={Colors.white} />
            </Pressable>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  activeSubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    borderColor: Colors.success + '50',
    overflow: 'hidden',
    ...Shadow.md,
  },
  glowAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: Colors.success,
    borderTopLeftRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.xl,
  },
  activeSubIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.successSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.success + '20',
  },
  activeSubInfo: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },
  activeSubTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  activeSubRoute: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.text,
    marginVertical: 3,
  },
  activeSubFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activeSubDate: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  trackMiniButton: {
    backgroundColor: Colors.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.colored,
  },
});
