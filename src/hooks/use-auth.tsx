'use client';

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

type AuthUser = {
  name: string;
  email: string;
  avatarUrl: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: AuthUser | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const user = isAuthenticated
    ? {
        name: 'Demo User',
        email: 'demo@ipop.com',
        avatarUrl: 'https://picsum.photos/seed/user/100/100',
      }
    : null;

  const login = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 1000); // Simulate network delay
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      user,
      isLoading,
    }),
    [isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
