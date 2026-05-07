import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';
import { useAppSettings } from './useAppSettings';

export function useBookRoute() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { monthly_fee } = useAppSettings();

  return useMutation({
    mutationFn: async (routeId: string) => {
      if (!user) return;

      const { data: routeData, error: routeError } = await supabase
        .from('routes')
        .select('driver_id, monthly_fee')
        .eq('id', routeId)
        .single();

      if (routeError || !routeData) {
        throw new Error('فشل جلب بيانات المسار');
      }

      const { error } = await supabase.rpc('process_subscription_payment', {
        p_student_id: user.id,
        p_driver_id: routeData.driver_id,
        p_monthly_fee: routeData.monthly_fee || monthly_fee,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['availableRoutes'] });
    },
  });
}
