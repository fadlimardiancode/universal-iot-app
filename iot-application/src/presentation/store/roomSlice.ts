import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../../domain/entities/Room';
import { roomRepository } from '../../data/repositories/RoomRepositoryImpl';

export interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  selectedRoomId: string | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
  selectedRoomId: null,
};

export const fetchRooms = createAsyncThunk<Room[]>(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      return await roomRepository.getRooms();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch rooms');
    }
  }
);

export const addRoomAction = createAsyncThunk<Room, Room>(
  'rooms/addRoom',
  async (room, { rejectWithValue }) => {
    try {
      return await roomRepository.addRoom(room);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add room');
    }
  }
);

export const renameRoomAction = createAsyncThunk<
  Room | null,
  { id: string; newName: string }
>('rooms/renameRoom', async ({ id, newName }, { rejectWithValue }) => {
  try {
    return await roomRepository.renameRoom(id, newName);
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to rename room');
  }
});

export const deleteRoomAction = createAsyncThunk<string, string>(
  'rooms/deleteRoom',
  async (id, { rejectWithValue }) => {
    try {
      await roomRepository.deleteRoom(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete room');
    }
  }
);

export const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
    },
    setSelectedRoom: (state, action: PayloadAction<string | null>) => {
      state.selectedRoomId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRoomAction.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      })
      .addCase(renameRoomAction.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.rooms.findIndex((r) => r.id === action.payload!.id);
          if (index !== -1) {
            state.rooms[index] = action.payload;
          }
        }
      })
      .addCase(deleteRoomAction.fulfilled, (state, action) => {
        state.rooms = state.rooms.filter((r) => r.id !== action.payload);
      });
  },
});

export const { setRooms, setSelectedRoom } = roomSlice.actions;
export default roomSlice.reducer;
