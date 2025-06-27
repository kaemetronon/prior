import { useState, useEffect } from 'react';
import { sortTasks } from '../utils/taskUtils';
import { backendUrl } from '../config';

export function getMoscowDateString(date = new Date()) {
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  const msk = new Date(utc + 3 * 60 * 60000);
  return msk.toISOString().split('T')[0];
}

export const useTasks = (initialDate) => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(initialDate || getMoscowDateString());

  useEffect(() => {
    fetch(`${backendUrl}/tasks/date/${currentDate}`)
      .then(res => res.json())
      .then(data => setTasks(sortTasks(data)))
      .catch(() => setTasks([]));
  }, [currentDate]);

  const addTask = async (task) => {
    const response = await fetch(`${backendUrl}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, date: currentDate })
    });
    const newTask = await response.json();
    setTasks(prev => sortTasks([...prev, newTask]));
    return newTask;
  };

  const updateTask = async (taskId, updatedTask) => {
    const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    const updatedTaskResponse = await response.json();
    setTasks(prev => sortTasks(prev.map(task => task.id === taskId ? updatedTaskResponse : task)));
    return updatedTaskResponse;
  };

  const deleteTask = async (taskId) => {
    await fetch(`${backendUrl}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const changeDate = (date) => {
    setCurrentDate(date);
  };

  return {
    tasks,
    currentDate,
    addTask,
    updateTask,
    deleteTask,
    changeDate,
  };
}; 