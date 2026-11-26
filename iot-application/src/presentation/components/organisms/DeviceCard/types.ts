import { Device } from '../../../../domain/entities/Device';

export interface DeviceCardProps {
  device: Device;
  onToggle: () => void;
  onAdjustTemp?: (delta: number) => void;
  onPress?: () => void;
  onRemove?: () => void;
}
