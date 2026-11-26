import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RoomCard } from '../RoomCard';
import { AppText } from '../../atoms/AppText';
import { AppIcon } from '../../atoms/AppIcon';
import { AppButton } from '../../atoms/AppButton';
import { RoomGridProps } from './types';
import { styles } from './styles';

export const RoomGrid: React.FC<RoomGridProps> = ({
  rooms,
  devices,
  showHeader = true,
  onSelectRoom,
  onRenameRoom,
  onDeleteRoom,
  onAddRoom,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <AppText variant="h3">Rooms ({rooms.length})</AppText>
          {onAddRoom && (
            <AppButton label="+ Add Room" size="sm" variant="outlined" onPress={onAddRoom} />
          )}
        </View>
      )}

      {rooms.length === 0 ? (
        <View style={styles.empty}>
          <AppIcon name="home-plus-outline" size={48} color={theme.colors.outline} />
          <AppText variant="subtitle1" color={theme.colors.outline}>
            No rooms yet
          </AppText>
          {onAddRoom && (
            <AppButton label="Create First Room" size="sm" onPress={onAddRoom} />
          )}
        </View>
      ) : (
        <View>
          {rooms.map((item) => {
            const roomDevices = devices.filter((d) => d.roomId === item.id);
            return (
              <RoomCard
                key={item.id}
                room={item}
                devices={roomDevices}
                onPress={() => onSelectRoom(item.id, item.name)}
                onRename={onRenameRoom ? () => onRenameRoom(item.id, item.name) : undefined}
                onDelete={onDeleteRoom ? () => onDeleteRoom(item.id) : undefined}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

export * from './types';
