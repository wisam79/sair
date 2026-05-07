import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { getCurrentISOString } from '@/lib/dates';

export function useRespondToRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
      const { error } = await supabase
        .from('subscription_requests')
        .update({
          status: accept ? 'accepted' : 'rejected',
          responded_at: getCurrentISOString(),
        })
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}
