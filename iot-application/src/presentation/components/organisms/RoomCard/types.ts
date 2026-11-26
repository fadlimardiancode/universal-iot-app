import { Room } from '../../../../domain/entities/Room';
import { Device } from '../../../../domain/entities/Device';

export interface RoomCardProps {
  room: Room;
  devices: Device[];
  onPress: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}
