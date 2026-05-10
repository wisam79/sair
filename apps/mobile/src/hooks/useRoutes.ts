import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Route } from '@uniride/core';

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('is_active', true)
        .gt('available_seats', 0);

      if (error) throw error;
      setRoutes(data || []);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Failed to fetch routes';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();

    const channel = supabase
      .channel('routes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'routes' }, () => {
        fetchRoutes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRoutes]);

  return { routes, isLoading, error, refetch: fetchRoutes };
}

export function useRouteById(routeId: string | null) {
  const [route, setRoute] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!routeId) {
      setIsLoading(false);
      return;
    }

    async function fetchRoute() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('id', routeId)
          .single();

        if (error) throw error;
        setRoute(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : typeof err === 'string' ? err : 'Failed to fetch route';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoute();
  }, [routeId]);

  return { route, isLoading, error };
}
