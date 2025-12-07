'use client';

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { useAuthService, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signInAnonymously, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc } from 'firebase/firestore';

// Define the shape of our custom user object
type AuthUser = {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  isPro: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: AuthUser | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const mapFirebaseUserToAuthUser = (firebaseUser: FirebaseUser, proStatus: boolean = false): AuthUser => ({
    uid: firebaseUser.uid,
    name: firebaseUser.isAnonymous ? 'Anonymous User' : firebaseUser.displayName || 'User',
    email: firebaseUser.email || 'anonymous@example.com',
    avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/100/100`,
    isPro: proStatus,
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthService();
  const firestore = useFirestore();
  const { user: firebaseUser, isUserLoading: isFirebaseUserLoading } = useUser();
  
  const userDocRef = useMemoFirebase(() => firebaseUser ? doc(firestore, 'users', firebaseUser.uid) : null, [firestore, firebaseUser]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [appUser, setAppUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (firebaseUser) {
      const proStatus = (userProfile as { proStatus?: boolean })?.proStatus ?? false;
      setAppUser(mapFirebaseUserToAuthUser(firebaseUser, proStatus));
    } else {
      setAppUser(null);
    }
  }, [firebaseUser, userProfile]);

  const isAuthenticated = !!firebaseUser;

  const login = async () => {
    try {
      await signInAnonymously(auth);
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
      isLoading: isFirebaseUserLoading || (isAuthenticated && isProfileLoading),
    }),
    [isAuthenticated, isFirebaseUserLoading, isProfileLoading, appUser]
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
