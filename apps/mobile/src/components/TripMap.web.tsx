import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';

interface TripMapProps {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  driverLat: number | null;
  driverLng: number | null;
  mapStyle?: 'streets' | 'dark' | 'satellite';
}

export const TripMap: React.FC<TripMapProps> = ({
  startLat,
  startLng,
  endLat,
  endLng,
  driverLat,
  driverLng,
  mapStyle = 'streets',
}) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: Colors.surface }]}>
      <View style={styles.placeholder}>
        <Ionicons
          name="map-outline"
          size={48}
          color={Colors.primary}
          style={{ marginBottom: 12 }}
        />
        <Text style={[styles.text, { color: Colors.text }]}>{t('map_view') || 'Trip Map'}</Text>
        <Text style={[styles.subtext, { color: Colors.textMuted }]}>
          {startLat.toFixed(4)}, {startLng.toFixed(4)} → {endLat.toFixed(4)}, {endLng.toFixed(4)}
        </Text>
        {driverLat !== null && driverLng !== null && (
          <Text style={[styles.driverText, { color: Colors.success }]}>
            ● {t('driver_location') || 'Driver Active'}: {driverLat.toFixed(4)},{' '}
            {driverLng.toFixed(4)}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 200,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtext: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.8,
  },
  driverText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
});
