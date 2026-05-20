import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../src/lib/supabase';
import { useTranslation } from '../src/hooks/useTranslation';
import { useAuthStore } from '../src/hooks/useStore';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';

interface PayoutRecord {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  reference_note?: string;
}

export default function PayoutsScreen() {
  const [balanceData, setBalanceData] = useState({
    available_balance: 0,
    total_earned: 0,
    total_paid: 0,
  });
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      // 1. Get Balance
      const { data: balData, error: balError } = await supabase.rpc('get_driver_balance');
      if (balError) throw balError;

      if (balData && balData.length > 0) {
        setBalanceData({
          available_balance: Number(balData[0].available_balance) || 0,
          total_earned: Number(balData[0].total_earned) || 0,
          total_paid: Number(balData[0].total_paid) || 0,
        });
      }

      // 2. Get Driver ID for this user
      const { data: driverData } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (driverData) {
        // 3. Get Payout History
        const { data: histData, error: histError } = await supabase
          .from('driver_payouts')
          .select('*')
          .eq('driver_id', driverData.id)
          .order('created_at', { ascending: false });

        if (histError) throw histError;
        setPayouts(histData || []);
      }
    } catch (err: unknown) {
      console.error(err);
      Alert.alert(t('error'), err instanceof Error ? err.message : t('something_went_wrong'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRequestPayout = async () => {
    if (balanceData.available_balance <= 0) return;

    Alert.alert(t('request_payout_title'), t('request_payout_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('confirm_request'),
        onPress: async () => {
          setRequesting(true);
          try {
            const { error } = await supabase.rpc('request_payout', {
              p_amount: balanceData.available_balance,
            });
            if (error) throw error;

            Alert.alert(t('success'), t('payout_submitted_success'));
            fetchData();
          } catch (err: unknown) {
            Alert.alert(t('error'), err instanceof Error ? err.message : t('something_went_wrong'));
          } finally {
            setRequesting(false);
          }
        },
      },
    ]);
  };

  const renderItem = useCallback(
    ({ item }: { item: PayoutRecord }) => {
      const statusColors = {
        pending: Colors.warning,
        completed: Colors.success,
        rejected: Colors.error,
      };
      const statusBgColors = {
        pending: Colors.warningSurface,
        completed: Colors.successSurface,
        rejected: Colors.errorSurface,
      };

      const statusLabel = t(`payout_${item.status}`);
      const color = statusColors[item.status as keyof typeof statusColors] || Colors.textSecondary;
      const bg = statusBgColors[item.status as keyof typeof statusBgColors] || Colors.surfaceMuted;

      const date = new Date(item.created_at).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      return (
        <View style={styles.payoutCard}>
          <View style={[styles.payoutHeader, isRTL && { flexDirection: 'row-reverse' }]}>
            <Text style={styles.payoutAmount}>
              {item.amount.toLocaleString()} {t('currency')}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: bg }]}>
              <Text style={[styles.statusText, { color }]}>{statusLabel}</Text>
            </View>
          </View>
          <Text style={[styles.payoutDate, { textAlign: isRTL ? 'right' : 'left' }]}>{date}</Text>
          {item.reference_note ? (
            <Text style={[styles.referenceNote, { textAlign: isRTL ? 'right' : 'left' }]}>
              {item.reference_note}
            </Text>
          ) : null}
        </View>
      );
    },
    [t, isRTL],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={64} color={Colors.border} />
        <Text style={styles.emptyText}>{t('no_trips_found')}</Text>
      </View>
    ),
    [t],
  );

  const keyExtractor = useCallback((item: PayoutRecord) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Custom Header for Stack */}
      <View style={[styles.navHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{t('withdraw_request')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>{t('available_balance')}</Text>
        <Text style={styles.balanceValue}>
          {balanceData.available_balance.toLocaleString()} {t('currency')}
        </Text>
        <TouchableOpacity
          style={[
            styles.requestBtn,
            (balanceData.available_balance <= 0 || requesting) && styles.requestBtnDisabled,
          ]}
          onPress={handleRequestPayout}
          disabled={balanceData.available_balance <= 0 || requesting}
        >
          {requesting ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={styles.requestBtnText}>{t('withdraw_request')}</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.historyContainer}>
        <Text style={[styles.historyTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
          {t('payout_history')}
        </Text>

        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={payouts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            ListEmptyComponent={ListEmpty}
            initialNumToRender={10}
            maxToRenderPerBatch={15}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    zIndex: 10,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  navTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.white,
  },
  balanceContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadow.md,
  },
  balanceLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.xs,
  },
  balanceValue: {
    fontFamily: FontFamily.bold,
    fontSize: 36,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  requestBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    width: '100%',
    alignItems: 'center',
  },
  requestBtnDisabled: {
    opacity: 0.5,
  },
  requestBtnText: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.primary,
  },
  historyContainer: {
    flex: 1,
    padding: Spacing.md,
  },
  historyTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  listContent: {
    paddingBottom: Spacing.xxxl,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  payoutCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  payoutAmount: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: 11,
  },
  payoutDate: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  referenceNote: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surfaceMuted,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
});
