import { calculateTaskWeight, sortTasks } from '../../utils/taskUtils';

describe('Task Utils', () => {
  describe('calculateTaskWeight', () => {
    it('should calculate weight correctly', () => {
      const task = {
        urgency: 10,
        personalInterest: 10,
        executionTime: 10,
        complexity: 10
      };
      const weight = calculateTaskWeight(task);
      // (10 * 3.3 + 10 * 2 + 10 * 3.2 + 10 * 1.5) / 10 = 10
      expect(weight).toBe(10);
    });

    it('should calculate weight for minimum values', () => {
      const task = {
        urgency: 1,
        personalInterest: 1,
        executionTime: 1,
        complexity: 1
      };
      const weight = calculateTaskWeight(task);
      // (1 * 3.3 + 1 * 2 + 1 * 3.2 + 1 * 1.5) / 10 = 1
      expect(weight).toBe(1);
    });
  });

  describe('sortTasks', () => {
    it('should sort tasks by weight when all are active', () => {
      const tasks = [
        {
          id: 1,
          title: 'Low weight',
          urgency: 1,
          personalInterest: 1,
          executionTime: 1,
          complexity: 1,
          completed: false
        },
        {
          id: 2,
          title: 'High weight',
          urgency: 10,
          personalInterest: 10,
          executionTime: 10,
          complexity: 10,
          completed: false
        },
        {
          id: 3,
          title: 'Medium weight',
          urgency: 5,
          personalInterest: 5,
          executionTime: 5,
          complexity: 5,
          completed: false
        }
      ];

      const sorted = sortTasks(tasks);
      expect(sorted[0].title).toBe('High weight');
      expect(sorted[1].title).toBe('Medium weight');
      expect(sorted[2].title).toBe('Low weight');
    });

    it('should move completed tasks to the end regardless of weight', () => {
      const tasks = [
        {
          id: 1,
          title: 'Completed high weight',
          urgency: 10,
          personalInterest: 10,
          executionTime: 10,
          complexity: 10,
          completed: true
        },
        {
          id: 2,
          title: 'Active low weight',
          urgency: 1,
          personalInterest: 1,
          executionTime: 1,
          complexity: 1,
          completed: false
        }
      ];

      const sorted = sortTasks(tasks);
      expect(sorted[0].title).toBe('Active low weight');
      expect(sorted[1].title).toBe('Completed high weight');
    });

    it('should maintain weight order within completed and active groups', () => {
      const tasks = [
        {
          id: 1,
          title: 'Completed high weight',
          urgency: 10,
          personalInterest: 10,
          executionTime: 10,
          complexity: 10,
          completed: true
        },
        {
          id: 2,
          title: 'Completed low weight',
          urgency: 1,
          personalInterest: 1,
          executionTime: 1,
          complexity: 1,
          completed: true
        },
        {
          id: 3,
          title: 'Active high weight',
          urgency: 10,
          personalInterest: 10,
          executionTime: 10,
          complexity: 10,
          completed: false
        },
        {
          id: 4,
          title: 'Active low weight',
          urgency: 1,
          personalInterest: 1,
          executionTime: 1,
          complexity: 1,
          completed: false
        }
      ];

      const sorted = sortTasks(tasks);
      expect(sorted[0].title).toBe('Active high weight');
      expect(sorted[1].title).toBe('Active low weight');
      expect(sorted[2].title).toBe('Completed high weight');
      expect(sorted[3].title).toBe('Completed low weight');
    });
  });
}); 