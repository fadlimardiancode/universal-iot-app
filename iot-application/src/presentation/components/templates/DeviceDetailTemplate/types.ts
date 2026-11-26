import { Device } from '../../../../domain/entities/Device';

export interface DeviceDetailTemplateProps {
  device: Device;
  roomName?: string;
  onTogglePower: (on: boolean) => void;
  onBrightnessChange?: (brightness: number) => void;
  onTargetTempChange?: (targetTemp: number) => void;
  onDeleteDevice?: () => void;
}
