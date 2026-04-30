const calculateTaskPriority = require('./taskPriority');

const serializeTaskWithPriority = (task, currentTime = Date.now()) => ({
  ...task.toObject(),
  priority: calculateTaskPriority(task.deadline, currentTime)
});

module.exports = serializeTaskWithPriority;