import { DeviceType, DeviceStatus } from '../../../../domain/entities/Device';

export interface DeviceToggleRowProps {
  name: string;
  type: DeviceType;
  isOn: boolean;
  status: DeviceStatus;
  subtitle?: string;
  onToggle: () => void;
  onPress?: () => void;
}
