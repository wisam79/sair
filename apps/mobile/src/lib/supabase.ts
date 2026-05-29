import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Log prominently for developers, but don't crash at module level.
  // A throw here happens before any ErrorBoundary is mounted, producing a
  // blank screen with no recovery path for the user.
  // The Supabase client will fail gracefully on first network call instead,
  // which the auth listener in _layout.tsx will catch and handle.
  const msg =
    '[Supabase] Missing required environment variables:\n' +
    'EXPO_PUBLIC_SUPABASE_URL: ' +
    (supabaseUrl ? '✓' : '✗') +
    '\n' +
    'EXPO_PUBLIC_SUPABASE_ANON_KEY: ' +
    (supabaseAnonKey ? '✓' : '✗');
  console.error(msg);
  // In production, report to Sentry so deployments with missing config are caught
  if (typeof __DEV__ !== 'undefined' && !__DEV__) {
    try {
      require('@sentry/react-native').captureMessage(msg, 'fatal');
    } catch {
      // Sentry not available — silent
    }
  }
}

import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (isWeb) {
        return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('[SecureStore] Failed to get item', e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
    } catch (e) {
      console.warn('[SecureStore] Failed to set item', e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn('[SecureStore] Failed to delete item', e);
    }
  },
};

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
