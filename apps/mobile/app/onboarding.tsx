import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontFamily, Spacing, BorderRadius, Typography, Shadow } from '../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../src/hooks/useTranslation';

import { useAuthStore } from '../src/hooks/useStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    titleKey: 'onboarding_1_title',
    descriptionKey: 'onboarding_1_desc',
    icon: 'bus-outline',
  },
  {
    id: '2',
    titleKey: 'onboarding_2_title',
    descriptionKey: 'onboarding_2_desc',
    icon: 'map-outline',
  },
  {
    id: '3',
    titleKey: 'onboarding_3_title',
    descriptionKey: 'onboarding_3_desc',
    icon: 'shield-checkmark-outline',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { setHasSeenOnboarding } = useAuthStore();
  const { top, bottom } = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      slidesRef.current?.scrollToIndex({ index: nextIndex });
    } else {
      setHasSeenOnboarding(true);
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    setHasSeenOnboarding(true);
    router.replace('/login');
  };

  const renderSlide = useCallback(
    ({ item }: { item: (typeof SLIDES)[number] }) => (
      <View style={styles.slide}>
        <View style={styles.iconGlowContainer}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={item.icon as React.ComponentProps<typeof Ionicons>['name']}
              size={72}
              color={Colors.white}
            />
          </View>
        </View>
        <Text style={styles.title}>{t(item.titleKey)}</Text>
        <Text style={styles.description}>{t(item.descriptionKey)}</Text>
      </View>
    ),
    [t],
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={[styles.skipContainer, { paddingTop: top, alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>{t('skip')}</Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <View style={styles.paginator}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [6, 20, 6],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.25, 1, 0.25],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                style={[styles.dot, { width: dotWidth, opacity }]}
                key={i.toString()}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? t('get_started') : t('next')}
          </Text>
          <Ionicons
            name={isRTL ? 'arrow-back-outline' : 'arrow-forward-outline'}
            size={20}
            color={Colors.white}
            style={{ marginLeft: Spacing.sm }}
          />
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
  skipContainer: {
    paddingHorizontal: Spacing.xl,
    alignItems: 'flex-end', // will be overridden in component if RTL, but default right-aligned
  },
  skipText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: 40,
  },
  iconGlowContainer: {
    width: 190,
    height: 190,
    borderRadius: BorderRadius.circle,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  iconCircle: {
    width: 148,
    height: 148,
    borderRadius: BorderRadius.circle,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: 26,
    color: Colors.secondary,
    marginBottom: Spacing.md,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  paginator: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 4,
    borderRadius: BorderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.glow,
  },
  buttonText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 0.3,
  },
});
