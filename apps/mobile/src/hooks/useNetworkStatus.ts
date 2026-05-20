import { useState, useEffect } from 'react';
import { AppState } from 'react-native';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function checkConnection() {
      let nextStatus = false;
      try {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchTimeout = setTimeout(() => controller.abort(), 3000);

        const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
        // Lightweight request to Supabase API gateway to check connection
        const response = await fetch(supabaseUrl, { method: 'GET', signal });
        clearTimeout(fetchTimeout);

        // Any status code indicates connectivity to our API
        nextStatus = response.status > 0;
      } catch {
        nextStatus = false;
      }

      if (mounted) {
        setIsOnline(nextStatus);
        // Check every 15s when online, or 5s when offline for fast recovery detection
        const delay = nextStatus ? 15000 : 5000;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkConnection, delay);
      }
    }

    checkConnection();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkConnection();
      }
    });

    return () => {
      mounted = false;
      subscription.remove();
      clearTimeout(timeoutId);
    };
  }, []);

  return { isOnline };
}
