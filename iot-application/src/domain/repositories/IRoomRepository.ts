import { Room } from '../entities/Room';

export interface IRoomRepository {
  getRooms(): Promise<Room[]>;
  addRoom(room: Room): Promise<Room>;
  renameRoom(id: string, newName: string): Promise<Room | null>;
  deleteRoom(id: string): Promise<boolean>;
}
