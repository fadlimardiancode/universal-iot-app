import React from 'react';
import { View } from 'react-native';
import { AppIcon } from '../../atoms/AppIcon';
import { AppText } from '../../atoms/AppText';
import { StatusChipProps } from './types';
import { styles } from './styles';

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  label,
  size = 'md',
}) => {
  let iconName = 'circle-medium';
  let bgColor = '#E9ECEF';
  let textColor = '#495057';
  let defaultLabel = status.toUpperCase();

  switch (status) {
    case 'on':
    case 'online':
      iconName = 'check-circle';
      bgColor = '#D1E7DD';
      textColor = '#0F5132';
      defaultLabel = status === 'on' ? 'ON' : 'ONLINE';
      break;
    case 'off':
    case 'offline':
      iconName = 'close-circle';
      bgColor = '#F8D7DA';
      textColor = '#842029';
      defaultLabel = status === 'off' ? 'OFF' : 'OFFLINE';
      break;
    case 'locked':
      iconName = 'lock';
      bgColor = '#CFE2FF';
      textColor = '#084298';
      defaultLabel = 'LOCKED';
      break;
    case 'unlocked':
      iconName = 'lock-open-variant';
      bgColor = '#FFF3CD';
      textColor = '#664D03';
      defaultLabel = 'UNLOCKED';
      break;
  }

  return (
    <View style={[styles.container, styles[size], { backgroundColor: bgColor }]}>
      <AppIcon name={iconName} size={size === 'sm' ? 14 : 16} color={textColor} />
      <AppText
        variant={size === 'sm' ? 'caption' : 'body2'}
        color={textColor}
        weight="600"
      >
        {label || defaultLabel}
      </AppText>
    </View>
  );
};

export * from './types';
