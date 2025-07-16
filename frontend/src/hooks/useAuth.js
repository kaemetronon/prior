import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TOKEN_KEY = 'jwt_token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(TOKEN_KEY));

  const login = useCallback((newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const clearAuth = useCallback(() => {
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
    } else {
      setToken(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    // state changed
  }, [token, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, getAuthHeaders, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 