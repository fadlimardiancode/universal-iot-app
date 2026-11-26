import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { AppSwitch } from '../../atoms/AppSwitch';
import { AppBadge } from '../../atoms/AppBadge';
import { AppIcon } from '../../atoms/AppIcon';
import { AppButton } from '../../atoms/AppButton';
import { StatusChip } from '../../molecules/StatusChip';
import { DeviceCardProps } from './types';
import { styles } from './styles';

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onToggle,
  onAdjustTemp,
  onPress,
  onRemove,
}) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (device.type) {
      case 'light':
        return device.isOn ? 'lightbulb-on' : 'lightbulb-outline';
      case 'plug':
        return device.isOn ? 'power-plug' : 'power-plug-off';
      case 'sensor':
        return 'thermometer-lines';
      case 'thermostat':
        return 'thermometer';
      case 'camera':
        return 'cctv';
      case 'lock':
        return device.isOn ? 'lock-open-variant' : 'lock';
      default:
        return 'devices';
    }
  };

  const getIconColor = () => {
    if (!device.isOn && device.type !== 'sensor') return theme.colors.outline;
    switch (device.type) {
      case 'light':
        return '#FFB703';
      case 'plug':
        return '#198754';
      case 'sensor':
        return '#20C997';
      case 'thermostat':
        return '#FB8500';
      case 'camera':
        return '#219EBC';
      case 'lock':
        return '#0D6EFD';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleCol}>
          <View style={styles.titleRow}>
            <AppIcon name={getIcon()} size={22} color={getIconColor()} />
            <AppText variant="subtitle2" numberOfLines={1}>
              {device.name}
            </AppText>
          </View>
          <AppText variant="caption" color={theme.colors.outline}>
            {device.roomId} • {device.type.toUpperCase()}
            {device.type === 'light' && device.brightness !== undefined ? ` • ${device.brightness}%` : ''}
          </AppText>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <AppBadge
            content={(device.protocol || 'mqtt').toUpperCase()}
            size={12}
            color={device.protocol === 'http' ? '#0D6EFD' : '#6610F2'}
          />
          <StatusChip status={device.status} size="sm" />
        </View>
      </View>

      {/* Device Specific Content */}
      {device.type === 'camera' && (
        <View
          style={[
            styles.cameraBox,
            { backgroundColor: device.isOn ? '#2B2D42' : theme.colors.surfaceVariant },
          ]}
        >
          {device.isOn ? (
            <>
              <View style={styles.cameraBadge}>
                <AppBadge content="LIVE" color="#DC3545" size={14} />
              </View>
              <AppIcon name="play-circle-outline" size={44} color="#FFFFFF" />
              <AppText variant="caption" color="#FFFFFF">
                Live Feed Simulated
              </AppText>
            </>
          ) : (
            <AppText variant="caption" color={theme.colors.outline}>
              Camera Inactive
            </AppText>
          )}
        </View>
      )}

      {device.type === 'sensor' && (
        <View style={styles.thermoRow}>
          <View>
            <AppText variant="h2" weight="700" color="#20C997">
              {(device.temperature || 24).toFixed(1)}°C
            </AppText>
            <AppText variant="caption" color={theme.colors.outline}>
              Humidity: {device.humidity || 55}% RH
            </AppText>
          </View>
          <View style={{ backgroundColor: '#20C9971A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
            <AppText variant="caption" color="#20C997" weight="600">
              Telemetry Only
            </AppText>
          </View>
        </View>
      )}

      {device.type === 'thermostat' && (
        <View style={styles.thermoRow}>
          <View>
            <AppText variant="h2" weight="700" color={theme.colors.primary}>
              {(device.temperature || 24).toFixed(1)}°C
            </AppText>
            <AppText variant="caption" color={theme.colors.outline}>
              Humidity: {device.humidity || 60}%
            </AppText>
          </View>

          {onAdjustTemp && (
            <View style={styles.tempButtons}>
              <AppButton
                label="-"
                size="sm"
                variant="secondary"
                style={styles.btnSmall}
                onPress={() => onAdjustTemp(-0.5)}
              />
              <AppButton
                label="+"
                size="sm"
                variant="secondary"
                style={styles.btnSmall}
                onPress={() => onAdjustTemp(0.5)}
              />
            </View>
          )}
        </View>
      )}

      {/* Bottom Switch & Remove */}
      {device.type === 'sensor' ? (
        <View style={styles.bodyRow}>
          <AppText variant="body2" color="#20C997" weight="600">
            Read-Only Sensor
          </AppText>

          {onRemove && (
            <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AppIcon name="trash-can-outline" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.bodyRow}>
          <AppText variant="body2" color={device.isOn ? theme.colors.primary : theme.colors.outline} weight="600">
            {device.type === 'lock'
              ? device.isOn
                ? 'Unlocked'
                : 'Locked'
              : device.isOn
              ? 'Active'
              : 'Turned Off'}
          </AppText>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {onRemove && (
              <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <AppIcon name="trash-can-outline" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            )}
            <AppSwitch value={device.isOn} onValueChange={onToggle} />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export * from './types';
