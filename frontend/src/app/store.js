import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from '../features/analytics/analyticsSlice';
import authReducer from '../features/auth/authSlice';
import taskReducer from '../features/tasks/taskSlice';

export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    auth: authReducer,
    tasks: taskReducer
  }
});
