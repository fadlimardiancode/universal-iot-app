module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@core': './src/core',
          '@data': './src/data',
          '@domain': './src/domain',
          '@presentation': './src/presentation',
          '@atoms': './src/presentation/components/atoms',
          '@molecules': './src/presentation/components/molecules',
          '@organisms': './src/presentation/components/organisms',
          '@templates': './src/presentation/components/templates',
          '@screens': './src/presentation/screens',
          '@navigation': './src/presentation/navigation',
          '@store': './src/presentation/store',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
