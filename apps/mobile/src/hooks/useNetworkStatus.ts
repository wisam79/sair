import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkConnection() {
      try {
        const { data, error } = await supabase.rpc('ping');
        if (mounted) setIsOnline(!error && data === true);
      } catch {
        if (mounted) setIsOnline(false);
      }
    }

    checkConnection();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') checkConnection();
    });

    const interval = setInterval(checkConnection, 30000);

    return () => {
      mounted = false;
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return { isOnline };
}
