export const AppColors = {
  // Brand colors
  primary: '#0D6EFD',
  primaryDark: '#0A58CA',
  primaryLight: '#E7F1FF',

  // Status colors
  success: '#198754',
  successLight: '#D1E7DD',
  warning: '#FFC107',
  warningLight: '#FFF3CD',
  danger: '#DC3545',
  dangerLight: '#F8D7DA',
  info: '#0DCAF0',

  // IoT Device specific colors
  deviceLight: '#FFB703',
  deviceThermostat: '#FB8500',
  deviceCamera: '#219EBC',
  deviceLock: '#023047',

  // Dark & Light Surface colors
  light: {
    background: '#F8F9FA',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F3F5',
    text: '#212529',
    textSecondary: '#6C757D',
    border: '#E9ECEF',
    card: '#FFFFFF',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    text: '#F8F9FA',
    textSecondary: '#ADB5BD',
    border: '#343A40',
    card: '#1E1E1E',
  },
} as const;
