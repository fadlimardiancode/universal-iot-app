import React from 'react';
import { Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppTextProps } from './types';
import { styles } from './styles';

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body1',
  color,
  align = 'left',
  weight,
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const textColor = color || theme.colors.onBackground;

  return (
    <Text
      style={[
        styles[variant],
        { color: textColor, textAlign: align },
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

export * from './types';
