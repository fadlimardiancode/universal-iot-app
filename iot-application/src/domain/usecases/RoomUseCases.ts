import { IRoomRepository } from '../repositories/IRoomRepository';
import { Room } from '../entities/Room';

export class GetRoomsUseCase {
  constructor(private repository: IRoomRepository) {}

  async execute(): Promise<Room[]> {
    return await this.repository.getRooms();
  }
}

export class AddRoomUseCase {
  constructor(private repository: IRoomRepository) {}

  async execute(room: Room): Promise<Room> {
    return await this.repository.addRoom(room);
  }
}

export class RenameRoomUseCase {
  constructor(private repository: IRoomRepository) {}

  async execute(id: string, newName: string): Promise<Room | null> {
    return await this.repository.renameRoom(id, newName);
  }
}

export class DeleteRoomUseCase {
  constructor(private repository: IRoomRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.repository.deleteRoom(id);
  }
}
