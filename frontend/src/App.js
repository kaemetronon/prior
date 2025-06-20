import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import Task from './components/Task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const { 
    tasks, 
    currentDate, 
    addTask, 
    updateTask,
    deleteTask,
    changeDate
  } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleDateChange = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    changeDate(newDate.toISOString().split('T')[0]);
  };

  const handleAddTask = (taskData) => {
    addTask(taskData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDateChange(-1)}
              className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {new Date(currentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h1>
            <button
              onClick={() => handleDateChange(1)}
              className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            Add Task
          </button>
        </div>

        <div className="grid gap-4">
          <TaskList
            tasks={tasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
          {tasks.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No tasks for this date
            </div>
          )}
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
}

export default App; 