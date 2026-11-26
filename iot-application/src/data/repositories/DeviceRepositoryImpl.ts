import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import { Device, DeviceStatus, MqttSetPayload, MqttStatePayload } from '../../domain/entities/Device';
import { IProtocolAdapter } from '../../domain/repositories/IProtocolAdapter';
import { mqttProtocolAdapter } from '../adapters/MqttProtocolAdapter';
import { httpProtocolAdapter } from '../adapters/HttpProtocolAdapter';
import { httpService } from '../datasources/HttpService';
import { StorageService } from '../../core/utils/storage';
import { APP_CONFIG } from '../../core/constants/config';

export class DeviceRepositoryImpl implements IDeviceRepository {
  private adapters: Map<string, IProtocolAdapter> = new Map();
  private deviceSubscriptions: Map<string, () => void> = new Map();
  private activeOnState: ((deviceId: string, payload: MqttStatePayload) => void) | null = null;
  private activeOnStatus: ((deviceId: string, status: DeviceStatus) => void) | null = null;

  constructor() {
    this.adapters.set('mqtt', mqttProtocolAdapter);
    this.adapters.set('http', httpProtocolAdapter);
  }

  private getAdapter(device?: Device | null): IProtocolAdapter {
    const protocol = device?.protocol || 'mqtt';
    return this.adapters.get(protocol) || mqttProtocolAdapter;
  }

  async getDevices(): Promise<Device[]> {
    const devices = await httpService.fetchDevices();
    // Ensure all devices have default protocol if missing
    return devices.map((d) => ({
      ...d,
      protocol: d.protocol || 'mqtt',
    }));
  }

  async getDeviceById(id: string): Promise<Device | null> {
    const device = await httpService.fetchDevice(id);
    if (!device) return null;
    return {
      ...device,
      protocol: device.protocol || 'mqtt',
    };
  }

  async toggleDevice(id: string, currentState: boolean): Promise<Device | null> {
    const nextState = !currentState;
    const payload: MqttSetPayload = { on: nextState };

    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const device = currentList.find((d) => d.id === id);

    // Delegate to the appropriate protocol adapter
    const adapter = this.getAdapter(device);
    if (device) {
      await adapter.sendState(device, payload);
    }

    // Update local storage cache
    const nextList = currentList.map((d) =>
      d.id === id ? { ...d, isOn: nextState, ...(d.type === 'lock' ? { isLocked: !nextState } : {}) } : d
    );
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);

    return nextList.find((d) => d.id === id) ?? null;
  }

  async adjustTemperature(id: string, temperature: number): Promise<Device | null> {
    const payload: MqttSetPayload = { temperature };

    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const device = currentList.find((d) => d.id === id);

    const adapter = this.getAdapter(device);
    if (device) {
      await adapter.sendState(device, payload);
    }

    const nextList = currentList.map((d) =>
      d.id === id ? { ...d, temperature } : d
    );
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);

    return nextList.find((d) => d.id === id) ?? null;
  }

  async adjustBrightness(id: string, brightness: number): Promise<Device | null> {
    const payload: MqttSetPayload = { brightness };

    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const device = currentList.find((d) => d.id === id);

    const adapter = this.getAdapter(device);
    if (device) {
      await adapter.sendState(device, payload);
    }

    const nextList = currentList.map((d) =>
      d.id === id ? { ...d, brightness } : d
    );
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);

    return nextList.find((d) => d.id === id) ?? null;
  }

  async addDevice(device: Device): Promise<Device> {
    const completeDevice: Device = {
      ...device,
      protocol: device.protocol || 'mqtt',
    };

    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const nextList = [...currentList, completeDevice];
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);

    // If HTTP device and subscription is active, start polling immediately
    if (completeDevice.protocol === 'http' && this.activeOnState && this.activeOnStatus) {
      const unsub = httpProtocolAdapter.subscribe(
        completeDevice,
        (payload) => this.activeOnState && this.activeOnState(completeDevice.id, payload),
        (status) => this.activeOnStatus && this.activeOnStatus(completeDevice.id, status)
      );
      this.deviceSubscriptions.set(completeDevice.id, unsub);
    }

    return completeDevice;
  }

  async removeDevice(id: string): Promise<boolean> {
    // Unsubscribe if active
    const unsub = this.deviceSubscriptions.get(id);
    if (unsub) {
      unsub();
      this.deviceSubscriptions.delete(id);
    }

    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const nextList = currentList.filter((d) => d.id !== id);
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, nextList);
    return true;
  }

  publishCommand(id: string, payload: MqttSetPayload): void {
    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    const device = currentList.find((d) => d.id === id);
    const adapter = this.getAdapter(device);
    if (device) {
      adapter.sendState(device, payload);
    }
  }

  /**
   * Subscribe updates across both MQTT broker & HTTP polling adapters
   */
  subscribeUpdates(
    onState: (deviceId: string, payload: MqttStatePayload) => void,
    onStatus: (deviceId: string, status: DeviceStatus) => void
  ): () => void {
    this.activeOnState = onState;
    this.activeOnStatus = onStatus;

    // 1. MQTT global subscription
    const unsubMqtt = mqttProtocolAdapter.subscribe(
      { id: '+', name: '', type: 'light', roomId: '', isOn: false, status: 'online' },
      (payload) => {
        // Will be matched per device by MQTT service
      },
      () => {}
    );

    // Also connect to direct datasource callbacks for global MQTT events
    const unsubState = require('../datasources/MqttService').mqttService.onDeviceState(onState);
    const unsubStatus = require('../datasources/MqttService').mqttService.onDeviceStatus(onStatus);

    // 2. HTTP per-device polling subscription
    const currentList = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES) || [];
    currentList
      .filter((d) => d.protocol === 'http')
      .forEach((httpDevice) => {
        if (!this.deviceSubscriptions.has(httpDevice.id)) {
          const unsubHttp = httpProtocolAdapter.subscribe(
            httpDevice,
            (payload) => onState(httpDevice.id, payload),
            (status) => onStatus(httpDevice.id, status)
          );
          this.deviceSubscriptions.set(httpDevice.id, unsubHttp);
        }
      });

    return () => {
      this.activeOnState = null;
      this.activeOnStatus = null;
      unsubMqtt();
      unsubState();
      unsubStatus();
      this.deviceSubscriptions.forEach((unsub) => unsub());
      this.deviceSubscriptions.clear();
    };
  }
}

export const deviceRepository = new DeviceRepositoryImpl();
