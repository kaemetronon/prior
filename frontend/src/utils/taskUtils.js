export const calculateTaskWeight = (task) => {
  const { urgency, personalInterest, executionTime, complexity } = task;
  return (urgency * 3.3 + personalInterest * 2 + executionTime * 3.2 + complexity * 1.5) / 10;
};

export const sortTasks = (tasks) => {
  return [...tasks].sort((a, b) => {
    // If one task is completed and the other isn't, completed task goes to the end
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // If both tasks have the same completion status, sort by weight
    const weightA = calculateTaskWeight(a);
    const weightB = calculateTaskWeight(b);
    return weightB - weightA;
  });
}; 