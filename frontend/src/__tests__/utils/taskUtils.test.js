import { calculateTaskWeight, sortTasks } from '../../utils/taskUtils';

describe('Task Utils', () => {
  describe('calculateTaskWeight', () => {
    it('should calculate weight correctly', () => {
      const task = {
        importance: 10,
        urgency: 10,
        personalInterest: 10,
        executionTime: 10,
        complexity: 10,
        concentration: 10
      };
      const weight = calculateTaskWeight(task);
      // (10*2.3 + 10*2 + 10*1.8 + 10*1.6 + 10*1.3 + 10*1) / 10 = 10
      expect(weight).toBeCloseTo(10, 5);
    });

    it('should calculate weight for minimum values', () => {
      const task = {
        importance: 1,
        urgency: 1,
        personalInterest: 1,
        executionTime: 1,
        complexity: 1,
        concentration: 1
      };
      const weight = calculateTaskWeight(task);
      // (1*2.3 + 1*2 + 1*1.8 + 1*1.6 + 1*1.3 + 1*1) / 10 = 1
      expect(weight).toBeCloseTo(1, 5);
    });

    it('should default importance to 3 if missing', () => {
      const task = {
        urgency: 5,
        personalInterest: 5,
        executionTime: 5,
        complexity: 5,
        concentration: 5
      };
      const weight = calculateTaskWeight(task);
      // (3*2.3 + 5*2 + 5*1.8 + 5*1.6 + 5*1.3 + 5*1) / 10
      const expected = (3*2.3 + 5*2 + 5*1.8 + 5*1.6 + 5*1.3 + 5*1) / 10;
      expect(weight).toBeCloseTo(expected, 5);
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