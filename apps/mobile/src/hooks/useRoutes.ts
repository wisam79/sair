import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Route } from '@sair/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { realtimeManager } from '../lib/realtimeManager';

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
    const unsubscribe = realtimeManager.subscribe({
      id: 'routes-changes',
      channelName: 'routes-changes',
      priority: 'normal',
      reconnect: true,
      subscriptions: [
        {
          event: 'postgres_changes',
          schema: 'public',
          table: 'routes',
          callback: (payload) => {
            queryClient.setQueriesData(
              { queryKey: ['routes'] },
              (old: { routes: Route[]; hasMore: boolean } | undefined, query) => {
                if (!old) return old;
                const queryInstitutionId = query.queryKey[1] as string | null | undefined;
                let updatedRoutes = [...old.routes];

                if (payload.eventType === 'UPDATE') {
                  const updatedRoute = payload.new as Route;
                  const matchesInstitution =
                    !queryInstitutionId || updatedRoute.institution_id === queryInstitutionId;
                  const isValid = updatedRoute.is_active && (updatedRoute.available_seats ?? 0) > 0;

                  if (matchesInstitution && isValid) {
                    const exists = updatedRoutes.some((r) => r.id === updatedRoute.id);
                    if (exists) {
                      updatedRoutes = updatedRoutes.map((r) =>
                        r.id === updatedRoute.id ? updatedRoute : r,
                      );
                    } else {
                      updatedRoutes = [updatedRoute, ...updatedRoutes];
                    }
                  } else {
                    updatedRoutes = updatedRoutes.filter((r) => r.id !== updatedRoute.id);
                  }
                } else if (payload.eventType === 'INSERT') {
                  const newRoute = payload.new as Route;
                  const matchesInstitution =
                    !queryInstitutionId || newRoute.institution_id === queryInstitutionId;
                  const isValid = newRoute.is_active && (newRoute.available_seats ?? 0) > 0;

                  if (matchesInstitution && isValid) {
                    const exists = updatedRoutes.some((r) => r.id === newRoute.id);
                    if (!exists) {
                      updatedRoutes = [newRoute, ...updatedRoutes];
                    }
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
          },
        },
      ],
    });

    return unsubscribe;
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

    const unsubscribe = realtimeManager.subscribe({
      id: `route-${routeId}`,
      channelName: `route-${routeId}`,
      priority: 'normal',
      reconnect: true,
      subscriptions: [
        {
          event: 'postgres_changes',
          schema: 'public',
          table: 'routes',
          filter: `id=eq.${routeId}`,
          callback: (payload) => {
            queryClient.setQueryData(queryKey, payload.new as Route);
          },
        },
      ],
    });

    return unsubscribe;
  }, [routeId, queryClient]);

  const errorMsg = error instanceof Error ? error.message : error ? String(error) : null;

  return { route, isLoading, error: errorMsg, refetch };
}
