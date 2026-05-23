import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface FeatureFlag {
  name: string;
  enabled: boolean;
}

// Default flags — used before DB loads or on error
const DEFAULT_FLAGS: Record<string, boolean> = {
  realtime_tracking: true,
  push_notifications: true,
  offline_mode: true,
  ratings_system: true,
  zaincash_payment: false,
};

export function useFeatureFlags() {
  const queryClient = useQueryClient();
  const queryKey = ['feature_flags'];

  const { data: flags = DEFAULT_FLAGS, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase.from('feature_flags').select('name, enabled');

      if (error) throw error;

      const map = (data as FeatureFlag[]).reduce<Record<string, boolean>>((acc, f) => {
        acc[f.name] = f.enabled;
        return acc;
      }, {});

      logger.info('Feature flags loaded', { count: data.length });
      return map;
    },
    staleTime: Infinity, // flags do not change often, keep cached infinitely unless invalidated
  });

  useEffect(() => {
    // Live updates — admin can toggle flags without app restart
    const channel = supabase
      .channel('feature-flags-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feature_flags' }, () => {
        logger.info('Feature flags changed — reloading');
        queryClient.invalidateQueries({ queryKey });
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          logger.warn('[Realtime] feature-flags channel error');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey]);

  const isEnabled = useCallback(
    (flagName: string): boolean => flags[flagName] ?? DEFAULT_FLAGS[flagName] ?? false,
    [flags],
  );

  return { flags, isEnabled, isLoading };
}
