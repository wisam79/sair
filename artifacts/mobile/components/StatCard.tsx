import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useColors } from '@/hooks/useColors';
import FeatherIcon from '@/components/FeatherIcon';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: string;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onPress?: () => void;
  compact?: boolean;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  iconColor,
  trend,
  trendValue,
  onPress,
  compact = false,
}: StatCardProps) {
  const colors = useColors();

  const formattedValue = typeof value === 'number' ? value.toLocaleString('ar-IQ') : value;

  const renderContent = () => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        compact && styles.compactCard,
      ]}
    >
      {trend && (
        <View
          style={[
            styles.trendBadge,
            {
              backgroundColor:
                trend === 'up'
                  ? colors.success + '20'
                  : trend === 'down'
                    ? colors.destructive + '20'
                    : colors.muted + '20',
            },
          ]}
        >
          <Text
            style={[
              styles.trendText,
              {
                color:
                  trend === 'up'
                    ? colors.success
                    : trend === 'down'
                      ? colors.destructive
                      : colors.muted,
              },
            ]}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
          </Text>
        </View>
      )}

      <View style={[styles.contentRow, compact && styles.compactRow]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: (iconColor || colors.primary) + '15' },
            compact ? styles.compactIcon : styles.standardIcon,
          ]}
        >
          <FeatherIcon name={icon} size={compact ? 16 : 20} color={iconColor || colors.primary} />
        </View>

        <View style={[styles.textContainer, compact && styles.compactTextContainer]}>
          <View style={styles.valueRow}>
            <Text
              style={[
                styles.value,
                { color: colors.text, fontFamily: 'Inter_700Bold' },
                compact ? styles.compactValue : styles.standardValue,
              ]}
            >
              {formattedValue}
            </Text>
            {unit && <Text style={[styles.unit, { color: colors.muted }]}> {unit}</Text>}
          </View>
          <Text style={[styles.label, { color: colors.muted, fontFamily: 'Inter_400Regular' }]}>
            {label}
          </Text>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.container}>
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  compactCard: {
    padding: 12,
  },
  contentRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  compactRow: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  standardIcon: {
    width: 36,
    height: 36,
    marginLeft: 12,
  },
  compactIcon: {
    width: 28,
    height: 28,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  compactTextContainer: {
    flexDirection: 'column',
  },
  valueRow: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
  },
  value: {
    writingDirection: 'rtl',
  },
  standardValue: {
    fontSize: 22,
  },
  compactValue: {
    fontSize: 18,
  },
  unit: {
    fontSize: 12,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    writingDirection: 'rtl',
  },
  trendBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 1,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default StatCard;
