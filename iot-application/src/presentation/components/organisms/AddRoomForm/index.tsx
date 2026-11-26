import React, { useState } from 'react';
import { View } from 'react-native';
import { Portal, Modal } from 'react-native-paper';
import { FormField } from '../../molecules/FormField';
import { AppButton } from '../../atoms/AppButton';
import { AppText } from '../../atoms/AppText';
import { styles } from './styles';
import { AddRoomFormProps } from './types';

export const AddRoomForm: React.FC<AddRoomFormProps> = ({
  visible,
  onDismiss,
  onSubmit,
}) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim() });
    setName('');
    onDismiss();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <AppText variant="h2" style={styles.title}>
          Add New Room
        </AppText>
        <FormField
          label="Room Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Master Bedroom"
        />
        <View style={styles.buttonRow}>
          <AppButton label="Cancel" variant="ghost" onPress={onDismiss} style={styles.button} />
          <AppButton label="Add Room" variant="primary" onPress={handleSubmit} style={styles.button} />
        </View>
      </Modal>
    </Portal>
  );
};
