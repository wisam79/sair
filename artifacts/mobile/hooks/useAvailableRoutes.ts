import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const QUERY_KEY = ['availableRoutes'];

export function useAvailableRoutesQuery(institutionId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, institutionId],
    queryFn: async () => {
      let query = supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .gt('available_seats', 0);
      if (institutionId) query = query.eq('institution_id', institutionId);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 30_000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
