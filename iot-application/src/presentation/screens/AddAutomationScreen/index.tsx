import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SegmentedButtons } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store';
import { addAutomationAction } from '../../store/automationSlice';
import { FormField } from '../../components/molecules';
import { AppButton, AppText } from '../../components/atoms';
import { AutomationAction } from '../../../domain/entities/Automation';

export const AddAutomationScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => state.devices.devices);

  const [name, setName] = useState('');
  const [scheduledTime, setScheduledTime] = useState('07:00');
  const [actionState, setActionState] = useState<AutomationAction>('turnOn');
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || '');

  const handleSave = () => {
    if (!name.trim()) return;

    dispatch(
      addAutomationAction({
        id: `auto_${Date.now()}`,
        name: name.trim(),
        deviceId: selectedDeviceId || 'device_1',
        action: actionState,
        scheduledTime: scheduledTime.trim() || '07:00',
        isActive: true,
      }),
    );
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <AppText variant="h2" style={styles.title}>
        Create Automation Rule
      </AppText>

      <FormField
        label="Automation Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Morning Routine"
      />

      <FormField
        label="Scheduled Time (24h format, e.g. 07:00)"
        value={scheduledTime}
        onChangeText={setScheduledTime}
        placeholder="07:00"
      />

      <AppText variant="subtitle1" style={styles.sectionLabel}>
        Action
      </AppText>
      <SegmentedButtons
        value={actionState}
        onValueChange={(val) => setActionState(val as AutomationAction)}
        buttons={[
          { value: 'turnOn', label: 'Turn ON' },
          { value: 'turnOff', label: 'Turn OFF' },
          { value: 'setTemperature', label: 'Set Temp' },
        ]}
        style={styles.segmented}
      />

      <View style={styles.buttonContainer}>
        <AppButton label="Save Automation" variant="primary" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  segmented: {
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 32,
  },
});
