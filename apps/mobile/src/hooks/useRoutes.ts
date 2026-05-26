import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Route } from '@sair/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

const PAGE_SIZE = 20;

export function useRoutes(institutionId?: string | null, page = 0) {
  const queryClient = useQueryClient();
  const queryKey = ['routes', institutionId, page];

  // Load cached routes on mount (only for page 0)
  useEffect(() => {
    if (page !== 0) return;
    const loadCached = async () => {
      try {
        const cached = await AsyncStorage.getItem('cached_routes');
        if (cached) {
          const parsed = JSON.parse(cached);
          // Seed the query cache if it has no data yet
          if (!queryClient.getQueryData(queryKey)) {
            queryClient.setQueryData(queryKey, { routes: parsed, hasMore: true });
          }
        }
      } catch (e) {
        // Ignore cache load failure
      }
    };
    loadCached();
  }, [queryClient, page, institutionId]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const from = page * PAGE_SIZE;
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

      const { data: routeData, error: err, count } = await query.range(from, to);

      if (err) throw err;
      const fetchedRoutes = routeData || [];

      if (page === 0) {
        AsyncStorage.setItem('cached_routes', JSON.stringify(fetchedRoutes)).catch(() => {});
      }

      const hasMoreValue =
        fetchedRoutes.length > 0 && (!count || from + fetchedRoutes.length < count);

      return {
        routes: fetchedRoutes,
        hasMore: hasMoreValue,
      };
    },
  });

  // Postgres realtime changes
  useEffect(() => {
    const channel = supabase
      .channel('routes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'routes' }, (payload) => {
        queryClient.setQueriesData(
          { queryKey: ['routes'] },
          (old: { routes: Route[]; hasMore: boolean } | undefined) => {
            if (!old) return old;
            let updatedRoutes = [...old.routes];
            if (payload.eventType === 'UPDATE') {
              updatedRoutes = updatedRoutes.map((r) =>
                r.id === payload.new.id ? ({ ...r, ...payload.new } as Route) : r,
              );
            } else if (payload.eventType === 'INSERT') {
              const exists = updatedRoutes.some((r) => r.id === payload.new.id);
              if (!exists) {
                updatedRoutes = [payload.new as Route, ...updatedRoutes];
              }
            } else if (payload.eventType === 'DELETE') {
              updatedRoutes = updatedRoutes.filter((r) => r.id !== payload.old.id);
            }
            return {
              ...old,
              routes: updatedRoutes,
            };
          },
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const routes = data?.routes ?? [];
  const hasMore = data?.hasMore ?? false;
  const errorMsg = error instanceof Error ? error.message : error ? String(error) : null;

  return { routes, isLoading, error: errorMsg, refetch, hasMore };
}

export function useRouteById(routeId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = ['route', routeId];

  const {
    data: route = null,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!routeId) return null;
      const { data, error } = await supabase.from('routes').select('*').eq('id', routeId).single();
      if (error) throw error;
      return data as Route;
    },
    enabled: !!routeId,
  });

  useEffect(() => {
    if (!routeId) return;

    const channel = supabase
      .channel(`route-${routeId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'routes', filter: `id=eq.${routeId}` },
        (payload) => {
          queryClient.setQueryData(queryKey, payload.new as Route);
        },
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[Realtime] route channel error, re-fetching...');
          NetInfo.fetch().then((state) => {
            const isOnline = !!state.isConnected && state.isInternetReachable !== false;
            if (isOnline) {
              refetch();
            }
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [routeId, queryClient, refetch]);

  const errorMsg = error instanceof Error ? error.message : error ? String(error) : null;

  return { route, isLoading, error: errorMsg, refetch };
}
