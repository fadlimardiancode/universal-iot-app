import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppIcon } from '../../atoms/AppIcon';
import { AppText } from '../../atoms/AppText';
import { AppSwitch } from '../../atoms/AppSwitch';
import { AppBadge } from '../../atoms/AppBadge';
import { DeviceToggleRowProps } from './types';
import { styles } from './styles';

export const DeviceToggleRow: React.FC<DeviceToggleRowProps> = ({
  name,
  type,
  isOn,
  status,
  subtitle,
  onToggle,
  onPress,
}) => {
  const theme = useTheme();

  const getDeviceIcon = () => {
    switch (type) {
      case 'light':
        return isOn ? 'lightbulb-on' : 'lightbulb-outline';
      case 'lock':
        return isOn ? 'lock-open-variant' : 'lock';
      case 'camera':
        return 'cctv';
      case 'thermostat':
        return 'thermometer';
      default:
        return 'power-socket-us';
    }
  };

  const getIconColor = () => {
    if (!isOn) return theme.colors.outline;
    switch (type) {
      case 'light':
        return '#FFB703';
      case 'lock':
        return '#0D6EFD';
      case 'camera':
        return '#219EBC';
      case 'thermostat':
        return '#FB8500';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.leftCol}>
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: isOn
                ? `${getIconColor()}1A`
                : theme.colors.surfaceVariant,
            },
          ]}
        >
          <AppIcon name={getDeviceIcon()} size={24} color={getIconColor()} />
        </View>

        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <AppText variant="subtitle2" numberOfLines={1}>
              {name}
            </AppText>
            <AppBadge
              content={status}
              size={12}
              color={status === 'online' ? '#198754' : '#6C757D'}
            />
          </View>
          {subtitle ? (
            <AppText variant="caption" color={theme.colors.outline}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      <AppSwitch value={isOn} onValueChange={onToggle} />
    </TouchableOpacity>
  );
};

export * from './types';
