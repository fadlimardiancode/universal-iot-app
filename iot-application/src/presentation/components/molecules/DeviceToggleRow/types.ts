import { DeviceType, DeviceStatus, DeviceProtocol } from '../../../../domain/entities/Device';

export interface DeviceToggleRowProps {
  name: string;
  type: DeviceType;
  isOn: boolean;
  status: DeviceStatus;
  protocol?: DeviceProtocol;
  subtitle?: string;
  temperature?: number;
  humidity?: number;
  onToggle: () => void;
  onPress?: () => void;
}
