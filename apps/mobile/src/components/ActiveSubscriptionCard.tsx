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
            <View
              style={[
                styles.glowAccent,
                isRTL
                  ? { right: 0, borderTopRightRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl }
                  : { left: 0, borderTopLeftRadius: BorderRadius.xl, borderBottomLeftRadius: BorderRadius.xl },
              ]}
            />

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
              <Ionicons name="navigate" size={18} color={Colors.primaryDeep} />
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
    backgroundColor: Colors.primaryDeep,
    padding: Spacing.md + 2,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.25)', // primaryLight border opacity
    overflow: 'hidden',
    ...Shadow.lg,
    elevation: 4,
  },
  glowAccent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: Colors.primaryLight,
  },
  activeSubIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  activeSubInfo: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },
  activeSubTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
    color: Colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  activeSubRoute: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
    marginVertical: 4,
  },
  activeSubFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activeSubDate: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  trackMiniButton: {
    backgroundColor: Colors.white,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});
