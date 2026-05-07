import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTripStore } from '@/stores/useTripStore';
import { TripData } from '@/stores/useTripStore';

export function useTripRealtime() {
  const user = useAuthStore((s) => s.user);
  const role = useAuthStore((s) => s.user?.role);
  const setActiveTrip = useTripStore((s) => s.setActiveTrip);
  const setTripHistory = useTripStore((s) => s.setTripHistory);

  useEffect(() => {
    if (!user) return;

    if (role === 'student') {
      const channel = supabase
        .channel(`student-trips-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'trip_students',
            filter: `student_id=eq.${user.id}`,
          },
          async (payload) => {
            const updatedRecord = payload.new as {
              trip_id: string;
              student_id: string;
              status: string;
            };
            if (updatedRecord.student_id === user.id) {
              const { data: tripData } = await supabase
                .from('trips')
                .select('*')
                .eq('id', updatedRecord.trip_id)
                .single();
              if (tripData) {
                setActiveTrip(tripData as TripData);
              }
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    if (role === 'driver') {
      const channel = supabase
        .channel(`driver-trips-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'trip_students',
          },
          async (payload) => {
            const updatedRecord = payload.new as {
              trip_id: string;
              student_id: string;
              status: string;
            };
            const { data: tripData } = await supabase
              .from('trips')
              .select('*')
              .eq('id', updatedRecord.trip_id)
              .single();
            if (tripData) {
              const { data: allTripStudents } = await supabase
                .from('trip_students')
                .select('*')
                .eq('trip_id', updatedRecord.trip_id);
              setActiveTrip({
                ...tripData,
                students: allTripStudents ?? [],
              } as TripData);
            }
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'trips',
            filter: `driver_id=eq.${user.id}`,
          },
          async () => {
            const { data: trips } = await supabase
              .from('trips')
              .select('*')
              .eq('driver_id', user.id)
              .order('created_at', { ascending: false });
            if (trips) {
              setTripHistory(trips as TripData[]);
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, role, setActiveTrip, setTripHistory]);
}
