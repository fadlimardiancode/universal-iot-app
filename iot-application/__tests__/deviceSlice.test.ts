import deviceReducer, {
  setDevices,
  updateDeviceFromMqtt,
  updateDeviceStatusFromMqtt,
  DeviceState,
} from '../src/presentation/store/deviceSlice';
import { Device } from '../src/domain/entities/Device';

const sampleDevices: Device[] = [
  {
    id: 'light-01',
    name: 'Living Room Light',
    type: 'light',
    roomId: 'room-1',
    isOn: true,
    brightness: 80,
    status: 'online',
  },
  {
    id: 'thermo-01',
    name: 'Bedroom Thermostat',
    type: 'thermostat',
    roomId: 'room-2',
    isOn: true,
    temperature: 24.0,
    humidity: 60,
    status: 'online',
  },
];

describe('deviceSlice', () => {
  it('should initialize with empty devices', () => {
    const state = deviceReducer(undefined, { type: 'unknown' });
    expect(state.devices).toEqual([]);
    expect(state.loading).toBe(false);
  });

  it('should set devices list', () => {
    const state = deviceReducer(undefined, setDevices(sampleDevices));
    expect(state.devices.length).toBe(2);
    expect(state.devices[0].id).toBe('light-01');
  });

  it('should update device state when MQTT message arrives (real-time sync)', () => {
    const initialState: DeviceState = {
      devices: sampleDevices,
      loading: false,
      error: null,
      selectedDeviceId: null,
    };

    const state = deviceReducer(
      initialState,
      updateDeviceFromMqtt({
        id: 'light-01',
        payload: { on: false, brightness: 30 },
      })
    );

    const updated = state.devices.find((d) => d.id === 'light-01');
    expect(updated?.isOn).toBe(false);
    expect(updated?.brightness).toBe(30);
  });

  it('should update device connectivity status when MQTT retained status arrives', () => {
    const initialState: DeviceState = {
      devices: sampleDevices,
      loading: false,
      error: null,
      selectedDeviceId: null,
    };

    const state = deviceReducer(
      initialState,
      updateDeviceStatusFromMqtt({ id: 'light-01', status: 'offline' })
    );

    const updated = state.devices.find((d) => d.id === 'light-01');
    expect(updated?.status).toBe('offline');
  });
});
