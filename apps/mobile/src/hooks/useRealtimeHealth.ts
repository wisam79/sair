import { useState, useEffect } from 'react';
import { realtimeManager, HealthStatus } from '../lib/realtimeManager';

export function useRealtimeHealth() {
  const [status, setStatus] = useState<HealthStatus>('healthy');

  useEffect(() => {
    return realtimeManager.onStatusChange(setStatus);
  }, []);

  return { status, isDegraded: status !== 'healthy', isDisconnected: status === 'disconnected' };
}
