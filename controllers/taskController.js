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

  res.status(201).json(serializeTaskWithPriority(task));
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

  res.json(serializeTaskWithPriority(task));
};

const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user
  });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json({ message: 'Task deleted' });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
