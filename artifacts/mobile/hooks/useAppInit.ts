import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export function useAppInit() {
  const { loadUserProfile, setLoading, user } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data: { session },
        } = await (await import('@/lib/supabase')).supabase.auth.getSession();
        if (session && mounted) {
          await loadUserProfile(session.user.id);
        }
      } catch (err: any) {
        console.error('Failed to load session:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return { isLoading: useAuthStore((s) => s.isLoading), user };
}
