import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAnalytics = createAsyncThunk('analytics/fetchAnalytics', async () => {
  const response = await api.get('/analytics');
  return response.data;
});

const initialState = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  tasksCompletedToday: 0,
  categoryDistribution: [],
  status: 'idle',
  error: null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalTasks = action.payload.totalTasks ?? 0;
        state.completedTasks = action.payload.completedTasks ?? 0;
        state.pendingTasks = action.payload.pendingTasks ?? 0;
        state.tasksCompletedToday = action.payload.tasksCompletedToday ?? 0;
        state.categoryDistribution = action.payload.categoryDistribution ?? [];
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to load analytics';
      });
  }
});

export default analyticsSlice.reducer;