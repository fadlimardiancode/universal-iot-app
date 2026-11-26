import React from 'react';
import { View } from 'react-native';
import { SummaryCard } from '../../molecules/SummaryCard';
import { styles } from './styles';
import { DashboardSummaryProps } from './types';

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalDevices,
  onlineDevices,
  activeRooms,
  averageTemperature,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.cardWrapper}>
          <SummaryCard
            label="Total Devices"
            value={totalDevices}
            icon="devices"
            color="#6200ee"
          />
        </View>
        <View style={styles.cardWrapper}>
          <SummaryCard
            label="Online"
            value={onlineDevices}
            icon="wifi-check"
            color="#4caf50"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.cardWrapper}>
          <SummaryCard
            label="Active Rooms"
            value={activeRooms}
            icon="home-outline"
            color="#ff9800"
          />
        </View>
        <View style={styles.cardWrapper}>
          <SummaryCard
            label="Avg Temp"
            value={averageTemperature !== undefined ? `${averageTemperature.toFixed(1)}°C` : '--'}
            icon="thermometer"
            color="#03a9f4"
          />
        </View>
      </View>
    </View>
  );
};
