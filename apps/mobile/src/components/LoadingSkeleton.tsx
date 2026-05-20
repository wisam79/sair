import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadow } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Shimmer Base ─────────────────────────────────────────────────────────────

interface ShimmerBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}

function ShimmerBox({ width, height, borderRadius = 6, style }: ShimmerBoxProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.75],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: Colors.border,
          opacity,
        },
        style,
      ]}
    />
  );
}

// ─── RouteCard Skeleton ────────────────────────────────────────────────────────

export function RouteCardSkeleton() {
  return (
    <View style={styles.routeCard}>
      {/* Accent bar */}
      <View style={styles.routeAccent} />
      <View style={styles.routeContent}>
        {/* Route name */}
        <ShimmerBox width="60%" height={16} borderRadius={6} style={{ marginBottom: 10 }} />
        {/* From */}
        <View style={styles.row}>
          <ShimmerBox width={12} height={12} borderRadius={6} />
          <ShimmerBox width="70%" height={13} borderRadius={5} />
        </View>
        <View style={{ height: 4 }} />
        {/* To */}
        <View style={styles.row}>
          <ShimmerBox width={12} height={12} borderRadius={6} />
          <ShimmerBox width="55%" height={13} borderRadius={5} />
        </View>
        {/* Footer */}
        <View style={[styles.row, { marginTop: 14, justifyContent: 'space-between' }]}>
          <ShimmerBox width={80} height={26} borderRadius={13} />
          <ShimmerBox width={70} height={16} borderRadius={5} />
        </View>
      </View>
    </View>
  );
}

// ─── Subscription Card Skeleton ────────────────────────────────────────────────

export function SubscriptionCardSkeleton() {
  return (
    <View style={styles.subCard}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <ShimmerBox width={80} height={24} borderRadius={12} />
        <ShimmerBox width="45%" height={16} borderRadius={6} />
      </View>
      <View style={{ marginBottom: 12 }}>
        <View style={styles.row}>
          <ShimmerBox width={10} height={10} borderRadius={5} />
          <ShimmerBox width="65%" height={13} borderRadius={5} />
        </View>
        <View style={{ height: 4 }} />
        <View style={styles.row}>
          <ShimmerBox width={10} height={10} borderRadius={5} />
          <ShimmerBox width="50%" height={13} borderRadius={5} />
        </View>
      </View>
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        <ShimmerBox width={100} height={14} borderRadius={5} />
        <ShimmerBox width={90} height={14} borderRadius={5} />
      </View>
    </View>
  );
}

// ─── Chat Item Skeleton ────────────────────────────────────────────────────────

export function ChatItemSkeleton() {
  return (
    <View style={styles.chatItem}>
      <ShimmerBox width={44} height={44} borderRadius={22} />
      <View style={{ flex: 1, gap: 6 }}>
        <ShimmerBox width="50%" height={14} borderRadius={5} />
        <ShimmerBox width="80%" height={12} borderRadius={5} />
      </View>
      <ShimmerBox width={35} height={11} borderRadius={4} />
    </View>
  );
}

// ─── Trip Card Skeleton (Driver) ───────────────────────────────────────────────

export function TripCardSkeleton() {
  return (
    <View style={styles.tripCard}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 14 }]}>
        <ShimmerBox width={110} height={28} borderRadius={14} />
        <ShimmerBox width={80} height={14} borderRadius={5} />
      </View>
      <View style={styles.tripRoute}>
        <ShimmerBox width={24} height={24} borderRadius={12} />
        <ShimmerBox width="70%" height={16} borderRadius={6} />
      </View>
      <ShimmerBox width="100%" height={44} borderRadius={10} style={{ marginTop: 12 }} />
    </View>
  );
}

// ─── Generic List ──────────────────────────────────────────────────────────────

/** @deprecated Use specific skeleton variants instead */
export function LoadingCard() {
  return <RouteCardSkeleton />;
}

export function LoadingList({
  count = 3,
  variant = 'route',
}: {
  count?: number;
  variant?: 'route' | 'subscription' | 'chat' | 'trip';
}) {
  const Comp =
    variant === 'subscription'
      ? SubscriptionCardSkeleton
      : variant === 'chat'
        ? ChatItemSkeleton
        : variant === 'trip'
          ? TripCardSkeleton
          : RouteCardSkeleton;

  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <Comp key={i} />
      ))}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  // Route Card
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadow.md,
  },
  routeAccent: {
    width: 4,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  routeContent: {
    flex: 1,
    padding: Spacing.md,
  },

  // Subscription Card
  subCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },

  // Chat Item
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  // Trip Card (driver)
  tripCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceMuted,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
});
