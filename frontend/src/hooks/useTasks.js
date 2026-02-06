import { useState, useEffect, useMemo } from 'react';
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

  // cache: date -> tasks[] (as received from backend)
  const [tasksCacheByDate, setTasksCacheByDate] = useState({});
  const [cacheVersion, setCacheVersion] = useState(0);

  const { request } = useApi();
  const { isAuthenticated } = useAuth();

  const cachedTasksForDate = tasksCacheByDate[currentDate];

  // 1) Fetch tasks for date once and keep in frontend cache.
  // 2) Tag filtering happens locally (no backend request).
  // Cache is invalidated on create/update/delete (simple approach).
  useEffect(() => {
    if (!isAuthenticated) return;
    if (cachedTasksForDate) return;

    const fetchTasks = async () => {
      try {
        const res = await request(`${backendUrl}/tasks/date/${currentDate}`);
        if (!res) return;
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        setTasksCacheByDate((prev) => ({ ...prev, [currentDate]: arr }));
      } catch (e) {
        setTasksCacheByDate((prev) => ({ ...prev, [currentDate]: [] }));
      }
    };

    fetchTasks();
  }, [currentDate, request, isAuthenticated, cachedTasksForDate, cacheVersion]);

  const filteredAndSortedTasks = useMemo(() => {
    const base = cachedTasksForDate || [];
    const selected = (selectedTags || []).filter(Boolean);

    // OR filter: task matches if it has ANY of selected tags
    const filtered = selected.length
      ? base.filter((t) => {
          const tags = Array.isArray(t.tags) ? t.tags : [];
          return tags.some((tag) => selected.includes(tag));
        })
      : base;

    return sortTasks(filtered, sortBy, sortOrder);
  }, [cachedTasksForDate, selectedTags, sortBy, sortOrder]);

  useEffect(() => {
    setTasks(filteredAndSortedTasks);
  }, [filteredAndSortedTasks]);

  const invalidateCache = () => {
    setTasksCacheByDate({});
    setCacheVersion((v) => v + 1);
  };

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
      invalidateCache();
      return newTask;
    } catch (e) {}
  };

  const updateTask = async (taskId, updatedTask) => {
    if (!isAuthenticated) return;

    // Optimistic update for completed only (keeps UI snappy)
    if (updatedTask.hasOwnProperty('completed')) {
      setTasks((prev) => {
        const updated = prev.map((task) => (task.id === taskId ? { ...task, completed: updatedTask.completed } : task));
        return sortTasks(updated, sortBy, sortOrder);
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
      invalidateCache();
      return updatedTaskResponse;
    } catch (e) {
      // rollback optimistic completed
      if (updatedTask.hasOwnProperty('completed')) {
        setTasks((prev) => {
          const updated = prev.map((task) => (task.id === taskId ? { ...task, completed: !updatedTask.completed } : task));
          return sortTasks(updated, sortBy, sortOrder);
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
      invalidateCache();
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
