import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';
import type { SubscriptionPlan } from '@/context';
import { formatDateShort, addDaysToDate } from '@/lib/dates';

export function useSubscribeToPlan() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ driverId, plan }: { driverId: string; plan: SubscriptionPlan }) => {
      if (!user) return;

      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('monthly_fee')
        .eq('id', driverId)
        .single();

      if (driverError || !driverData) {
        throw new Error('فشل جلب بيانات السائق');
      }

      if (typeof driverData.monthly_fee !== 'number' || driverData.monthly_fee <= 0) {
        throw new Error('بيانات تسعير السائق غير صالحة ولا يمكن إتمام الاشتراك');
      }

      const monthlyFee = driverData.monthly_fee;

      const { error } = await supabase.from('subscriptions').insert({
        student_id: user.id,
        driver_id: driverId,
        monthly_fee: monthlyFee,
        status: 'pending',
        start_date: formatDateShort(new Date()),
        end_date: formatDateShort(addDaysToDate(new Date(), 30)),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}
