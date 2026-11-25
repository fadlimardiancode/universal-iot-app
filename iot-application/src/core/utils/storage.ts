import { createMMKV, MMKV } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({
  id: 'universal-iot-storage',
});

export const StorageService = {
  getString: (key: string): string | null => {
    return storage.getString(key) ?? null;
  },
  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },
  getObject: <T>(key: string): T | null => {
    const raw = storage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setObject: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },
  remove: (key: string): boolean => {
    return storage.remove(key);
  },
  clearAll: (): void => {
    storage.clearAll();
  },
};
