import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context';
import type { DriverProfile } from '@/context';

const QUERY_KEY = ['driverProfile'];

export function useDriverProfileQuery() {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user || user.role !== 'driver') return null;
      const { data, error } = await supabase
        .from('drivers')
        .select('*, profile:profiles!drivers_user_id_fkey(id, full_name, phone)')
        .eq('user_id', user.id)
        .single();
      if (error) throw error;
      return data as DriverProfile;
    },
    enabled: !!user && user.role === 'driver',
    staleTime: 30_000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useAvailableDriversQuery(institutionId: string) {
  return useQuery({
    queryKey: ['availableDrivers', institutionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*, profile:profiles!drivers_user_id_fkey(id, full_name, phone)')
        .eq('institution_id', institutionId)
        .eq('is_available', true)
        .gt('available_seats', 0);
      if (error) throw error;
      return (data || []) as DriverProfile[];
    },
    enabled: !!institutionId,
    staleTime: 30_000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
