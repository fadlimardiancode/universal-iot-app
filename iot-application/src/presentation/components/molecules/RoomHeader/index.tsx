import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { AppBadge } from '../../atoms/AppBadge';
import { AppButton } from '../../atoms/AppButton';
import { RoomHeaderProps } from './types';
import { styles } from './styles';

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomName,
  deviceCount,
  activeCount = 0,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <AppText variant="h3">{roomName}</AppText>
        <AppBadge
          content={`${activeCount}/${deviceCount} On`}
          color={activeCount > 0 ? theme.colors.primary : theme.colors.outline}
        />
      </View>

      <View style={styles.actions}>
        {onEdit && (
          <AppButton label="Rename" size="sm" variant="ghost" onPress={onEdit} />
        )}
        {onDelete && (
          <AppButton label="Delete" size="sm" variant="ghost" onPress={onDelete} />
        )}
      </View>
    </View>
  );
};

export * from './types';
