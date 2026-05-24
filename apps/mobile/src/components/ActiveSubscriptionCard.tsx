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
            <View style={styles.activeSubIcon}>
              <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
            </View>
            <View style={[styles.activeSubInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.activeSubTitle}>{t('active_subscription')}</Text>
              <Text style={styles.activeSubRoute} numberOfLines={1}>
                {activeSub.routes?.title || t('route')}
              </Text>
              <View style={[styles.activeSubFooter, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.activeSubDate}>
                  {t('expires')}:{' '}
                  {new Date(activeSub.end_date).toLocaleDateString(
                    language === 'ar' ? 'ar-IQ' : 'en-US',
                  )}
                </Text>
              </View>
            </View>
            <Pressable style={styles.trackMiniButton} onPress={handleTrackPress}>
              <Ionicons name="navigate" size={20} color={Colors.white} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.72)', // Translucent glass card background
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Light reflection edge
    ...Shadow.md,
  },
  activeSubIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.successSurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.sm,
  },
  activeSubInfo: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },
  activeSubTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeSubRoute: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
    marginVertical: 2,
  },
  activeSubFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeSubDate: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    color: Colors.textMuted,
  },
  trackMiniButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
