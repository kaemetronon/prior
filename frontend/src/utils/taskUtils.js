export const calculateTaskWeight = (task) => {
  const { importance, urgency, personalInterest, executionTime, complexity, concentration } = task;
  return (importance * 2.6 + urgency * 2.1 + personalInterest * 1.6 + executionTime * 1.6 + complexity * 1.1 + concentration * 1) / 10;
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