import { IDeviceRepository } from '../repositories/IDeviceRepository';
import { Device } from '../entities/Device';

export class GetDevicesUseCase {
  constructor(private repository: IDeviceRepository) {}

  async execute(): Promise<Device[]> {
    return await this.repository.getDevices();
  }
}

export class ToggleDeviceUseCase {
  constructor(private repository: IDeviceRepository) {}

  async execute(id: string, currentState: boolean): Promise<Device | null> {
    return await this.repository.toggleDevice(id, currentState);
  }
}

export class AdjustTemperatureUseCase {
  constructor(private repository: IDeviceRepository) {}

  async execute(id: string, temperature: number): Promise<Device | null> {
    return await this.repository.adjustTemperature(id, temperature);
  }
}

export class AddDeviceUseCase {
  constructor(private repository: IDeviceRepository) {}

  async execute(device: Device): Promise<Device> {
    return await this.repository.addDevice(device);
  }
}

export class RemoveDeviceUseCase {
  constructor(private repository: IDeviceRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.repository.removeDevice(id);
  }
}
