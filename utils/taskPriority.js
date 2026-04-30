const calculateTaskPriority = (deadline, currentTime = Date.now()) => {
  if (!deadline) {
    return 0;
  }

  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return 0;
  }

  const deadlineTime = deadlineDate.getTime();

  if (deadlineTime <= currentTime) {
    return 1000;
  }

  const remainingHours = (deadlineTime - currentTime) / (1000 * 60 * 60);

  return Number((1000 / (remainingHours + 1)).toFixed(2));
};

module.exports = calculateTaskPriority;