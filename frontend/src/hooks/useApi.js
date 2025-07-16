import { useAuth } from './useAuth';
import { useCallback } from 'react';

export const useApi = () => {
  const { token, clearAuth } = useAuth();

  const request = useCallback(
    async (url, options = {}) => {
      const headers = {
        ...(options.headers || {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      };
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });
        if (response.status === 401) {
          clearAuth();
          throw new Error('Unauthorized');
        }
        return response;
      } catch (error) {
        if (error.message === 'Unauthorized') {
          // Можно обработать редирект или показать сообщение
        }
        throw error;
      }
    },
    [token, clearAuth]
  );

  return { request };
}; 