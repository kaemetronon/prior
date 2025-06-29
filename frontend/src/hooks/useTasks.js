import { useState, useEffect } from 'react';
import { sortTasks } from '../utils/taskUtils';
import { backendUrl } from '../config';

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useTasks = (initialDate, getAuthHeaders, isAuthenticated) => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(initialDate || getLocalDateString());

  useEffect(() => {
    if (!isAuthenticated || !getAuthHeaders) return;
    
    fetch(`${backendUrl}/tasks/date/${currentDate}`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => setTasks(sortTasks(data)))
      .catch(() => setTasks([]));
  }, [currentDate, getAuthHeaders, isAuthenticated]);

  const addTask = async (task) => {
    if (!isAuthenticated) return;
    
    const response = await fetch(`${backendUrl}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...task, date: currentDate })
    });
    
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    
    const newTask = await response.json();
    setTasks(prev => sortTasks([...prev, newTask]));
    return newTask;
  };

  const updateTask = async (taskId, updatedTask) => {
    if (!isAuthenticated) return;
    
    const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedTask)
    });
    
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    
    const updatedTaskResponse = await response.json();
    setTasks(prev => sortTasks(prev.map(task => task.id === taskId ? updatedTaskResponse : task)));
    return updatedTaskResponse;
  };

  const deleteTask = async (taskId) => {
    if (!isAuthenticated) return;
    
    const response = await fetch(`${backendUrl}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    
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