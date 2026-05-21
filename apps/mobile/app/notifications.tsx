import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../src/lib/supabase';
import { useTranslation } from '../src/hooks/useTranslation';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../src/theme';
import { EmptyState } from '../src/components/EmptyState';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  data: Record<string, unknown>;
}

export default function NotificationsScreen() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cached notifications on mount
  useEffect(() => {
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem('cached_notifications');
        if (cached) {
          setNotifications(JSON.parse(cached));
          setIsLoading(false);
        }
      } catch (e) {
        // Ignore cache load failure
      }
    };
    loadCached();
  }, []);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('notification_log')
      .select('id, title, body, is_read, created_at, data')
      .order('created_at', { ascending: false })
      .limit(50);
    const newNotifications = (data as NotificationItem[]) ?? [];
    setNotifications(newNotifications);
    AsyncStorage.setItem('cached_notifications', JSON.stringify(newNotifications)).catch(() => {});
    setIsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications]),
  );

  const markAsRead = async (id: string) => {
    await supabase.from('notification_log').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const clearAll = async () => {
    Alert.alert(t('alert'), t('clear_notifications_confirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('clear_all'),
        style: 'destructive',
        onPress: async () => {
          await supabase
            .from('notification_log')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');
          setNotifications([]);
        },
      },
    ]);
  };

  const formatDate = useCallback(
    (iso: string) =>
      new Date(iso).toLocaleString(isRTL ? 'ar-IQ' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'short',
      }),
    [isRTL],
  );

  const renderItem = useCallback(
    ({ item }: { item: NotificationItem }) => (
      <TouchableOpacity
        style={[
          styles.item,
          !item.is_read && styles.itemUnread,
          isRTL && { flexDirection: 'row-reverse' },
        ]}
        onPress={() => markAsRead(item.id)}
        activeOpacity={0.85}
      >
        <View
          style={[
            styles.iconBox,
            { backgroundColor: item.is_read ? Colors.surfaceMuted : Colors.primarySurface },
          ]}
        >
          <Ionicons
            name="notifications-outline"
            size={20}
            color={item.is_read ? Colors.textMuted : Colors.primary}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {item.title}
          </Text>
          <Text
            style={[styles.itemBody, { textAlign: isRTL ? 'right' : 'left' }]}
            numberOfLines={2}
          >
            {item.body}
          </Text>
          <Text style={[styles.itemDate, { textAlign: isRTL ? 'right' : 'left' }]}>
            {formatDate(item.created_at)}
          </Text>
        </View>
        {!item.is_read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    ),
    [isRTL, formatDate],
  );

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        icon="notifications-off-outline"
        title={t('no_notifications')}
        subtitle={t('notifications_empty_subtitle')}
        iconColor={Colors.textMuted}
      />
    ),
    [t],
  );

  const keyExtractor = useCallback((item: NotificationItem) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: top + Spacing.md },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications')}</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>{t('clear_all')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchNotifications}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: { padding: Spacing.xs, width: 40 },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    color: Colors.text,
  },
  clearButton: { padding: Spacing.xs },
  clearText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.error,
  },
  listContent: { paddingVertical: Spacing.sm },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  itemUnread: {
    backgroundColor: Colors.primarySurface + '55',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  itemTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  itemBody: {
    fontFamily: FontFamily.regular,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  itemDate: {
    fontFamily: FontFamily.regular,
    fontSize: 11,
    color: Colors.textMuted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
});
