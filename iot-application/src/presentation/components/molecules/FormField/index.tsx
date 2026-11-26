import React from 'react';
import { View, TextInput } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { FormFieldProps } from './types';
import { styles } from './styles';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  style,
  ...rest
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <AppText variant="caption" color={theme.colors.onSurface} style={styles.label}>
        {label}
      </AppText>
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.outline,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.outline}
        {...rest}
      />
      {error ? (
        <AppText variant="caption" color={theme.colors.error} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

export * from './types';
