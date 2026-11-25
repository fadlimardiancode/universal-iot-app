import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppSkeletonProps } from './types';
import { styles } from './styles';

export const AppSkeleton: React.FC<AppSkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          backgroundColor: theme.colors.surfaceVariant,
          borderRadius: borderRadius ?? styles.skeleton.borderRadius,
        },
        style,
      ]}
    />
  );
};

export * from './types';
