import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';
import type { SubscriptionData } from '@/context';

const QUERY_KEY = ['subscription'];

export function useSubscriptionQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user || user.role !== 'student') return null;
      const { data, error } = await supabase
        .from('subscriptions')
        .select(
          '*, driver:drivers(id, user_id, vehicle_info, capacity, available_seats, monthly_fee)',
        )
        .eq('student_id', user.id)
        .in('status', ['pending', 'active'])
        .order('created_at', { ascending: false })
        .maybeSingle();
      if (error) throw error;
      return data as SubscriptionData | null;
    },
    enabled: !!user && user.role === 'student',
    staleTime: 30_000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
