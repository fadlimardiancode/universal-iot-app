import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleDeviceAction,
  adjustTemperatureAction,
} from '../../store/deviceSlice';
import { DashboardTemplate } from '../../components/templates';
import { RootStackParamList } from '../../navigation/types';
import { automationScheduler } from '../../../core/services/AutomationScheduler';

export const HomeScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const devices = useAppSelector((state) => state.devices.devices);
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const automations = useAppSelector((state) => state.automations.automations);
  const isMqttConnected = useAppSelector((state) => state.connectivity.mqttConnected);

  const [refreshing, setRefreshing] = useState(false);

  const totalDevices = devices.length;
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const activeRooms = rooms.length;

  const thermoDevices = devices.filter((d) => d.type === 'thermostat' && d.temperature !== undefined);
  const averageTemperature =
    thermoDevices.length > 0
      ? thermoDevices.reduce((acc, curr) => acc + (curr.temperature ?? 0), 0) / thermoDevices.length
      : undefined;

  // Next scheduled automation info
  const nextScheduled = automationScheduler.getNextAutomation();
  const nextTargetDevice = nextScheduled
    ? devices.find((d) => d.id === nextScheduled.automation.deviceId)
    : undefined;

  const nextAutomationInfo = nextScheduled
    ? {
        ruleName: nextScheduled.automation.name,
        time: nextScheduled.automation.scheduledTime,
        deviceName: nextTargetDevice?.name || nextScheduled.automation.deviceId,
        actionText:
          nextScheduled.automation.action === 'turnOn'
            ? 'Turn ON'
            : nextScheduled.automation.action === 'turnOff'
            ? 'Turn OFF'
            : `Set Temp to ${nextScheduled.automation.value}°C`,
      }
    : null;

  const handleDevicePress = useCallback(
    (deviceId: string) => {
      navigation.navigate('DeviceDetail', { deviceId });
    },
    [navigation],
  );

  const handleDeviceToggle = useCallback(
    (deviceId: string, currentState: boolean) => {
      dispatch(toggleDeviceAction({ id: deviceId, currentState }));
    },
    [dispatch],
  );

  const handleAdjustTemp = useCallback(
    (deviceId: string, delta: number) => {
      const dev = devices.find((d) => d.id === deviceId);
      if (dev && dev.temperature !== undefined) {
        dispatch(adjustTemperatureAction({ id: deviceId, temperature: dev.temperature + delta }));
      }
    },
    [dispatch, devices],
  );

  const handleRoomPress = useCallback(
    (roomId: string) => {
      const room = rooms.find((r) => r.id === roomId);
      navigation.navigate('RoomDetail', { roomId, roomName: room?.name || 'Room' });
    },
    [navigation, rooms],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  }, []);

  return (
    <DashboardTemplate
      mqttConnected={isMqttConnected}
      totalDevices={totalDevices}
      onlineDevices={onlineDevices}
      activeRooms={activeRooms}
      averageTemperature={averageTemperature}
      rooms={rooms}
      devices={devices}
      favoriteDevices={devices.slice(0, 5)}
      nextAutomation={nextAutomationInfo}
      onDevicePress={handleDevicePress}
      onDeviceToggle={handleDeviceToggle}
      onAdjustTemp={handleAdjustTemp}
      onRoomPress={handleRoomPress}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    />
  );
};
