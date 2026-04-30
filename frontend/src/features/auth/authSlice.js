import { createSlice } from '@reduxjs/toolkit';

const getStoredToken = () => {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage.getItem('token');
};

const saveToken = (token) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

const removeToken = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('token');
  }
};

const token = getStoredToken();

const initialState = {
  user: null,
  token,
  isAuthenticated: Boolean(token)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.isAuthenticated = Boolean(action.payload.token);

      if (action.payload.token) {
        saveToken(action.payload.token);
      } else {
        removeToken();
      }
    },
    register: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.isAuthenticated = Boolean(action.payload.token);

      if (action.payload.token) {
        saveToken(action.payload.token);
      } else {
        removeToken();
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeToken();
    }
  }
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
