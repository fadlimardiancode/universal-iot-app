import { DeviceType, DeviceProtocol, DeviceConnectionConfig } from '../../../../domain/entities/Device';
import { Room } from '../../../../domain/entities/Room';

export interface AddDeviceFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (device: {
    name: string;
    type: DeviceType;
    roomId: string;
    protocol: DeviceProtocol;
    connectionConfig?: DeviceConnectionConfig;
  }) => void;
  rooms: Room[];
  initialRoomId?: string;
}
