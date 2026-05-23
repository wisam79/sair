import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useUnreadCount = () => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const queryKey = ['unreadCount', user?.id];

  const { data: unreadCount = 0 } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_unread_count');
      if (error) throw error;
      return Number(data) || 0;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages where I am NOT the sender
    const channel = supabase
      .channel(`unread_messages_${user.id}_${Math.random().toString(36).slice(2, 9)}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=neq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=neq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, queryKey]);

  return unreadCount;
};
