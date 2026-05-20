import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Alert, Linking, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../hooks/useStore';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Colors, Spacing, BorderRadius, Shadow, FontFamily } from '../theme';
import { useTranslation } from '../hooks/useTranslation';

interface SOSButtonProps {
  tripId: string;
}

export const SOSButton: React.FC<SOSButtonProps> = ({ tripId }) => {
  const { t, isRTL } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const [scaleValue] = useState(new Animated.Value(1));
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isPressing) {
      animation = Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]);
      animation.start();
    } else {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isPressing, scaleValue]);

  const handleSOSPressIn = () => {
    setIsPressing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSOSPressOut = () => {
    setIsPressing(false);
  };

  const triggerSOS = async () => {
    setIsPressing(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    try {
      // 1. Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 2. Report to DB
      if (user) {
        await supabase.from('emergency_reports').insert({
          trip_id: tripId,
          reporter_id: user.id,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }

      // 3. Dial Emergency (911 for Iraq as specified by user)
      Linking.openURL('tel:911');
    } catch (error) {
      console.warn('SOS Error:', error);
      Alert.alert(t('error'), t('emergency_failed_call_directly'));
      Linking.openURL('tel:911');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPressIn={handleSOSPressIn}
        onPressOut={handleSOSPressOut}
        onLongPress={triggerSOS}
        delayLongPress={3000} // 3 seconds to trigger
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.button,
            { transform: [{ scale: scaleValue }] },
            isRTL && { flexDirection: 'row-reverse' },
          ]}
        >
          <Ionicons name="warning" size={24} color={Colors.white} />
          <Text style={styles.text}>{t('sos_button')}</Text>
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.hint}>{t('sos_hint')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  button: {
    backgroundColor: Colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  text: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
  },
  hint: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
});
