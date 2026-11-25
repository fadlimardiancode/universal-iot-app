// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => {
  const storage = new Map();
  return {
    createMMKV: () => ({
      getString: jest.fn((key) => storage.get(key) ?? undefined),
      set: jest.fn((key, value) => storage.set(key, value)),
      getBoolean: jest.fn((key) => storage.get(key) ?? undefined),
      getNumber: jest.fn((key) => storage.get(key) ?? undefined),
      remove: jest.fn((key) => storage.delete(key)),
      clearAll: jest.fn(() => storage.clear()),
      contains: jest.fn((key) => storage.has(key)),
      getAllKeys: jest.fn(() => Array.from(storage.keys())),
    }),
  };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
