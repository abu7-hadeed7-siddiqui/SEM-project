import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('learnova_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load profile if token exists
  useEffect(() => {
    async function loadInitialProfile() {
      if (token) {
        try {
          const res = await api.profile.get();
          if (res.success) {
            setUser(res.user);
            setProfile(res.profile);
            localStorage.setItem('learnova_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Could not load profile with stored token:', err.message);
        }
      }
      setLoading(false);
    }

    loadInitialProfile();

    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      setProfile(null);
      localStorage.removeItem('learnova_token');
      localStorage.removeItem('learnova_user');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('learnova_token', res.token);
      localStorage.setItem('learnova_user', JSON.stringify(res.user));

      // Fetch profile
      try {
        const profRes = await api.profile.get();
        if (profRes.success) {
          setProfile(profRes.profile);
        }
      } catch (e) {
        console.error('Failed to fetch profile after login', e);
      }
      return res;
    }
    throw new Error(res.error || 'Login failed');
  };

  const register = async (name, email, password) => {
    const res = await api.auth.register(name, email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('learnova_token', res.token);
      localStorage.setItem('learnova_user', JSON.stringify(res.user));

      // Fetch initial empty profile
      try {
        const profRes = await api.profile.get();
        if (profRes.success) {
          setProfile(profRes.profile);
        }
      } catch (e) {
        console.error('Failed to fetch profile after register', e);
      }
      return res;
    }
    throw new Error(res.error || 'Registration failed');
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      // Ignore API logout error, clear locally
    }
    setToken(null);
    setUser(null);
    setProfile(null);
    localStorage.removeItem('learnova_token');
    localStorage.removeItem('learnova_user');
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const res = await api.profile.get();
      if (res.success) {
        setUser(res.user);
        setProfile(res.profile);
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  const value = {
    user,
    profile,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshProfile,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
