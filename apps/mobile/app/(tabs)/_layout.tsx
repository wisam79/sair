import React, { useEffect, useRef } from 'react';
import { Tabs, useRouter, type Href } from 'expo-router';
import { View, Animated, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/hooks/useStore';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useUnreadCount } from '../../src/hooks/useUnreadCount';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, Shadow, Spacing } from '../../src/theme';
import * as Haptics from 'expo-haptics';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface AnimatedTabIconProps {
  name: IoniconsName;
  color: string;
  focused: boolean;
}

function AnimatedTabIcon({ name, color, focused }: AnimatedTabIconProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const isFirst = useRef(true);

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.18, useNativeDriver: true, speed: 50, bounciness: 10 }),
        Animated.spring(scale, { toValue: 1.0, useNativeDriver: true, speed: 28, bounciness: 5 }),
      ]).start();

      if (!isFirst.current) {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        isFirst.current = false;
      }
    }
  }, [focused, scale]);

  const activeName = focused
    ? name.endsWith('-outline')
      ? (name.replace('-outline', '') as IoniconsName)
      : name
    : name;

  return (
    <View style={[tabStyles.iconWrapper, focused && tabStyles.activeWrapper]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={activeName} size={21} color={focused ? Colors.primary : Colors.textMuted} />
      </Animated.View>
      {focused && <View style={tabStyles.activeDot} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activeWrapper: {
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  activeDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
});

export default function TabLayout() {
  const { role } = useAuthStore();
  const { t, isRTL } = useTranslation();
  const unreadCount = useUnreadCount();
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  const isDriver = role === 'driver';

  const screens: {
    name: string;
    options: React.ComponentProps<typeof Tabs.Screen>['options'];
  }[] = [
    {
      name: 'index',
      options: {
        title: t('home'),
        headerShown: false,
        href: isDriver ? null : ('/(tabs)' as Href),
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <AnimatedTabIcon name="home-outline" color={color} focused={focused} />
        ),
      },
    },
    {
      name: 'driver',
      options: {
        title: t('driver_dashboard'),
        headerShown: false,
        href: isDriver ? ('/(tabs)/driver' as Href) : null,
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <AnimatedTabIcon name="car-outline" color={color} focused={focused} />
        ),
      },
    },
    {
      name: 'subscriptions',
      options: {
        title: t('my_subscriptions'),
        headerShown: false,
        href: isDriver ? null : ('/(tabs)/subscriptions' as Href),
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <AnimatedTabIcon name="ticket-outline" color={color} focused={focused} />
        ),
      },
    },
    {
      name: 'chat',
      options: {
        title: t('messages'),
        headerShown: false,
        tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <AnimatedTabIcon name="chatbubbles-outline" color={color} focused={focused} />
        ),
      },
    },
    {
      name: 'profile',
      options: {
        title: t('account'),
        headerShown: false,
        tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
          <AnimatedTabIcon name="person-outline" color={color} focused={focused} />
        ),
      },
    },
  ];

  const orderedScreens = isRTL ? [...screens].reverse() : screens;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          height: 62 + bottom,
          paddingBottom: bottom + 8,
          paddingTop: 10,
          ...Shadow.lg,
        },
        tabBarLabelStyle: {
          fontFamily: FontFamily.medium,
          fontSize: 10.5,
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.surfaceMuted,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: FontFamily.bold,
          color: Colors.secondary,
          fontSize: 18,
        },
        headerShadowVisible: false,
        tabBarBadgeStyle: {
          backgroundColor: Colors.error,
          fontFamily: FontFamily.bold,
          fontSize: 9,
          minWidth: 16,
          height: 16,
          lineHeight: 14,
          borderRadius: 8,
        },
        headerRight: () => (
          <TouchableOpacity
            style={isRTL ? { marginLeft: Spacing.lg } : { marginRight: Spacing.lg }}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.7}
          >
            <View style={{ position: 'relative', padding: 4 }}>
              <Ionicons name="notifications-outline" size={24} color={Colors.secondary} />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    backgroundColor: Colors.error,
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 3,
                    borderWidth: 2,
                    borderColor: Colors.white,
                  }}
                >
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: 8,
                      fontFamily: FontFamily.bold,
                      lineHeight: 10,
                    }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
      }}
    >
      {orderedScreens.map((screen) => (
        <Tabs.Screen key={screen.name} name={screen.name} options={screen.options} />
      ))}
    </Tabs>
  );
}
