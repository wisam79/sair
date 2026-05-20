import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Route } from '@uniride/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAGE_SIZE = 20;

export function useRoutes(institutionId?: string | null, page = 0) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Load cached routes on mount
  useEffect(() => {
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem('cached_routes');
        if (cached) {
          setRoutes(JSON.parse(cached));
          setIsLoading(false);
        }
      } catch (e) {
        // Ignore cache load failure
      }
    };
    loadCached();
  }, []);

  const fetchRoutes = useCallback(
    async (isRefresh = false) => {
      try {
        setIsLoading(true);
        // If refreshing, we fetch everything from 0 up to the current page's end
        const from = isRefresh ? 0 : page * PAGE_SIZE;
        const to = page * PAGE_SIZE + PAGE_SIZE - 1;

        let query = supabase
          .from('routes')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .gt('available_seats', 0)
          .order('created_at', { ascending: false });

        if (institutionId) {
          query = query.eq('institution_id', institutionId);
        }

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;
        const newRoutes = data || [];
        setRoutes(
          page === 0 || isRefresh
            ? newRoutes
            : (prev) => {
                const existingIds = new Set(prev.map((r) => r.id));
                const unique = newRoutes.filter((r) => !existingIds.has(r.id));
                return [...prev, ...unique];
              },
        );

        if (page === 0 || isRefresh) {
          AsyncStorage.setItem('cached_routes', JSON.stringify(newRoutes)).catch(() => {});
        }

        // Calculate hasMore correctly regardless of isRefresh
        const currentFetchedCount = isRefresh ? newRoutes.length : from + newRoutes.length;
        setHasMore(newRoutes.length > 0 && (!count || currentFetchedCount < count));
        setError(null);
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
              ? err
              : 'Failed to fetch routes';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [page, institutionId],
  );

  useEffect(() => {
    fetchRoutes();

    const channel = supabase
      .channel('routes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'routes' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setRoutes((prev) =>
            prev.map((r) => (r.id === payload.new.id ? ({ ...r, ...payload.new } as Route) : r)),
          );
        } else if (payload.eventType === 'INSERT') {
          setRoutes((prev) => [payload.new as Route, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setRoutes((prev) => prev.filter((r) => r.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRoutes]);

  return { routes, isLoading, error, refetch: fetchRoutes, hasMore };
}

export function useRouteById(routeId: string | null) {
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = useCallback(async () => {
    if (!routeId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('routes').select('*').eq('id', routeId).single();

      if (error) throw error;
      setRoute(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
            ? err
            : 'Failed to fetch route';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    fetchRoute();

    const channel = supabase
      .channel(`route-${routeId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'routes', filter: `id=eq.${routeId}` },
        () => {
          // ✅ Re-fetch كامل — لا ندمج payload.new مباشرة (قد يفقد بيانات)
          fetchRoute();
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[Realtime] route channel error, re-fetching...');
          fetchRoute();
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [routeId, fetchRoute]);

  return { route, isLoading, error, refetch: fetchRoute };
}
