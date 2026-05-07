import { NotificationBanner } from '@/components/NotificationBanner';
import { BlurView } from 'expo-blur';
import { Redirect, Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, StyleSheet, View, useColorScheme } from 'react-native';

import { useAuthStore, useNotificationStore } from '@/stores';
import { useColors } from '@/hooks/useColors';

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const { appNotifications: notifications, dismissNotification } = useNotificationStore();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';

  if (!isAuthenticated) return <Redirect href="/onboarding" />;

  return (
    <View style={{ flex: 1 }}>
      {notifications.length > 0 && (
        <NotificationBanner
          message={notifications[0].message}
          type={notifications[0].type}
          visible={true}
          onDismiss={() => dismissNotification(notifications[0].id)}
        />
      )}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isIOS ? 'transparent' : colors.card,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 4,
            height: 64,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
          },
          tabBarBackground: () =>
            isIOS ? (
              <BlurView
                intensity={100}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
            ) : null,
          tabBarLabelStyle: {
            fontFamily: 'Inter_500Medium',
            fontSize: 12,
            letterSpacing: -0.2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'الرئيسية',
            tabBarIcon: ({ color, focused }) => {
              const size = focused ? 24 : 22;
              return <SymbolView name="house.fill" tintColor={color} size={size} />;
            },
          }}
        />
        <Tabs.Screen
          name="trips"
          options={{
            title: 'السفرات',
            tabBarIcon: ({ color, focused }) => {
              const size = focused ? 24 : 22;
              return <SymbolView name="map.fill" tintColor={color} size={size} />;
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'الملف',
            tabBarIcon: ({ color, focused }) => {
              const size = focused ? 24 : 22;
              return <SymbolView name="person.fill" tintColor={color} size={size} />;
            },
          }}
        />
      </Tabs>
    </View>
  );
}
