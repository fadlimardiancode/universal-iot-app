import React from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { AppSwitch } from '../../atoms/AppSwitch';
import { AppBadge } from '../../atoms/AppBadge';
import { styles } from './styles';
import { SettingsTemplateProps } from './types';

export const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  isDarkMode,
  onToggleDarkMode,
  mqttConnected,
  brokerUrl,
  httpServerUrl,
  appVersion,
}) => {
  return (
    <ScrollView style={styles.container}>
      <AppText variant="h2" style={styles.title}>
        Settings
      </AppText>

      <Card style={styles.card}>
        <Card.Title title="Appearance" />
        <Card.Content>
          <View style={styles.row}>
            <View>
              <AppText variant="subtitle1">Dark Mode</AppText>
              <AppText variant="caption" style={styles.description}>
                Switch between Light & Dark theme
              </AppText>
            </View>
            <AppSwitch value={isDarkMode} onValueChange={onToggleDarkMode} />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Connection & Protocol" />
        <Card.Content>
          <View style={styles.row}>
            <View>
              <AppText variant="subtitle1">MQTT Broker</AppText>
              <AppText variant="caption" style={styles.description}>
                {brokerUrl}
              </AppText>
            </View>
            <AppBadge
              content={mqttConnected ? 'Connected' : 'Disconnected'}
              color={mqttConnected ? '#198754' : '#6C757D'}
            />
          </View>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <View>
              <AppText variant="subtitle1">HTTP Server</AppText>
              <AppText variant="caption" style={styles.description}>
                {httpServerUrl}
              </AppText>
            </View>
            <AppBadge content="Ready" color="#198754" />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="About" />
        <Card.Content>
          <AppText variant="body1">Universal IoT Home App</AppText>
          <AppText variant="caption" style={styles.description}>
            Version: {appVersion} • Clean Architecture & Atomic Design
          </AppText>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};
