import { useAuth } from './useAuth';

export const request = async (token, url, options = {}, clearAuth) => {
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
      if (clearAuth) clearAuth();
      return;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const useApi = () => {
  const { token, clearAuth } = useAuth();

  const request = async (url, options = {}) => {
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
        return;
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  return { request };
}; 