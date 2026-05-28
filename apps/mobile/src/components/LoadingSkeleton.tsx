import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from 'react-native';
import { Colors, BorderRadius, Spacing, Shadow } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Shimmer Base ─────────────────────────────────────────────────────────────
// Uses a sliding translateX wave for a premium "content loading" feel
// identical to the Facebook / Instagram skeleton effect.

interface ShimmerBoxProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
  delay?: number;
}

function ShimmerBox({ width, height, borderRadius = 8, style, delay = 0 }: ShimmerBoxProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1100,
          easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1100,
          easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer, delay]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.65, 0.3],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: '#DDD8D2',
          opacity,
          overflow: 'hidden',
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

export function SubscriptionCardSkeleton({ index = 0 }: { index?: number }) {
  const d = index * 120;
  return (
    <View style={styles.subCard}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 12 }]}>
        <ShimmerBox width={80} height={24} borderRadius={12} delay={d} />
        <ShimmerBox width="45%" height={16} borderRadius={6} delay={d + 80} />
      </View>
      <View style={{ marginBottom: 12, backgroundColor: '#F8F6F3', borderRadius: 8, padding: 10, gap: 6 }}>
        <View style={styles.row}>
          <ShimmerBox width={10} height={10} borderRadius={5} delay={d + 100} />
          <ShimmerBox width="65%" height={13} borderRadius={5} delay={d + 100} />
        </View>
        <View style={{ height: 4 }} />
        <View style={styles.row}>
          <ShimmerBox width={10} height={10} borderRadius={5} delay={d + 160} />
          <ShimmerBox width="50%" height={13} borderRadius={5} delay={d + 160} />
        </View>
      </View>
      <View style={[styles.row, { justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0EDE8' }]}>
        <ShimmerBox width={100} height={14} borderRadius={5} delay={d + 200} />
        <ShimmerBox width={90} height={14} borderRadius={5} delay={d + 240} />
      </View>
      <View style={[styles.row, { marginTop: 12, gap: 8 }]}>
        <ShimmerBox width="48%" height={36} borderRadius={8} delay={d + 280} />
        <ShimmerBox width="48%" height={36} borderRadius={8} delay={d + 320} />
      </View>
    </View>
  );
}

// ─── Profile & Stat Skeletons ──────────────────────────────────────────────────

export function ProfileCardSkeleton() {
  return (
    <View style={styles.profileCard}>
      <ShimmerBox width={80} height={80} borderRadius={40} />
      <ShimmerBox width="40%" height={20} borderRadius={10} style={{ marginTop: 16 }} />
      <ShimmerBox width="30%" height={14} borderRadius={7} style={{ marginTop: 8 }} />
    </View>
  );
}

export function StatWidgetSkeleton() {
  return (
    <View style={styles.statWidget}>
      <ShimmerBox width={40} height={40} borderRadius={20} />
      <ShimmerBox width="60%" height={16} borderRadius={8} style={{ marginTop: 12 }} />
    </View>
  );
}

// ─── Chat Item Skeleton ────────────────────────────────────────────────────────

export function ChatItemSkeleton({ index = 0 }: { index?: number }) {
  return (
    <View style={styles.chatItem}>
      <ShimmerBox width={44} height={44} borderRadius={22} delay={index * 100} />
      <View style={{ flex: 1, gap: 6 }}>
        <ShimmerBox width="50%" height={14} borderRadius={5} delay={index * 100 + 50} />
        <ShimmerBox width="80%" height={12} borderRadius={5} delay={index * 100 + 50} />
      </View>
      <ShimmerBox width={35} height={11} borderRadius={4} delay={index * 100 + 100} />
    </View>
  );
}

// ─── Trip Card Skeleton (Driver) ───────────────────────────────────────────────

export function TripCardSkeleton({ index = 0 }: { index?: number }) {
  const d = index * 100;
  return (
    <View style={styles.tripCard}>
      <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 14 }]}>
        <ShimmerBox width={110} height={28} borderRadius={14} delay={d} />
        <ShimmerBox width={80} height={14} borderRadius={5} delay={d} />
      </View>
      <View style={styles.tripRoute}>
        <ShimmerBox width={24} height={24} borderRadius={12} delay={d + 50} />
        <ShimmerBox width="70%" height={16} borderRadius={6} delay={d + 50} />
      </View>
      <ShimmerBox width="100%" height={44} borderRadius={10} style={{ marginTop: 12 }} delay={d + 100} />
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
  variant?: 'route' | 'subscription' | 'chat' | 'trip' | 'profile';
}) {
  const Comp =
    variant === 'subscription'
      ? SubscriptionCardSkeleton
      : variant === 'chat'
        ? ChatItemSkeleton
        : variant === 'trip'
          ? TripCardSkeleton
          : variant === 'profile'
            ? ProfileCardSkeleton
            : RouteCardSkeleton;

  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <Comp key={i} index={i} />
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
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.md,
  },
  routeAccent: {
    width: 5,
    backgroundColor: Colors.borderLight,
  },
  routeContent: {
    flex: 1,
    padding: Spacing.lg,
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
    paddingVertical: Spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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

  // Profile Card
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    alignItems: 'center',
    ...Shadow.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    width: '100%',
  },

  // Stat Widget
  statWidget: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.sm,
  },
});
