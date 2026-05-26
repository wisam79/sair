import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useConversations } from '../../src/hooks/useMessages';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/hooks/useStore';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import * as Haptics from 'expo-haptics';

interface ConversationItem {
  id: string;
  trip_id: string;
  driver_id: string;
  student_id: string;
  last_message_at: string;
  driver_name?: string;
  student_name?: string;
  last_message?: string;
  unread_count?: number;
}

const getAvatarBg = (name: string) => {
  const hash = name.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const colors = [
    '#86EFAC', // pastel green
    '#16A34A', // Sair primary green
    '#15803D', // Sair dark green
    '#A7F3D0', // light emerald
    '#059669', // emerald green
    '#34D399', // mint green
  ];
  return colors[hash % colors.length];
};

const getInitials = (name: string) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export default function ConversationsScreen() {
  const router = useRouter();
  const { conversations, loading, error } = useConversations();
  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'active'>('all');

  console.log('[DEBUG ConversationsScreen] conversations:', JSON.stringify(conversations, null, 2));
  if (error) {
    console.error('[DEBUG ConversationsScreen] error:', error);
  }

  const filteredConversations = conversations.filter((c) => {
    // 1. Text Search Filter
    const rawStudentName = c.student_name;
    const rawDriverName = c.driver_name;

    const studentNameStr =
      typeof rawStudentName === 'object' && rawStudentName !== null
        ? (rawStudentName as any).full_name ||
          (rawStudentName as any).name ||
          JSON.stringify(rawStudentName)
        : rawStudentName || '';

    const driverNameStr =
      typeof rawDriverName === 'object' && rawDriverName !== null
        ? (rawDriverName as any).full_name ||
          (rawDriverName as any).name ||
          JSON.stringify(rawDriverName)
        : rawDriverName || '';

    const displayName = user?.id === c.driver_id ? studentNameStr : driverNameStr;
    const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Tab Filter
    if (activeTab === 'unread') {
      return !!c.unread_count && c.unread_count > 0;
    }
    if (activeTab === 'active') {
      // Show chats with activity in the last 24 hours
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      return new Date(c.last_message_at).getTime() > oneDayAgo;
    }

    return true;
  });

  const renderConversation = useCallback(
    ({ item }: { item: ConversationItem }) => {
      const rawStudentName = item.student_name;
      const rawDriverName = item.driver_name;

      const studentNameStr =
        typeof rawStudentName === 'object' && rawStudentName !== null
          ? (rawStudentName as any).full_name ||
            (rawStudentName as any).name ||
            JSON.stringify(rawStudentName)
          : rawStudentName;

      const driverNameStr =
        typeof rawDriverName === 'object' && rawDriverName !== null
          ? (rawDriverName as any).full_name ||
            (rawDriverName as any).name ||
            JSON.stringify(rawDriverName)
          : rawDriverName;

      const displayName =
        user?.id === item.driver_id ? studentNameStr || t('student') : driverNameStr || t('driver');

      const time = new Date(item.last_message_at).toLocaleDateString(isRTL ? 'ar-IQ' : 'en-US', {
        month: 'short',
        day: 'numeric',
      });

      const hasUnread = !!item.unread_count && item.unread_count > 0;

      let lastMessageText = t('chat_tap_to_open');
      if (item.last_message !== undefined && item.last_message !== null) {
        if (typeof item.last_message === 'object') {
          lastMessageText = (item.last_message as any).content || JSON.stringify(item.last_message);
        } else {
          const strVal = String(item.last_message).trim();
          if (strVal && strVal !== '[object Object]') {
            lastMessageText = strVal;
          }
        }
      }

      const initials = getInitials(displayName);
      const avatarBg = getAvatarBg(displayName);

      return (
        <TouchableOpacity
          style={[styles.conversationItem, isRTL && { flexDirection: 'row-reverse' }]}
          onPress={() => router.push(`/chat/${item.id}`)}
          activeOpacity={0.85}
        >
          <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.conversationContent}>
            <View style={[styles.conversationHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text
                style={[
                  styles.conversationName,
                  hasUnread && styles.conversationNameUnread,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
                numberOfLines={1}
              >
                {displayName}
              </Text>
              <Text style={styles.conversationTime}>{time}</Text>
            </View>
            <View style={[styles.previewRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text
                style={[
                  styles.conversationPreview,
                  hasUnread && styles.conversationPreviewUnread,
                  { textAlign: isRTL ? 'right' : 'left' },
                ]}
                numberOfLines={1}
              >
                {lastMessageText}
              </Text>
              {hasUnread && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{item.unread_count}</Text>
                </View>
              )}
            </View>
          </View>
          <Ionicons
            name={isRTL ? 'chevron-back' : 'chevron-forward'}
            size={18}
            color={Colors.textMuted}
            style={isRTL ? { marginRight: Spacing.sm } : { marginLeft: Spacing.sm }}
          />
        </TouchableOpacity>
      );
    },
    [router, isRTL, t, user?.id],
  );

  const renderSeparator = useCallback(() => <View style={styles.separator} />, []);
  const keyExtractor = useCallback((item: ConversationItem) => item.id, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />

      {/* Branded Header Banner (Fixed at the top) */}
      <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
        {/* Glassmorphic Background Effects */}
        <View style={styles.glassOverlay} />
        <View style={styles.glassHighlight} />

        <Text style={styles.headerTitle}>
          {t('messages')}
        </Text>
        <TouchableOpacity
          style={[styles.headerShortcutBtn, { [isRTL ? 'left' : 'right']: Spacing.md }]}
          onPress={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/help');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Search & Filter Segmented Tabs */}
      <View style={styles.searchFilterContainer}>
        <View style={[styles.searchBar, isRTL && { flexDirection: 'row-reverse' }]}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={isRTL ? 'ابحث عن اسم...' : 'Search name...'}
            placeholderTextColor={Colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.tabBarContainer, isRTL && { flexDirection: 'row-reverse' }]}>
          {[
            { id: 'all', label: isRTL ? 'الكل' : 'All' },
            { id: 'unread', label: isRTL ? 'غير مقروءة' : 'Unread' },
            { id: 'active', label: isRTL ? 'نشطة' : 'Active' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.id as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="chatbubbles-outline" size={56} color={Colors.primary} />
          </View>
          <Text style={styles.emptyText}>{t('no_conversations')}</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? isRTL
                ? 'لا توجد نتائج تطابق بحثك'
                : 'No results matching your search'
              : t('start_chat_from_trip')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={keyExtractor}
          renderItem={renderConversation}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={renderSeparator}
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
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  headerBanner: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...Shadow.header,
    zIndex: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primaryDeep,
  },
  glassHighlight: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.glassOverlay,
    borderBottomWidth: 1,
    borderBottomColor: Colors.glassBorder,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 16,
    color: Colors.white,
    zIndex: 2,
    textAlign: 'center',
    width: '100%',
  },
  headerShortcutBtn: {
    position: 'absolute',
    bottom: 12,
    zIndex: 3,
    padding: 6,
  },
  searchFilterContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    backgroundColor: Colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 38,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: 14,
    color: Colors.text,
    paddingHorizontal: Spacing.xs,
    height: '100%',
    paddingVertical: 0,
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: BorderRadius.lg,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: Colors.white,
    ...Shadow.sm,
  },
  tabButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tabButtonTextActive: {
    fontFamily: FontFamily.bold,
    color: Colors.primary,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl + 40,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: 15,
    color: Colors.white,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxs,
  },
  conversationName: {
    fontSize: 15,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },
  conversationNameUnread: {
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  conversationTime: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationPreview: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: Spacing.xs,
  },
  conversationPreviewUnread: {
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.pill,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontFamily: FontFamily.bold,
  },
  separator: {
    height: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '15',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: FontFamily.regular,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 18,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: Colors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
