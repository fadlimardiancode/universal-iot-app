import roomReducer, { setRooms, RoomState } from '../src/presentation/store/roomSlice';
import { Room } from '../src/domain/entities/Room';

const sampleRooms: Room[] = [
  { id: 'room-1', name: 'Living Room' },
  { id: 'room-2', name: 'Bedroom' },
];

describe('roomSlice', () => {
  it('should set rooms list', () => {
    const state = roomReducer(undefined, setRooms(sampleRooms));
    expect(state.rooms.length).toBe(2);
    expect(state.rooms[0].name).toBe('Living Room');
  });
});
