import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { store, useAppDispatch, useAppSelector } from './src/presentation/store';
import {
  fetchDevices,
  updateDeviceFromMqtt,
  updateDeviceStatusFromMqtt,
} from './src/presentation/store/deviceSlice';
import { fetchRooms } from './src/presentation/store/roomSlice';
import { fetchAutomations } from './src/presentation/store/automationSlice';
import { setMqttConnected } from './src/presentation/store/connectivitySlice';
import { mqttService } from './src/data/datasources/MqttService';
import { deviceRepository } from './src/data/repositories/DeviceRepositoryImpl';
import { lightTheme, darkTheme } from './src/core/theme';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';

const MainApp: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const themeMode = useAppSelector((state) => state.theme.mode);

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
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={theme as any}>
        <AppNavigator />
      </NavigationContainer>
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
