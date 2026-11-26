import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import { Device, DeviceStatus, MqttSetPayload, MqttStatePayload } from '../../domain/entities/Device';
import { httpService } from '../datasources/HttpService';
import { mqttService } from '../datasources/MqttService';
import { StorageService } from '../../core/utils/storage';
import { APP_CONFIG } from '../../core/constants/config';

export class DeviceRepositoryImpl implements IDeviceRepository {
  async getDevices(): Promise<Device[]> {
    return await httpService.fetchDevices();
  }

  async getDeviceById(id: string): Promise<Device | null> {
    return await httpService.fetchDevice(id);
  }

  async toggleDevice(id: string, currentState: boolean): Promise<Device | null> {
    const nextState = !currentState;
    const payload: MqttSetPayload = { on: nextState };

    // Publish to MQTT
    mqttService.publishCommand(id, payload);

    // Call HTTP set endpoint
    const updated = await httpService.setDeviceState(id, { isOn: nextState });

    // Update local storage cache
    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const nextList = currentList.map((d) =>
      d.id === id ? { ...d, isOn: nextState, ...(d.type === 'lock' ? { isLocked: !nextState } : {}) } : d
    );
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);

    return updated || (nextList.find((d) => d.id === id) ?? null);
  }

  async adjustTemperature(id: string, temperature: number): Promise<Device | null> {
    const payload: MqttSetPayload = { temperature };
    mqttService.publishCommand(id, payload);

    const updated = await httpService.setDeviceState(id, { temperature });

    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const nextList = currentList.map((d) =>
      d.id === id ? { ...d, temperature } : d
    );
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);

    return updated || (nextList.find((d) => d.id === id) ?? null);
  }

  async addDevice(device: Device): Promise<Device> {
    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const nextList = [...currentList, device];
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);
    return device;
  }

  async removeDevice(id: string): Promise<boolean> {
    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const nextList = currentList.filter((d) => d.id !== id);
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);
    return true;
  }

  publishCommand(id: string, payload: MqttSetPayload): void {
    mqttService.publishCommand(id, payload);
  }

  subscribeUpdates(
    onState: (deviceId: string, payload: MqttStatePayload) => void,
    onStatus: (deviceId: string, status: DeviceStatus) => void
  ): () => void {
    const unsubState = mqttService.onDeviceState(onState);
    const unsubStatus = mqttService.onDeviceStatus(onStatus);

    return () => {
      unsubState();
      unsubStatus();
    };
  }
}

export const deviceRepository = new DeviceRepositoryImpl();
