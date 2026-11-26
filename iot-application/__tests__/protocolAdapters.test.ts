import { MqttProtocolAdapter } from '../src/data/adapters/MqttProtocolAdapter';
import { HttpProtocolAdapter } from '../src/data/adapters/HttpProtocolAdapter';
import { mqttService } from '../src/data/datasources/MqttService';
import { Device } from '../src/domain/entities/Device';
import deviceReducer, {
  addDeviceAction,
  adjustBrightnessAction,
  updateDeviceFromMqtt,
  DeviceState,
} from '../src/presentation/store/deviceSlice';

jest.mock('../src/data/datasources/MqttService', () => ({
  mqttService: {
    publishCommand: jest.fn(),
    publishRaw: jest.fn(),
    onDeviceState: jest.fn((cb) => {
      return jest.fn();
    }),
    onDeviceStatus: jest.fn((cb) => {
      return jest.fn();
    }),
    getConnected: jest.fn(() => true),
  },
}));

describe('Protocol Adapters & Multi-Protocol Provisioning', () => {
  describe('MqttProtocolAdapter', () => {
    let adapter: MqttProtocolAdapter;

    beforeEach(() => {
      jest.clearAllMocks();
      adapter = new MqttProtocolAdapter();
    });

    it('has protocol identifier "mqtt"', () => {
      expect(adapter.protocol).toBe('mqtt');
    });

    it('sends state commands through mqttService.publishCommand', async () => {
      const device: Device = {
        id: 'light-mqtt-1',
        name: 'MQTT Light',
        type: 'light',
        roomId: 'room-1',
        isOn: false,
        status: 'online',
        protocol: 'mqtt',
      };

      const result = await adapter.sendState(device, { on: true, brightness: 75 });
      expect(result).toBe(true);
      expect(mqttService.publishCommand).toHaveBeenCalledWith('light-mqtt-1', {
        on: true,
        brightness: 75,
      });
    });

    it('sends raw MQTT message if custom topic is specified in connectionConfig', async () => {
      const device: Device = {
        id: 'plug-mqtt-2',
        name: 'MQTT Plug',
        type: 'plug',
        roomId: 'room-1',
        isOn: false,
        status: 'online',
        protocol: 'mqtt',
        connectionConfig: {
          brokerUrl: 'ws://localhost:9001',
          topic: 'custom/topic/plug-02',
        },
      };

      const result = await adapter.sendState(device, { on: true });
      expect(result).toBe(true);
      expect(mqttService.publishCommand).toHaveBeenCalledWith(
        'plug-mqtt-2',
        { on: true },
        'custom/topic/plug-02'
      );
    });

    it('subscribes to MQTT events and cleans up on unsubscribe', () => {
      const device: Device = {
        id: 'sensor-1',
        name: 'MQTT Sensor',
        type: 'sensor',
        roomId: 'room-1',
        isOn: true,
        status: 'online',
        protocol: 'mqtt',
      };

      const onState = jest.fn();
      const onStatus = jest.fn();

      const unsubscribe = adapter.subscribe(device, onState, onStatus);
      expect(mqttService.onDeviceState).toHaveBeenCalled();
      expect(mqttService.onDeviceStatus).toHaveBeenCalled();

      // Trigger cleanup
      unsubscribe();
    });
  });

  describe('HttpProtocolAdapter', () => {
    let mockAxiosClient: any;
    let adapter: HttpProtocolAdapter;

    beforeEach(() => {
      jest.clearAllMocks();
      jest.useFakeTimers();

      mockAxiosClient = {
        get: jest.fn().mockResolvedValue({
          data: {
            id: 'plug-http-1',
            name: 'HTTP Plug',
            type: 'plug',
            isOn: true,
            status: 'online',
          },
        }),
        post: jest.fn().mockResolvedValue({ data: { success: true } }),
      };

      adapter = new HttpProtocolAdapter(mockAxiosClient);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('has protocol identifier "http"', () => {
      expect(adapter.protocol).toBe('http');
    });

    it('sends state commands through HTTP POST /devices/:id/set', async () => {
      const device: Device = {
        id: 'plug-http-1',
        name: 'HTTP Smart Plug',
        type: 'plug',
        roomId: 'room-kitchen',
        isOn: false,
        status: 'online',
        protocol: 'http',
        connectionConfig: {
          baseUrl: 'http://localhost:3001',
          pollIntervalMs: 5000,
        },
      };

      const result = await adapter.sendState(device, { on: true });
      expect(result).toBe(true);
      expect(mockAxiosClient.post).toHaveBeenCalledWith(
        'http://localhost:3001/devices/plug-http-1/set',
        { on: true }
      );
    });

    it('subscribes via immediate GET and polls periodically with setInterval', async () => {
      const device: Device = {
        id: 'sensor-http-2',
        name: 'HTTP Climate Sensor',
        type: 'sensor',
        roomId: 'room-1',
        isOn: true,
        status: 'online',
        protocol: 'http',
        connectionConfig: {
          baseUrl: 'http://localhost:3001',
          pollIntervalMs: 3000,
        },
      };

      mockAxiosClient.get.mockResolvedValueOnce({
        data: {
          id: 'sensor-http-2',
          isOn: true,
          status: 'online',
          temperature: 23.5,
          humidity: 50,
        },
      });

      const onState = jest.fn();
      const onStatus = jest.fn();

      const unsubscribe = adapter.subscribe(device, onState, onStatus);

      // Verify immediate fetch
      expect(mockAxiosClient.get).toHaveBeenCalledWith('http://localhost:3001/devices/sensor-http-2');

      // Wait for promise resolution
      await Promise.resolve();

      expect(onStatus).toHaveBeenCalledWith('online');
      expect(onState).toHaveBeenCalledWith(
        expect.objectContaining({
          on: true,
          temperature: 23.5,
          humidity: 50,
        })
      );

      // Advance timer by poll interval (3000ms)
      mockAxiosClient.get.mockResolvedValueOnce({
        data: {
          id: 'sensor-http-2',
          isOn: true,
          status: 'online',
          temperature: 24.2,
          humidity: 48,
        },
      });

      jest.advanceTimersByTime(3000);
      await Promise.resolve();

      expect(mockAxiosClient.get).toHaveBeenCalledTimes(2);

      // Unsubscribe stops the polling
      unsubscribe();
      jest.advanceTimersByTime(6000);
      expect(mockAxiosClient.get).toHaveBeenCalledTimes(2); // no more calls
    });

    it('reports offline status when HTTP polling fails', async () => {
      const device: Device = {
        id: 'plug-unreachable',
        name: 'Offline Plug',
        type: 'plug',
        roomId: 'room-1',
        isOn: false,
        status: 'online',
        protocol: 'http',
      };

      mockAxiosClient.get.mockRejectedValueOnce(new Error('Network Error'));

      const onState = jest.fn();
      const onStatus = jest.fn();

      const unsubscribe = adapter.subscribe(device, onState, onStatus);
      await Promise.resolve();

      expect(onStatus).toHaveBeenCalledWith('offline');
      unsubscribe();
    });
  });

  describe('Device Provisioning & Redux Integration', () => {
    it('manages both MQTT and HTTP devices in the unified device store', () => {
      const initialState: DeviceState = {
        devices: [
          {
            id: 'mqtt-light-1',
            name: 'Ceiling Light',
            type: 'light',
            roomId: 'room-1',
            isOn: false,
            brightness: 100,
            status: 'online',
            protocol: 'mqtt',
          },
        ],
        loading: false,
        error: null,
        selectedDeviceId: null,
      };

      // Add HTTP Smart Plug
      const httpPlug: Device = {
        id: 'http-plug-1',
        name: 'Desk Plug',
        type: 'plug',
        roomId: 'room-1',
        isOn: true,
        status: 'online',
        protocol: 'http',
        connectionConfig: {
          baseUrl: 'http://localhost:3001',
          pollIntervalMs: 5000,
        },
      };

      const stateWithPlug = deviceReducer(
        initialState,
        addDeviceAction.fulfilled(httpPlug, '', httpPlug)
      );

      expect(stateWithPlug.devices.length).toBe(2);
      expect(stateWithPlug.devices.find((d) => d.id === 'http-plug-1')?.protocol).toBe('http');
      expect(stateWithPlug.devices.find((d) => d.id === 'mqtt-light-1')?.protocol).toBe('mqtt');
    });

    it('updates brightness for light device via adjustBrightnessAction', () => {
      const initialLight: Device = {
        id: 'light-dimmer',
        name: 'Dimmer Light',
        type: 'light',
        roomId: 'room-1',
        isOn: true,
        brightness: 50,
        status: 'online',
        protocol: 'mqtt',
      };

      const initialState: DeviceState = {
        devices: [initialLight],
        loading: false,
        error: null,
        selectedDeviceId: null,
      };

      const updatedLight: Device = {
        ...initialLight,
        brightness: 85,
      };

      const nextState = deviceReducer(
        initialState,
        adjustBrightnessAction.fulfilled(updatedLight, '', { id: 'light-dimmer', brightness: 85 })
      );

      expect(nextState.devices[0].brightness).toBe(85);
    });

    it('handles read-only telemetry update for sensor device without modifying power state', () => {
      const initialSensor: Device = {
        id: 'temp-sensor-1',
        name: 'DHT22 Sensor',
        type: 'sensor',
        roomId: 'room-1',
        isOn: true,
        temperature: 22.0,
        humidity: 60,
        status: 'online',
        protocol: 'mqtt',
      };

      const initialState: DeviceState = {
        devices: [initialSensor],
        loading: false,
        error: null,
        selectedDeviceId: null,
      };

      const nextState = deviceReducer(
        initialState,
        updateDeviceFromMqtt({
          id: 'temp-sensor-1',
          payload: { temperature: 26.5, humidity: 72 },
        })
      );

      const sensor = nextState.devices.find((d) => d.id === 'temp-sensor-1');
      expect(sensor?.temperature).toBe(26.5);
      expect(sensor?.humidity).toBe(72);
      expect(sensor?.isOn).toBe(true);
    });
  });
});
