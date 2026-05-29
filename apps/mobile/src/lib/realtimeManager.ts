import { supabase } from './supabase';
import { logger } from './logger';
import NetInfo from '@react-native-community/netinfo';

export interface ChannelSubscription {
  event: string;
  schema?: string;
  table?: string;
  filter?: string;
  callback: (payload: any) => void;
}

export interface ChannelConfig {
  id: string; // Unique channel identifier
  channelName: string; // Supabase channel name
  subscriptions: ChannelSubscription[];
  priority: 'critical' | 'normal' | 'low';
  reconnect: boolean; // Whether to auto-reconnect
  onError?: (status: string) => void; // Optional error callback
}

export type HealthStatus = 'healthy' | 'degraded' | 'disconnected';

class RealtimeManager {
  private channels = new Map<string, ReturnType<typeof supabase.channel>>();
  private configs = new Map<string, ChannelConfig>();
  private retryTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private retryCounts = new Map<string, number>();
  private _status: HealthStatus = 'healthy';
  private _listeners = new Set<(status: HealthStatus) => void>();
  private _isPaused = false;

  static readonly MAX_CHANNELS = 12;
  static readonly MAX_RETRIES = 5;
  static readonly BASE_DELAY = 1000;
  static readonly MAX_DELAY = 30000;

  constructor() {
    // Listen to network changes to automatically pause/resume
    NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && state.isInternetReachable !== false;
      if (online) {
        this.resume();
      } else {
        this.pause();
      }
    });
  }

  get status() {
    return this._status;
  }

  /** Subscribe to a channel with automatic lifecycle management */
  subscribe(config: ChannelConfig): () => void {
    if (this.configs.has(config.id)) {
      logger.warn(`[RealtimeManager] Channel ${config.id} is already subscribed. Re-subscribing.`);
      this.unsubscribe(config.id);
    }

    // Limit active channel count
    if (this.channels.size >= RealtimeManager.MAX_CHANNELS) {
      logger.warn(
        `[RealtimeManager] Max channel limit reached (${RealtimeManager.MAX_CHANNELS}). Pruning low priority channel.`,
      );
      this.pruneLowPriorityChannel();
    }

    this.configs.set(config.id, config);

    if (!this._isPaused) {
      this.connect(config.id);
    }

    return () => this.unsubscribe(config.id);
  }

  /** Connect/Recreate a channel */
  private connect(id: string) {
    const config = this.configs.get(id);
    if (!config) return;

    try {
      const channel = supabase.channel(config.channelName);

      config.subscriptions.forEach((sub) => {
        if (sub.event === 'postgres_changes') {
          channel.on(
            'postgres_changes',
            {
              event: '*' as any,
              schema: sub.schema || 'public',
              table: sub.table,
              filter: sub.filter,
            },
            sub.callback,
          );
        }
      });

      channel.subscribe((status) => {
        this.handleChannelStatus(id, status);
      });

      this.channels.set(id, channel);
    } catch (err) {
      logger.error(`[RealtimeManager] Exception while connecting channel ${id}`, { error: err });
      this.handleChannelStatus(id, 'CHANNEL_ERROR');
    }
  }

  /** Unsubscribe and cleanup a channel */
  unsubscribe(id: string): void {
    this.clearRetryTimer(id);
    this.retryCounts.delete(id);

    const channel = this.channels.get(id);
    if (channel) {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        logger.warn(`[RealtimeManager] Failed to remove channel ${id} from Supabase client`, {
          error: err,
        });
      }
      this.channels.delete(id);
    }

    this.configs.delete(id);
    this.updateStatus();
  }

  /** Pause all channels (called when offline) */
  pause(): void {
    if (this._isPaused) return;
    this._isPaused = true;
    logger.info('[RealtimeManager] Pausing all realtime channels (offline)');

    this.retryTimers.forEach((timer) => clearTimeout(timer));
    this.retryTimers.clear();

    this.channels.forEach((channel, id) => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        // Silent
      }
    });
    this.channels.clear();
    this.updateStatus();
  }

  /** Resume all channels (called when online) */
  resume(): void {
    if (!this._isPaused) return;
    this._isPaused = false;
    logger.info('[RealtimeManager] Resuming all realtime channels (online)');

    this.configs.forEach((config) => {
      this.connect(config.id);
    });
    this.updateStatus();
  }

  /** Listen to health status changes */
  onStatusChange(listener: (status: HealthStatus) => void): () => void {
    this._listeners.add(listener);
    // Emit initial status
    listener(this._status);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /** Calculate backoff with jitter */
  private getBackoff(retryCount: number): number {
    const delay = Math.min(
      RealtimeManager.BASE_DELAY * Math.pow(2, retryCount),
      RealtimeManager.MAX_DELAY,
    );
    return delay + Math.random() * delay * 0.3; // 30% jitter
  }

  private clearRetryTimer(id: string) {
    const timer = this.retryTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.retryTimers.delete(id);
    }
  }

  private handleChannelStatus(id: string, status: string) {
    if (status === 'SUBSCRIBED') {
      this.retryCounts.delete(id);
      this.clearRetryTimer(id);
      this.updateStatus();
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      this.updateStatus();
      const config = this.configs.get(id);
      if (config && config.reconnect && !this._isPaused) {
        const retryCount = this.retryCounts.get(id) || 0;
        if (retryCount < RealtimeManager.MAX_RETRIES) {
          this.retryCounts.set(id, retryCount + 1);
          const delay = this.getBackoff(retryCount);
          logger.warn(
            `[RealtimeManager] Channel ${id} errored/timed out (${status}). Retrying in ${Math.round(delay)}ms`,
            { attempt: retryCount + 1 },
          );
          this.clearRetryTimer(id);
          const timer = setTimeout(() => {
            this.connect(id);
          }, delay);
          this.retryTimers.set(id, timer);
        } else {
          logger.error(
            `[RealtimeManager] Channel ${id} exceeded max retries. Reconnections stopped.`,
            { id },
          );
        }
      }
    }
  }

  private updateStatus() {
    let activeRetries = 0;
    for (const [_, count] of this.retryCounts.entries()) {
      if (count > 0) activeRetries++;
    }

    let newStatus: HealthStatus = 'healthy';
    if (this._isPaused) {
      newStatus = 'disconnected';
    } else if (activeRetries > 0) {
      newStatus = 'degraded';
    }

    if (newStatus !== this._status) {
      this._status = newStatus;
      this._listeners.forEach((listener) => listener(newStatus));
    }
  }

  private pruneLowPriorityChannel() {
    let candidateId: string | null = null;
    let lowestPriorityValue = 3; // 1: critical, 2: normal, 3: low

    const priorityValues = { critical: 1, normal: 2, low: 3 };

    this.configs.forEach((config) => {
      const val = priorityValues[config.priority];
      if (val > lowestPriorityValue || candidateId === null) {
        lowestPriorityValue = val;
        candidateId = config.id;
      }
    });

    if (candidateId) {
      logger.info(
        `[RealtimeManager] Pruning channel ${candidateId} (priority: ${this.configs.get(candidateId)?.priority})`,
      );
      this.unsubscribe(candidateId);
    }
  }

  /** Destroy all channels (app teardown) */
  destroy(): void {
    this.retryTimers.forEach((timer) => clearTimeout(timer));
    this.retryTimers.clear();
    this.channels.forEach((channel) => {
      try {
        supabase.removeChannel(channel);
      } catch (err) {
        // Silent
      }
    });
    this.channels.clear();
    this.configs.clear();
    this._listeners.clear();
    this.updateStatus();
  }
}

export const realtimeManager = new RealtimeManager();
