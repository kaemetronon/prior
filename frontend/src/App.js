import React, { useState } from 'react';
import { useTasks, getLocalDateString } from './hooks/useTasks';
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
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    changeDate(getLocalDateString(date));
  };

  const handleAddTask = (taskData) => {
    addTask(taskData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => window.location.reload()}
              className="bg-white p-3 sm:p-2 rounded-lg shadow hover:shadow-md transition-shadow text-lg sm:text-base"
              title="Обновить страницу"
            >
              ⟳
            </button>
            <button
              onClick={() => handleDateChange(-1)}
              className="bg-white p-3 sm:p-2 rounded-lg shadow hover:shadow-md transition-shadow text-lg sm:text-base"
            >
              ←
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 flex-1 sm:w-auto text-center px-2">
              {new Date(currentDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h1>
            <button
              onClick={() => handleDateChange(1)}
              className="bg-white p-3 sm:p-2 rounded-lg shadow hover:shadow-md transition-shadow text-lg sm:text-base"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg shadow hover:shadow-md transition-shadow text-base sm:text-sm font-medium w-full sm:w-auto"
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