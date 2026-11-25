import themeReducer, { setThemeMode, toggleTheme } from '../src/presentation/store/themeSlice';

// StorageService is mocked in jest.setup.js

describe('themeSlice', () => {
  it('should return initial state with default theme', () => {
    const state = themeReducer(undefined, { type: 'unknown' });
    expect(['light', 'dark', 'system']).toContain(state.mode);
  });

  it('should handle setThemeMode', () => {
    const state = themeReducer({ mode: 'light' }, setThemeMode('dark'));
    expect(state.mode).toBe('dark');
  });

  it('should toggle theme from light to dark and vice versa', () => {
    let state = themeReducer({ mode: 'light' }, toggleTheme());
    expect(state.mode).toBe('dark');

    state = themeReducer(state, toggleTheme());
    expect(state.mode).toBe('light');
  });
});
