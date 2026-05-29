import { useEffect, useState, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { Trip, TripStatus, Subscription, Route, getErrorMessage } from '@sair/core';
import { useAuthStore, useTripStore } from './useStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OfflineCache } from '../lib/offlineCache';
import { logger } from '../lib/logger';
import NetInfo from '@react-native-community/netinfo';
import { offlineQueue, QUEUE_LIMITS } from '../lib/offlineQueue';
import { realtimeManager } from '../lib/realtimeManager';
import Constants from 'expo-constants';

function isExpoGo(): boolean {
  return Constants.appOwnership === 'expo';
}

const GPS_QUEUE_KEY = 'gps_offline_queue';
const PAGE_SIZE = 20;

export interface SubscriptionWithRoute extends Subscription {
  routes: {
    id: string;
    title: string;
    start_location: string;
    end_location: string;
    price: number;
  } | null;
}

export interface TripWithRoute extends Trip {
  routes: {
    start_lat: number | null;
    start_lng: number | null;
    end_lat: number | null;
    end_lng: number | null;
    title: string;
    start_location: string;
    end_location: string;
  } | null;
  driver: {
    id?: string;
    user_id?: string;
    full_name: string;
    phone: string;
    vehicle_model?: string;
    vehicle_plate?: string;
    capacity?: number;
    avg_rating?: number;
    completed_trips?: number;
  } | null;
}

export function useSubscriptions(page = 0) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['subscriptions', page],
    queryFn: async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          const offlineSub = await OfflineCache.getActiveSubscription();
          return offlineSub ? [offlineSub as SubscriptionWithRoute] : [];
        }

        const from = page * PAGE_SIZE;
        const { data: list, error: err } = await supabase
          .from('subscriptions')
          .select('*, routes(*)')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .range(from, from + PAGE_SIZE - 1);

        if (err) throw err;
        const newSubs = (list as SubscriptionWithRoute[]) || [];
        if (page === 0) {
          const activeSub = newSubs.find((s) => s.status === 'active');
          await OfflineCache.saveActiveSubscription(activeSub || null);
        }
        return newSubs;
      } catch (err) {
        if (page === 0) {
          const offlineSub = await OfflineCache.getActiveSubscription();
          if (offlineSub) {
            return [offlineSub as SubscriptionWithRoute];
          }
        }
        throw err;
      }
    },
  });

  return {
    subscriptions: data || [],
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
    hasMore: (data?.length ?? 0) === PAGE_SIZE,
  };
}

export function useActiveTrips() {
  const queryClient = useQueryClient();

  const {
    data: trips = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['activeTrips'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .in('status', ['driver_waiting', 'in_transit'])
        .order('scheduled_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return (data as Trip[]) || [];
    },
  });

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const setupRealtime = async () => {
      if (!isMounted) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      unsubscribe = realtimeManager.subscribe({
        id: `trips-active-${user.id}`,
        channelName: `trips-active-${user.id}`,
        priority: 'critical',
        reconnect: true,
        onError: (status) => {
          NetInfo.fetch().then((state) => {
            const isOnline = !!state.isConnected && state.isInternetReachable !== false;
            if (isOnline && isMounted) refetch();
          });
        },
        subscriptions: [
          {
            event: 'postgres_changes',
            schema: 'public',
            table: 'trips',
            callback: (payload) => {
              if (!isMounted) return;
              const { eventType, new: newRow, old: oldRow } = payload;

              queryClient.setQueryData<Trip[]>(['activeTrips'], (prev = []) => {
                if (eventType === 'INSERT') {
                  const inserted = newRow as Trip;
                  if (['driver_waiting', 'in_transit'].includes(inserted.status)) {
                    if (prev.some((t) => t.id === inserted.id)) return prev;
                    return [inserted, ...prev];
                  }
                } else if (eventType === 'UPDATE') {
                  const updated = newRow as Trip;
                  if (!['driver_waiting', 'in_transit'].includes(updated.status)) {
                    return prev.filter((t) => t.id !== updated.id);
                  } else {
                    const exists = prev.some((t) => t.id === updated.id);
                    if (exists) {
                      return prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
                    } else {
                      return [updated, ...prev];
                    }
                  }
                } else if (eventType === 'DELETE') {
                  const deletedId = (oldRow as { id?: string })?.id;
                  if (deletedId) {
                    return prev.filter((t) => t.id !== deletedId);
                  }
                }
                return prev;
              });
            },
          },
        ],
      });
    };

    setupRealtime();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [queryClient]);

  return { trips, isLoading, error: error ? getErrorMessage(error) : null, refetch };
}

