import { useState, useEffect } from 'react';
import { sortTasks } from '../utils/taskUtils';
import { backendUrl } from '../config';
import { request } from './useApi';

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useTasks = (initialDate, token, clearAuth) => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(initialDate || getLocalDateString());

  useEffect(() => {
    if (!token) return;
    const url = `${backendUrl}/tasks/date/${currentDate}`;
    request(token, url, {}, clearAuth)
      .then(res => {
        if (res) {
          return res.json();
        }
      })
      .then(data => {
        if (data) setTasks(sortTasks(data));
      })
      .catch((err) => {
        setTasks([]);
      });
  }, [currentDate, token, clearAuth]);

  const addTask = async (task) => {
    if (!token) return;
    const url = `${backendUrl}/tasks`;
    const body = JSON.stringify({ ...task, date: currentDate });
    const response = await request(token, url, {
      method: 'POST',
      body
    }, clearAuth);
    if (!response) return;
    const newTask = await response.json();
    setTasks(prev => sortTasks([...prev, newTask]));
    return newTask;
  };

  const updateTask = async (taskId, updatedTask) => {
    if (!token) return;
    const url = `${backendUrl}/tasks/${taskId}`;
    const body = JSON.stringify(updatedTask);
    const response = await request(token, url, {
      method: 'PUT',
      body
    }, clearAuth);
    if (!response) return;
    const updatedTaskResponse = await response.json();
    setTasks(prev => sortTasks(prev.map(task => task.id === taskId ? updatedTaskResponse : task)));
    return updatedTaskResponse;
  };

  const deleteTask = async (taskId) => {
    if (!token) return;
    const url = `${backendUrl}/tasks/${taskId}`;
    const response = await request(token, url, {
      method: 'DELETE'
    }, clearAuth);
    if (!response) return;
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