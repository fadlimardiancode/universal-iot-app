import { Room } from '../../../../domain/entities/Room';
import { Device } from '../../../../domain/entities/Device';

export interface RoomGridProps {
  rooms: Room[];
  devices: Device[];
  showHeader?: boolean;
  onSelectRoom: (roomId: string, roomName: string) => void;
  onRenameRoom?: (roomId: string, currentName: string) => void;
  onDeleteRoom?: (roomId: string) => void;
  onAddRoom?: () => void;
}
