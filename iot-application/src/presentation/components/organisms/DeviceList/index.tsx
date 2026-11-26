import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { DeviceCard } from '../DeviceCard';
import { AppText } from '../../atoms/AppText';
import { AppIcon } from '../../atoms/AppIcon';
import { AppButton } from '../../atoms/AppButton';
import { AppSkeleton } from '../../atoms/AppSkeleton';
import { DeviceListProps, FilterType } from './types';
import { styles } from './styles';

export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  loading = false,
  onPressDevice,
  onToggle,
  onAdjustTemp,
  onRemoveDevice,
  onAddDevice,
}) => {
  const theme = useTheme();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredDevices = devices.filter((device) => {
    if (filter === 'on') return device.isOn;
    if (filter === 'off') return !device.isOn;
    return true;
  });

  const renderFilterChip = (type: FilterType, label: string) => {
    const isSelected = filter === type;
    return (
      <TouchableOpacity
        onPress={() => setFilter(type)}
        style={[
          styles.chip,
          {
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
            borderColor: isSelected ? theme.colors.primary : theme.colors.outline,
          },
        ]}
      >
        <AppText
          variant="caption"
          weight="600"
          color={isSelected ? '#FFFFFF' : theme.colors.onSurface}
        >
          {label}
        </AppText>
      </TouchableOpacity>
    );
  };

  if (loading && devices.length === 0) {
    return (
      <View style={{ gap: 12, paddingVertical: 12 }}>
        <AppSkeleton width="100%" height={90} borderRadius={16} />
        <AppSkeleton width="100%" height={90} borderRadius={16} />
        <AppSkeleton width="100%" height={90} borderRadius={16} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {renderFilterChip('all', `All (${devices.length})`)}
        {renderFilterChip('on', `On (${devices.filter((d) => d.isOn).length})`)}
        {renderFilterChip('off', `Off (${devices.filter((d) => !d.isOn).length})`)}
      </View>

      {filteredDevices.length === 0 ? (
        <View style={styles.emptyBox}>
          <AppIcon name="devices" size={48} color={theme.colors.outline} />
          <AppText variant="subtitle1" color={theme.colors.outline}>
            No devices found
          </AppText>
          {onAddDevice && (
            <AppButton
              label="Add New Device"
              variant="outlined"
              size="sm"
              onPress={onAddDevice}
            />
          )}
        </View>
      ) : (
        <View>
          {filteredDevices.map((item) => (
            <DeviceCard
              key={item.id}
              device={item}
              onToggle={() => onToggle(item.id, item.isOn)}
              onAdjustTemp={
                onAdjustTemp ? (delta) => onAdjustTemp(item.id, delta) : undefined
              }
              onPress={onPressDevice ? () => onPressDevice(item.id) : undefined}
              onRemove={onRemoveDevice ? () => onRemoveDevice(item.id) : undefined}
            />
          ))}
          {onAddDevice && (
            <View style={styles.footer}>
              <AppButton
                label="+ Add Device"
                variant="outlined"
                onPress={onAddDevice}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export * from './types';
