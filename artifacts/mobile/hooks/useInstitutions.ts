import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Institution } from '@/context';

const QUERY_KEY = ['institutions'];

export function useInstitutionsQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.from('institutions').select('*').order('name');
      if (error) throw error;
      return (data || []) as Institution[];
    },
    staleTime: 60_000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
