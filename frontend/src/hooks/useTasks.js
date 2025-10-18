import { useState, useEffect } from 'react';
import { backendUrl } from '../config';
import { useApi } from './useApi';
import { useAuth } from './useAuth';

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useTasks = (initialDate, sortBy = 'weight', sortOrder = 'desc') => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(initialDate || getLocalDateString());
  const { request } = useApi();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchTasks = async () => {
      try {
        const res = await request(`${backendUrl}/tasks/date/${currentDate}?sortBy=${sortBy}&sortOrder=${sortOrder}`);
        if (res) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (e) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [currentDate, request, isAuthenticated, sortBy, sortOrder]);

  const addTask = async (task) => {
    if (!isAuthenticated) return;
    const url = `${backendUrl}/tasks`;
    const body = JSON.stringify({ ...task, date: currentDate });
    try {
      const response = await request(url, {
        method: 'POST',
        body
      });
      if (!response) return;
      const newTask = await response.json();
      
      // Запрашиваем актуальный список задач после создания для правильной сортировки
      const tasksResponse = await request(`${backendUrl}/tasks/date/${currentDate}?sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (tasksResponse) {
        const updatedTasks = await tasksResponse.json();
        setTasks(updatedTasks);
      }
      
      return newTask;
    } catch (e) {}
  };

  const updateTask = async (taskId, updatedTask) => {
    if (!isAuthenticated) return;
    const url = `${backendUrl}/tasks/${taskId}`;
    const body = JSON.stringify(updatedTask);
    try {
      const response = await request(url, {
        method: 'PUT',
        body
      });
      if (!response) return;
      const updatedTaskResponse = await response.json();
      setTasks(prev => prev.map(task => task.id === taskId ? updatedTaskResponse : task));
      return updatedTaskResponse;
    } catch (e) {}
  };

  const deleteTask = async (taskId) => {
    if (!isAuthenticated) return;
    const url = `${backendUrl}/tasks/${taskId}`;
    try {
      const response = await request(url, {
        method: 'DELETE'
      });
      if (!response) return;
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (e) {}
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