import { Device } from '../../../../domain/entities/Device';
import { Room } from '../../../../domain/entities/Room';

export interface RoomDetailTemplateProps {
  room: Room;
  devices: Device[];
  onDevicePress: (deviceId: string) => void;
  onDeviceToggle: (deviceId: string, currentState: boolean) => void;
  onAdjustTemp?: (deviceId: string, delta: number) => void;
  onAddDevicePress?: () => void;
  onDeleteRoomPress?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}
