import { Device } from '../../../../domain/entities/Device';

export type FilterType = 'all' | 'on' | 'off';

export interface DeviceListProps {
  devices: Device[];
  loading?: boolean;
  onToggle: (id: string, currentState: boolean) => void;
  onAdjustTemp?: (id: string, delta: number) => void;
  onPressDevice?: (id: string) => void;
  onRemoveDevice?: (id: string) => void;
  onAddDevice?: () => void;
}
