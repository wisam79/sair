import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useConversations } from '../../src/hooks/useMessages';
import { useTranslation } from '../../src/hooks/useTranslation';
import { Colors, FontFamily, Spacing, BorderRadius } from '../../src/theme';

interface ConversationItem {
  id: string;
  trip_id: string;
  driver_id: string;
  student_id: string;
  last_message_at: string;
  driver_name?: string;
  student_name?: string;
}

export default function ConversationsScreen() {
  const router = useRouter();
  const { conversations, loading, error } = useConversations();
  const { t, isRTL } = useTranslation();

  const renderConversation = useCallback(
    ({ item }: { item: ConversationItem }) => {
      const displayName = item.driver_name || item.student_name || t('unknown_driver');
      const time = new Date(item.last_message_at).toLocaleDateString();

      return (
        <TouchableOpacity
          style={[styles.conversationItem, isRTL && { flexDirection: 'row-reverse' }]}
          onPress={() => router.push(`/chat/${item.id}`)}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={Colors.textMuted} />
          </View>
          <View style={styles.conversationContent}>
            <View style={[styles.conversationHeader, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={styles.conversationName}>{displayName}</Text>
              <Text style={styles.conversationTime}>{time}</Text>
            </View>
            <Text style={styles.conversationPreview} numberOfLines={1}>
              {t('chat_tap_to_open')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
      );
    },
    [router, isRTL, t],
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyText}>{t('no_conversations')}</Text>
          <Text style={styles.emptySubtext}>{t('start_chat_from_trip')}</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
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
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontFamily: FontFamily.bold,
    color: Colors.text,
  },
  listContent: {
    padding: Spacing.md,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },
  conversationTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  conversationPreview: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  emptyText: {
    fontSize: 18,
    fontFamily: FontFamily.medium,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
