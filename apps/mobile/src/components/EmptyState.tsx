import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon: IoniconsName;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  iconColor?: string;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  ctaLabel,
  onCta,
  iconColor = Colors.border,
}: EmptyStateProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // Entrance fade
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    // Gentle float
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );

    // Subtle glow pulse behind icon
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1.25,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.0,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
        Animated.parallel([
          Animated.timing(glowScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: Platform.OS !== 'web',
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.35,
            duration: 0,
            useNativeDriver: Platform.OS !== 'web',
          }),
        ]),
      ]),
    );

    bounceLoop.start();
    glowLoop.start();
    return () => {
      bounceLoop.stop();
      glowLoop.stop();
    };
  }, [bounceAnim, glowScale, glowOpacity, fadeIn]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <Animated.View style={{ transform: [{ translateY: bounceAnim }], alignItems: 'center' }}>
        {/* Glow ring */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              borderColor: iconColor + '30',
              backgroundColor: iconColor + '12',
              transform: [{ scale: glowScale }],
              opacity: glowOpacity,
            },
          ]}
        />
        {/* Icon circle */}
        <View style={[styles.iconCircle, { borderColor: iconColor + '50', shadowColor: iconColor }]}>
          <Ionicons name={icon} size={52} color={iconColor} />
        </View>
      </Animated.View>

      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {ctaLabel && onCta ? (
        <TouchableOpacity style={styles.ctaButton} onPress={onCta} activeOpacity={0.85}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  glowRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1.5,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.circle,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySurface,
    marginBottom: Spacing.sm,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 19,
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  ctaButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    ...Shadow.glow,
  },
  ctaText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
