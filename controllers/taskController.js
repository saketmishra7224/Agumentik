const Task = require('../models/Task');
const serializeTaskWithPriority = require('../utils/taskResponse');

const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user });
  const currentTime = Date.now();

  const tasksWithPriority = tasks
    .map((task) => serializeTaskWithPriority(task, currentTime))
    .sort((leftTask, rightTask) => {
      if (rightTask.priority !== leftTask.priority) {
        return rightTask.priority - leftTask.priority;
      }

      return new Date(leftTask.createdAt) - new Date(rightTask.createdAt);
    });

  res.json(tasksWithPriority);
};

const createTask = async (req, res) => {
  const { title, description, category, status, deadline } = req.body;

  const task = await Task.create({
    title,
    description,
    category,
    status,
    deadline,
    user: req.user
  });

  const io = req.app.get('io');
  const serialized = serializeTaskWithPriority(task, Date.now());

  if (io) {
    io.emit('taskCreated', serialized);
  }

  res.status(201).json(serialized);
};

const updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    { status: req.body.status },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const io = req.app.get('io');
  const serialized = serializeTaskWithPriority(task, Date.now());

  if (io) {
    io.emit('taskUpdated', serialized);
  }

  res.json(serialized);
};

const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const io = req.app.get('io');
  const serialized = serializeTaskWithPriority(task, Date.now());

  if (io) {
    io.emit('taskDeleted', serialized);
  }

  res.json({ message: 'Task deleted' });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
