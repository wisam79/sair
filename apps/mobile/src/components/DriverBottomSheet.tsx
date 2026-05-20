import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../theme';
import { useTranslation } from '../hooks/useTranslation';
import * as Haptics from 'expo-haptics';

interface DriverBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  driverName?: string;
  driverRating?: number;
  driverTrips?: number;
  vehicleModel?: string;
  vehiclePlate?: string;
  vehicleCapacity?: number;
  hasAC?: boolean;
  hasWifi?: boolean;
}

export function DriverBottomSheet({
  visible,
  onClose,
  driverName,
  driverRating = 4.8,
  driverTrips = 142,
  vehicleModel,
  vehiclePlate,
  vehicleCapacity = 24,
  hasAC = true,
  hasWifi = true,
}: DriverBottomSheetProps) {
  const { t, isRTL } = useTranslation();

  const displayDriverName = driverName || t('driver_uniride');
  const displayVehicleModel = vehicleModel || t('vehicle_model_default');
  const displayVehiclePlate = vehiclePlate || t('vehicle_plate_default');

  // Helper to render rating stars
  const renderStars = () => {
    const stars = [];
    const floor = Math.floor(driverRating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= floor ? 'star' : i - 0.5 <= driverRating ? 'star-half' : 'star-outline'}
          size={16}
          color={Colors.warning}
        />,
      );
    }
    return stars;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={styles.sheetContainer}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={styles.headerTitle}>{t('driver_vehicle_details')}</Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={22} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.contentScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Driver Identity Card */}
              <View style={[styles.driverCard, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={28} color={Colors.white} />
                </View>
                <View
                  style={[styles.driverMeta, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
                >
                  <Text style={styles.driverName}>{displayDriverName}</Text>
                  <Text style={styles.driverLabel}>{t('driver')}</Text>
                  <View style={[styles.ratingRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <View style={[styles.stars, isRTL && { flexDirection: 'row-reverse' }]}>
                      {renderStars()}
                    </View>
                    <Text style={styles.ratingText}>{driverRating}</Text>
                    <Text style={styles.tripsText}>
                      ({driverTrips} {t('completed_trips_count')})
                    </Text>
                  </View>
                </View>
              </View>

              {/* Vehicle Specifications */}
              <View style={styles.specSection}>
                <View style={[styles.specRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View
                    style={[styles.specItem, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
                  >
                    <Text style={styles.specLabel}>{t('vehicle_model')}</Text>
                    <Text style={styles.specValue}>{displayVehicleModel}</Text>
                  </View>
                  <View
                    style={[styles.specItem, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
                  >
                    <Text style={styles.specLabel}>{t('vehicle_plate')}</Text>
                    <Text style={[styles.specValue, styles.plateText]}>{displayVehiclePlate}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.specRow,
                    { borderBottomWidth: 0 },
                    isRTL && { flexDirection: 'row-reverse' },
                  ]}
                >
                  <View
                    style={[styles.specItem, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
                  >
                    <Text style={styles.specLabel}>{t('vehicle_capacity')}</Text>
                    <Text style={styles.specValue}>
                      {vehicleCapacity} {t(vehicleCapacity === 1 ? 'passenger' : 'passengers')}
                    </Text>
                  </View>
                  <View
                    style={[styles.specItem, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}
                  >
                    <Text style={styles.specLabel}>{t('driver_rating_label')}</Text>
                    <Text style={styles.specValue}>{driverRating} / 5.0</Text>
                  </View>
                </View>
              </View>

              {/* Features Badges */}
              <Text style={[styles.sectionLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('features')}
              </Text>
              <View style={[styles.featuresRow, isRTL && { flexDirection: 'row-reverse' }]}>
                {hasAC && (
                  <View style={[styles.featureBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="snow-outline" size={16} color={Colors.primary} />
                    <Text style={styles.featureText}>{t('ac_active')}</Text>
                  </View>
                )}
                {hasWifi && (
                  <View style={[styles.featureBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Ionicons name="wifi-outline" size={16} color={Colors.primary} />
                    <Text style={styles.featureText}>{t('wifi_free')}</Text>
                  </View>
                )}
                <View style={[styles.featureBadge, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Ionicons name="shield-checkmark-outline" size={16} color={Colors.primary} />
                  <Text style={styles.featureText}>{t('insured_trip')}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl * 1.5,
    borderTopRightRadius: BorderRadius.xl * 1.5,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    maxHeight: '65%',
    ...Shadow.lg,
  },
  dragHandle: {
    width: 42,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  contentScroll: {
    paddingVertical: Spacing.lg,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.primarySurface,
    ...Shadow.sm,
  },
  driverMeta: {
    flex: 1,
    gap: 2,
  },
  driverName: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
  },
  driverLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.text,
  },
  tripsText: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textSecondary,
  },
  specSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  specItem: {
    flex: 1,
    gap: 4,
    paddingHorizontal: Spacing.xs,
  },
  specLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textMuted,
  },
  specValue: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
  },
  plateText: {
    fontFamily: FontFamily.bold,
    color: Colors.secondary,
  },
  sectionLabel: {
    fontFamily: FontFamily.bold,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.primary + '22',
  },
  featureText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.primary,
  },
});
