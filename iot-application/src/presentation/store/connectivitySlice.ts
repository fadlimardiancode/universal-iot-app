import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ConnectivityState {
  mqttConnected: boolean;
  httpReachable: boolean;
}

const initialState: ConnectivityState = {
  mqttConnected: false,
  httpReachable: false,
};

export const connectivitySlice = createSlice({
  name: 'connectivity',
  initialState,
  reducers: {
    setMqttConnected: (state, action: PayloadAction<boolean>) => {
      state.mqttConnected = action.payload;
    },
    setHttpReachable: (state, action: PayloadAction<boolean>) => {
      state.httpReachable = action.payload;
    },
  },
});

export const { setMqttConnected, setHttpReachable } = connectivitySlice.actions;
export default connectivitySlice.reducer;
