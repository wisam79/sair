import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

export const QUEUE_LIMITS = {
  trips: 10, // Max pending offline trips
  statusUpdates: 50, // Max pending status changes
  gpsLocations: 100, // Max GPS points
} as const;

export const ENTRY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours max age

class Mutex {
  private queue: (() => void)[] = [];
  private locked = false;

  async acquire(): Promise<() => void> {
    return new Promise((resolve) => {
      const release = () => {
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          next?.();
        } else {
          this.locked = false;
        }
      };

      if (this.locked) {
        this.queue.push(() => resolve(release));
      } else {
        this.locked = true;
        resolve(release);
      }
    });
  }

  async runExclusive<T>(callback: () => Promise<T>): Promise<T> {
    const release = await this.acquire();
    try {
      return await callback();
    } finally {
      release();
    }
  }
}

class OfflineQueueManager {
  private gpsMutex = new Mutex();

  /** Read and parse queue safely */
  async getQueue<T>(key: string): Promise<T[]> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return [];
      return JSON.parse(raw) as T[];
    } catch (err) {
      logger.warn(`[OfflineQueue] Corrupted JSON in queue ${key}, resetting queue`, { error: err });
      return [];
    }
  }

  /** Add entry with size enforcement */
  async enqueue<T>(
    key: string,
    entry: T,
    limit: number,
    dropStrategy: 'drop_oldest' | 'error' = 'error',
  ): Promise<void> {
    const queue = await this.getQueue<T>(key);
    if (queue.length >= limit) {
      if (dropStrategy === 'drop_oldest') {
        queue.shift();
        logger.info(`[OfflineQueue] Queue ${key} full, dropped oldest item`);
      } else {
        throw new Error(`Queue ${key} is full (limit: ${limit})`);
      }
    }
    queue.push(entry);
    await AsyncStorage.setItem(key, JSON.stringify(queue));
  }

  /** Acquire mutex for GPS/queue operations */
  async withGpsMutex<T>(fn: () => Promise<T>): Promise<T> {
    return this.gpsMutex.runExclusive(fn);
  }

  /** Remove entries older than TTL */
  async pruneStale(key: string): Promise<number> {
    try {
      const queue = await this.getQueue<any>(key);
      if (queue.length === 0) return 0;

      const now = Date.now();
      const filtered = queue.filter((item: any) => {
        // Fallback to item.timestamp, if not present keep it
        if (!item.timestamp) return true;
        return now - item.timestamp < ENTRY_TTL_MS;
      });

      const prunedCount = queue.length - filtered.length;
      if (prunedCount > 0) {
        logger.info(`[OfflineQueue] Pruned ${prunedCount} stale entries from queue ${key}`);
        if (filtered.length === 0) {
          await AsyncStorage.removeItem(key);
        } else {
          await AsyncStorage.setItem(key, JSON.stringify(filtered));
        }
      }
      return prunedCount;
    } catch (err) {
      logger.warn(`[OfflineQueue] Failed to prune stale items in ${key}`, { error: err });
      return 0;
    }
  }

  /** Remove all entries with orphaned local_trip_ IDs older than 1 hour */
  async cleanupOrphanedLocalIds(): Promise<void> {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();

    const cleanupQueue = async (key: string) => {
      try {
        const queue = await this.getQueue<any>(key);
        if (queue.length === 0) return;

        const filtered = queue.filter((item: any) => {
          const tripId = item.tripId || item.localId;
          if (tripId && tripId.startsWith('local_trip_')) {
            // Check if item was created more than 1 hour ago
            const timestamp = item.timestamp;
            if (timestamp && now - timestamp > ONE_HOUR) {
              logger.warn(
                `[OfflineQueue] Cleanup orphaned local trip ID ${tripId} in queue ${key}`,
              );
              return false;
            }
          }
          return true;
        });

        if (filtered.length !== queue.length) {
          if (filtered.length === 0) {
            await AsyncStorage.removeItem(key);
          } else {
            await AsyncStorage.setItem(key, JSON.stringify(filtered));
          }
        }
      } catch (err) {
        logger.warn(`[OfflineQueue] Failed to cleanup orphaned IDs in ${key}`, { error: err });
      }
    };

    await cleanupQueue('pending_status_updates');
    await cleanupQueue('gps_offline_queue');
    await cleanupQueue('pending_trips_creation_queue');
  }

  /** Get total size of all queues for monitoring */
  async getTotalSize(): Promise<number> {
    try {
      const trips = await this.getQueue('pending_trips_creation_queue');
      const statusUpdates = await this.getQueue('pending_status_updates');
      const gps = await this.getQueue('gps_offline_queue');
      return trips.length + statusUpdates.length + gps.length;
    } catch {
      return 0;
    }
  }
}

export const offlineQueue = new OfflineQueueManager();
