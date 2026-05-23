import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      // isInternetReachable can be null initially, so we only treat it as offline if explicitly false.
      const online = !!state.isConnected && state.isInternetReachable !== false;
      setIsOnline(online);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isOnline };
}
