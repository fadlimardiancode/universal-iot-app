import { IRoomRepository } from '../../domain/repositories/IRoomRepository';
import { Room } from '../../domain/entities/Room';
import { httpService } from '../datasources/HttpService';
import { StorageService } from '../../core/utils/storage';
import { APP_CONFIG } from '../../core/constants/config';

export class RoomRepositoryImpl implements IRoomRepository {
  async getRooms(): Promise<Room[]> {
    return await httpService.fetchRooms();
  }

  async addRoom(room: Room): Promise<Room> {
    const current = StorageService.getObject<Room[]>(APP_CONFIG.STORAGE_KEYS.ROOMS) || [];
    const updated = [...current, room];
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.ROOMS, updated);
    return room;
  }

  async renameRoom(id: string, newName: string): Promise<Room | null> {
    const current = StorageService.getObject<Room[]>(APP_CONFIG.STORAGE_KEYS.ROOMS) || [];
    const target = current.find((r) => r.id === id);
    if (!target) return null;

    const updated = current.map((r) => (r.id === id ? { ...r, name: newName } : r));
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.ROOMS, updated);
    return { ...target, name: newName };
  }

  async deleteRoom(id: string): Promise<boolean> {
    const current = StorageService.getObject<Room[]>(APP_CONFIG.STORAGE_KEYS.ROOMS) || [];
    const updated = current.filter((r) => r.id !== id);
    StorageService.setObject(APP_CONFIG.STORAGE_KEYS.ROOMS, updated);
    return true;
  }
}

export const roomRepository = new RoomRepositoryImpl();
