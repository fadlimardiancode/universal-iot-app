import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../AppText';
import { AppBadgeProps } from './types';
import { styles } from './styles';

export const AppBadge: React.FC<AppBadgeProps> = ({
  content,
  size = 18,
  color,
  textColor = '#FFFFFF',
  visible = true,
  style,
}) => {
  const theme = useTheme();
  if (!visible) return null;

  const bg = color || theme.colors.error;
  const isDot = content === undefined || content === null;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          minWidth: size,
          height: size,
        },
        style,
      ]}
    >
      {!isDot && (
        <AppText variant="caption" color={textColor} style={styles.text}>
          {content}
        </AppText>
      )}
    </View>
  );
};

export * from './types';
