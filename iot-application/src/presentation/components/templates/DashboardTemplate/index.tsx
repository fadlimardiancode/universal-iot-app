import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { AppText } from '../../atoms/AppText';
import { AppBadge } from '../../atoms/AppBadge';
import { AppIcon } from '../../atoms/AppIcon';
import { DashboardSummary } from '../../organisms/DashboardSummary';
import { DeviceList } from '../../organisms/DeviceList';
import { RoomGrid } from '../../organisms/RoomGrid';
import { styles } from './styles';
import { DashboardTemplateProps } from './types';

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  totalDevices,
  onlineDevices,
  activeRooms,
  averageTemperature,
  rooms,
  devices,
  favoriteDevices,
  mqttConnected,
  nextAutomation,
  onDevicePress,
  onDeviceToggle,
  onAdjustTemp,
  onRoomPress,
  onRefresh,
  refreshing = false,
}) => {
  const theme = useTheme();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      <View style={styles.header}>
        <View>
          <AppText variant="h2" style={styles.title}>
            Smart Home
          </AppText>
          <AppText variant="body2" style={styles.subtitle}>
            Welcome back, manage your home
          </AppText>
        </View>
        <AppBadge
          content={mqttConnected ? 'MQTT Live' : 'Offline'}
          color={mqttConnected ? '#198754' : '#6C757D'}
        />
      </View>

      {/* Next Upcoming Automation Banner */}
      {nextAutomation && (
        <View style={styles.automationBannerWrapper}>
          <Card
            style={[
              styles.automationBannerCard,
              {
                backgroundColor: theme.dark ? '#221935' : '#F3EDF7',
                borderColor: theme.dark ? '#4A3B69' : '#E8DEF8',
                borderWidth: 1,
              },
            ]}
          >
            <Card.Content style={styles.automationBannerContent}>
              <View
                style={[
                  styles.automationBannerIconBox,
                  { backgroundColor: theme.dark ? '#3B2A5E' : '#E8DEF8' },
                ]}
              >
                <AppIcon
                  name="clock-outline"
                  size={20}
                  color={theme.dark ? '#BB86FC' : '#6200ee'}
                />
              </View>
              <View style={styles.automationBannerTextCol}>
                <AppText
                  variant="caption"
                  color={theme.dark ? '#BB86FC' : '#6200ee'}
                  weight="700"
                  style={styles.automationBannerHeader}
                >
                  UPCOMING AUTOMATION • {nextAutomation.time}
                </AppText>
                <AppText variant="body2" weight="600" color={theme.colors.onSurface}>
                  {nextAutomation.ruleName}: {nextAutomation.actionText} on {nextAutomation.deviceName}
                </AppText>
              </View>
            </Card.Content>
          </Card>
        </View>
      )}

      <DashboardSummary
        totalDevices={totalDevices}
        onlineDevices={onlineDevices}
        activeRooms={activeRooms}
        averageTemperature={averageTemperature}
      />

      <View style={styles.section}>
        <AppText variant="h3" style={styles.sectionTitle}>
          Rooms
        </AppText>
        <RoomGrid
          showHeader={false}
          rooms={rooms}
          devices={devices}
          onSelectRoom={(roomId) => onRoomPress(roomId)}
        />
      </View>

      <View style={styles.section}>
        <AppText variant="h3" style={styles.sectionTitle}>
          Active Devices
        </AppText>
        <DeviceList
          devices={favoriteDevices}
          onPressDevice={onDevicePress}
          onToggle={onDeviceToggle}
          onAdjustTemp={onAdjustTemp}
        />
      </View>
    </ScrollView>
  );
};
