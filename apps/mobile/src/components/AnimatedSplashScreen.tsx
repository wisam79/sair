import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme';

const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationFinished: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onAnimationFinished,
}) => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-40)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const pathProgress = useRef(new Animated.Value(0)).current;
  const carPosition = useRef(new Animated.Value(0)).current;
  const carOpacity = useRef(new Animated.Value(0)).current;

  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Run the animation sequence
    Animated.sequence([
      // 1. Fade in and spring-scale the logo icon
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      // 2. Fade in and slide up text, fade in the car, and animate the path/car
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(carOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pathProgress, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false, // width/layout animations cannot use native driver
        }),
        Animated.timing(carPosition, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true, // translate properties can use native driver
        }),
      ]),
      // 3. Pause momentarily for visual premium feel
      Animated.delay(800),
      // 4. Smooth fade out of the entire splash screen
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Callback to root layout to unmount this screen
      onAnimationFinished();
    });
  }, [
    logoScale,
    logoOpacity,
    logoTranslateY,
    textOpacity,
    textTranslateY,
    pathProgress,
    carPosition,
    carOpacity,
    splashOpacity,
    onAnimationFinished,
  ]);

  // Interpolate car movement (from -60px to 60px)
  const carTranslateX = carPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-65, 55],
  });

  // Interpolate path line width
  const lineWidth = pathProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  return (
    <Animated.View style={[styles.container, { opacity: splashOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.backgroundDark} />

      <View style={styles.centerContent}>
        {/* Animated Brand Logo/Symbol */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { translateY: logoTranslateY }],
            },
          ]}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="navigate" size={42} color={Colors.white} />
          </View>
        </Animated.View>

        {/* Animated Brand Name & Subtitle */}
        <Animated.View
          style={[
            styles.textWrapper,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandArabic}>سير</Text>
          <Text style={styles.brandEnglish}>Sair</Text>
          <Text style={styles.subtitle}>منصة النقل الذكي للجامعة</Text>
        </Animated.View>

        {/* Smart Transit Route Animation */}
        <View style={styles.transitWrapper}>
          {/* Background gray line */}
          <View style={styles.trackLineBackground} />
          {/* Animated active path line */}
          <Animated.View style={[styles.trackLineActive, { width: lineWidth }]} />
          {/* Moving car icon */}
          <Animated.View
            style={[
              styles.carWrapper,
              {
                opacity: carOpacity,
                transform: [{ translateX: carTranslateX }],
              },
            ]}
          >
            <Ionicons name="car-sport" size={16} color={Colors.primary} />
          </Animated.View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>v2.0.0</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999, // Ensure it sits on top of all other components
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // Premium glassmorphism shadow
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  textWrapper: {
    alignItems: 'center',
  },
  brandArabic: {
    fontFamily: 'Gulzar_400Regular',
    fontSize: 54,
    color: Colors.primary,
    lineHeight: 64,
    textAlign: 'center',
  },
  brandEnglish: {
    fontFamily: 'IBMPlexSansArabic_700Bold',
    fontSize: 22,
    color: Colors.white,
    letterSpacing: 2,
    marginTop: -8,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 10,
    textAlign: 'center',
  },
  transitWrapper: {
    width: 120,
    height: 30,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackLineBackground: {
    position: 'absolute',
    width: 120,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#333333',
  },
  trackLineActive: {
    position: 'absolute',
    left: 0,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.primary,
  },
  carWrapper: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondaryDark,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  footer: {
    paddingBottom: 30,
  },
  versionText: {
    fontFamily: 'IBMPlexSansArabic_400Regular',
    color: '#555555',
    fontSize: 12,
  },
});
