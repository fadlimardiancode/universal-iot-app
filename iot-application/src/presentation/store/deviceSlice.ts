import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Device, DeviceStatus, MqttStatePayload } from '../../domain/entities/Device';
import { deviceRepository } from '../../data/repositories/DeviceRepositoryImpl';

export interface DeviceState {
  devices: Device[];
  loading: boolean;
  error: string | null;
  selectedDeviceId: string | null;
}

const initialState: DeviceState = {
  devices: [],
  loading: false,
  error: null,
  selectedDeviceId: null,
};

export const fetchDevices = createAsyncThunk<Device[]>(
  'devices/fetchDevices',
  async (_, { rejectWithValue }) => {
    try {
      return await deviceRepository.getDevices();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch devices');
    }
  }
);

export const toggleDeviceAction = createAsyncThunk<
  Device | null,
  { id: string; currentState: boolean }
>('devices/toggleDevice', async ({ id, currentState }, { rejectWithValue }) => {
  try {
    return await deviceRepository.toggleDevice(id, currentState);
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to toggle device');
  }
});

export const adjustTemperatureAction = createAsyncThunk<
  Device | null,
  { id: string; temperature: number }
>('devices/adjustTemperature', async ({ id, temperature }, { rejectWithValue }) => {
  try {
    return await deviceRepository.adjustTemperature(id, temperature);
  } catch (err: any) {
    return rejectWithValue(err.message || 'Failed to adjust temperature');
  }
});

export const addDeviceAction = createAsyncThunk<Device, Device>(
  'devices/addDevice',
  async (device, { rejectWithValue }) => {
    try {
      return await deviceRepository.addDevice(device);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add device');
    }
  }
);

export const removeDeviceAction = createAsyncThunk<string, string>(
  'devices/removeDevice',
  async (id, { rejectWithValue }) => {
    try {
      await deviceRepository.removeDevice(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to remove device');
    }
  }
);

export const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
    },
    setSelectedDevice: (state, action: PayloadAction<string | null>) => {
      state.selectedDeviceId = action.payload;
    },
    // Called when an MQTT state update message arrives (real-time sync)
    updateDeviceFromMqtt: (
      state,
      action: PayloadAction<{ id: string; payload: MqttStatePayload }>
    ) => {
      const { id, payload } = action.payload;
      const index = state.devices.findIndex((d) => d.id === id);
      if (index !== -1) {
        const current = state.devices[index];
        state.devices[index] = {
          ...current,
          isOn: payload.on !== undefined ? payload.on : current.isOn,
          brightness: payload.brightness !== undefined ? payload.brightness : current.brightness,
          temperature: payload.temperature !== undefined ? payload.temperature : current.temperature,
          humidity: payload.humidity !== undefined ? payload.humidity : current.humidity,
          isLocked: payload.isLocked !== undefined ? payload.isLocked : current.isLocked,
        };
      }
    },
    // Called when an MQTT status update message arrives (online/offline)
    updateDeviceStatusFromMqtt: (
      state,
      action: PayloadAction<{ id: string; status: DeviceStatus }>
    ) => {
      const { id, status } = action.payload;
      const index = state.devices.findIndex((d) => d.id === id);
      if (index !== -1) {
        state.devices[index].status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch devices
      .addCase(fetchDevices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload;
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle device (optimistic)
      .addCase(toggleDeviceAction.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.devices.findIndex((d) => d.id === action.payload!.id);
          if (index !== -1) {
            state.devices[index] = action.payload;
          }
        }
      })
      // Adjust temperature
      .addCase(adjustTemperatureAction.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.devices.findIndex((d) => d.id === action.payload!.id);
          if (index !== -1) {
            state.devices[index] = action.payload;
          }
        }
      })
      // Add device
      .addCase(addDeviceAction.fulfilled, (state, action) => {
        state.devices.push(action.payload);
      })
      // Remove device
      .addCase(removeDeviceAction.fulfilled, (state, action) => {
        state.devices = state.devices.filter((d) => d.id !== action.payload);
      });
  },
});

export const {
  setDevices,
  setSelectedDevice,
  updateDeviceFromMqtt,
  updateDeviceStatusFromMqtt,
} = deviceSlice.actions;

export default deviceSlice.reducer;
