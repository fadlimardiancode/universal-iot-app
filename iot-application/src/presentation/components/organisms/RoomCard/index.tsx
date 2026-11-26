import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { AppIcon } from '../../atoms/AppIcon';
import { AppBadge } from '../../atoms/AppBadge';
import { RoomCardProps } from './types';
import { styles } from './styles';

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  devices,
  onPress,
  onRename,
  onDelete,
}) => {
  const theme = useTheme();

  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.isOn).length;

  const getRoomIcon = () => {
    return room.icon || 'home-outline';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant || '#E9ECEF',
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor:
                  activeDevices > 0
                    ? `${theme.colors.primary}1A`
                    : theme.colors.surfaceVariant,
              },
            ]}
          >
            <AppIcon
              name={getRoomIcon()}
              size={24}
              color={
                activeDevices > 0 ? theme.colors.primary : theme.colors.onSurfaceVariant
              }
            />
          </View>

          <View>
            <AppText variant="subtitle1" weight="700">
              {room.name}
            </AppText>
            <AppText variant="caption" color={theme.colors.onSurfaceVariant}>
              {totalDevices} {totalDevices === 1 ? 'device' : 'devices'}
            </AppText>
          </View>
        </View>

        <AppBadge
          content={`${activeDevices} Active`}
          color={activeDevices > 0 ? '#198754' : '#6C757D'}
        />
      </View>

      {/* Mini Device Icons Preview */}
      <View style={styles.devicePreviewRow}>
        {devices.slice(0, 4).map((d) => (
          <View
            key={d.id}
            style={[
              styles.miniDeviceBadge,
              {
                backgroundColor: d.isOn
                  ? `${theme.colors.primary}1A`
                  : theme.colors.surfaceVariant,
              },
            ]}
          >
            <AppIcon
              name={
                d.type === 'light'
                  ? 'lightbulb-outline'
                  : d.type === 'thermostat'
                  ? 'thermometer'
                  : d.type === 'camera'
                  ? 'cctv'
                  : 'lock'
              }
              size={14}
              color={d.isOn ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
            <AppText
              variant="caption"
              color={d.isOn ? theme.colors.primary : theme.colors.onSurfaceVariant}
              weight="600"
            >
              {d.name.split(' ')[0]}
            </AppText>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.bottomRow}>
        <AppText variant="caption" color={theme.colors.primary} weight="600">
          View Room Details →
        </AppText>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          {onRename && (
            <TouchableOpacity onPress={onRename} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AppIcon name="pencil-outline" size={18} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AppIcon name="trash-can-outline" size={18} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export * from './types';
