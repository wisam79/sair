import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription } from '@uniride/core';

const CACHE_KEY = '@uniride_active_subscription';

export const OfflineCache = {
  /**
   * Save the active subscription locally to allow offline verification.
   * In a production app, we would encrypt this payload so it can't be easily modified locally.
   */
  async saveActiveSubscription(subscription: Subscription | null): Promise<void> {
    try {
      if (subscription) {
        // Save the raw subscription data + a timestamp to prevent stale reads
        const payload = {
          data: subscription,
          cachedAt: new Date().toISOString(),
        };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } else {
        await AsyncStorage.removeItem(CACHE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save subscription to offline cache', e);
    }
  },

  /**
   * Retrieve the locally cached active subscription if internet is down.
   */
  async getActiveSubscription(): Promise<Subscription | null> {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return null;

      const payload = JSON.parse(raw);
      const sub: Subscription = payload.data;
      
      // Basic verification: Is it expired?
      const endDate = new Date(sub.end_date);
      if (endDate < new Date()) {
        await AsyncStorage.removeItem(CACHE_KEY);
        return null;
      }

      return sub;
    } catch (e) {
      console.warn('Failed to retrieve subscription from offline cache', e);
      return null;
    }
  },

  /**
   * Clear cache (e.g. on logout)
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
    } catch (e) {
      console.warn('Failed to clear offline cache', e);
    }
  }
};
