import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user') || localStorage.getItem('travel_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.me();
          if (res?.data) {
            setUser(res.data);
          }
        } catch (err) {
          if (err?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      closeAuthModal();
      return res.data.user;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      closeAuthModal();
      return res.data.user;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const googleLogin = async (data) => {
    const res = await authService.googleLogin(data);
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      closeAuthModal();
      return res.data.user;
    }
    throw new Error(res?.message || 'Google login failed');
  };

  const facebookLogin = async (data) => {
    const res = await authService.facebookLogin(data);
    if (res?.data?.token && res?.data?.user) {
      setToken(res.data.token);
      setUser(res.data.user);
      closeAuthModal();
      return res.data.user;
    }
    throw new Error(res?.message || 'Facebook login failed');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res?.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error(res?.message || 'Profile update failed');
  };

  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await authService.uploadAvatar(formData);
    if (res?.data) {
      setUser(res.data);
      return res.data;
    }
    throw new Error(res?.message || 'Avatar upload failed');
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: 'login' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        googleLogin,
        facebookLogin,
        logout,
        updateProfile,
        uploadAvatar,
        authModal,
        openAuthModal,
        closeAuthModal,
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
