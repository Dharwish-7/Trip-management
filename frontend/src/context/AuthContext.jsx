import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  // Check existing session
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const profile = await api.getCurrentUser();
          setUser(profile);
        } catch (err) {
          console.warn('Session expired or invalid token', err);
          logout();
        }
      } else {
        // Auto-login with Demo Traveler so the user can immediately play with the app!
        try {
          const res = await api.login({ email: 'traveler@example.com', password: 'pass123' });
          setStoredToken(res.token);
          setToken(res.token);
          setUser(res.user);
        } catch (e) {
          // Fallback
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  };

  // Instant switch between Traveler & Govt Official
  const switchRole = async (targetRole) => {
    if (targetRole === 'official') {
      return login('official@govt.gov', 'admin123');
    } else {
      return login('traveler@example.com', 'pass123');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      switchRole,
      isAuthenticated: !!user,
      isOfficial: user?.role === 'official',
      isTraveler: user?.role === 'traveler'
    }}>
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
