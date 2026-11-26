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
  protocol = 'mqtt',
  subtitle,
  temperature,
  humidity,
  onToggle,
  onPress,
}) => {
  const theme = useTheme();

  const getDeviceIcon = () => {
    switch (type) {
      case 'light':
        return isOn ? 'lightbulb-on' : 'lightbulb-outline';
      case 'plug':
        return isOn ? 'power-plug' : 'power-plug-off';
      case 'sensor':
        return 'thermometer-lines';
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
    if (!isOn && type !== 'sensor') return theme.colors.outline;
    switch (type) {
      case 'light':
        return '#FFB703';
      case 'plug':
        return '#198754';
      case 'sensor':
        return '#20C997';
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
              backgroundColor: (isOn || type === 'sensor')
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
              content={protocol.toUpperCase()}
              size={12}
              color={protocol === 'http' ? '#0D6EFD' : '#6610F2'}
            />
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

      {type === 'sensor' ? (
        <View style={{ alignItems: 'flex-end' }}>
          <AppText variant="caption" color={theme.colors.primary} weight="700">
            {temperature !== undefined ? `${temperature}°C` : 'Telemetry'}
          </AppText>
          {humidity !== undefined && (
            <AppText variant="caption" color={theme.colors.outline}>
              {humidity}% RH
            </AppText>
          )}
        </View>
      ) : (
        <AppSwitch value={isOn} onValueChange={onToggle} />
      )}
    </TouchableOpacity>
  );
};

export * from './types';
