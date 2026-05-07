import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DEFAULT_APP_SETTINGS, AppSettings } from '@/lib/constants/financial';

export function useAppSettings() {
  const { data, error, isLoading } = useQuery<AppSettings, Error>({
    queryKey: ['appSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select(
          'monthly_fee, commission_bps, referral_discount, cancellation_fee, absence_deduction_rate, target_work_days, monthly_period_days',
        )
        .single();

      if (error) throw error;
      return {
        monthly_fee: data.monthly_fee,
        commission_amount_iqd: data.commission_bps,
        referral_discount: data.referral_discount,
        cancellation_fee: data.cancellation_fee,
        absence_deduction_rate: data.absence_deduction_rate,
        target_work_days: data.target_work_days,
        monthly_period_days: data.monthly_period_days,
      } as AppSettings;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  if (error) {
    console.warn('Failed to fetch app settings, falling back to defaults:', error.message);
  }

  return {
    ...(data ?? DEFAULT_APP_SETTINGS),
    isLoading,
    error,
  };
}
