export interface RoomHeaderProps {
  roomName: string;
  deviceCount: number;
  activeCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}
