import { Device, DeviceStatus, MqttSetPayload, MqttStatePayload, DeviceProtocol } from '../entities/Device';

export interface IProtocolAdapter {
  readonly protocol: DeviceProtocol;

  /**
   * Send a command to change device state
   */
  sendState(device: Device, payload: MqttSetPayload): Promise<boolean>;

  /**
   * Subscribe to live state updates (MQTT subscription or HTTP polling)
   */
  subscribe(
    device: Device,
    onState: (payload: MqttStatePayload) => void,
    onStatus: (status: DeviceStatus) => void
  ): () => void;

  /**
   * Teardown resources
   */
  disconnect(): void;
}
