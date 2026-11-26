import React, { useCallback } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleDeviceAction,
  adjustTemperatureAction,
  removeDeviceAction,
} from '../../store/deviceSlice';
import { DeviceDetailTemplate } from '../../components/templates';
import { RootStackParamList } from '../../navigation/types';

export const DeviceDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DeviceDetail'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const { deviceId } = route.params;
  const device = useAppSelector((state) =>
    state.devices.devices.find((d) => d.id === deviceId),
  );
  const rooms = useAppSelector((state) => state.rooms.rooms);
  const room = rooms.find((r) => r.id === device?.roomId);

  const handleTogglePower = useCallback(
    () => {
      if (!device) return;
      dispatch(toggleDeviceAction({ id: device.id, currentState: device.isOn }));
    },
    [dispatch, device],
  );

  const handleBrightnessChange = useCallback(
    (_brightness: number) => {
      // Light brightness can be wired when endpoint available
    },
    [],
  );

  const handleTargetTempChange = useCallback(
    (targetTemperature: number) => {
      if (!device) return;
      dispatch(
        adjustTemperatureAction({
          id: device.id,
          temperature: targetTemperature,
        }),
      );
    },
    [dispatch, device],
  );

  const handleDeleteDevice = useCallback(() => {
    if (!device) return;
    dispatch(removeDeviceAction(device.id));
    navigation.goBack();
  }, [dispatch, device, navigation]);

  if (!device) {
    return null;
  }

  return (
    <DeviceDetailTemplate
      device={device}
      roomName={room?.name}
      onTogglePower={handleTogglePower}
      onBrightnessChange={handleBrightnessChange}
      onTargetTempChange={handleTargetTempChange}
      onDeleteDevice={handleDeleteDevice}
    />
  );
};
