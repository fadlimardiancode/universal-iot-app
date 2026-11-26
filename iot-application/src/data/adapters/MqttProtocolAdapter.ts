import { IProtocolAdapter } from '../../domain/repositories/IProtocolAdapter';
import { Device, DeviceProtocol, DeviceStatus, MqttSetPayload, MqttStatePayload } from '../../domain/entities/Device';
import { mqttService } from '../datasources/MqttService';
import { APP_CONFIG } from '../../core/constants/config';

export class MqttProtocolAdapter implements IProtocolAdapter {
  readonly protocol: DeviceProtocol = 'mqtt';

  async sendState(device: Device, payload: MqttSetPayload): Promise<boolean> {
    try {
      if (device.connectionConfig?.topic) {
        mqttService.publishCommand(device.id, payload, device.connectionConfig.topic);
      } else {
        mqttService.publishCommand(device.id, payload);
      }
      return true;
    } catch (err) {
      console.error(`[MqttProtocolAdapter] Failed to send state to ${device.id}:`, err);
      return false;
    }
  }

  subscribe(
    device: Device,
    onState: (payload: MqttStatePayload) => void,
    onStatus: (status: DeviceStatus) => void
  ): () => void {
    // Ensure MQTT is connected
    if (!mqttService.getConnected()) {
      mqttService.connect();
    }

    const unsubState = mqttService.onDeviceState((deviceId, payload) => {
      if (deviceId === device.id) {
        onState(payload);
      }
    });

    const unsubStatus = mqttService.onDeviceStatus((deviceId, status) => {
      if (deviceId === device.id) {
        onStatus(status);
      }
    });

    return () => {
      unsubState();
      unsubStatus();
    };
  }

  disconnect(): void {
    mqttService.disconnect();
  }
}

export const mqttProtocolAdapter = new MqttProtocolAdapter();
