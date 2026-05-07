import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';

export function useSubmitSubscriptionRequest() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      driverId,
      goTime,
      returnTime,
      pickupArea,
      dropoffArea,
    }: {
      driverId: string;
      goTime: string;
      returnTime: string;
      pickupArea: string;
      dropoffArea: string;
    }) => {
      if (!user || !user.institution_id) {
        throw new Error('يجب تحديد المؤسسة أولاً');
      }
      const { error } = await supabase.from('subscription_requests').insert({
        student_id: user.id,
        driver_id: driverId,
        institution_id: user.institution_id,
        go_time: goTime,
        return_time: returnTime,
        pickup_area: pickupArea,
        dropoff_area: dropoffArea,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
  });
}
