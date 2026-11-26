import React, { useState } from 'react';
import { View } from 'react-native';
import { Portal, Modal, SegmentedButtons } from 'react-native-paper';
import { FormField } from '../../molecules/FormField';
import { AppButton } from '../../atoms/AppButton';
import { AppText } from '../../atoms/AppText';
import { styles } from './styles';
import { AddDeviceFormProps } from './types';
import { DeviceType } from '../../../../domain/entities/Device';

export const AddDeviceForm: React.FC<AddDeviceFormProps> = ({
  visible,
  onDismiss,
  onSubmit,
  rooms,
  initialRoomId,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<DeviceType>('light');
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || (rooms[0]?.id ?? ''));

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      type,
      roomId: selectedRoomId,
    });
    setName('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <AppText variant="h2" style={styles.title}>
          Add New Device
        </AppText>
        <FormField
          label="Device Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Ceiling Lamp"
        />
        <AppText variant="body1" style={styles.sectionLabel}>
          Device Type
        </AppText>
        <SegmentedButtons
          value={type}
          onValueChange={(val) => setType(val as DeviceType)}
          buttons={[
            { value: 'light', label: 'Light', icon: 'lightbulb' },
            { value: 'thermostat', label: 'Thermo', icon: 'thermometer' },
            { value: 'lock', label: 'Lock', icon: 'lock' },
            { value: 'camera', label: 'Camera', icon: 'camera' },
          ]}
          style={styles.segmented}
        />
        <View style={styles.buttonRow}>
          <AppButton label="Cancel" variant="ghost" onPress={onDismiss} style={styles.button} />
          <AppButton label="Add Device" variant="primary" onPress={handleSubmit} style={styles.button} />
        </View>
      </Modal>
    </Portal>
  );
};
