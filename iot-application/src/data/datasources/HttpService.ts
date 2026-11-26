import axios, { AxiosInstance } from 'axios';
import { APP_CONFIG } from '../../core/constants/config';
import { Device, Room, Automation } from '../../domain/entities';
import { INITIAL_MOCK_DEVICES } from './MockDeviceDataSource';
import { INITIAL_MOCK_ROOMS } from './MockRoomDataSource';
import { INITIAL_MOCK_AUTOMATIONS } from './MockAutomationDataSource';
import { StorageService } from '../../core/utils/storage';

class HttpService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: APP_CONFIG.HTTP_BASE_URL,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async isServerReachable(): Promise<boolean> {
    try {
      await this.client.get('/devices', { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  async fetchDevices(): Promise<Device[]> {
    try {
      const response = await this.client.get<Device[]>('/devices');
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Save cache to local storage
        StorageService.setObject(APP_CONFIG.STORAGE_KEYS.DEVICES, response.data);
        return response.data;
      }
    } catch (err) {
      console.warn('[HttpService] Failed to fetch devices from HTTP, falling back to cache/mock');
    }

    // Fallback: check storage first, then mock
    const cached = StorageService.getObject<Device[]>(APP_CONFIG.STORAGE_KEYS.DEVICES);
    if (cached && cached.length > 0) {
      return cached;
    }
    return INITIAL_MOCK_DEVICES;
  }

  async fetchDevice(id: string): Promise<Device | null> {
    try {
      const response = await this.client.get<Device>(`/devices/${id}`);
      return response.data;
    } catch {
      const all = await this.fetchDevices();
      return all.find((d) => d.id === id) || null;
    }
  }

  async setDeviceState(id: string, payload: Partial<Device>): Promise<Device | null> {
    try {
      const response = await this.client.post<Device>(`/devices/${id}/set`, payload);
      return response.data;
    } catch (err) {
      console.warn(`[HttpService] Failed POST /devices/${id}/set:`, err);
      return null;
    }
  }

  async fetchRooms(): Promise<Room[]> {
    try {
      const response = await this.client.get<Room[]>('/rooms');
      if (Array.isArray(response.data) && response.data.length > 0) {
        StorageService.setObject(APP_CONFIG.STORAGE_KEYS.ROOMS, response.data);
        return response.data;
      }
    } catch {
      // Fallback
    }

    const cached = StorageService.getObject<Room[]>(APP_CONFIG.STORAGE_KEYS.ROOMS);
    if (cached && cached.length > 0) {
      return cached;
    }
    return INITIAL_MOCK_ROOMS;
  }

  async fetchAutomations(): Promise<Automation[]> {
    try {
      const response = await this.client.get<Automation[]>('/automations');
      if (Array.isArray(response.data) && response.data.length > 0) {
        StorageService.setObject(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS, response.data);
        return response.data;
      }
    } catch {
      // Fallback
    }

    const cached = StorageService.getObject<Automation[]>(APP_CONFIG.STORAGE_KEYS.AUTOMATIONS);
    if (cached && cached.length > 0) {
      return cached;
    }
    return INITIAL_MOCK_AUTOMATIONS;
  }
}

export const httpService = new HttpService();
