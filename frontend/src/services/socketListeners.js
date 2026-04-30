import socket from './socket';
import { store } from '../app/store';
import { taskCreated, taskUpdated, taskDeleted } from '../features/tasks/taskSlice';

let initialized = false;

export default function initSocketListeners() {
  if (initialized) return;
  initialized = true;

  socket.on('taskCreated', (task) => {
    store.dispatch(taskCreated(task));
  });

  socket.on('taskUpdated', (task) => {
    store.dispatch(taskUpdated(task));
  });

  socket.on('taskDeleted', (task) => {
    store.dispatch(taskDeleted(task));
  });
}
