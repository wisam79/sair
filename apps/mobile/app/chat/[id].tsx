import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ViewStyle,
  Animated,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMessages, useConversations, type Message } from '../../src/hooks/useMessages';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/hooks/useStore';
import { Colors, FontFamily, Spacing, BorderRadius, Shadow } from '../../src/theme';
import * as Haptics from 'expo-haptics';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();
  const { user, role } = useAuthStore();
  const { messages, loading, error, sendMessage } = useMessages(id || null);
  const { conversations } = useConversations();
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const sendBtnScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    Animated.spring(sendBtnScale, {
      toValue: inputText.trim() ? 1.0 : 0.9,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [inputText]);

  const reversedMessages = messages;

  const conversation = useMemo(() => conversations.find((c) => c.id === id), [conversations, id]);

  const displayName = useMemo(() => {
    if (!conversation) return t('chat');
    const rawStudentName = conversation.student_name;
    const rawDriverName = conversation.driver_name;

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

    return user?.id === conversation.driver_id
      ? studentNameStr || t('student')
      : driverNameStr || t('driver');
  }, [conversation, user?.id, t]);

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

  const handleContentSizeChange = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0 });
  }, []);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await sendMessage(inputText);
      setInputText('');
    } catch {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setSending(false);
    }
  };

  const handleQuickReply = async (text: string) => {
    setInputText(text);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderMessage = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const isOwnMessage = item.sender_id === user?.id;

      // Grouping consecutive messages logic
      const prevMessage = index < reversedMessages.length - 1 ? reversedMessages[index + 1] : null;
      const nextMessage = index > 0 ? reversedMessages[index - 1] : null;

      const isConsecutivePrev =
        prevMessage &&
        prevMessage.sender_id === item.sender_id &&
        new Date(item.created_at).getTime() - new Date(prevMessage.created_at).getTime() <
          3 * 60 * 1000;

      const isConsecutiveNext =
        nextMessage &&
        nextMessage.sender_id === item.sender_id &&
        new Date(nextMessage.created_at).getTime() - new Date(item.created_at).getTime() <
          3 * 60 * 1000;

      const showTimestamp = !isConsecutiveNext;
      const isGroupEnd = !isConsecutiveNext;

      const bubbleBorderRadius = isOwnMessage
        ? {
            borderTopLeftRadius: BorderRadius.lg,
            borderTopRightRadius: BorderRadius.lg,
            borderBottomLeftRadius: BorderRadius.lg,
            borderBottomRightRadius: isGroupEnd ? 4 : BorderRadius.lg,
          }
        : {
            borderTopLeftRadius: BorderRadius.lg,
            borderTopRightRadius: BorderRadius.lg,
            borderBottomRightRadius: BorderRadius.lg,
            borderBottomLeftRadius: isGroupEnd ? 4 : BorderRadius.lg,
          };

      let messageText = '';
      if (item.content !== undefined && item.content !== null) {
        if (typeof item.content === 'object') {
          messageText = (item.content as any).content || JSON.stringify(item.content);
        } else {
          const strVal = String(item.content);
          if (strVal !== '[object Object]') {
            messageText = strVal;
          }
        }
      }

      return (
        <View
          style={[
            styles.messageContainer,
            isOwnMessage ? styles.ownMessage : styles.otherMessage,
            isConsecutivePrev && { marginTop: 2 },
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              isOwnMessage ? styles.ownBubble : styles.otherBubble,
              bubbleBorderRadius,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownText : styles.otherText,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {messageText}
            </Text>
            {showTimestamp && (
              <View
                style={[
                  styles.timeContainer,
                  { justifyContent: isOwnMessage ? 'flex-end' : 'flex-start' },
                  isRTL && { flexDirection: 'row-reverse' },
                ]}
              >
                <Text
                  style={[styles.messageTime, isOwnMessage ? styles.ownTime : styles.otherTime]}
                >
                  {new Date(item.created_at).toLocaleTimeString(isRTL ? 'ar-IQ' : 'en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                {isOwnMessage && (
                  <Ionicons
                    name={item.is_read ? 'checkmark-done' : 'checkmark'}
                    size={14}
                    color={item.is_read ? '#85E3FF' : 'rgba(255,255,255,0.5)'}
                    style={{ [isRTL ? 'marginRight' : 'marginLeft']: 4 } as any}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      );
    },
    [user?.id, isRTL, reversedMessages],
  );

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : keyboardVisible ? 'height' : undefined}
      keyboardVerticalOffset={Platform.select({
        ios: 90 + bottom,
        android: keyboardVisible ? 24 : 0,
      })}
    >
      <StatusBar style="dark" translucent />
      <View
        style={[
          styles.header,
          { paddingTop: top + Spacing.sm },
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <View style={[styles.headerNameContainer, isRTL && { flexDirection: 'row-reverse' }]}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerTitle}>{displayName}</Text>
          </View>
          {conversation && (
            <Text style={styles.headerSubtitle}>
              {user?.id === conversation.driver_id ? t('student') : t('driver')}
            </Text>
          )}
        </View>
        {conversation?.trip_id ? (
          <TouchableOpacity
            style={styles.headerInfoBtn}
            onPress={() =>
              router.push({
                pathname: '/tracking/[tripId]',
                params: { tripId: conversation.trip_id },
              })
            }
          >
            <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={reversedMessages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        style={styles.flatList}
        contentContainerStyle={styles.messagesList}
        inverted
        onContentSizeChange={handleContentSizeChange}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews={true}
      />

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
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickReplyChip}
              onPress={() => handleQuickReply(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickReplyText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View
        style={[
          styles.inputContainer,
          isRTL && { flexDirection: 'row-reverse' },
          { paddingBottom: Platform.OS === 'ios' && bottom > 0 ? bottom : Spacing.md },
        ]}
      >
        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('type_message')}
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={1000}
        />
        <Animated.View style={{ transform: [{ scale: sendBtnScale }] }}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
              { [isRTL ? 'marginEnd' : 'marginStart']: Spacing.sm } as ViewStyle,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Ionicons name="send" size={18} color={Colors.white} />
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
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
  flatList: {
    flex: 1,
  },
  messagesList: {
    padding: Spacing.md,
  },
  messageContainer: {
    marginVertical: Spacing.xs,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  ownBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
    ...Shadow.sm,
  },
  otherBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EFECE9',
    ...Shadow.sm,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  ownText: {
    color: Colors.white,
  },
  otherText: {
    color: Colors.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'right',
  },
  otherTime: {
    color: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.md,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#EFECE9',
    ...Shadow.sm,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F2EF',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
    maxHeight: 100,
    color: Colors.text,
    borderWidth: 1,
    borderColor: '#E6E3DE',
  },
  inputRTL: {
    textAlign: 'right',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
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
