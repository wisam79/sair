import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chat, Channel, MessageList, MessageComposer, OverlayProvider } from 'stream-chat-expo';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/hooks/useStore';
import { getStreamClient, connectStreamUser } from '../../src/lib/stream';
import { supabase } from '../../src/lib/supabase';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import * as Haptics from 'expo-haptics';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();
  const { user, role, profile } = useAuthStore();

  const [connecting, setConnecting] = useState(true);
  const [channel, setChannel] = useState<any>(null);
  const [conversationMeta, setConversationMeta] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize Stream Chat connection and watch channel
  useEffect(() => {
    let active = true;

    async function initChat() {
      if (!id || !user) return;

      try {
        setConnecting(true);
        setErrorMsg(null);

        // 1. Connect the user to Stream Chat
        const userName = profile?.full_name || user.email || 'User';
        await connectStreamUser(user.id, userName);

        if (!active) return;

        // 2. Fetch conversation metadata from Supabase
        const { data: conv, error } = await supabase
          .from('conversations')
          .select(
            `
            id,
            student_id,
            driver_id,
            trip_id,
            drivers!driver_id (
              user_id,
              profiles!user_id (
                full_name
              )
            ),
            student:profiles!student_id (
              full_name
            )
          `,
          )
          .eq('id', id)
          .single();

        if (error || !conv) {
          throw new Error(error?.message || 'Conversation metadata not found');
        }

        if (!active) return;
        setConversationMeta(conv);

        // 3. Watch Stream Channel
        const client = getStreamClient();
        if (!client) {
          throw new Error('Stream client not initialized');
        }

        // Handle array conversion for Supabase join results
        const driversArr = conv.drivers as any;
        const driverMeta = Array.isArray(driversArr) ? driversArr[0] : driversArr;
        const profilesArr = driverMeta?.profiles as any;
        const driverProfile = Array.isArray(profilesArr) ? profilesArr[0] : profilesArr;

        const studentArr = conv.student as any;
        const studentMeta = Array.isArray(studentArr) ? studentArr[0] : studentArr;

        const driverUserId = driverMeta?.user_id;
        const studentUserId = conv.student_id;

        if (!driverUserId || !studentUserId) {
          throw new Error('Participant metadata missing');
        }

        const channelName =
          user.id === driverUserId ? studentMeta?.full_name : driverProfile?.full_name;

        const chatChannel = client.channel('messaging', id, {
          members: [studentUserId, driverUserId],
          name: channelName || 'Chat',
        } as any);

        await chatChannel.watch();

        if (!active) return;
        setChannel(chatChannel);
      } catch (err: any) {
        console.error('[ChatScreen] Initialization error:', err);
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
  }, [id, user, profile, t]);

  const displayName = useMemo(() => {
    if (!conversationMeta) return t('chat');
    const driversArr = conversationMeta.drivers as any;
    const driverMeta = Array.isArray(driversArr) ? driversArr[0] : driversArr;
    const profilesArr = driverMeta?.profiles as any;
    const driverProfile = Array.isArray(profilesArr) ? profilesArr[0] : profilesArr;

    const studentArr = conversationMeta.student as any;
    const studentMeta = Array.isArray(studentArr) ? studentArr[0] : studentArr;

    const driverUserId = driverMeta?.user_id;
    return user?.id === driverUserId
      ? studentMeta?.full_name || t('student')
      : driverProfile?.full_name || t('driver');
  }, [conversationMeta, user?.id, t]);

  const roleText = useMemo(() => {
    if (!conversationMeta) return '';
    const driversArr = conversationMeta.drivers as any;
    const driverMeta = Array.isArray(driversArr) ? driversArr[0] : driversArr;
    const driverUserId = driverMeta?.user_id;
    return user?.id === driverUserId ? t('student') : t('driver');
  }, [conversationMeta, user?.id, t]);

  const quickReplies = useMemo(() => {
    if (role === 'driver') {
      return isRTL
        ? ['أنا في الطريق 🚌', 'وصلت لنقطة التجمع 📍', 'يرجى الإسراع ⏱️', 'هل الجميع متواجد؟ 👥']
        : ['I am on my way 🚌', 'Arrived at pickup 📍', 'Please hurry ⏱️', 'Is everyone here? 👥'];
    } else {
      return isRTL
        ? ['أنا عند البوابة 🚪', 'كم دقيقة وتصل؟ ⏱️', 'شكراً لك 👍', 'سأصل خلال دقائق 🏃‍♂️']
        : ['I am at the gate 🚪', 'How many mins? ⏱️', 'Thank you 👍', 'Arriving in mins 🏃‍♂️'];
    }
  }, [role, isRTL]);

  const handleQuickReply = useCallback(
    async (text: string) => {
      if (channel) {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          await channel.sendMessage({ text });
        } catch (err) {
          console.error('[ChatScreen] Failed to send quick reply:', err);
        }
      }
    },
    [channel],
  );

  const renderQuickReply = useCallback(
    ({ item }: { item: string }) => (
      <TouchableOpacity
        style={styles.quickReplyChip}
        onPress={() => handleQuickReply(item)}
        activeOpacity={0.8}
      >
        <Text style={styles.quickReplyText}>{item}</Text>
      </TouchableOpacity>
    ),
    [handleQuickReply],
  );

  const chatClient = getStreamClient();

  if (connecting || !chatClient || !channel) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBackButton}>
          <Text style={styles.errorBackButtonText}>{t('go_back_short')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const streamTheme = useMemo(() => ({
    colors: {
      background: Colors.white,
      background_page: Colors.background,
      border: Colors.border,
      text: Colors.text,
      text_muted: Colors.textMuted,
      accent_green: Colors.primary,
      white: Colors.white,
      black: Colors.black,
    },
    semantics: {
      accentPrimary: Colors.primary,
      backgroundCoreApp: Colors.background,
      backgroundCoreElevation0: Colors.white,
      backgroundCoreElevation1: Colors.white,
      backgroundCoreElevation2: Colors.white,
      backgroundCoreElevation3: Colors.white,
      backgroundCoreSurfaceDefault: Colors.white,
      backgroundCoreSurfaceStrong: Colors.surfaceMuted,
      backgroundCoreSurfaceSubtle: Colors.surfaceMuted,
      chatBgIncoming: Colors.white,
      chatBgOutgoing: Colors.primarySurface,
      chatTextIncoming: Colors.text,
      chatTextOutgoing: Colors.text,
      inputTextDefault: Colors.text,
      inputTextPlaceholder: Colors.textMuted,
      inputTextIcon: Colors.textMuted,
      borderCoreDefault: Colors.border,
      borderCoreStrong: Colors.border,
      borderCoreSubtle: Colors.borderLight,
      textPrimary: Colors.text,
      textSecondary: Colors.textSecondary,
      textTertiary: Colors.textMuted,
      textDisabled: Colors.textMuted,
      textLink: Colors.primary,
    }
  }), []);

  return (
    <OverlayProvider value={{ style: streamTheme }}>
      <Chat client={chatClient}>
        <Channel channel={channel} keyboardBehavior="padding">
          <View style={styles.container}>
            <StatusBar style="dark" translucent />

            {/* Header */}
            <View
              style={[
                styles.header,
                { paddingTop: top + Spacing.sm },
                isRTL && { flexDirection: 'row-reverse' },
              ]}
            >
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons
                  name={isRTL ? 'arrow-forward' : 'arrow-back'}
                  size={24}
                  color={Colors.text}
                />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <View style={[styles.headerNameContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.headerTitle}>{displayName}</Text>
                </View>
                {roleText ? <Text style={styles.headerSubtitle}>{roleText}</Text> : null}
              </View>
              {conversationMeta?.trip_id ? (
                <TouchableOpacity
                  style={styles.headerInfoBtn}
                  onPress={() =>
                    router.push({
                      pathname: '/tracking/[tripId]',
                      params: { tripId: conversationMeta.trip_id },
                    })
                  }
                >
                  <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
              ) : (
                <View style={styles.headerSpacer} />
              )}
            </View>

            {/* Message List */}
            <View style={{ flex: 1 }}>
              <MessageList />
            </View>

            {/* Smart Quick Replies Chips */}
            <View style={{ backgroundColor: Colors.background }}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={quickReplies}
                keyExtractor={(item) => item}
                contentContainerStyle={[
                  styles.quickRepliesContainer,
                  isRTL && { flexDirection: 'row-reverse' },
                ]}
                renderItem={renderQuickReply}
              />
            </View>

            {/* Message Input */}
            <View
              style={{ paddingBottom: Platform.OS === 'ios' && bottom > 0 ? bottom : Spacing.xs }}
            >
              <MessageComposer />
            </View>
          </View>
        </Channel>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: '#EFECE9',
    borderBottomWidth: 1,
    borderBottomColor: '#E6E2DE',
    ...Shadow.sm,
    zIndex: 10,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: FontFamily.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorBackButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  errorBackButtonText: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: 14,
  },
  quickRepliesContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    height: 48,
  },
  quickReplyChip: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E6E3DE',
    ...Shadow.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickReplyText: {
    fontFamily: FontFamily.medium,
    fontSize: 13,
    color: Colors.primary,
  },
  headerInfoBtn: {
    padding: Spacing.xs,
  },
  headerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
});
