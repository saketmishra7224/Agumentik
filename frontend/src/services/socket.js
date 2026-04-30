import { io } from 'socket.io-client';

// Determine backend origin for socket connection.
// Prefer VITE_SOCKET_URL; otherwise derive from VITE_API_URL by stripping /api.
const apiUrl = import.meta.env.VITE_API_URL || '';
const socketUrl = import.meta.env.VITE_SOCKET_URL
  || (apiUrl ? apiUrl.replace(/\/api\/?$/, '') : window.location.origin);

const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
