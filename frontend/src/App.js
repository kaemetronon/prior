import React, { useState } from 'react';
import { useTasks, getLocalDateString } from './hooks/useTasks';
import { useAuth } from './hooks/useAuth';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import LoginForm from './components/LoginForm';

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const {
    tasks,
    currentDate,
    addTask,
    updateTask,
    deleteTask,
    changeDate
  } = useTasks(null);

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const handleDateChange = (days) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    changeDate(getLocalDateString(date));
  };

  const handleAddTask = async (taskData) => {
    await addTask(taskData);
  };

  const handleUpdateTask = async (taskId, taskData) => {
    await updateTask(taskId, taskData);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-3 sm:gap-4">
          <div className="flex items-center space-x-1 sm:space-x-4 w-full sm:w-auto">
            <button
              onClick={() => window.location.reload()}
              className="bg-white p-2 sm:p-2 rounded-lg shadow hover:shadow-md transition-shadow text-base sm:text-base"
              title="Обновить страницу"
            >
              ⟳
            </button>
            <button
              onClick={() => handleDateChange(-1)}
              className="bg-white p-2 sm:p-2 rounded-lg shadow hover:shadow-md transition-shadow text-base sm:text-base"
            >
              ←
            </button>
            <div className="flex-1 sm:flex-none sm:w-80 text-center px-1 sm:px-2">
              <h1 className="text-sm sm:text-2xl font-bold text-gray-800">
                {new Date(currentDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h1>
            </div>
            <button
              onClick={() => handleDateChange(1)}
              className="bg-white p-2 sm:p-2 rounded-lg shadow hover:shadow-md transition-shadow text-base sm:text-base"
            >
              →
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:shadow-md transition-shadow text-sm sm:text-sm font-medium"
            >
              Add Task
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 sm:px-4 sm:py-2 rounded-lg shadow hover:shadow-md transition-shadow text-sm sm:text-sm font-medium"
            >
              Выйти
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
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