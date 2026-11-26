import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import themeReducer from './themeSlice';
import deviceReducer from './deviceSlice';
import roomReducer from './roomSlice';
import automationReducer from './automationSlice';
import connectivityReducer from './connectivitySlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    devices: deviceReducer,
    rooms: roomReducer,
    automations: automationReducer,
    connectivity: connectivityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
