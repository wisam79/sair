import * as SecureStore from 'expo-secure-store';
import { Subscription } from '@sair/core';
import { Platform } from 'react-native';

const CACHE_KEY = 'sair_active_subscription';
const isWeb = Platform.OS === 'web';

export const OfflineCache = {
  /**
   * Save the active subscription locally to allow offline verification.
   */
  async saveActiveSubscription(subscription: Subscription | null): Promise<void> {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          if (subscription) {
            const payload = {
              data: subscription,
              cachedAt: new Date().toISOString(),
            };
            window.localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
          } else {
            window.localStorage.removeItem(CACHE_KEY);
          }
        }
        return;
      }

      if (subscription) {
        // Save the raw subscription data + a timestamp to prevent stale reads
        const payload = {
          data: subscription,
          cachedAt: new Date().toISOString(),
        };
        await SecureStore.setItemAsync(CACHE_KEY, JSON.stringify(payload), {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
      } else {
        await SecureStore.deleteItemAsync(CACHE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save subscription to secure cache', e);
    }
  },

  /**
   * Retrieve the locally cached active subscription if internet is down.
   */
  async getActiveSubscription(): Promise<Subscription | null> {
    try {
      const raw = isWeb
        ? (typeof window !== 'undefined' ? window.localStorage.getItem(CACHE_KEY) : null)
        : await SecureStore.getItemAsync(CACHE_KEY);
      if (!raw) return null;

      const payload = JSON.parse(raw);
      const sub: Subscription = payload.data;

      // Basic verification: Is it expired?
      const endDate = new Date(sub.end_date);
      if (endDate < new Date()) {
        if (isWeb) {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(CACHE_KEY);
          }
        } else {
          await SecureStore.deleteItemAsync(CACHE_KEY);
        }
        return null;
      }

      return sub;
    } catch (e) {
      console.warn('Failed to retrieve subscription from secure cache', e);
      return null;
    }
  },

  /**
   * Clear cache (e.g. on logout)
   */
  async clear(): Promise<void> {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(CACHE_KEY);
        }
        return;
      }
      await SecureStore.deleteItemAsync(CACHE_KEY);
    } catch (e) {
      console.warn('Failed to clear secure cache', e);
    }
  },
};
