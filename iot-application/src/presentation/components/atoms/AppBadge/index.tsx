import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../AppText';
import { AppBadgeProps } from './types';
import { styles } from './styles';

export const AppBadge: React.FC<AppBadgeProps> = ({
  content,
  size,
  color,
  textColor = '#FFFFFF',
  visible = true,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  if (!visible) return null;

  const bg = color || theme.colors.error;
  const isDot = content === undefined || content === null;

  if (isDot) {
    const dotSize = size || 8;
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: bg,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
          },
          style,
        ]}
      />
    );
  }

  // Text badge / pill:
  // Use minimum height and proper padding so text has breathing room and never gets clipped
  const badgeMinHeight = size && size > 18 ? size : 20;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          minHeight: badgeMinHeight,
          minWidth: badgeMinHeight,
        },
        style,
      ]}
    >
      <AppText
        variant="caption"
        color={textColor}
        style={[styles.text, textStyle]}
      >
        {content}
      </AppText>
    </View>
  );
};

export * from './types';
