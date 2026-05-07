import { createMMKV } from 'react-native-mmkv';
import superjson from 'superjson';
import type { PersistStorage } from 'zustand/middleware';

export const storage = createMMKV();

export const mmkvStorage: PersistStorage<any, unknown> = {
  setItem: (key: string, value: { state: any }) => {
    storage.set(key, superjson.stringify(value));
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    if (!value) return Promise.resolve(null);
    return Promise.resolve(superjson.parse(value) as { state: any });
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
};
