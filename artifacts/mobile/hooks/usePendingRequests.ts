import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';
import type { SubscriptionRequestData } from '@/context';

const QUERY_KEY = ['pendingRequests'];

export function usePendingRequestsQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user || user.role !== 'driver') return [];

      const { data: drv } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (!drv) return [];

      const { data, error } = await supabase
        .from('subscription_requests')
        .select('*')
        .eq('driver_id', drv.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as SubscriptionRequestData[];
    },
    enabled: !!user && user.role === 'driver',
    staleTime: 30_000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
