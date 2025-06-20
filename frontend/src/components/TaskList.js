import React from 'react';
import Task from './Task';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Task
          key={task.id}
          task={task}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList; 