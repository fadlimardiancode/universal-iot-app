import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageService } from '../../core/utils/storage';
import { APP_CONFIG } from '../../core/constants/config';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
}

const savedTheme = StorageService.getString(APP_CONFIG.STORAGE_KEYS.THEME) as ThemeMode | null;

const initialState: ThemeState = {
  mode: savedTheme || 'system',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      StorageService.setString(APP_CONFIG.STORAGE_KEYS.THEME, action.payload);
    },
    toggleTheme: (state) => {
      const nextMode: ThemeMode = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = nextMode;
      StorageService.setString(APP_CONFIG.STORAGE_KEYS.THEME, nextMode);
    },
  },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