export function useTripTracking(tripId: string | null) {
  const queryClient = useQueryClient();

  const {
    data: trip = null,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['tripTracking', tripId],
    queryFn: async () => {
      if (!tripId) return null;
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
          .select(
            'vehicle_model, vehicle_plate, capacity, profiles!drivers_user_id_fkey(id, full_name, phone)',
          )
          .eq('id', baseTrip.driver_id)
          .single();

        const profileRow = driverRecord?.profiles
          ? Array.isArray(driverRecord.profiles)
            ? driverRecord.profiles[0]
            : driverRecord.profiles
          : null;

        if (profileRow) {
          // Fetch completed trips count
          const { count: tripsCount } = await supabase
            .from('trips')
            .select('id', { count: 'exact', head: true })
            .eq('driver_id', baseTrip.driver_id)
            .eq('status', 'completed');

          // Fetch average rating
          const { data: ratingsData } = await supabase
            .from('ratings')
            .select('rating')
            .eq('driver_id', profileRow.id);

          let avgRating = 0;
          if (ratingsData && ratingsData.length > 0) {
            const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
            avgRating = Math.round((sum / ratingsData.length) * 10) / 10;
          }

          driver = {
            id: baseTrip.driver_id,
            user_id: profileRow.id,
            full_name: profileRow.full_name ?? '',
            phone: profileRow.phone ?? '',
            vehicle_model: driverRecord.vehicle_model ?? undefined,
            vehicle_plate: driverRecord.vehicle_plate ?? undefined,
            capacity: driverRecord.capacity ?? undefined,
            avg_rating: avgRating || undefined,
            completed_trips: tripsCount ?? 0,
          };
        }
      }
      return { ...baseTrip, driver };
    },
    enabled: !!tripId,
  });

  useEffect(() => {
    if (!tripId) return;

    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let retryCount = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const teardown = () => {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };

    const setupRealtime = () => {
      if (!isMounted) return;

      channel = supabase
        .channel(`trip-tracking-${tripId}-${Math.random().toString(36).substring(2, 8)}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'trips', filter: `id=eq.${tripId}` },
          (payload) => {
            if (!isMounted) return;
            const updated = payload.new as Trip;
            queryClient.setQueryData<TripWithRoute | null>(['tripTracking', tripId], (prev) => {
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
        .on('broadcast', { event: 'gps-update' }, (payload) => {
          if (!isMounted) return;
          const { lat, lng } = payload.payload;
          queryClient.setQueryData<TripWithRoute | null>(['tripTracking', tripId], (prev) => {
            if (!prev) return null;
            return { ...prev, last_lat: lat, last_lng: lng };
          });
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            retryCount = 0;
          }

          if ((status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') && isMounted) {
            logger.warn('[Realtime] trip-tracking channel error, will reconnect...', {
              status,
              tripId,
              attempt: retryCount + 1,
            });

            NetInfo.fetch().then((state) => {
              const isOnline = !!state.isConnected && state.isInternetReachable !== false;
              if (isOnline && isMounted) refetch();
            });

            teardown();
            const delay = Math.min(1000 * 2 ** retryCount, 30000);
            retryCount += 1;
            retryTimer = setTimeout(() => setupRealtime(), delay);
          }
        });
    };

    setupRealtime();

    return () => {
      isMounted = false;
      teardown();
    };
  }, [tripId, queryClient, refetch]);

  return { trip, isLoading, error: error ? getErrorMessage(error) : null, refetch };
}

export function useDriverTrips(page = 0) {
  const queryClient = useQueryClient();
  const driverIdRef = useRef<string | null>(null);
  const { activeTripId, currentStatus, tripRouteId } = useTripStore();

  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['driverTrips', page],
    queryFn: async () => {
      let currentUser: import('@supabase/supabase-js').User | null = null;
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        currentUser = user;
        if (!user) {
          const cached = await AsyncStorage.getItem('driver_trips_cache');
          return cached ? (JSON.parse(cached) as TripWithRoute[]) : [];
        }

        const netState = await NetInfo.fetch();
        const isOnline = !!netState.isConnected && netState.isInternetReachable !== false;
        const cacheKey = `driver_trips_cache_${user.id}`;

        if (!isOnline) {
          const cached = await AsyncStorage.getItem(cacheKey);
          return cached ? (JSON.parse(cached) as TripWithRoute[]) : [];
        }

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
        const { data: list, error: err } = await supabase
          .from('trips')
          .select('*, routes(*)')
          .eq('driver_id', driverData.id)
          .order('scheduled_at', { ascending: false })
          .range(from, from + PAGE_SIZE - 1);

        if (err) throw err;
        const fetchedTrips = (list as TripWithRoute[]) || [];

        if (page === 0) {
          await AsyncStorage.setItem(cacheKey, JSON.stringify(fetchedTrips));
        }

        return fetchedTrips;
      } catch (err) {
        try {
          const user = currentUser || (await supabase.auth.getUser()).data.user;
          if (user) {
            const cached = await AsyncStorage.getItem(`driver_trips_cache_${user.id}`);
            if (cached) {
              return JSON.parse(cached) as TripWithRoute[];
            }
          }
        } catch (_) {
          logger.warn('[Cache] Failed to load offline driver trips');
        }
        throw err;
      }
    },
  });

  const [mergedTrips, setMergedTrips] = useState<TripWithRoute[]>(data);

  useEffect(() => {
    if (activeTripId && activeTripId.startsWith('local_trip_')) {
      const getLocalTrip = async () => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
          const cachedRoutesRaw = await AsyncStorage.getItem(`driver_routes_${user.id}`);
          if (cachedRoutesRaw) {
            const cachedRoutes = JSON.parse(cachedRoutesRaw) as Route[];
            const matchingRoute = cachedRoutes.find((r) => r.id === tripRouteId);
            if (matchingRoute) {
              const localTrip: TripWithRoute = {
                id: activeTripId,
                route_id: tripRouteId || '',
                driver_id: '',
                status: currentStatus || 'scheduled',
                scheduled_at: new Date().toISOString(),
                started_at: null,
                ended_at: null,
                last_lat: null,
                last_lng: null,
                routes: {
                  start_lat: matchingRoute.start_lat ?? null,
                  start_lng: matchingRoute.start_lng ?? null,
                  end_lat: matchingRoute.end_lat ?? null,
                  end_lng: matchingRoute.end_lng ?? null,
                  title: matchingRoute.title,
                  start_location: matchingRoute.start_location,
                  end_location: matchingRoute.end_location,
                },
                driver: null,
              };

              setMergedTrips((prev) => {
                const exists = prev.some((t) => t.id === activeTripId);
                if (exists) {
                  return prev.map((t) =>
                    t.id === activeTripId ? { ...t, status: currentStatus || t.status } : t,
                  );
                }
                return [localTrip, ...prev.filter((t) => t.id !== activeTripId)];
              });
            }
          }
        } catch (_) {
          logger.warn('[Cache] Failed to load local route information for trip merge');
        }
      };
      getLocalTrip();
    } else {
      setMergedTrips(data);
    }
  }, [data, activeTripId, currentStatus, tripRouteId]);

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let retryCount = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const teardown = () => {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };

    const setupRealtime = () => {
      if (!isMounted) return;

      // New unique name each reconnect attempt to prevent stale channel conflicts
      const channelName = `driver-trips-${driverIdRef.current || 'pending'}-p${page}-${Math.random().toString(36).substring(2, 8)}`;
      channel = supabase
        .channel(channelName)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, (payload) => {
          if (!isMounted) return;
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
              queryClient.setQueryData<TripWithRoute[]>(['driverTrips', page], (prev = []) => {
                return prev.map((t) => (t.id === newTrip.id ? { ...t, ...newTrip } : t));
              });
            } else {
              refetch();
            }
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            retryCount = 0;
          }

          if ((status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') && isMounted) {
            logger.warn('[Realtime] driver-trips channel error, will reconnect...', {
              status,
              attempt: retryCount + 1,
            });

            NetInfo.fetch().then((state) => {
              const isOnline = !!state.isConnected && state.isInternetReachable !== false;
              if (isOnline && isMounted) refetch();
            });

            teardown();
            const delay = Math.min(1000 * 2 ** retryCount, 30000);
            retryCount += 1;
            retryTimer = setTimeout(() => setupRealtime(), delay);
          }
        });
    };

    setupRealtime();

    return () => {
      isMounted = false;
      teardown();
    };
  }, [page, queryClient, refetch]);

  return {
    trips: mergedTrips,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
    hasMore: data.length === PAGE_SIZE,
  };
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
  // Debounce: reset timer on each call so we always write the latest state
  if (writeTimeout) {
    clearTimeout(writeTimeout);
  }
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
  }, 3000);
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
  await offlineQueue.withGpsMutex(async () => {
    try {
      // CRITICAL FIX: persist in-memory queue to AsyncStorage first.
      // Without this, memoryGpsQueue may contain locations not yet written
      // by scheduleQueueWrite (which has a 3s debounce delay), causing
      // flushGpsQueue to read stale/empty data from AsyncStorage.
      await persistQueueImmediately();

      const queueData = await AsyncStorage.getItem(GPS_QUEUE_KEY);
      if (!queueData) return;

      let queue: QueuedLocation[] = JSON.parse(queueData);
      if (queue.length === 0) return;

      // Filter out locations that still have local trip IDs (not synced yet)
      const readyLocations = queue.filter((q) => !q.tripId.startsWith('local_trip_'));
      const notReadyLocations = queue.filter((q) => q.tripId.startsWith('local_trip_'));

      if (readyLocations.length > 0) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { error, data } = await supabase.rpc('bulk_update_trip_locations', {
          p_locations: readyLocations.map((q) => ({ trip_id: q.tripId, lat: q.lat, lng: q.lng })),
        });

        if (error) {
          let failedQueue = queue
            .map((item) => {
              if (!item.tripId.startsWith('local_trip_')) {
                return { ...item, retries: item.retries + 1 };
              }
              return item;
            })
            .filter((item) => {
              if (item.retries >= 3) {
                logger.warn('[GPS Queue] Dropping item after 3 retries', { item });
                return false;
              }
              return true;
            });

          if (failedQueue.length > 0) {
            await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(failedQueue));
          } else {
            await AsyncStorage.removeItem(GPS_QUEUE_KEY);
          }
          memoryGpsQueue = failedQueue;
          return;
        }

        const responseData = data as { success_count: number; failed: unknown[] } | null;
        if (responseData?.failed && responseData.failed.length > 0) {
          logger.warn('[GPS Queue] Some locations were rejected by the server', {
            failed: responseData.failed,
          });
        }
      }

      if (notReadyLocations.length > 0) {
        await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(notReadyLocations));
        memoryGpsQueue = notReadyLocations;
      } else {
        if (readyLocations.length > 0) {
          await AsyncStorage.removeItem(GPS_QUEUE_KEY);
          memoryGpsQueue = [];
        }
      }
    } catch (err) {
      logger.warn('Failed to flush GPS queue', { error: getErrorMessage(err) });
    }
  });
}

// Cascading Offline Sync Manager
let isSyncing = false;

/** Safely parse JSON from AsyncStorage, returning fallback on corrupt data */
function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    logger.warn('[Offline Sync] Corrupted JSON in AsyncStorage, using fallback', {
      raw: raw.slice(0, 100),
    });
    return fallback;
  }
}

interface PendingOfflineTrip {
  localId: string;
  routeId: string;
  scheduledAt: string;
}

interface PendingStatusUpdate {
  tripId: string;
  newStatus: TripStatus;
  lat: number;
  lng: number;
}

export async function syncOfflineData() {
  if (isSyncing) return;
  isSyncing = true;
  try {
    const netState = await NetInfo.fetch();
    const isOnline = !!netState.isConnected && netState.isInternetReachable !== false;
    if (!isOnline) return;

    try {
      // Step 0: Cleanup orphaned local IDs older than 1 hour
      await offlineQueue.cleanupOrphanedLocalIds();
      // Step 0.5: Prune entries older than 24 hours
      await offlineQueue.pruneStale('pending_trips_creation_queue');
      await offlineQueue.pruneStale('pending_status_updates');
      await offlineQueue.pruneStale(GPS_QUEUE_KEY);

      // 1. Sync Offline Trips Creation
      const pendingTripsKey = 'pending_trips_creation_queue';
      const pendingTripsRaw = await AsyncStorage.getItem(pendingTripsKey);
      let pendingTrips = safeJsonParse<PendingOfflineTrip[]>(pendingTripsRaw, []);
      if (pendingTrips.length > 0) {
        const activeTripStore = useTripStore.getState();
        const remainingTrips = [];

        for (const item of pendingTrips) {
          try {
            const { data: realTripId, error } = await supabase.rpc('create_trip', {
              p_route_id: item.routeId,
              p_scheduled_at: item.scheduledAt,
            });

            if (error) throw error;

            // Swap local ID with real ID in useTripStore if it matches
            if (activeTripStore.activeTripId === item.localId) {
              activeTripStore.setActiveTrip(
                realTripId,
                activeTripStore.currentStatus || 'driver_waiting',
                item.routeId,
              );
            }

            // Swap ID in pending status updates
            const statusKey = 'pending_status_updates';
            const statusRaw = await AsyncStorage.getItem(statusKey);
            let statusUpdates = safeJsonParse<PendingStatusUpdate[]>(statusRaw, []);
            statusUpdates = statusUpdates.map((u: PendingStatusUpdate) =>
              u.tripId === item.localId ? { ...u, tripId: realTripId } : u,
            );
            await AsyncStorage.setItem(statusKey, JSON.stringify(statusUpdates));

            // Swap ID in GPS offline queue
            const gpsRaw = await AsyncStorage.getItem(GPS_QUEUE_KEY);
            let gpsQueue = safeJsonParse<QueuedLocation[]>(gpsRaw, []);
            gpsQueue = gpsQueue.map((g: QueuedLocation) =>
              g.tripId === item.localId ? { ...g, tripId: realTripId } : g,
            );
            await AsyncStorage.setItem(GPS_QUEUE_KEY, JSON.stringify(gpsQueue));

            memoryGpsQueue = memoryGpsQueue.map((g) =>
              g.tripId === item.localId ? { ...g, tripId: realTripId } : g,
            );
          } catch (err) {
            logger.warn('[Offline Sync] Failed to create trip, leaving in queue', err);
            remainingTrips.push(item);
          }
        }

        await AsyncStorage.setItem(pendingTripsKey, JSON.stringify(remainingTrips));
      }

      // 2. Sync Offline Status Transitions
      const statusKey = 'pending_status_updates';
      const statusRaw = await AsyncStorage.getItem(statusKey);
      let statusUpdates = safeJsonParse<PendingStatusUpdate[]>(statusRaw, []);
      if (statusUpdates.length > 0) {
        const remainingStatusUpdates = [];

        for (const update of statusUpdates) {
          if (update.tripId.startsWith('local_trip_')) {
            remainingStatusUpdates.push(update);
            continue;
          }

          try {
            const { error } = await supabase.functions.invoke('trip-engine', {
              body: {
                trip_id: update.tripId,
                new_status: update.newStatus,
                lat: update.lat,
                lng: update.lng,
              },
            });

            if (error) throw error;
          } catch (err) {
            logger.warn('[Offline Sync] Failed to update status, leaving in queue', err);
            remainingStatusUpdates.push(update);
          }
        }

        await AsyncStorage.setItem(statusKey, JSON.stringify(remainingStatusUpdates));
      }

      // 3. Flush GPS location queue
      await flushGpsQueue();
    } catch (err) {
      logger.warn('[Offline Sync] General sync error', err);
    }
  } finally {
    isSyncing = false;
  }
}

// Global network listener to sync data automatically when internet returns
NetInfo.addEventListener((state) => {
  const isOnline = !!state.isConnected && state.isInternetReachable !== false;
  if (isOnline) {
    const jitter = process.env.NODE_ENV === 'test' ? 0 : Math.floor(Math.random() * 14500) + 500;
    if (jitter > 0) {
      setTimeout(() => {
        syncOfflineData().catch(() => {});
      }, jitter);
    } else {
      syncOfflineData().catch(() => {});
    }
  }
});

export { flushGpsQueue as flushGpsQueueForTest };

async function queueLocationUpdate(tripId: string, lat: number, lng: number) {
  await offlineQueue.withGpsMutex(async () => {
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

    if (memoryGpsQueue.length > QUEUE_LIMITS.gpsLocations) {
      memoryGpsQueue = memoryGpsQueue.slice(memoryGpsQueue.length - QUEUE_LIMITS.gpsLocations);
    }

    scheduleQueueWrite();
  });
}

export function useLocationTracker() {
  const watchRef = useRef<{ remove: () => void } | null>(null);
  const isOnlineRef = useRef(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const lastDbWriteTimeRef = useRef<number>(0);

  const handleLocationUpdate = useCallback(async (tripId: string, lat: number, lng: number) => {
    // 1. Broadcast live location update in-memory (high performance, no DB write)
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'gps-update',
        payload: { lat, lng },
      });
    }

    // 2. Throttle database location writes to once every 30 seconds (disabled in tests)
    const now = Date.now();
    const throttleLimit = process.env.NODE_ENV === 'test' ? 0 : 30000;
    if (now - lastDbWriteTimeRef.current >= throttleLimit) {
      lastDbWriteTimeRef.current = now;

      if (!isOnlineRef.current) {
        await queueLocationUpdate(tripId, lat, lng);
        return;
      }

      const { error } = await supabase.rpc('update_trip_location', {
        p_trip_id: tripId,
        p_lat: lat,
        p_lng: lng,
      });

      if (error) {
        if (error.code === 'NETWORK_ERROR' || !error.code) {
          isOnlineRef.current = false;
          await queueLocationUpdate(tripId, lat, lng);

          // Wait for actual network recovery instead of arbitrary 5s
          const unsubscribe = NetInfo.addEventListener((state) => {
            const online = !!state.isConnected && state.isInternetReachable !== false;
            if (online) {
              isOnlineRef.current = true;
              unsubscribe();
              flushGpsQueue();
            }
          });
          // Safety timeout: force recovery check after 30s
          setTimeout(() => {
            unsubscribe();
            isOnlineRef.current = true;
          }, 30000);
        }
      }
    }
  }, []);

  const startExpoLocationFallback = useCallback(
    async (tripId: string) => {
      logger.warn('[LocationTracker] Using fallback Location.watchPositionAsync');
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return { error: 'Location permission denied' };
      }

      // Initialize realtime channel for broadcasting coordinates directly
      const channel = supabase.channel(`trip-${tripId}`, {
        config: { broadcast: { self: false } },
      });
      channel.subscribe();
      channelRef.current = channel;
      lastDbWriteTimeRef.current = 0; // reset on tracking start

      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000,
          distanceInterval: 15,
        },
        async (location) => {
          const { coords } = location;
          await handleLocationUpdate(tripId, coords.latitude, coords.longitude);
        },
      );

      return { error: null };
    },
    [handleLocationUpdate],
  );

  const startTracking = useCallback(
    async (tripId: string) => {
      try {
        const isGo = isExpoGo();

        if (isGo) {
          return startExpoLocationFallback(tripId);
        }

        // Standalone or Dev Build: Use Radar SDK
        let Radar: typeof import('react-native-radar').default;
        try {
          Radar = require('react-native-radar').default;
        } catch (e) {
          logger.warn('[LocationTracker] Failed to load Radar module, using Location fallback', {
            error: e,
          });
          return startExpoLocationFallback(tripId);
        }

        const publishableKey = process.env.EXPO_PUBLIC_RADAR_PUBLISHABLE_KEY;
        if (!publishableKey) {
          console.warn('[LocationTracker] Radar key missing.');
          return { error: 'Radar API key missing' };
        }

        // Initialize Radar
        Radar.initialize(publishableKey);

        // Get user from auth store to tag Radar user
        const user = useAuthStore.getState().user;
        if (user) {
          Radar.setUserId(user.id);
          Radar.setMetadata({ tripId });
        }

        // Initialize realtime channel
        const channel = supabase.channel(`trip-${tripId}`, {
          config: { broadcast: { self: false } },
        });
        channel.subscribe();
        channelRef.current = channel;
        lastDbWriteTimeRef.current = 0;

        // Start continuous background tracking
        Radar.startTrackingContinuous();

        // Listen for location updates
        const listener = (result: import('react-native-radar').RadarResult) => {
          if (result.location) {
            const { latitude, longitude } = result.location;
            handleLocationUpdate(tripId, latitude, longitude);
          }
        };

        Radar.onLocationUpdated(listener);
        watchRef.current = {
          remove: () => {
            Radar.stopTracking();
            Radar.onLocationUpdated(null);
          },
        };

        return { error: null };
      } catch (err: unknown) {
        return { error: getErrorMessage(err) };
      }
    },
    [handleLocationUpdate, startExpoLocationFallback],
  );

  const stopTracking = useCallback(() => {
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
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
  const user = useAuthStore((state) => state.user);

  const {
    data: trips = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['tripHistory', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: subs, error: subsError } = await supabase
        .from('subscriptions')
        .select('route_id')
        .eq('student_id', user.id)
        .in('status', ['active', 'expired']);

      if (subsError) throw subsError;

      const routeIds = subs?.map((s) => s.route_id) || [];

      if (routeIds.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('trips')
        .select('id, status, ended_at, routes(title), drivers(profiles(full_name))')
        .in('route_id', routeIds)
        .eq('status', 'completed')
        .order('ended_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        AsyncStorage.setItem(`cached_trip_history_${user.id}`, JSON.stringify(data)).catch(
          () => {},
        );
        return data as unknown as TripHistoryItem[];
      }
      return [];
    },
    enabled: !!user,
  });

  const [initialTrips, setInitialTrips] = useState<TripHistoryItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsInitialLoading(false);
      return;
    }
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem(`cached_trip_history_${user.id}`);
        if (cached) {
          setInitialTrips(JSON.parse(cached));
        }
      } catch (e) {
        // Ignore
      } finally {
        setIsInitialLoading(false);
      }
    };
    loadCached();
  }, [user]);

  const tripsToReturn = trips.length > 0 ? trips : initialTrips;

  return {
    trips: tripsToReturn,
    loading: isLoading && isInitialLoading,
    refreshing: isRefetching,
    refetch,
  };
}
