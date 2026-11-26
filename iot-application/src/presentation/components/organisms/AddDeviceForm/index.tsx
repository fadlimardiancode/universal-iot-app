import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Portal, Modal, SegmentedButtons } from 'react-native-paper';
import { FormField } from '../../molecules/FormField';
import { AppButton } from '../../atoms/AppButton';
import { AppText } from '../../atoms/AppText';
import { styles } from './styles';
import { AddDeviceFormProps } from './types';
import { DeviceType, DeviceProtocol } from '../../../../domain/entities/Device';
import { APP_CONFIG } from '../../../../core/constants/config';

export const AddDeviceForm: React.FC<AddDeviceFormProps> = ({
  visible,
  onDismiss,
  onSubmit,
  rooms,
  initialRoomId,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('light');
  const [protocol, setProtocol] = useState<DeviceProtocol>('mqtt');
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || (rooms[0]?.id ?? ''));

  // MQTT specific fields
  const [brokerUrl, setBrokerUrl] = useState<string>(APP_CONFIG.MQTT_BROKER_URL);
  const [topic, setTopic] = useState('');

  // HTTP specific fields
  const [baseUrl, setBaseUrl] = useState<string>(APP_CONFIG.HTTP_BASE_URL);
  const [pollIntervalSec, setPollIntervalSec] = useState('5');

  useEffect(() => {
    if (initialRoomId) {
      setSelectedRoomId(initialRoomId);
    } else if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [initialRoomId, rooms, selectedRoomId]);

  // Update default topic when name changes
  useEffect(() => {
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    setTopic(slug ? `${APP_CONFIG.MQTT_TOPIC_PREFIX}/${slug}` : '');
  }, [name]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    const connectionConfig =
      protocol === 'mqtt'
        ? {
            brokerUrl: brokerUrl.trim() || APP_CONFIG.MQTT_BROKER_URL,
            topic: topic.trim() || `${APP_CONFIG.MQTT_TOPIC_PREFIX}/${name.trim().toLowerCase().replace(/\s+/g, '-')}`,
          }
        : {
            baseUrl: baseUrl.trim() || APP_CONFIG.HTTP_BASE_URL,
            pollIntervalMs: (parseInt(pollIntervalSec, 10) || 5) * 1000,
          };

    onSubmit({
      name: name.trim(),
      type,
      roomId: selectedRoomId,
      protocol,
      connectionConfig,
    });

    setName('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <AppText variant="h2" style={styles.title}>
            Add New Device
          </AppText>

          {/* Device Name */}
          <FormField
            label="Device Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Living Room Lamp"
          />

          {/* Device Type Selection */}
          <AppText variant="body1" style={styles.sectionLabel}>
            Device Type
          </AppText>
          <AppText variant="caption" style={styles.hintText}>
            Select standard IoT device profile
          </AppText>
          <SegmentedButtons
            value={type}
            onValueChange={(val) => setType(val as DeviceType)}
            buttons={[
              { value: 'light', label: 'Light', icon: 'lightbulb' },
              { value: 'plug', label: 'Plug', icon: 'power-socket-us' },
              { value: 'sensor', label: 'Sensor', icon: 'thermometer-lines' },
            ]}
            style={styles.segmented}
          />
          <SegmentedButtons
            value={type}
            onValueChange={(val) => setType(val as DeviceType)}
            buttons={[
              { value: 'thermostat', label: 'Thermo', icon: 'thermometer' },
              { value: 'lock', label: 'Lock', icon: 'lock' },
              { value: 'camera', label: 'Camera', icon: 'camera' },
            ]}
            style={styles.segmented}
          />

          {/* Protocol Selection */}
          <AppText variant="body1" style={styles.sectionLabel}>
            Communication Protocol
          </AppText>
          <AppText variant="caption" style={styles.hintText}>
            Choose transport adapter for device provisioning
          </AppText>
          <SegmentedButtons
            value={protocol}
            onValueChange={(val) => setProtocol(val as DeviceProtocol)}
            buttons={[
              { value: 'mqtt', label: 'MQTT (Broker)', icon: 'swap-horizontal' },
              { value: 'http', label: 'HTTP (REST Polling)', icon: 'web' },
            ]}
            style={styles.segmented}
          />

          {/* Connection Parameters according to chosen protocol */}
          {protocol === 'mqtt' ? (
            <View style={styles.configBox}>
              <AppText variant="caption" style={styles.configTitle}>
                MQTT Connection Configuration
              </AppText>
              <FormField
                label="Broker WebSocket URL"
                value={brokerUrl}
                onChangeText={setBrokerUrl}
                placeholder="ws://localhost:9001"
              />
              <FormField
                label="State & Command Topic"
                value={topic}
                onChangeText={setTopic}
                placeholder={`home/demo-iot-app/...`}
              />
            </View>
          ) : (
            <View style={styles.configBox}>
              <AppText variant="caption" style={styles.configTitle}>
                HTTP / REST Polling Configuration
              </AppText>
              <FormField
                label="Base REST URL"
                value={baseUrl}
                onChangeText={setBaseUrl}
                placeholder="http://localhost:3001"
              />
              <FormField
                label="Polling Interval (seconds)"
                value={pollIntervalSec}
                onChangeText={setPollIntervalSec}
                placeholder="5"
                keyboardType="numeric"
              />
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <AppButton label="Cancel" variant="ghost" onPress={onDismiss} style={styles.button} />
            <AppButton label="Add Device" variant="primary" onPress={handleSubmit} style={styles.button} />
          </View>
        </ScrollView>
      </Modal>
    </Portal>
  );
};
