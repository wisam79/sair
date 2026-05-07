import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/context';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => {
      const forbiddenKeys = ['role', 'is_admin', 'user_id', 'is_activated'];
      for (const key of forbiddenKeys) {
        if (key in updates) {
          throw new Error(`لا يمكنك تحديث ${key}`);
        }
      }
      const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['driverProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profiles', variables.userId] });
    },
  });
}
