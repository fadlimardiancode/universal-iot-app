import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { AppSwitch } from '../../atoms/AppSwitch';
import { AppButton } from '../../atoms/AppButton';
import { AppBadge } from '../../atoms/AppBadge';
import { TemperatureControl } from '../../molecules/TemperatureControl';
import { styles } from './styles';
import { DeviceDetailTemplateProps } from './types';

export const DeviceDetailTemplate: React.FC<DeviceDetailTemplateProps> = ({
  device,
  roomName,
  onTogglePower,
  onBrightnessChange,
  onTargetTempChange,
  onDeleteDevice,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.statusRow}>
            <AppText variant="caption" style={styles.roomLabel}>
              {roomName || 'Unassigned'}
            </AppText>
            <AppBadge
              content={device.status.toUpperCase()}
              color={device.status === 'online' ? '#198754' : '#6C757D'}
            />
          </View>
          <AppText variant="h2" style={styles.deviceName}>
            {device.name}
          </AppText>
          <AppText variant="caption" style={styles.deviceMeta}>
            ID: {device.id} • Type: {device.type}
          </AppText>
        </Card.Content>
      </Card>

      {/* Primary Power / State Control */}
      <Card style={styles.controlCard}>
        <Card.Content>
          <View style={styles.switchRow}>
            <AppText variant="subtitle1">
              {device.type === 'lock' ? 'Door Lock Status' : 'Power State'}
            </AppText>
            <AppSwitch
              value={device.isOn}
              onValueChange={onTogglePower}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Type-specific Controls */}
      {device.type === 'light' && (
        <Card style={styles.controlCard}>
          <Card.Content>
            <AppText variant="subtitle1">
              Brightness: {device.brightness ?? 0}%
            </AppText>
            <View style={styles.brightnessButtons}>
              {[25, 50, 75, 100].map((level) => (
                <AppButton
                  key={level}
                  label={`${level}%`}
                  variant={device.brightness === level ? 'primary' : 'outlined'}
                  size="sm"
                  onPress={() => onBrightnessChange && onBrightnessChange(level)}
                />
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {device.type === 'thermostat' && (
        <Card style={styles.controlCard}>
          <Card.Content>
            <TemperatureControl
              value={device.temperature ?? 24}
              onIncrease={() =>
                onTargetTempChange &&
                onTargetTempChange((device.temperature ?? 22) + 0.5)
              }
              onDecrease={() =>
                onTargetTempChange &&
                onTargetTempChange((device.temperature ?? 22) - 0.5)
              }
            />
            {device.humidity !== undefined && (
              <AppText variant="body2" style={styles.humidityText}>
                Relative Humidity: {device.humidity}%
              </AppText>
            )}
          </Card.Content>
        </Card>
      )}

      {device.type === 'camera' && (
        <Card style={styles.controlCard}>
          <Card.Content>
            <AppText variant="subtitle1" style={styles.cameraTitle}>
              Live Camera Feed
            </AppText>
            <View style={styles.cameraPlaceholder}>
              <AppText variant="body1" style={styles.cameraPlaceholderText}>
                {device.isOn ? '● Streaming (Simulated RTSP Feed)' : 'Camera is in Privacy Mode (OFF)'}
              </AppText>
            </View>
          </Card.Content>
        </Card>
      )}

      {onDeleteDevice && (
        <View style={styles.deleteWrapper}>
          <AppButton
            label="Remove Device"
            variant="danger"
            onPress={onDeleteDevice}
          />
        </View>
      )}
    </ScrollView>
  );
};
