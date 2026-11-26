import {
  GetDevicesUseCase,
  ToggleDeviceUseCase,
  AdjustTemperatureUseCase,
} from '../src/domain/usecases/DeviceUseCases';
import { IDeviceRepository } from '../src/domain/repositories/IDeviceRepository';
import { Device } from '../src/domain/entities/Device';

describe('Device Use Cases', () => {
  const mockDevice: Device = {
    id: 'light-01',
    name: 'Living Room Light',
    type: 'light',
    roomId: 'room-1',
    isOn: true,
    status: 'online',
  };

  const mockRepo: IDeviceRepository = {
    getDevices: jest.fn(async () => [mockDevice]),
    getDeviceById: jest.fn(async (id: string) => (id === mockDevice.id ? mockDevice : null)),
    toggleDevice: jest.fn(async (id: string, current: boolean) => ({
      ...mockDevice,
      isOn: !current,
    })),
    adjustTemperature: jest.fn(async (id: string, temp: number) => ({
      ...mockDevice,
      temperature: temp,
    })),
    adjustBrightness: jest.fn(async (id: string, brightness: number) => ({
      ...mockDevice,
      brightness,
    })),
    addDevice: jest.fn(async (dev: Device) => dev),
    removeDevice: jest.fn(async () => true),
    publishCommand: jest.fn(),
    subscribeUpdates: jest.fn(() => () => {}),
  };

  it('GetDevicesUseCase returns device list from repository', async () => {
    const useCase = new GetDevicesUseCase(mockRepo);
    const devices = await useCase.execute();
    expect(devices.length).toBe(1);
    expect(devices[0].name).toBe('Living Room Light');
  });

  it('ToggleDeviceUseCase toggles device state properly', async () => {
    const useCase = new ToggleDeviceUseCase(mockRepo);
    const result = await useCase.execute('light-01', true);
    expect(result?.isOn).toBe(false);
    expect(mockRepo.toggleDevice).toHaveBeenCalledWith('light-01', true);
  });

  it('AdjustTemperatureUseCase adjusts thermostat temperature', async () => {
    const useCase = new AdjustTemperatureUseCase(mockRepo);
    const result = await useCase.execute('thermo-01', 25.5);
    expect(result?.temperature).toBe(25.5);
    expect(mockRepo.adjustTemperature).toHaveBeenCalledWith('thermo-01', 25.5);
  });
});
