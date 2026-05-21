import { useEffect, useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Trip, TripStatus, Subscription } from '@uniride/core';
import { useAuthStore } from './useStore';

const GPS_QUEUE_KEY = 'gps_offline_queue';
const PAGE_SIZE = 20;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unknown error occurred';
}

interface SubscriptionWithRoute extends Subscription {
  routes: {
    id: string;
    title: string;
    start_location: string;
    end_location: string;
    price: number;
  } | null;
}

import { OfflineCache } from '../lib/offlineCache';
import { logger } from '../lib/logger';

export function useSubscriptions(page = 0) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Try to load offline
        const offlineSub = await OfflineCache.getActiveSubscription();
        if (offlineSub) setSubscriptions([offlineSub as SubscriptionWithRoute]);
        return;
      }

      const from = page * PAGE_SIZE;
      const { data, error, count } = await supabase
        .from('subscriptions')
        .select('*, routes(*)', { count: 'exact' })
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;
      const newSubs = (data as SubscriptionWithRoute[]) || [];
      setSubscriptions(page === 0 ? newSubs : (prev) => [...prev, ...newSubs]);
      setHasMore(newSubs.length === PAGE_SIZE && (!count || from + PAGE_SIZE < count));

      // Cache active subscription for offline use
      if (page === 0) {
        const activeSub = newSubs.find((s) => s.status === 'active');
        await OfflineCache.saveActiveSubscription(activeSub || null);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
      // Fallback to offline cache on network error
      if (page === 0) {
        const offlineSub = await OfflineCache.getActiveSubscription();
        if (offlineSub) {
          setSubscriptions([offlineSub as SubscriptionWithRoute]);
          setError(null); // Clear error if we have offline data
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return { subscriptions, isLoading, error, refetch: fetchSubscriptions, hasMore };
}

export function useActiveTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .in('status', ['driver_waiting', 'in_transit'])
        .order('scheduled_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTrips((data as Trip[]) || []);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setupRealtime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      fetchTrips();

      channel = supabase
        .channel(`trips-active-${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
          if (!isMounted) return;
          const { eventType, new: newRow, old: oldRow } = payload;
          if (eventType === 'INSERT') {
            const inserted = newRow as Trip;
            if (['driver_waiting', 'in_transit'].includes(inserted.status)) {
              setTrips((prev) => {
                if (prev.some((t) => t.id === inserted.id)) return prev;
                return [inserted, ...prev];
              });
            }
          } else if (eventType === 'UPDATE') {
            const updated = newRow as Trip;
            if (!['driver_waiting', 'in_transit'].includes(updated.status)) {
              setTrips((prev) => prev.filter((t) => t.id !== updated.id));
            } else {
              setTrips((prev) => {
                const exists = prev.some((t) => t.id === updated.id);
                if (exists) {
                  return prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
                } else {
                  return [updated, ...prev];
                }
              });
            }
          } else if (eventType === 'DELETE') {
            const deletedId = (oldRow as { id?: string })?.id;
            if (deletedId) {
              setTrips((prev) => prev.filter((t) => t.id !== deletedId));
            }
          }
        })
        .subscribe((status) => {
          if ((status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') && isMounted) {
            fetchTrips();
          }
        });
    };

    setupRealtime();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [fetchTrips]);

  return { trips, isLoading, error, refetch: fetchTrips };
}

export interface TripWithRoute extends Trip {
  routes: {
    start_lat: number | null;
    start_lng: number | null;
    end_lat: number | null;
    end_lng: number | null;
    title: string;
  } | null;
  driver: {
    full_name: string;
    phone: string;
  } | null;
}

export function useTripTracking(tripId: string | null) {
  const [trip, setTrip] = useState<TripWithRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrip = useCallback(async () => {
    if (!tripId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*, routes(start_lat, start_lng, end_lat, end_lng, title)')
        .eq('id', tripId)
        .single();
      if (error) throw error;
      const baseTrip = data as TripWithRoute;

      let driver: TripWithRoute['driver'] = null;
      if (baseTrip.driver_id) {
        const { data: driverRecord } = await supabase
          .from('drivers')
          .select('profiles!drivers_user_id_fkey(full_name, phone)')
          .eq('id', baseTrip.driver_id)
          .single();

        const profileRow = Array.isArray(driverRecord?.profiles)
          ? driverRecord.profiles[0]
          : driverRecord?.profiles;
        driver = profileRow
          ? { full_name: profileRow.full_name ?? '', phone: profileRow.phone ?? '' }
          : null;
      }

      setTrip({ ...baseTrip, driver });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTrip();

    const channel = supabase
      .channel(`trip-${tripId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` },
        (payload) => {
          const updated = payload.new as Trip;
          setTrip((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              status: updated.status,
              last_lat: updated.last_lat,
              last_lng: updated.last_lng,
              started_at: updated.started_at,
              ended_at: updated.ended_at,
            };
          });
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          logger.warn('[Realtime] trip tracking reconnecting...', { status });
          fetchTrip();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, fetchTrip]);

  return { trip, isLoading, error, refetch: fetchTrip };
}

export function useDriverTrips(page = 0) {
  const [trips, setTrips] = useState<TripWithRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const driverIdRef = useRef<string | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // ✅ احصل على drivers.id أولاً — لا تستخدم auth.uid() مباشرة
      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (driverError || !driverData) {
        throw new Error('Driver profile not found');
      }

      driverIdRef.current = driverData.id;

      const from = page * PAGE_SIZE;
      const { data, error, count } = await supabase
        .from('trips')
        .select('*, routes(*)', { count: 'exact' })
        .eq('driver_id', driverData.id) // ✅ فلتر على السائق الحالي فقط
        .order('scheduled_at', { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;
      const newTrips = (data as TripWithRoute[]) || [];
      setTrips(page === 0 ? newTrips : (prev) => [...prev, ...newTrips]);
      setHasMore(newTrips.length === PAGE_SIZE && (!count || from + PAGE_SIZE < count));
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchTrips();

    const channel = supabase
      .channel('driver-trips-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
        const { eventType, new: newTripRow, old: oldTripRow } = payload;
        const newTrip = newTripRow as Trip | undefined;
        const oldTrip = oldTripRow as Trip | undefined;
        const currentDriverId = driverIdRef.current;

        if (
          currentDriverId &&
          ((newTrip && newTrip.driver_id === currentDriverId) ||
            (oldTrip && oldTrip.driver_id === currentDriverId))
        ) {
          if (eventType === 'UPDATE' && newTrip) {
            setTrips((prev) => prev.map((t) => (t.id === newTrip.id ? { ...t, ...newTrip } : t)));
          } else {
            fetchTrips();
          }
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          logger.warn('[Realtime] driver-trips channel error, re-fetching...', { status });
          fetchTrips();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTrips]);

  return { trips, isLoading, error, refetch: fetchTrips, hasMore };
}

interface QueuedLocation {
  tripId: string;
  lat: number;
  lng: number;
  timestamp: number;
  retries: number;
}

let memoryGpsQueue: QueuedLocation[] = [];
let writeTimeout: ReturnType<typeof setTimeout> | null = null;

function scheduleQueueWrite() {
  if (writeTimeout) return;
  writeTimeout = setTimeout(async () => {
    writeTimeout = null;
    try {
      if (memoryGpsQueue.length === 0) {
        await AsyncStorage.removeItem(GPS_QUEUE_KEY);
      } else {
        await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(memoryGpsQueue));
      }
    } catch (err) {
      logger.warn('Failed to write GPS queue to AsyncStorage', { error: getErrorMessage(err) });
    }
  }, 10000);
}

async function persistQueueImmediately() {
  if (writeTimeout) {
    clearTimeout(writeTimeout);
    writeTimeout = null;
  }
  try {
    if (memoryGpsQueue.length === 0) {
      await AsyncStorage.removeItem(GPS_QUEUE_KEY);
    } else {
      await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(memoryGpsQueue));
    }
  } catch (err) {
    logger.warn('Failed to write GPS queue immediately', { error: getErrorMessage(err) });
  }
}

async function flushGpsQueue() {
  try {
    const queueData = await AsyncStorage.getItem(GPS_QUEUE_KEY);
    if (!queueData) return;

    let queue: QueuedLocation[] = JSON.parse(queueData);
    if (queue.length === 0) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Send the entire queue in a single RPC call in snake_case
    const { error, data } = await supabase.rpc('bulk_update_trip_locations', {
      p_locations: queue.map((q) => ({ trip_id: q.tripId, lat: q.lat, lng: q.lng })),
    });

    if (error) {
      // Network error or global failure: increment retries and keep the queue
      queue = queue
        .map((item) => ({ ...item, retries: item.retries + 1 }))
        .filter((item) => {
          if (item.retries >= 3) {
            logger.warn('[GPS Queue] Dropping item after 3 retries', { item });
            return false;
          }
          return true;
        });

      if (queue.length > 0) {
        await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(queue));
      } else {
        await AsyncStorage.removeItem(GPS_QUEUE_KEY);
      }
      memoryGpsQueue = queue;
      return;
    }

    // Success: check if there are specific failed items from the RPC
    const responseData = data as { success_count: number; failed: unknown[] } | null;
    if (responseData?.failed && responseData.failed.length > 0) {
      logger.warn('[GPS Queue] Some locations were rejected by the server', {
        failed: responseData.failed,
      });
    }

    // If the RPC succeeded, we can clear the queue.
    await AsyncStorage.removeItem(GPS_QUEUE_KEY);
    memoryGpsQueue = [];
  } catch (err) {
    logger.warn('Failed to flush GPS queue', { error: getErrorMessage(err) });
  }
}

// ✅ exported for testing only
export { flushGpsQueue as flushGpsQueueForTest };

async function queueLocationUpdate(tripId: string, lat: number, lng: number) {
  if (memoryGpsQueue.length === 0) {
    try {
      const existing = await AsyncStorage.getItem(GPS_QUEUE_KEY);
      if (existing) {
        memoryGpsQueue = JSON.parse(existing);
      }
    } catch (e) {
      // Ignore
    }
  }

  const item: QueuedLocation = { tripId, lat, lng, timestamp: Date.now(), retries: 0 };
  memoryGpsQueue.push(item);

  // Phase 5: Memory optimization - Limit queue size to 100 items to prevent out-of-memory errors
  if (memoryGpsQueue.length > 100) {
    memoryGpsQueue = memoryGpsQueue.slice(memoryGpsQueue.length - 100);
  }

  scheduleQueueWrite();
}

export function useLocationTracker() {
  const watchRef = useRef<Location.LocationSubscription | null>(null);
  const isOnlineRef = useRef(true);

  const startTracking = useCallback(async (tripId: string) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return { error: 'Location permission denied' };
      }

      watchRef.current = await Location.watchPositionAsync(
        {
          // Phase 5: Battery Optimization
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10s max
          distanceInterval: 15, // Only if moved 15m
        },
        async (location) => {
          const { coords } = location;

          if (!isOnlineRef.current) {
            await queueLocationUpdate(tripId, coords.latitude, coords.longitude);
            return;
          }

          const { error } = await supabase.rpc('update_trip_location', {
            p_trip_id: tripId,
            p_lat: coords.latitude,
            p_lng: coords.longitude,
          });

          if (error) {
            if (error.code === 'NETWORK_ERROR' || !error.code) {
              isOnlineRef.current = false;
              await queueLocationUpdate(tripId, coords.latitude, coords.longitude);
              setTimeout(() => {
                isOnlineRef.current = true;
                flushGpsQueue();
              }, 5000);
            }
          }
        },
      );

      return { error: null };
    } catch (err: unknown) {
      return { error: getErrorMessage(err) };
    }
  }, []);

  const stopTracking = useCallback(() => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
    persistQueueImmediately();
  }, []);

  return { startTracking, stopTracking };
}

export interface TripHistoryItem {
  id: string;
  status: TripStatus;
  ended_at: string | null;
  routes: {
    title: string;
  } | null;
  drivers: {
    profiles: {
      full_name: string;
    } | null;
  } | null;
}

export function useTripHistory() {
  const [trips, setTrips] = useState<TripHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Load cached trip history on mount
  useEffect(() => {
    if (!user) return;
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem(`cached_trip_history_${user.id}`);
        if (cached) {
          setTrips(JSON.parse(cached));
          setLoading(false);
        }
      } catch (e) {
        // Ignore cache load failure
      }
    };
    loadCached();
  }, [user]);

  const fetchTrips = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Step 1: Get subscribed routes
      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('route_id')
        .eq('student_id', user.id)
        .in('status', ['active', 'expired']);

      if (subsError) throw subsError;

      const routeIds = subs?.map((s) => s.route_id) || [];

      if (routeIds.length === 0) {
        setTrips([]);
        setLoading(false);
        return;
      }

      // Step 2: Get completed trips for these routes
      const { data, error } = await supabase
        .from('trips')
        .select('id, status, ended_at, routes(title), drivers(profiles(full_name))')
        .in('route_id', routeIds)
        .eq('status', 'completed')
        .order('ended_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      if (data) {
        setTrips(data as unknown as TripHistoryItem[]);
        AsyncStorage.setItem(`cached_trip_history_${user.id}`, JSON.stringify(data)).catch(
          () => {},
        );
      }
    } catch (error) {
      console.error('Error fetching trip history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const refetch = () => {
    setRefreshing(true);
    fetchTrips();
  };

  return { trips, loading, refreshing, refetch };
}
