import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

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
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const { data, error: err } = await supabase.rpc('get_my_conversations');
      if (err) throw err;

      const convs = (data as Conversation[]) || [];
      setConversations(convs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();

    const channel: RealtimeChannel = supabase
      .channel('conversations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
        fetchConversations();
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          fetchConversations();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase.rpc('get_messages', {
        p_conversation_id: conversationId,
        p_limit: 50,
      });
      if (err) throw err;

      setMessages((data as Message[]) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || !content.trim()) return null;

      try {
        const { data, error: err } = await supabase.rpc('send_message', {
          p_conversation_id: conversationId,
          p_content: content.trim(),
        });
        if (err) throw err;

        await fetchMessages();
        return data as Message;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        return null;
      }
    },
    [conversationId, fetchMessages],
  );

  const markAsRead = useCallback(async () => {
    if (!conversationId) return;

    try {
      await supabase.rpc('mark_messages_read', {
        p_conversation_id: conversationId,
      });
    } catch {
      // Silently fail - not critical
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!conversationId) return;

    const channel: RealtimeChannel = supabase
      .channel(`messages-${conversationId}`)
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
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMessage.id);
            if (exists) return prev;
            return [newMessage, ...prev];
          });
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          fetchMessages();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    if (conversationId && messages.length > 0) {
      markAsRead();
    }
  }, [conversationId, messages, markAsRead]);

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
}

export function useConversationForTrip(tripId: string | null) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getOrCreate = useCallback(async () => {
    if (!tripId) {
      setConversation(null);
      setLoading(false);
      return null;
    }

    try {
      const { data, error: err } = await supabase.rpc('get_or_create_conversation', {
        p_trip_id: tripId,
      });
      if (err) throw err;

      setConversation(data as Conversation);
      setError(null);
      return data as Conversation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get conversation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    getOrCreate();
  }, [getOrCreate]);

  return { conversation, loading, error, getOrCreate };
}
