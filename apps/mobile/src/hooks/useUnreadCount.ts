import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useStore';

export const useUnreadCount = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const fetchUnreadCount = async () => {
      try {
        const { data, error } = await supabase.rpc('get_unread_count');
        if (error) {
          console.error('Error fetching unread count:', error);
          return;
        }
        if (isMounted) {
          setUnreadCount(Number(data) || 0);
        }
      } catch (err) {
        console.error('Error in fetchUnreadCount:', err);
      }
    };

    fetchUnreadCount();

    // Subscribe to new messages where I am NOT the sender
    const channel = supabase
      .channel('unread_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=neq.${user.id}`,
        },
        () => {
          if (isMounted) fetchUnreadCount();
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
          if (isMounted) fetchUnreadCount();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  return unreadCount;
};
