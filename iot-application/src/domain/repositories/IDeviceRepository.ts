import { Device, DeviceStatus, MqttSetPayload, MqttStatePayload } from '../entities/Device';

export interface IDeviceRepository {
  getDevices(): Promise<Device[]>;
  getDeviceById(id: string): Promise<Device | null>;
  toggleDevice(id: string, currentState: boolean): Promise<Device | null>;
  adjustTemperature(id: string, temperature: number): Promise<Device | null>;
  addDevice(device: Device): Promise<Device>;
  removeDevice(id: string): Promise<boolean>;
  publishCommand(id: string, payload: MqttSetPayload): void;
  subscribeUpdates(
    onState: (deviceId: string, payload: MqttStatePayload) => void,
    onStatus: (deviceId: string, status: DeviceStatus) => void
  ): () => void;
}
