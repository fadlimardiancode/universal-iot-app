import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Automation } from '../../domain/entities/Automation';
import { automationRepository } from '../../data/repositories/AutomationRepositoryImpl';

export interface AutomationState {
  automations: Automation[];
  loading: boolean;
  error: string | null;
}

const initialState: AutomationState = {
  automations: [],
  loading: false,
  error: null,
};

export const fetchAutomations = createAsyncThunk<Automation[]>(
  'automations/fetchAutomations',
  async (_, { rejectWithValue }) => {
    try {
      return await automationRepository.getAutomations();
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch automations');
    }
  }
);

export const addAutomationAction = createAsyncThunk<Automation, Automation>(
  'automations/addAutomation',
  async (automation, { rejectWithValue }) => {
    try {
      return await automationRepository.addAutomation(automation);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add automation');
    }
  }
);

export const toggleAutomationAction = createAsyncThunk<Automation | null, string>(
  'automations/toggleAutomation',
  async (id, { rejectWithValue }) => {
    try {
      return await automationRepository.toggleAutomation(id);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to toggle automation');
    }
  }
);

export const deleteAutomationAction = createAsyncThunk<string, string>(
  'automations/deleteAutomation',
  async (id, { rejectWithValue }) => {
    try {
      await automationRepository.deleteAutomation(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete automation');
    }
  }
);

export const automationSlice = createSlice({
  name: 'automations',
  initialState,
  reducers: {
    setAutomations: (state, action: PayloadAction<Automation[]>) => {
      state.automations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutomations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAutomations.fulfilled, (state, action) => {
        state.loading = false;
        state.automations = action.payload;
      })
      .addCase(fetchAutomations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAutomationAction.fulfilled, (state, action) => {
        state.automations.push(action.payload);
      })
      .addCase(toggleAutomationAction.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.automations.findIndex((a) => a.id === action.payload!.id);
          if (index !== -1) {
            state.automations[index] = action.payload;
          }
        }
      })
      .addCase(deleteAutomationAction.fulfilled, (state, action) => {
        state.automations = state.automations.filter((a) => a.id !== action.payload);
      });
  },
});

export const { setAutomations } = automationSlice.actions;
export default automationSlice.reducer;
