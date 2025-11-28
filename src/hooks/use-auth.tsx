'use client';

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useAuthService, useUser } from '@/firebase';
import { signInAnonymously, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

// Define the shape of our custom user object
type AuthUser = {
  uid: string;
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

// This function maps the Firebase User object to our app-specific AuthUser object
const mapFirebaseUserToAuthUser = (firebaseUser: User): AuthUser => ({
    uid: firebaseUser.uid,
    name: firebaseUser.isAnonymous ? 'Anonymous User' : firebaseUser.displayName || 'User',
    email: firebaseUser.email || 'anonymous@example.com',
    avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthService(); // Get the Firebase Auth instance
  const { user: firebaseUser, isUserLoading: isFirebaseUserLoading } = useUser(); // Get the Firebase user state
  const [appUser, setAppUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (firebaseUser) {
      setAppUser(mapFirebaseUserToAuthUser(firebaseUser));
    } else {
      setAppUser(null);
    }
  }, [firebaseUser]);

  const isAuthenticated = !!firebaseUser;

  const login = async () => {
    try {
      await signInAnonymously(auth);
      // onAuthStateChanged in FirebaseProvider will handle the rest
    } catch (error) {
      console.error("Anonymous sign-in failed", error);
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out failed", error);
    }
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      user: appUser,
      isLoading: isFirebaseUserLoading,
    }),
    [isAuthenticated, isFirebaseUserLoading, appUser]
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
