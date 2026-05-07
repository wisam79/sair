import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth, useDriver } from '@/context';
import type { TripData } from '@/context';

const QUERY_KEY = ['tripHistory'];

export function useTripHistoryQuery() {
  const { user } = useAuth();
  const { driver } = useDriver();

  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user) return [];

      let tripsData: any[] = [];

      if (driver) {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('driver_id', driver.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data) tripsData = data;
      } else {
        const { data, error } = await supabase
          .from('trip_students')
          .select('trips(*)')
          .eq('student_id', user.id);
        if (error) throw error;
        if (data) {
          tripsData = data.map((d) => d.trips).filter(Boolean);
        }
      }

      return tripsData as TripData[];
    },
    enabled: !!user,
    staleTime: 30_000,
    retry: 3,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
