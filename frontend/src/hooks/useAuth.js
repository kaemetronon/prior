import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TOKEN_KEY = 'jwt_token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(TOKEN_KEY));

  const login = useCallback((newToken) => {
    console.log('[useAuth] login called', newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    console.log('[useAuth] logout called');
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const clearAuth = useCallback(() => {
    console.log('[useAuth] clearAuth called');
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      console.log('[useAuth] useEffect: token restored', storedToken);
    } else {
      setToken(null);
      setIsAuthenticated(false);
      console.log('[useAuth] useEffect: no token in storage');
    }
  }, []);

  useEffect(() => {
    console.log('[useAuth] state changed', { token, isAuthenticated });
  }, [token, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, getAuthHeaders, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 