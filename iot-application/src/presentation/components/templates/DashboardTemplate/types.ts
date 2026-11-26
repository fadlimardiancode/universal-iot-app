import { Device } from '../../../../domain/entities/Device';
import { Room } from '../../../../domain/entities/Room';

export interface DashboardTemplateProps {
  mqttConnected: boolean;
  totalDevices: number;
  onlineDevices: number;
  activeRooms: number;
  averageTemperature?: number;
  rooms: Room[];
  devices: Device[];
  favoriteDevices: Device[];
  onDevicePress: (deviceId: string) => void;
  onDeviceToggle: (deviceId: string, currentState: boolean) => void;
  onAdjustTemp?: (deviceId: string, delta: number) => void;
  onRoomPress: (roomId: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}
