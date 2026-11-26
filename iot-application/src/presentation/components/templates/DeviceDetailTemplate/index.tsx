import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
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
  const isSensor = device.type === 'sensor';
  const protocol = device.protocol || 'mqtt';
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.statusRow}>
            <AppText variant="caption" style={styles.roomLabel}>
              {roomName || 'Unassigned Room'}
            </AppText>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <AppBadge
                content={protocol.toUpperCase()}
                color={protocol === 'http' ? '#0D6EFD' : '#6610F2'}
              />
              <AppBadge
                content={device.status.toUpperCase()}
                color={device.status === 'online' ? '#198754' : '#6C757D'}
              />
            </View>
          </View>
          <AppText variant="h2" style={styles.deviceName}>
            {device.name}
          </AppText>
          <AppText variant="caption" style={styles.deviceMeta}>
            ID: {device.id} • Type: {device.type.toUpperCase()}
          </AppText>

          {/* Connection Config Info */}
          <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant }}>
            <AppText variant="caption" color={theme.colors.onSurface} weight="600">
              {protocol === 'mqtt' ? 'MQTT Protocol Config:' : 'HTTP REST Polling Config:'}
            </AppText>
            {protocol === 'mqtt' ? (
              <AppText variant="caption" color={theme.colors.onSurfaceVariant}>
                Broker: {device.connectionConfig?.brokerUrl || 'ws://localhost:9001'} • Topic: {device.connectionConfig?.topic || `home/${device.id}`}
              </AppText>
            ) : (
              <AppText variant="caption" color={theme.colors.onSurfaceVariant}>
                Base URL: {device.connectionConfig?.baseUrl || 'http://localhost:3001'} • Poll Interval: {(device.connectionConfig?.pollIntervalMs || 5000) / 1000}s
              </AppText>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Primary Power / State Control (Not shown for read-only sensor) */}
      {!isSensor && (
        <Card style={styles.controlCard}>
          <Card.Content>
            <View style={styles.switchRow}>
              <AppText variant="subtitle1">
                {device.type === 'lock'
                  ? 'Door Lock Status'
                  : device.type === 'plug'
                  ? 'Smart Plug Power State'
                  : 'Power State'}
              </AppText>
              <AppSwitch
                value={device.isOn}
                onValueChange={onTogglePower}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Sensor Specific Telemetry Display (Read-Only) */}
      {isSensor && (
        <Card style={styles.controlCard}>
          <Card.Content>
            <AppText variant="subtitle1" style={{ marginBottom: 12 }}>
              Telemetry Metrics (Read-Only Sensor)
            </AppText>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 }}>
              <View style={{ alignItems: 'center' }}>
                <AppText variant="h2" style={{ color: '#20C997', fontWeight: '700' }}>
                  {(device.temperature || 24).toFixed(1)}°C
                </AppText>
                <AppText variant="caption" color={theme.colors.onSurfaceVariant}>
                  Temperature
                </AppText>
              </View>
              <View style={{ width: 1, backgroundColor: theme.colors.outlineVariant }} />
              <View style={{ alignItems: 'center' }}>
                <AppText variant="h2" style={{ color: '#0D6EFD', fontWeight: '700' }}>
                  {device.humidity || 55}%
                </AppText>
                <AppText variant="caption" color={theme.colors.onSurfaceVariant}>
                  Relative Humidity
                </AppText>
              </View>
            </View>
            <AppText variant="caption" color={theme.colors.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 8 }}>
              Sensors are read-only telemetry devices and do not accept command states.
            </AppText>
          </Card.Content>
        </Card>
      )}

      {/* Light Controls: Brightness */}
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

      {/* Thermostat Controls */}
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

      {/* Camera Live Feed */}
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
