export interface SettingsTemplateProps {
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  mqttConnected: boolean;
  brokerUrl: string;
  httpServerUrl: string;
  appVersion: string;
}
