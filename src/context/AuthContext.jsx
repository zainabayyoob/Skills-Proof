import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillproof_jwt_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register'
  const [oauthError, setOauthError] = useState(null);

  const clearOauthError = () => setOauthError(null);

  // Load user session on boot and inspect OAuth callback tokens
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check for incoming OAuth callback parameters in search or hash query
      const searchParams = new URLSearchParams(window.location.search);
      let authToken = searchParams.get('auth_token') || searchParams.get('token');
      let authError = searchParams.get('auth_error') || searchParams.get('authError');

      if (!authToken && !authError && window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.substring(window.location.hash.indexOf('?') + 1);
        const hashParams = new URLSearchParams(hashQuery);
        authToken = hashParams.get('auth_token') || hashParams.get('token');
        authError = hashParams.get('auth_error') || hashParams.get('authError');
      }

      if (authToken) {
        localStorage.setItem('skillproof_jwt_token', authToken);
        setToken(authToken);
        try {
          const cleanHash = window.location.hash.split('?')[0] || '#/';
          const cleanUrl = window.location.pathname + (cleanHash !== '#/' ? cleanHash : '#/');
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (e) {
          console.warn('Failed to clean OAuth URL params:', e);
        }
      } else if (authError) {
        const errorMap = {
          access_denied: 'Google sign-in was cancelled.',
          missing_code: 'Google sign-in could not be completed (missing authorization code).',
          token_exchange_failed: 'Google sign-in failed during token exchange with Google.',
          userinfo_failed: 'Google sign-in failed while retrieving your user profile from Google.',
          email_not_verified: 'Your Google email address is not verified.',
          provider_credentials_required: 'Google OAuth is not configured on the server. Please check .env credentials.',
          oauth_failed: 'Google authentication encountered an unexpected error.'
        };
        const message = errorMap[authError] || `Google sign-in error: ${authError}`;
        setOauthError(message);
        setAuthModalTab('login');
        setAuthModalOpen(true);
        try {
          const cleanHash = window.location.hash.split('?')[0] || '#/';
          const cleanUrl = window.location.pathname + (cleanHash !== '#/' ? cleanHash : '#/');
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (e) {
          console.warn('Failed to clean OAuth URL params:', e);
        }
      }

      const activeToken = authToken || localStorage.getItem('skillproof_jwt_token');
      if (activeToken) {
        try {
          const data = await api.auth.getMe();
          if (data && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('skillproof_jwt_token');
            setToken(null);
            setUser(null);
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
      // Close modal on successful authentication unless verification is explicitly required
      if (data.requireVerification !== true || (data.user.emailVerified && data.user.phoneVerified)) {
        setAuthModalOpen(false);
      }
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
        setUser,
        oauthError,
        clearOauthError
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
