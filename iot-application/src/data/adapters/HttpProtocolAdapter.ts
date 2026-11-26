import axios, { AxiosInstance } from 'axios';
import { IProtocolAdapter } from '../../domain/repositories/IProtocolAdapter';
import { Device, DeviceProtocol, DeviceStatus, MqttSetPayload, MqttStatePayload } from '../../domain/entities/Device';
import { APP_CONFIG } from '../../core/constants/config';

export class HttpProtocolAdapter implements IProtocolAdapter {
  readonly protocol: DeviceProtocol = 'http';
  private pollingTimers: Map<string, NodeJS.Timeout> = new Map();
  private client: AxiosInstance;

  constructor(customClient?: AxiosInstance) {
    this.client =
      customClient ||
      axios.create({
        baseURL: APP_CONFIG.HTTP_BASE_URL,
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
  }

  async sendState(device: Device, payload: MqttSetPayload): Promise<boolean> {
    const baseUrl = device.connectionConfig?.baseUrl || APP_CONFIG.HTTP_BASE_URL;
    try {
      await this.client.post(`${baseUrl}/devices/${device.id}/set`, payload);
      return true;
    } catch (err: any) {
      console.warn(`[HttpProtocolAdapter] POST /devices/${device.id}/set error:`, err.message);
      return false;
    }
  }

  subscribe(
    device: Device,
    onState: (payload: MqttStatePayload) => void,
    onStatus: (status: DeviceStatus) => void
  ): () => void {
    const baseUrl = device.connectionConfig?.baseUrl || APP_CONFIG.HTTP_BASE_URL;
    const intervalMs = device.connectionConfig?.pollIntervalMs || 5000;

    // Fetch initial device state
    const fetchState = async () => {
      try {
        const response = await this.client.get(`${baseUrl}/devices/${device.id}`);
        if (response.data) {
          const data = response.data;
          onStatus(data.status || 'online');
          onState({
            on: data.isOn !== undefined ? data.isOn : data.on,
            brightness: data.brightness,
            temperature: data.temperature,
            humidity: data.humidity,
            isLocked: data.isLocked,
          });
        }
      } catch (err: any) {
        // Device offline or unreachable
        onStatus('offline');
      }
    };

    fetchState();

    // Setup HTTP live polling
    const timer = setInterval(fetchState, intervalMs);
    this.pollingTimers.set(device.id, timer);

    return () => {
      clearInterval(timer);
      this.pollingTimers.delete(device.id);
    };
  }

  disconnect(): void {
    this.pollingTimers.forEach((timer) => clearInterval(timer));
    this.pollingTimers.clear();
  }
}

export const httpProtocolAdapter = new HttpProtocolAdapter();
