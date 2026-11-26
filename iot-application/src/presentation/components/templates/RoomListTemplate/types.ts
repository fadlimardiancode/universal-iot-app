import { Room } from '../../../../domain/entities/Room';
import { Device } from '../../../../domain/entities/Device';

export interface RoomListTemplateProps {
  rooms: Room[];
  devices: Device[];
  onRoomPress: (roomId: string, roomName: string) => void;
  onRenameRoom?: (roomId: string, currentName: string) => void;
  onDeleteRoom?: (roomId: string) => void;
  onAddRoomPress?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}
