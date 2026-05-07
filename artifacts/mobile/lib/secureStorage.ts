import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'supabase-auth-token';
const REFRESH_TOKEN_KEY = 'supabase-refresh-token';

export const secureStorage = {
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  getItem: async (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

export const saveAuthToken = async (token: string) => {
  await secureStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return secureStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = async () => {
  await secureStorage.removeItem(TOKEN_KEY);
  await secureStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const saveRefreshToken = async (token: string) => {
  await secureStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return secureStorage.getItem(REFRESH_TOKEN_KEY);
};
