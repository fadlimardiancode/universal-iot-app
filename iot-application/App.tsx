import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, View, StyleSheet, ScrollView } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { store, useAppDispatch, useAppSelector } from './src/presentation/store';
import { toggleTheme } from './src/presentation/store/themeSlice';
import {
  fetchDevices,
  toggleDeviceAction,
  adjustTemperatureAction,
  updateDeviceFromMqtt,
  updateDeviceStatusFromMqtt,
} from './src/presentation/store/deviceSlice';
import { fetchRooms } from './src/presentation/store/roomSlice';
import { fetchAutomations } from './src/presentation/store/automationSlice';
import { setMqttConnected } from './src/presentation/store/connectivitySlice';
import { mqttService } from './src/data/datasources/MqttService';
import { deviceRepository } from './src/data/repositories/DeviceRepositoryImpl';
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
  const dispatch = useAppDispatch();

  const themeMode = useAppSelector((state) => state.theme.mode);
  const { devices, loading: devicesLoading } = useAppSelector((state) => state.devices);
  const { rooms } = useAppSelector((state) => state.rooms);
  const { mqttConnected } = useAppSelector((state) => state.connectivity);

  const isDarkMode =
    themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Initialize data and MQTT lifecycle
  useEffect(() => {
    dispatch(fetchDevices());
    dispatch(fetchRooms());
    dispatch(fetchAutomations());

    // Connect MQTT
    mqttService.connect();

    const unsubConn = mqttService.onConnection((connected) => {
      dispatch(setMqttConnected(connected));
    });

    const unsubUpdates = deviceRepository.subscribeUpdates(
      (deviceId, payload) => {
        dispatch(updateDeviceFromMqtt({ id: deviceId, payload }));
      },
      (deviceId, status) => {
        dispatch(updateDeviceStatusFromMqtt({ id: deviceId, status }));
      }
    );

    return () => {
      unsubConn();
      unsubUpdates();
      mqttService.disconnect();
    };
  }, [dispatch]);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <AppText variant="h2">Universal IoT</AppText>
              <AppBadge
                content={mqttConnected ? 'MQTT Live' : 'Offline'}
                color={mqttConnected ? '#198754' : '#6C757D'}
              />
            </View>
            <AppText variant="subtitle2" color={theme.customColors.textSecondary}>
              Smart Home Control Center • Phase 3 (Data & State) Ready
            </AppText>
          </View>

          <AppDivider spacing={AppSpacing.md} />

          {/* Connection Status Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.customColors.card,
                borderColor: theme.customColors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <AppText variant="h3">System & Connectivity</AppText>
              <AppSwitch
                value={isDarkMode}
                onValueChange={() => dispatch(toggleTheme())}
              />
            </View>
            <AppDivider spacing={AppSpacing.xs} />
            <View style={styles.featureRow}>
              <AppText variant="body2">MQTT Broker:</AppText>
              <AppText
                variant="subtitle2"
                color={mqttConnected ? '#198754' : '#DC3545'}
              >
                {mqttConnected ? '● CONNECTED' : '○ DISCONNECTED'}
              </AppText>
            </View>
            <View style={styles.featureRow}>
              <AppText variant="body2">Total Rooms:</AppText>
              <AppText variant="subtitle2">{rooms.length} Rooms</AppText>
            </View>
            <View style={styles.featureRow}>
              <AppText variant="body2">Theme Mode:</AppText>
              <AppText variant="subtitle2" color={theme.colors.primary}>
                {themeMode.toUpperCase()}
              </AppText>
            </View>
          </View>

          {/* Live Device List Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.customColors.card,
                borderColor: theme.customColors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <AppText variant="h3">Devices ({devices.length})</AppText>
              <AppButton
                label="Refresh"
                size="sm"
                variant="outlined"
                onPress={() => dispatch(fetchDevices())}
              />
            </View>
            <AppDivider spacing={AppSpacing.sm} />

            {devicesLoading && devices.length === 0 ? (
              <View style={styles.skeletonContainer}>
                <AppSkeleton width="100%" height={32} />
                <View style={{ height: 8 }} />
                <AppSkeleton width="80%" height={32} />
              </View>
            ) : (
              devices.map((device) => (
                <View key={device.id} style={styles.deviceRow}>
                  <View style={styles.deviceInfo}>
                    <View style={styles.deviceNameRow}>
                      <AppText variant="subtitle2">{device.name}</AppText>
                      <AppBadge
                        content={device.status}
                        size={14}
                        color={device.status === 'online' ? '#198754' : '#6C757D'}
                      />
                    </View>
                    <AppText variant="caption" color={theme.customColors.textSecondary}>
                      {device.type.toUpperCase()} • {device.roomId}
                      {device.temperature !== undefined && ` • ${device.temperature}°C`}
                      {device.brightness !== undefined && ` • ${device.brightness}%`}
                    </AppText>
                  </View>

                  {device.type === 'thermostat' ? (
                    <View style={styles.tempButtonRow}>
                      <AppButton
                        label="-"
                        size="sm"
                        variant="secondary"
                        onPress={() =>
                          dispatch(
                            adjustTemperatureAction({
                              id: device.id,
                              temperature: Math.max(16, (device.temperature || 24) - 0.5),
                            })
                          )
                        }
                      />
                      <AppButton
                        label="+"
                        size="sm"
                        variant="secondary"
                        onPress={() =>
                          dispatch(
                            adjustTemperatureAction({
                              id: device.id,
                              temperature: Math.min(30, (device.temperature || 24) + 0.5),
                            })
                          )
                        }
                      />
                    </View>
                  ) : (
                    <AppSwitch
                      value={device.isOn}
                      onValueChange={() =>
                        dispatch(
                          toggleDeviceAction({
                            id: device.id,
                            currentState: device.isOn,
                          })
                        )
                      }
                    />
                  )}
                </View>
              ))
            )}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppSpacing.xs,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppSpacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tempButtonRow: {
    flexDirection: 'row',
    gap: 4,
  },
  skeletonContainer: {
    marginVertical: AppSpacing.xs,
  },
});
