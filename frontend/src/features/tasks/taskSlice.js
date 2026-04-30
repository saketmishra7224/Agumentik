import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await api.get('/tasks');
  return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData, thunkAPI) => {
  const response = await api.post('/tasks', taskData);
  await thunkAPI.dispatch(fetchTasks());
  return response.data;
});

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status }, thunkAPI) => {
    const response = await api.put(`/tasks/${id}`, { status });
    await thunkAPI.dispatch(fetchTasks());
    return response.data;
  }
);

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, thunkAPI) => {
  await api.delete(`/tasks/${id}`);
  await thunkAPI.dispatch(fetchTasks());
  return id;
});

const initialState = {
  tasks: []
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  }
});

export default taskSlice.reducer;
