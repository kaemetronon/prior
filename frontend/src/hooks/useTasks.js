import { useState, useEffect } from 'react';
import { backendUrl } from '../config';
import { useApi } from './useApi';
import { useAuth } from './useAuth';
import { sortTasks } from '../utils/taskUtils';

export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const useTasks = (initialDate, sortBy = 'weight', sortOrder = 'desc', selectedTags = []) => {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(initialDate || getLocalDateString());
  const { request } = useApi();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchTasks = async () => {
      try {
        const tagsParam = selectedTags && selectedTags.length ? `&tags=${encodeURIComponent(selectedTags.join(','))}` : '';
        const res = await request(`${backendUrl}/tasks/date/${currentDate}?sortBy=${sortBy}&sortOrder=${sortOrder}${tagsParam}`);
        if (res) {
          const data = await res.json();
          setTasks(sortTasks(data, sortBy, sortOrder));
        }
      } catch (e) {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [currentDate, request, isAuthenticated, sortBy, sortOrder, selectedTags]);

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
      const tagsParam = selectedTags && selectedTags.length ? `&tags=${encodeURIComponent(selectedTags.join(','))}` : '';
      const tasksResponse = await request(`${backendUrl}/tasks/date/${currentDate}?sortBy=${sortBy}&sortOrder=${sortOrder}${tagsParam}`);
      if (tasksResponse) {
        const updatedTasks = await tasksResponse.json();
        setTasks(sortTasks(updatedTasks, sortBy, sortOrder));
      }
      
      return newTask;
    } catch (e) {}
  };

  const updateTask = async (taskId, updatedTask) => {
    if (!isAuthenticated) return;
    
    // Оптимистичное обновление для completed - сразу обновляем локальное состояние
    if (updatedTask.hasOwnProperty('completed')) {
      setTasks(prev => {
        const updatedTasks = prev.map(task => 
          task.id === taskId ? { ...task, completed: updatedTask.completed } : task
        );
        return sortTasks(updatedTasks, sortBy, sortOrder);
      });
    }
    
    const url = `${backendUrl}/tasks/${taskId}`;
    const body = JSON.stringify(updatedTask);
    try {
      const response = await request(url, {
        method: 'PUT',
        body
      });
      if (!response) return;
      const updatedTaskResponse = await response.json();
      
      // Обновляем с данными с сервера и применяем сортировку
      setTasks(prev => {
        const updatedTasks = prev.map(task => task.id === taskId ? updatedTaskResponse : task);
        return sortTasks(updatedTasks, sortBy, sortOrder);
      });
      
      return updatedTaskResponse;
    } catch (e) {
      // В случае ошибки откатываем изменения
      if (updatedTask.hasOwnProperty('completed')) {
        setTasks(prev => {
          const updatedTasks = prev.map(task => 
            task.id === taskId ? { ...task, completed: !updatedTask.completed } : task
          );
          return sortTasks(updatedTasks, sortBy, sortOrder);
        });
      }
    }
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