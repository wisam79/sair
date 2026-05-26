import { useEffect, useCallback, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { RealtimeChannel } from '@supabase/supabase-js';
import NetInfo from '@react-native-community/netinfo';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  trip_id: string;
  driver_id: string;
  student_id: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  driver_name?: string;
  student_name?: string;
  last_message?: string;
  unread_count?: number;
}

export function useConversations() {
  const queryClient = useQueryClient();
  const queryKey = ['conversations'];
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: conversations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: res, error: err } = await supabase.rpc('get_my_conversations');
      if (err) throw err;
      return (res as Conversation[]) || [];
    },
  });

  useEffect(() => {
    const channelName = `conversations-changes-${Math.random().toString(36).substring(2, 9)}`;

    // Debounced invalidation to prevent rapid-fire refetches
    const debouncedInvalidate = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey });
      }, 500);
    };

    // Listen on messages table (has RLS) instead of conversations table.
    // This ensures we only get notified about messages the user can see.
    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        debouncedInvalidate();
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          NetInfo.fetch().then((state) => {
            const isOnline = !!state.isConnected && state.isInternetReachable !== false;
            if (isOnline) {
              queryClient.invalidateQueries({ queryKey });
            }
          });
        }
      });

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const errorMsg = error
    ? (error as any).message || (error as any).error_description || String(error)
    : null;

  return { conversations, loading: isLoading, error: errorMsg, refetch };
}

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ['messages', conversationId];

  const {
    data: messages = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!conversationId) return [];
      const { data: res, error: err } = await supabase.rpc('get_messages', {
        p_conversation_id: conversationId,
        p_limit: 50,
      });
      if (err) throw err;
      return (res as Message[]) || [];
    },
    enabled: !!conversationId,
  });

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return null;

      const { data: res, error: err } = await supabase
        .rpc('send_message', {
          p_conversation_id: conversationId,
          p_content: content.trim(),
        })
        .single();
      if (err) throw err;

      const sentMessage = res as Message;

      queryClient.setQueryData<Message[]>(queryKey, (old) => {
        if (!old) return [sentMessage];
        const exists = old.some((m) => m.id === sentMessage.id);
        if (exists) return old;
        return [sentMessage, ...old];
      });

      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      return sentMessage;
    },
    [conversationId, queryClient, queryKey],
  );

  const markAsRead = useCallback(async () => {
    if (!conversationId) return;

    try {
      await supabase.rpc('mark_messages_read', {
        p_conversation_id: conversationId,
      });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch {
      // Silently fail - not critical
    }
  }, [conversationId, queryClient]);

  useEffect(() => {
    if (!conversationId) return;

    const channelName = `messages-${conversationId}-${Math.random().toString(36).substring(2, 9)}`;
    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          queryClient.setQueryData<Message[]>(queryKey, (old) => {
            if (!old) return [newMessage];
            const exists = old.some((m) => m.id === newMessage.id);
            if (exists) return old;
            return [newMessage, ...old];
          });
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          NetInfo.fetch().then((state) => {
            const isOnline = !!state.isConnected && state.isInternetReachable !== false;
            if (isOnline) {
              refetch();
            }
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, refetch, queryClient, queryKey]);

  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markAsRead();
    }
  }, [conversationId, messages, markAsRead]);

  const errorMsg = error
    ? (error as any).message || (error as any).error_description || String(error)
    : null;

  return { messages, loading: isLoading, error: errorMsg, sendMessage, refetch };
}

export function useConversationForTrip(tripId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ['conversation_for_trip', tripId];

  const {
    data: conversation = null,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!tripId) return null;
      const { data: res, error: err } = await supabase
        .rpc('get_or_create_conversation', {
          p_trip_id: tripId,
        })
        .single();
      if (err) throw err;
      return res as Conversation;
    },
    enabled: !!tripId,
  });

  const getOrCreate = useCallback(async () => {
    if (!tripId) return null;
    const { data: res, error: err } = await supabase
      .rpc('get_or_create_conversation', {
        p_trip_id: tripId,
      })
      .single();
    if (err) throw err;
    const conv = res as Conversation;
    queryClient.setQueryData(queryKey, conv);
    return conv;
  }, [tripId, queryClient, queryKey]);

  const errorMsg = error
    ? (error as any).message || (error as any).error_description || String(error)
    : null;

  return { conversation, loading: isLoading, error: errorMsg, getOrCreate };
}
