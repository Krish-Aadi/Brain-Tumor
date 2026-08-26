import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('neuroscan_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('neuroscan_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('neuroscan_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('neuroscan_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('neuroscan_token', token);
    } else {
      localStorage.removeItem('neuroscan_token');
    }
  }, [token]);

  const login = async (email, password, role = 'Researcher') => {
    // In production, this calls the FastAPI /auth/login endpoint
    // Provides immediate valid session for testing
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Research Scholar',
      email: email,
      role: role || 'Researcher',
      institution: 'NeuroImaging Research Lab',
      joinedDate: '2026-01-15',
      scansAnalyzed: 42
    };
    const mockToken = 'jwt_mock_token_' + Date.now();
    setUser(mockUser);
    setToken(mockToken);
    return { success: true, user: mockUser, token: mockToken };
  };

  const register = async (userData) => {
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: userData.fullName || 'New Researcher',
      email: userData.email,
      role: userData.role || 'Researcher',
      institution: userData.institution || 'Medical University AI Center',
      joinedDate: new Date().toISOString().split('T')[0],
      scansAnalyzed: 0
    };
    const mockToken = 'jwt_mock_token_' + Date.now();
    setUser(newUser);
    setToken(mockToken);
    return { success: true, user: newUser, token: mockToken };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
