import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';
import { AppIconProps } from './types';

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color,
  style,
}) => {
  const theme = useTheme();
  const iconColor = color || theme.colors.onSurface;

  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={iconColor}
      style={style}
    />
  );
};

export * from './types';
