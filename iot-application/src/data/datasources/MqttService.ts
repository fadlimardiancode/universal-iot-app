import mqtt, { MqttClient } from 'mqtt';
import { APP_CONFIG } from '../../core/constants/config';
import { DeviceStatus, MqttSetPayload, MqttStatePayload } from '../../domain/entities/Device';

export type DeviceStateCallback = (deviceId: string, payload: MqttStatePayload) => void;
export type DeviceStatusCallback = (deviceId: string, status: DeviceStatus) => void;
export type ConnectionCallback = (connected: boolean) => void;

class MqttService {
  private client: MqttClient | null = null;
  private isConnected: boolean = false;
  private stateCallbacks: Set<DeviceStateCallback> = new Set();
  private statusCallbacks: Set<DeviceStatusCallback> = new Set();
  private connectionCallbacks: Set<ConnectionCallback> = new Set();

  connect(): void {
    if (this.client) {
      return;
    }

    const brokerUrl = APP_CONFIG.MQTT_BROKER_URL;
    console.log(`[MqttService] Connecting to ${brokerUrl}...`);

    try {
      this.client = mqtt.connect(brokerUrl, {
        connectTimeout: 4000,
        reconnectPeriod: 5000,
      });

      this.client.on('connect', () => {
        console.log(`[MqttService] Connected successfully to ${brokerUrl}`);
        this.isConnected = true;
        this.notifyConnection(true);

        // Subscribe to state and status topics
        const stateTopic = `${APP_CONFIG.MQTT_TOPIC_PREFIX}/+/state`;
        const statusTopic = `${APP_CONFIG.MQTT_TOPIC_PREFIX}/+/status`;

        this.client?.subscribe([stateTopic, statusTopic], (err) => {
          if (!err) {
            console.log(`[MqttService] Subscribed to ${stateTopic} & ${statusTopic}`);
          } else {
            console.error('[MqttService] Subscribe error:', err.message);
          }
        });
      });

      this.client.on('message', (topic, message) => {
        this.handleMessage(topic, message.toString());
      });

      this.client.on('close', () => {
        if (this.isConnected) {
          console.log('[MqttService] Connection closed');
          this.isConnected = false;
          this.notifyConnection(false);
        }
      });

      this.client.on('error', (err) => {
        console.warn('[MqttService] Connection error:', err.message);
      });
    } catch (e) {
      console.warn('[MqttService] Exception creating client:', e);
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.end(true);
      this.client = null;
      this.isConnected = false;
      this.notifyConnection(false);
    }
  }

  publishCommand(deviceId: string, payload: MqttSetPayload): void {
    if (!this.client || !this.isConnected) {
      console.warn(`[MqttService] Cannot publish to ${deviceId}: broker not connected`);
      return;
    }

    const topic = `${APP_CONFIG.MQTT_TOPIC_PREFIX}/${deviceId}/set`;
    const message = JSON.stringify(payload);

    this.client.publish(topic, message, { qos: 0 }, (err) => {
      if (err) {
        console.error(`[MqttService] Failed to publish command to ${topic}:`, err);
      } else {
        console.log(`[MqttService] Published to ${topic}:`, payload);
      }
    });
  }

  onDeviceState(cb: DeviceStateCallback): () => void {
    this.stateCallbacks.add(cb);
    return () => this.stateCallbacks.delete(cb);
  }

  onDeviceStatus(cb: DeviceStatusCallback): () => void {
    this.statusCallbacks.add(cb);
    return () => this.statusCallbacks.delete(cb);
  }

  onConnection(cb: ConnectionCallback): () => void {
    this.connectionCallbacks.add(cb);
    cb(this.isConnected);
    return () => this.connectionCallbacks.delete(cb);
  }

  private notifyConnection(connected: boolean): void {
    this.connectionCallbacks.forEach((cb) => {
      try {
        cb(connected);
      } catch (e) {
        console.error(e);
      }
    });
  }

  private handleMessage(topic: string, message: string): void {
    try {
      const stateRegex = new RegExp(`^${APP_CONFIG.MQTT_TOPIC_PREFIX}/([^/]+)/state$`);
      const statusRegex = new RegExp(`^${APP_CONFIG.MQTT_TOPIC_PREFIX}/([^/]+)/status$`);

      const stateMatch = topic.match(stateRegex);
      if (stateMatch) {
        const deviceId = stateMatch[1];
        const payload: MqttStatePayload = JSON.parse(message);
        this.stateCallbacks.forEach((cb) => cb(deviceId, payload));
        return;
      }

      const statusMatch = topic.match(statusRegex);
      if (statusMatch) {
        const deviceId = statusMatch[1];
        const status = message as DeviceStatus;
        this.statusCallbacks.forEach((cb) => cb(deviceId, status));
        return;
      }
    } catch (err) {
      console.error('[MqttService] Error parsing incoming message:', err);
    }
  }

  getConnected(): boolean {
    return this.isConnected;
  }
}

export const mqttService = new MqttService();
