export const calculateTaskWeight = (task) => {
  const { importance, urgency, personalInterest, executionTime, complexity, concentration } = task;
  return (importance * 2.6 + urgency * 2.1 + personalInterest * 1.6 + executionTime * 1.6 + complexity * 1.1 + concentration * 1) / 10;
};

export const getWeightColor = (weight) => {
  // Convert weight to a value between 0 and 1
  const normalizedWeight = (weight - 1) / 9;
  
  // Calculate RGB values for gradient from red (1) to green (10)
  const red = Math.round(255 * (1 - normalizedWeight));
  const green = Math.round(255 * normalizedWeight);
  
  return `rgb(${red}, ${green}, 0)`;
};

// Детекция Apple Watch
export const isAppleWatch = () => {
  const userAgent = navigator.userAgent;
  return userAgent.includes('Watch') || 
         (userAgent.includes('iPhone') && window.screen.width <= 162); // Apple Watch screen width
};

export const sortTasks = (tasks, sortBy = 'weight', sortOrder = 'desc') => {
  const isAscending = sortOrder.toLowerCase() === 'asc';
  
  return [...tasks].sort((a, b) => {
    // If one task is completed and the other isn't, completed task goes to the end
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // If both tasks have the same completion status, sort by the specified field
    let comparison = 0;
    
    switch (sortBy) {
      case 'weight':
        const weightA = calculateTaskWeight(a);
        const weightB = calculateTaskWeight(b);
        comparison = weightA - weightB;
        break;
      case 'importance':
        comparison = a.importance - b.importance;
        break;
      case 'urgency':
        comparison = a.urgency - b.urgency;
        break;
      case 'personalInterest':
        comparison = a.personalInterest - b.personalInterest;
        break;
      case 'executionTime':
        comparison = a.executionTime - b.executionTime;
        break;
      case 'complexity':
        comparison = a.complexity - b.complexity;
        break;
      case 'concentration':
        comparison = a.concentration - b.concentration;
        break;
      default:
        // Default to weight sorting
        const defaultWeightA = calculateTaskWeight(a);
        const defaultWeightB = calculateTaskWeight(b);
        comparison = defaultWeightA - defaultWeightB;
    }
    
    // If values are equal, sort by blocked status (unblocked first)
    if (comparison === 0) {
      comparison = a.blocked - b.blocked;
    }
    
    return isAscending ? comparison : -comparison;
  });
};
