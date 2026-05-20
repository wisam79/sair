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
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMessages, type Message } from '../../src/hooks/useMessages';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/hooks/useStore';
import { Colors, FontFamily, Spacing, BorderRadius } from '../../src/theme';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, isRTL } = useTranslation();
  const { user } = useAuthStore();
  const { messages, loading, error, sendMessage } = useMessages(id || null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const handleContentSizeChange = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0 });
  }, []);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleSend = async () => {
    if (!inputText.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(inputText);
      setInputText('');
    } finally {
      setSending(false);
    }
  };

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isOwnMessage = item.sender_id === user?.id;

      return (
        <View
          style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}
        >
          <View
            style={[styles.messageBubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}
          >
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownText : styles.otherText,
                { textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {item.content}
            </Text>
            <Text style={[styles.messageTime, isOwnMessage ? styles.ownTime : styles.otherTime]}>
              {new Date(item.created_at).toLocaleTimeString(isRTL ? 'ar-IQ' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
      );
    },
    [user?.id],
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={[styles.header, isRTL && { flexDirection: 'row-reverse' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('chat')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        ref={flatListRef}
        data={reversedMessages}
        keyExtractor={keyExtractor}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        inverted
        onContentSizeChange={handleContentSizeChange}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <View style={[styles.inputContainer, isRTL && { flexDirection: 'row-reverse' }]}>
        <TextInput
          style={[styles.input, isRTL && styles.inputRTL]}
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('type_message')}
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || sending) && styles.sendButtonDisabled,
            { [isRTL ? 'marginEnd' : 'marginStart']: Spacing.sm } as any,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Ionicons name="send" size={20} color={Colors.white} />
          )}
        </TouchableOpacity>
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
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: FontFamily.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
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
  },
  otherBubble: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownText: {
    color: Colors.white,
  },
  otherText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: Spacing.xs,
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
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    maxHeight: 100,
    color: Colors.text,
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
});
