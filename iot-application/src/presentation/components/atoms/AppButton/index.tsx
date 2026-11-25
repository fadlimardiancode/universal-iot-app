import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../AppText';
import { AppButtonProps } from './types';
import { styles } from './styles';
import { AppColors } from '../../../../core/constants/AppColors';

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  labelStyle,
}) => {
  const theme = useTheme();

  let backgroundColor = theme.colors.primary;
  let textColor = '#FFFFFF';
  let borderWidth = 0;
  let borderColor = 'transparent';

  switch (variant) {
    case 'secondary':
      backgroundColor = theme.colors.surfaceVariant;
      textColor = theme.colors.onSurfaceVariant;
      break;
    case 'outlined':
      backgroundColor = 'transparent';
      textColor = theme.colors.primary;
      borderWidth = 1;
      borderColor = theme.colors.primary;
      break;
    case 'ghost':
      backgroundColor = 'transparent';
      textColor = theme.colors.primary;
      break;
    case 'danger':
      backgroundColor = AppColors.danger;
      textColor = '#FFFFFF';
      break;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        styles[size],
        { backgroundColor, borderWidth, borderColor },
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <AppText
          variant={size === 'sm' ? 'caption' : size === 'lg' ? 'subtitle1' : 'body2'}
          color={textColor}
          style={[styles.label, labelStyle]}
        >
          {label}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

export * from './types';
