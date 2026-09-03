import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { tokenStorage } from '../services/tokenStorage.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [token, setToken] = useState(() => tokenStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.getAccessToken();
      if (storedToken) {
        try {
          const profile = await authService.getCurrentUser();
          setUser(profile);
          setToken(storedToken);
        } catch {
          // Token expired or invalid
          tokenStorage.clearTokens();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    setUser(result.user);
    setToken(result.token);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    warehouse: user?.warehouse || null,
    warehouseId: user?.warehouse_id || '',
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
