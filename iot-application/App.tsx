import React from 'react';
import { StatusBar, useColorScheme, View, StyleSheet, ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { store, useAppDispatch, useAppSelector } from './src/presentation/store';
import { toggleTheme } from './src/presentation/store/themeSlice';
import { lightTheme, darkTheme } from './src/core/theme';
import { AppText } from './src/presentation/components/atoms/AppText';
import { AppButton } from './src/presentation/components/atoms/AppButton';
import { AppSwitch } from './src/presentation/components/atoms/AppSwitch';
import { AppBadge } from './src/presentation/components/atoms/AppBadge';
import { AppDivider } from './src/presentation/components/atoms/AppDivider';
import { AppSkeleton } from './src/presentation/components/atoms/AppSkeleton';
import { AppSpacing } from './src/core/constants/AppSpacing';

const MainApp: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const dispatch = useAppDispatch();

  const isDarkMode =
    themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <AppText variant="h2">Universal IoT</AppText>
              <AppBadge content="v1.0" color={theme.colors.primary} />
            </View>
            <AppText variant="subtitle2" color={theme.customColors.textSecondary}>
              Smart Home Control Center • Phase 1 Ready
            </AppText>
          </View>

          <AppDivider spacing={AppSpacing.md} />

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.customColors.card,
                borderColor: theme.customColors.border,
              },
            ]}
          >
            <AppText variant="h3">Architecture Setup</AppText>
            <AppText variant="body2" color={theme.customColors.textSecondary}>
              Clean Architecture + Atomic Design
            </AppText>
            <AppDivider spacing={AppSpacing.sm} />

            <View style={styles.featureRow}>
              <AppText variant="body2">Dark Mode:</AppText>
              <AppSwitch
                value={isDarkMode}
                onValueChange={() => dispatch(toggleTheme())}
              />
            </View>

            <View style={styles.featureRow}>
              <AppText variant="body2">Current Mode:</AppText>
              <AppText variant="subtitle2" color={theme.colors.primary}>
                {themeMode.toUpperCase()}
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.customColors.card,
                borderColor: theme.customColors.border,
              },
            ]}
          >
            <AppText variant="h3">Atoms Showcase</AppText>
            <AppDivider spacing={AppSpacing.sm} />

            <View style={styles.buttonRow}>
              <AppButton
                label="Primary Button"
                variant="primary"
                size="sm"
                onPress={() => {}}
              />
              <AppButton
                label="Secondary"
                variant="secondary"
                size="sm"
                onPress={() => {}}
              />
              <AppButton
                label="Outlined"
                variant="outlined"
                size="sm"
                onPress={() => {}}
              />
            </View>

            <AppDivider spacing={AppSpacing.sm} />
            <AppText variant="caption" color={theme.customColors.textSecondary}>
              Loading Skeleton Atom:
            </AppText>
            <View style={styles.skeletonContainer}>
              <AppSkeleton width="100%" height={16} />
              <View style={{ height: 6 }} />
              <AppSkeleton width="60%" height={16} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <MainApp />
      </ReduxProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: AppSpacing.md,
  },
  header: {
    marginBottom: AppSpacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppSpacing.sm,
  },
  card: {
    padding: AppSpacing.md,
    borderRadius: AppSpacing.borderRadius.lg,
    borderWidth: 1,
    marginVertical: AppSpacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppSpacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: AppSpacing.sm,
    flexWrap: 'wrap',
    marginVertical: AppSpacing.xs,
  },
  skeletonContainer: {
    marginTop: AppSpacing.xs,
  },
});
