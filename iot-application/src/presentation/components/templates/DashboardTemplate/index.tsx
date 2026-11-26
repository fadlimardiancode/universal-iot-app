import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { AppText } from '../../atoms/AppText';
import { AppBadge } from '../../atoms/AppBadge';
import { DashboardSummary } from '../../organisms/DashboardSummary';
import { DeviceList } from '../../organisms/DeviceList';
import { RoomGrid } from '../../organisms/RoomGrid';
import { styles } from './styles';
import { DashboardTemplateProps } from './types';

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  mqttConnected,
  totalDevices,
  onlineDevices,
  activeRooms,
  averageTemperature,
  rooms,
  devices,
  favoriteDevices,
  onDevicePress,
  onDeviceToggle,
  onAdjustTemp,
  onRoomPress,
  onRefresh,
  refreshing = false,
}) => {
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
