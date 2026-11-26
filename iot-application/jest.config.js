module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@reduxjs/toolkit|immer|react-native-paper|react-native-vector-icons|react-native-safe-area-context|react-native-screens|react-native-reanimated|react-native-gesture-handler|@react-navigation)/)',
  ],
};
