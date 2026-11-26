export type DeviceType = 'light' | 'thermostat' | 'camera' | 'lock';

export type DeviceStatus = 'online' | 'offline';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  roomId: string;
  isOn: boolean;
  status: DeviceStatus;
  temperature?: number;    // for thermostat (°C)
  humidity?: number;       // for thermostat/sensor (%)
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
