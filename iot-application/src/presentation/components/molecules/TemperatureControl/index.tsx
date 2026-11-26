import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { AppButton } from '../../atoms/AppButton';
import { TemperatureControlProps } from './types';
import { styles } from './styles';

export const TemperatureControl: React.FC<TemperatureControlProps> = ({
  value,
  min = 16,
  max = 30,
  unit = '°C',
  onIncrease,
  onDecrease,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      <AppButton
        label="-"
        variant="secondary"
        onPress={onDecrease}
        disabled={value <= min}
        style={styles.button}
      />

      <View style={styles.valueDisplay}>
        <AppText variant="h2" color={theme.colors.primary} weight="700">
          {value.toFixed(1)}
          {unit}
        </AppText>
        <AppText variant="caption" color={theme.colors.outline}>
          Target Temperature
        </AppText>
      </View>

      <AppButton
        label="+"
        variant="secondary"
        onPress={onIncrease}
        disabled={value >= max}
        style={styles.button}
      />
    </View>
  );
};

export * from './types';
