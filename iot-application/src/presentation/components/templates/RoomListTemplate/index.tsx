import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { FAB } from 'react-native-paper';
import { RoomGrid } from '../../organisms/RoomGrid';
import { styles } from './styles';
import { RoomListTemplateProps } from './types';

export const RoomListTemplate: React.FC<RoomListTemplateProps> = ({
  rooms,
  devices,
  onRoomPress,
  onRenameRoom,
  onDeleteRoom,
  onAddRoomPress,
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
        <RoomGrid
          rooms={rooms}
          devices={devices}
          onSelectRoom={onRoomPress}
          onRenameRoom={onRenameRoom}
          onDeleteRoom={onDeleteRoom}
          onAddRoom={onAddRoomPress}
        />
      </ScrollView>
      {onAddRoomPress && (
        <FAB icon="plus" style={styles.fab} onPress={onAddRoomPress} />
      )}
    </View>
  );
};
