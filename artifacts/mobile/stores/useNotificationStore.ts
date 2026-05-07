import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PersistOptions } from 'zustand/middleware';
import { mmkvStorage } from '@/lib/storage';
import { toast } from 'sonner-native';

export interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationState {
  notifications: NotificationData[];
  appNotifications: AppNotification[];
  unreadNotificationCount: number;
  notify: (message: string, type?: AppNotification['type']) => void;
  dismissNotification: (id: string) => void;
  markNotificationRead: (id: string) => Promise<void>;
  setNotifications: (notifications: NotificationData[]) => void;
}

type NotificationPersist = PersistOptions<NotificationState>;

const persistConfig: NotificationPersist = {
  name: 'notification-storage',
  storage: mmkvStorage,
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      appNotifications: [],
      unreadNotificationCount: 0,

      notify: (message, type = 'info' as AppNotification['type']) => {
        const id = Math.random().toString(36).slice(2);
        set((state) => ({
          appNotifications: [...state.appNotifications, { id, message, type }],
        }));
        setTimeout(() => {
          set((state) => ({
            appNotifications: state.appNotifications.filter((n) => n.id !== id),
          }));
        }, 4000);

        switch (type) {
          case 'success':
            toast.success(message);
            break;
          case 'error':
            toast.error(message);
            break;
          case 'warning':
            toast.warning(message);
            break;
          default:
            toast.info(message);
        }
      },

      dismissNotification: (id) => {
        set((state) => ({
          appNotifications: state.appNotifications.filter((n) => n.id !== id),
        }));
      },

      markNotificationRead: async (id) => {
        const { supabase } = await import('@/lib/supabase');
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
        }));
      },

      setNotifications: (notifications) => {
        set({
          notifications,
          unreadNotificationCount: notifications.filter((n) => !n.is_read).length,
        });
      },
    }),
    persistConfig,
  ),
);
