import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { AppColors } from '../constants/AppColors';

export interface CustomTheme extends MD3Theme {
  customColors: {
    deviceLight: string;
    deviceThermostat: string;
    deviceCamera: string;
    deviceLock: string;
    card: string;
    border: string;
    surfaceVariant: string;
    textSecondary: string;
  };
}

export const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: AppColors.primary,
    background: AppColors.light.background,
    surface: AppColors.light.surface,
    surfaceVariant: AppColors.light.surfaceVariant,
    outline: AppColors.light.textSecondary,
    outlineVariant: AppColors.light.border,
    error: AppColors.danger,
    onPrimary: '#FFFFFF',
    onBackground: AppColors.light.text,
    onSurface: AppColors.light.text,
    onSurfaceVariant: AppColors.light.textSecondary,
  },
  customColors: {
    deviceLight: AppColors.deviceLight,
    deviceThermostat: AppColors.deviceThermostat,
    deviceCamera: AppColors.deviceCamera,
    deviceLock: AppColors.deviceLock,
    card: AppColors.light.card,
    border: AppColors.light.border,
    surfaceVariant: AppColors.light.surfaceVariant,
    textSecondary: AppColors.light.textSecondary,
  },
};

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: AppColors.primary,
    background: AppColors.dark.background,
    surface: AppColors.dark.surface,
    surfaceVariant: AppColors.dark.surfaceVariant,
    outline: AppColors.dark.textSecondary,
    outlineVariant: AppColors.dark.border,
    error: AppColors.danger,
    onPrimary: '#FFFFFF',
    onBackground: AppColors.dark.text,
    onSurface: AppColors.dark.text,
    onSurfaceVariant: AppColors.dark.textSecondary,
  },
  customColors: {
    deviceLight: AppColors.deviceLight,
    deviceThermostat: AppColors.deviceThermostat,
    deviceCamera: AppColors.deviceCamera,
    deviceLock: AppColors.deviceLock,
    card: AppColors.dark.card,
    border: AppColors.dark.border,
    surfaceVariant: AppColors.dark.surfaceVariant,
    textSecondary: AppColors.dark.textSecondary,
  },
};
