import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await api.get('/tasks');
  return response.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
});

export const updateTaskStatus = createAsyncThunk('tasks/updateTaskStatus', async ({ id, status }) => {
  const response = await api.put(`/tasks/${id}`, { status });
  return response.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

const initialState = {
  tasks: []
};

const sortTasks = (tasks) => {
  return tasks.slice().sort((leftTask, rightTask) => {
    if (rightTask.priority !== leftTask.priority) {
      return rightTask.priority - leftTask.priority;
    }

    return new Date(leftTask.createdAt) - new Date(rightTask.createdAt);
  });
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskCreated: (state, action) => {
      state.tasks = sortTasks([...state.tasks, action.payload]);
    },
    taskUpdated: (state, action) => {
      const updatedTasks = state.tasks.map((task) =>
        task._id === action.payload._id ? action.payload : task
      );
      state.tasks = sortTasks(
        updatedTasks.some((task) => task._id === action.payload._id)
          ? updatedTasks
          : [...updatedTasks, action.payload]
      );
    },
    taskDeleted: (state, action) => {
      const taskId = action.payload?._id || action.payload;
      state.tasks = state.tasks.filter((task) => task._id !== taskId);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
    });
  }
});

export const { taskCreated, taskUpdated, taskDeleted } = taskSlice.actions;

export default taskSlice.reducer;
