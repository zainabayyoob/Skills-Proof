import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillproof_jwt_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'

  // Load user session on boot
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('skillproof_jwt_token');
      if (storedToken) {
        try {
          const data = await api.auth.getMe();
          if (data && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('skillproof_jwt_token');
            setToken(null);
          }
        } catch (err) {
          console.warn('Session expired or invalid, logging out:', err.message);
          localStorage.removeItem('skillproof_jwt_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await api.auth.login(credentials);
    if (data.token && data.user) {
      localStorage.setItem('skillproof_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setAuthModalOpen(false);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.auth.register(userData);
    if (data.token && data.user) {
      localStorage.setItem('skillproof_jwt_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setAuthModalOpen(false);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('skillproof_jwt_token');
    setToken(null);
    setUser(null);
  };

  const loadDemoPreset = async () => {
    try {
      const data = await api.auth.loadDemoPreset();
      if (data.token && data.user) {
        localStorage.setItem('skillproof_jwt_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setAuthModalOpen(false);
      }
      return data;
    } catch (err) {
      console.error('Failed to load demo preset:', err);
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const data = await api.auth.getMe();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loadDemoPreset,
        refreshUser,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setAuthModalTab,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
