import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SegmentedButtons, Card, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../store';
import { addAutomationAction } from '../../store/automationSlice';
import { FormField } from '../../components/molecules';
import { AppButton, AppText, AppIcon } from '../../components/atoms';
import { AutomationAction } from '../../../domain/entities/Automation';

export const AddAutomationScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const devices = useAppSelector((state) => state.devices.devices);

  const [name, setName] = useState('');
  const [scheduledHour, setScheduledHour] = useState('07');
  const [scheduledMinute, setScheduledMinute] = useState('00');
  const [actionState, setActionState] = useState<AutomationAction>('turnOn');
  const [targetTemp, setTargetTemp] = useState('23');
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || '');

  const scheduledTime = `${scheduledHour.padStart(2, '0')}:${scheduledMinute.padStart(2, '0')}`;

  const handleSave = () => {
    if (!name.trim()) return;

    dispatch(
      addAutomationAction({
        id: `auto_${Date.now()}`,
        name: name.trim(),
        deviceId: selectedDeviceId || devices[0]?.id || 'device_1',
        action: actionState,
        scheduledTime,
        isActive: true,
        value: actionState === 'setTemperature' ? parseFloat(targetTemp) || 22 : undefined,
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
        placeholder="e.g. Morning Awakening"
      />

      {/* Target Device Selection */}
      <AppText variant="subtitle1" style={styles.sectionLabel}>
        Target Device
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.devicePickerRow}>
        {devices.map((device) => {
          const isSelected = (selectedDeviceId || devices[0]?.id) === device.id;
          return (
            <TouchableOpacity
              key={device.id}
              onPress={() => setSelectedDeviceId(device.id)}
              style={[
                styles.deviceChip,
                {
                  borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
                  backgroundColor: isSelected ? `${theme.colors.primary}1A` : theme.colors.surface,
                },
              ]}
            >
              <AppIcon
                name={
                  device.type === 'light'
                    ? 'lightbulb'
                    : device.type === 'thermostat'
                    ? 'thermometer'
                    : device.type === 'lock'
                    ? 'lock'
                    : 'camera'
                }
                size={18}
                color={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <AppText
                variant="body2"
                style={[
                  styles.deviceChipText,
                  isSelected && { color: theme.colors.primary, fontWeight: '700' },
                ]}
              >
                {device.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Time Picker Inputs */}
      <AppText variant="subtitle1" style={styles.sectionLabel}>
        Execution Time (24h)
      </AppText>
      <View style={styles.timeRow}>
        <View style={styles.timeInputWrapper}>
          <FormField
            label="Hour (00-23)"
            value={scheduledHour}
            onChangeText={(val) => setScheduledHour(val.slice(0, 2))}
            placeholder="07"
            keyboardType="number-pad"
          />
        </View>
        <AppText variant="h2" style={styles.timeColon}>
          :
        </AppText>
        <View style={styles.timeInputWrapper}>
          <FormField
            label="Minute (00-59)"
            value={scheduledMinute}
            onChangeText={(val) => setScheduledMinute(val.slice(0, 2))}
            placeholder="00"
            keyboardType="number-pad"
          />
        </View>
      </View>

      {/* Quick Time Presets */}
      <View style={styles.presetRow}>
        {[
          { label: '06:30 (Morning)', h: '06', m: '30' },
          { label: '18:00 (Evening)', h: '18', m: '00' },
          { label: '23:00 (Night)', h: '23', m: '00' },
        ].map((preset) => (
          <TouchableOpacity
            key={preset.label}
            onPress={() => {
              setScheduledHour(preset.h);
              setScheduledMinute(preset.m);
            }}
            style={[styles.presetChip, { borderColor: theme.colors.outline }]}
          >
            <AppText variant="caption">{preset.label}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Selection */}
      <AppText variant="subtitle1" style={styles.sectionLabel}>
        Action to Trigger
      </AppText>
      <SegmentedButtons
        value={actionState}
        onValueChange={(val) => setActionState(val as AutomationAction)}
        buttons={[
          { value: 'turnOn', label: 'Turn ON', icon: 'power' },
          { value: 'turnOff', label: 'Turn OFF', icon: 'power-off' },
          { value: 'setTemperature', label: 'Set Temp', icon: 'thermometer' },
        ]}
        style={styles.segmented}
      />

      {actionState === 'setTemperature' && (
        <View style={styles.tempInputWrapper}>
          <FormField
            label="Target Temperature (°C)"
            value={targetTemp}
            onChangeText={setTargetTemp}
            placeholder="22"
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Summary Preview Card */}
      <Card style={styles.summaryCard}>
        <Card.Content>
          <AppText variant="caption" style={styles.summaryTitle}>
            RULE SUMMARY
          </AppText>
          <AppText variant="body1" style={styles.summaryBody}>
            At <AppText weight="700">{scheduledTime}</AppText> every day,{' '}
            <AppText weight="700">
              {actionState === 'turnOn'
                ? 'Turn ON'
                : actionState === 'turnOff'
                ? 'Turn OFF'
                : `Set Temperature to ${targetTemp}°C on`}
            </AppText>{' '}
            device{' '}
            <AppText weight="700">
              {devices.find((d) => d.id === selectedDeviceId)?.name || selectedDeviceId}
            </AppText>
            .
          </AppText>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <AppButton label="Save Automation Rule" variant="primary" onPress={handleSave} />
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
  devicePickerRow: {
    marginBottom: 8,
  },
  deviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  deviceChipText: {
    marginLeft: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputWrapper: {
    flex: 1,
  },
  timeColon: {
    marginHorizontal: 12,
    marginTop: -8,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 12,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  segmented: {
    marginBottom: 12,
  },
  tempInputWrapper: {
    marginTop: 4,
  },
  summaryCard: {
    marginTop: 16,
    borderRadius: 12,
  },
  summaryTitle: {
    opacity: 0.6,
    marginBottom: 4,
  },
  summaryBody: {
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});
