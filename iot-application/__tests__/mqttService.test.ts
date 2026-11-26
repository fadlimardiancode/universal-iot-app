import { mqttService } from '../src/data/datasources/MqttService';
import { APP_CONFIG } from '../src/core/constants/config';
import mqtt from 'mqtt';

describe('MqttService', () => {
  let mockClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      on: jest.fn(),
      subscribe: jest.fn(),
      publish: jest.fn((topic, payload, opts, cb) => {
        if (typeof opts === 'function') opts();
        if (typeof cb === 'function') cb();
      }),
      end: jest.fn((force, opts, cb) => {
        if (typeof opts === 'function') opts();
        if (typeof cb === 'function') cb();
      }),
    };
    (mqtt.connect as jest.Mock).mockReturnValue(mockClient);
  });

  afterEach(() => {
    mqttService.disconnect();
  });

  it('connects to broker and sets up event handlers and subscriptions', () => {
    mqttService.connect();

    expect(mqtt.connect).toHaveBeenCalled();
    expect(mockClient.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockClient.on).toHaveBeenCalledWith('message', expect.any(Function));
    expect(mockClient.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mockClient.on).toHaveBeenCalledWith('error', expect.any(Function));

    // Simulate connect event
    const connectHandler = mockClient.on.mock.calls.find((call: any[]) => call[0] === 'connect')[1];
    connectHandler();

    expect(mockClient.subscribe).toHaveBeenCalledWith(
      [`${APP_CONFIG.MQTT_TOPIC_PREFIX}/+/state`, `${APP_CONFIG.MQTT_TOPIC_PREFIX}/+/status`],
      expect.any(Function)
    );
    expect(mqttService.getConnected()).toBe(true);
  });

  it('publishes command to the correct MQTT topic prefix', () => {
    mqttService.connect();

    // Trigger connect to mark as connected
    const connectHandler = mockClient.on.mock.calls.find((call: any[]) => call[0] === 'connect')[1];
    connectHandler();

    mqttService.publishCommand('light-01', { on: true, brightness: 75 });

    expect(mockClient.publish).toHaveBeenCalledWith(
      `${APP_CONFIG.MQTT_TOPIC_PREFIX}/light-01/set`,
      JSON.stringify({ on: true, brightness: 75 }),
      { qos: 0 },
      expect.any(Function)
    );
  });

  it('handles incoming MQTT state message and triggers callback', () => {
    mqttService.connect();

    const mockCallback = jest.fn();
    const unsub = mqttService.onDeviceState(mockCallback);

    const messageHandler = mockClient.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
    messageHandler(`${APP_CONFIG.MQTT_TOPIC_PREFIX}/light-01/state`, Buffer.from(JSON.stringify({ on: false, brightness: 0 })));

    expect(mockCallback).toHaveBeenCalledWith('light-01', { on: false, brightness: 0 });
    unsub();
  });

  it('handles incoming retained status message (online/offline)', () => {
    mqttService.connect();

    const mockCallback = jest.fn();
    const unsub = mqttService.onDeviceStatus(mockCallback);

    const messageHandler = mockClient.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
    messageHandler(`${APP_CONFIG.MQTT_TOPIC_PREFIX}/thermo-01/status`, Buffer.from('offline'));

    expect(mockCallback).toHaveBeenCalledWith('thermo-01', 'offline');
    unsub();
  });
});
