import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../store';
import { addRoomAction, renameRoomAction, deleteRoomAction } from '../../store/roomSlice';
import { RoomListTemplate } from '../../components/templates';
import { AddRoomForm } from '../../components/organisms';
import { RootStackParamList } from '../../navigation/types';

export const RoomsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const rooms = useAppSelector((state) => state.rooms.rooms);
  const devices = useAppSelector((state) => state.devices.devices);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRoomPress = useCallback(
    (roomId: string, roomName: string) => {
      navigation.navigate('RoomDetail', { roomId, roomName });
    },
    [navigation],
  );

  const handleAddRoom = useCallback(
    (roomData: { name: string }) => {
      dispatch(
        addRoomAction({
          id: `room_${Date.now()}`,
          name: roomData.name,
        }),
      );
    },
    [dispatch],
  );

  const handleRenameRoom = useCallback(
    (roomId: string, currentName: string) => {
      dispatch(renameRoomAction({ id: roomId, newName: `${currentName} (Updated)` }));
    },
    [dispatch],
  );

  const handleDeleteRoom = useCallback(
    (roomId: string) => {
      dispatch(deleteRoomAction(roomId));
    },
    [dispatch],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  return (
    <>
      <RoomListTemplate
        rooms={rooms}
        devices={devices}
        onRoomPress={handleRoomPress}
        onRenameRoom={handleRenameRoom}
        onDeleteRoom={handleDeleteRoom}
        onAddRoomPress={() => setModalVisible(true)}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
      <AddRoomForm
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onSubmit={handleAddRoom}
      />
    </>
  );
};
