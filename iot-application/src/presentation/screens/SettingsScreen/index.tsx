import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { toggleTheme } from '../../store/themeSlice';
import { SettingsTemplate } from '../../components/templates';

export const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const isMqttConnected = useAppSelector((state) => state.connectivity.mqttConnected);

  const handleToggleDarkMode = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return (
    <SettingsTemplate
      isDarkMode={themeMode === 'dark'}
      onToggleDarkMode={handleToggleDarkMode}
      mqttConnected={isMqttConnected}
      brokerUrl="ws://localhost:9001"
      httpServerUrl="http://localhost:3001"
      appVersion="1.0.0"
    />
  );
};
