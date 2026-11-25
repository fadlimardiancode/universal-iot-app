import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppDividerProps } from './types';
import { styles } from './styles';

export const AppDivider: React.FC<AppDividerProps> = ({
  color,
  thickness = 1,
  spacing = 8,
  style,
}) => {
  const theme = useTheme();
  const dividerColor = color || theme.colors.outline;

  return (
    <View
      style={[
        styles.divider,
        {
          height: thickness,
          backgroundColor: dividerColor,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
};

export * from './types';
