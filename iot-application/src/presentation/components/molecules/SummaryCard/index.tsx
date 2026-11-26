import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppIcon } from '../../atoms/AppIcon';
import { AppText } from '../../atoms/AppText';
import { SummaryCardProps } from './types';
import { styles } from './styles';

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  label,
  value,
  color,
  subtitle,
  onPress,
}) => {
  const theme = useTheme();
  const accentColor = color || theme.colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant || '#E9ECEF',
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: `${accentColor}1A` }]}>
          <AppIcon name={icon} size={20} color={accentColor} />
        </View>
        {subtitle && (
          <AppText variant="caption" color={theme.colors.onSurfaceVariant}>
            {subtitle}
          </AppText>
        )}
      </View>

      <AppText variant="h2" weight="700" color={accentColor}>
        {value}
      </AppText>
      <AppText variant="caption" color={theme.colors.onSurfaceVariant} weight="600">
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

export * from './types';
