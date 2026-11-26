import React, { useCallback, useState } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  toggleDeviceAction,
  adjustTemperatureAction,
  addDeviceAction,
} from '../../store/deviceSlice';
import { deleteRoomAction } from '../../store/roomSlice';
import { RoomDetailTemplate } from '../../components/templates';
import { AddDeviceForm } from '../../components/organisms';
import { DeviceType, DeviceProtocol, DeviceConnectionConfig } from '../../../domain/entities/Device';
import { RootStackParamList } from '../../navigation/types';

export const RoomDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'RoomDetail'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const { roomId } = route.params;
  const room = useAppSelector((state) =>
    state.rooms.rooms.find((r) => r.id === roomId),
  );
  const allRooms = useAppSelector((state) => state.rooms.rooms);
  const devices = useAppSelector((state) =>
    state.devices.devices.filter((d) => d.roomId === roomId),
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleAddDevice = useCallback(
    (newDevice: {
      name: string;
      type: DeviceType;
      roomId: string;
      protocol: DeviceProtocol;
      connectionConfig?: DeviceConnectionConfig;
    }) => {
      dispatch(
        addDeviceAction({
          id: `dev_${Date.now()}`,
          name: newDevice.name,
          type: newDevice.type,
          roomId: newDevice.roomId,
          status: 'online',
          isOn: newDevice.type === 'sensor' ? true : false,
          protocol: newDevice.protocol,
          connectionConfig: newDevice.connectionConfig,
          ...(newDevice.type === 'light' ? { brightness: 100 } : {}),
          ...(newDevice.type === 'sensor' || newDevice.type === 'thermostat'
            ? { temperature: 24, humidity: 55 }
            : {}),
        }),
      );
    },
    [dispatch],
  );

  const handleDeleteRoom = useCallback(() => {
    dispatch(deleteRoomAction(roomId));
    navigation.goBack();
  }, [dispatch, roomId, navigation]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  if (!room) {
    return null;
  }

  return (
    <>
      <RoomDetailTemplate
        room={room}
        devices={devices}
        onDevicePress={handleDevicePress}
        onDeviceToggle={handleDeviceToggle}
        onAdjustTemp={handleAdjustTemp}
        onAddDevicePress={() => setModalVisible(true)}
        onDeleteRoomPress={handleDeleteRoom}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <AddDeviceForm
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSubmit={handleAddDevice}
        rooms={allRooms}
        initialRoomId={roomId}
      />
    </>
  );
};
