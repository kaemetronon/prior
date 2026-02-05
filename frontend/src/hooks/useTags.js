import { useEffect, useState } from 'react';
import { backendUrl } from '../config';
import { useApi } from './useApi';
import { useAuth } from './useAuth';

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const { request } = useApi();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTags = async () => {
      try {
        const res = await request(`${backendUrl}/tags`);
        if (!res) return;
        const data = await res.json();
        setTags(Array.isArray(data) ? data : []);
      } catch (e) {
        setTags([]);
      }
    };

    fetchTags();
  }, [isAuthenticated, request]);

  return { tags, setTags };
};
