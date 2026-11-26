export type DeviceType = 'light' | 'plug' | 'sensor' | 'thermostat' | 'lock' | 'camera';

export type DeviceProtocol = 'mqtt' | 'http';

export type DeviceStatus = 'online' | 'offline';

export interface DeviceConnectionConfig {
  brokerUrl?: string;     // for MQTT (e.g. ws://localhost:9001)
  topic?: string;         // for MQTT state/set topic (e.g. home/demo-iot-app/plug-01)
  baseUrl?: string;       // for HTTP (e.g. http://localhost:3001)
  pollIntervalMs?: number;// for HTTP polling (default: 5000)
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  roomId: string;
  isOn: boolean;
  status: DeviceStatus;
  protocol?: DeviceProtocol; // default: 'mqtt'
  connectionConfig?: DeviceConnectionConfig;
  temperature?: number;    // for thermostat / sensor (°C)
  humidity?: number;       // for thermostat / sensor (%)
  brightness?: number;     // for light (0-100)
  isLocked?: boolean;      // for lock
}

export interface MqttStatePayload {
  on?: boolean;
  brightness?: number;
  temperature?: number;
  humidity?: number;
  isLocked?: boolean;
}

export interface MqttSetPayload {
  on?: boolean;
  brightness?: number;
  temperature?: number;
  isLocked?: boolean;
}
