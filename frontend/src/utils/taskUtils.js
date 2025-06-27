export const calculateTaskWeight = (task) => {
  const { urgency, personalInterest, executionTime, complexity, concentration } = task;
  return (urgency * 2.6 + personalInterest * 1.6 + executionTime * 2.5 + complexity * 1.2 + concentration * 2.1) / 10;
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