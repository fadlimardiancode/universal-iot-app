import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppSwitchProps } from './types';
import { styles } from './styles';

export const AppSwitch: React.FC<AppSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  color,
}) => {
  const theme = useTheme();
  const activeColor = color || theme.colors.primary;

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: theme.colors.surfaceVariant, true: activeColor }}
      thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
      style={styles.container}
    />
  );
};

export * from './types';
