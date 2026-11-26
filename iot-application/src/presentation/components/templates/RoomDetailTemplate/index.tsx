import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { FAB } from 'react-native-paper';
import { RoomHeader } from '../../molecules/RoomHeader';
import { DeviceList } from '../../organisms/DeviceList';
import { styles } from './styles';
import { RoomDetailTemplateProps } from './types';

export const RoomDetailTemplate: React.FC<RoomDetailTemplateProps> = ({
  room,
  devices,
  onDevicePress,
  onDeviceToggle,
  onAdjustTemp,
  onAddDevicePress,
  onDeleteRoomPress,
  onRefresh,
  refreshing = false,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        <RoomHeader
          roomName={room.name}
          deviceCount={devices.length}
          onDelete={onDeleteRoomPress}
        />
        <View style={styles.deviceListWrapper}>
          <DeviceList
            devices={devices}
            onPressDevice={onDevicePress}
            onToggle={onDeviceToggle}
            onAdjustTemp={onAdjustTemp}
            onAddDevice={onAddDevicePress}
          />
        </View>
      </ScrollView>
      {onAddDevicePress && (
        <FAB icon="plus" style={styles.fab} onPress={onAddDevicePress} />
      )}
    </View>
  );
};
