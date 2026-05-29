import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chat, ChannelList, WithComponents, OverlayProvider } from 'stream-chat-expo';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/hooks/useStore';
import { getStreamClient, connectStreamUser } from '../../src/lib/stream';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { EmptyState } from '../../src/components/EmptyState';
import { LoadingList } from '../../src/components/LoadingSkeleton';
import * as Haptics from 'expo-haptics';

export default function ConversationsScreen() {
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { top } = useSafeAreaInsets();
  const { user, profile } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [connecting, setConnecting] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize Stream Chat connection
  useEffect(() => {
    let active = true;
    async function initChat() {
      if (!user) return;
      try {
        setConnecting(true);
        setErrorMsg(null);
        await connectStreamUser(user.id, profile?.full_name || user.email || 'User');
      } catch (err: any) {
        console.error('[ConversationsScreen] Init failed:', err);
        if (active) {
          setErrorMsg(err.message || t('error_generic'));
        }
      } finally {
        if (active) {
          setConnecting(false);
        }
      }
    }
    initChat();
    return () => {
      active = false;
    };
  }, [user, profile, t]);

  // Stream Chat filters
  const filters = useMemo(() => {
    if (!user) return {};
    const base: any = {
      members: { $in: [user.id] },
    };
    if (searchQuery.trim()) {
      base.name = { $autocomplete: searchQuery.trim() };
    }
    if (activeTab === 'unread') {
      base.unread_count = { $gt: 0 };
    }
    return base;
  }, [user, searchQuery, activeTab]);

  const sort = useMemo(() => [{ last_message_at: -1 as any }], []);
  const options = useMemo(() => ({ watch: true, state: true, limit: 20 }), []);

  const chatClient = getStreamClient();

  if (connecting || !chatClient) {
    return (
      <View style={[styles.container, { backgroundColor: Colors.background }]}>
        <StatusBar style="light" translucent />
        {/* Render stub header so the layout doesn't jump */}
        <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
          <View style={styles.glassOverlay} />
          <View style={styles.glassHighlight} />
          <Text style={styles.headerTitle}>{t('messages')}</Text>
        </View>
        <View style={{ marginTop: Spacing.sm }}>
          <LoadingList count={5} variant="chat" />
        </View>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <OverlayProvider>
      <Chat client={chatClient}>
        <View style={styles.container}>
          <StatusBar style="light" translucent />

          {/* Branded Header Banner (Fixed at the top) */}
          <View style={[styles.headerBanner, { paddingTop: top + Spacing.sm }]}>
            {/* Glassmorphic Background Effects */}
            <View style={styles.glassOverlay} />
            <View style={styles.glassHighlight} />

            <Text style={styles.headerTitle}>{t('messages')}</Text>
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

          {/* Stream Chat Channel List */}
          <View style={{ flex: 1 }}>
            <WithComponents
              overrides={{
                EmptyStateIndicator: () => (
                  <EmptyState
                    icon="chatbubbles-outline"
                    title={t('no_conversations')}
                    subtitle={isRTL ? 'لم تبدأ أي محادثة بعد.' : 'No conversations started yet.'}
                    iconColor={Colors.primary}
                  />
                ),
              }}
            >
              <ChannelList
                filters={filters}
                sort={sort}
                options={options}
                onSelect={(channel) => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push(`/chat/${channel.id}`);
                }}
              />
            </WithComponents>
          </View>
        </View>
      </Chat>
    </OverlayProvider>
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
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});
