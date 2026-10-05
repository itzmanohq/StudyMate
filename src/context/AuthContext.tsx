// src/context/AuthContext.tsx - Authentication state & Google Sign-In manager
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured, db, firebaseConfig } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '../types';
import { INITIAL_USERS } from '../services/mockData';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  authError: string | null;
  isOnline: boolean;
  isDemoUser: boolean;
  signInWithGoogle: () => Promise<void>;
  signInDemoUser: (role: 'owner' | 'brother') => void;
  signOutUser: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    if (!auth) {
      // If Firebase Auth is not initialized, check for explicit demo user session only
      const savedDemoUserId = localStorage.getItem('studymate_active_demo_uid');
      if (savedDemoUserId) {
        const found = INITIAL_USERS.find((u) => u.id === savedDemoUserId);
        if (found) {
          setUser(found);
          setIsDemoUser(true);
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setFirebaseUser(fbUser);
        setIsDemoUser(false);
        try {
          // Check Firestore user doc
          if (db) {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              setUser(userDoc.data() as UserProfile);
            } else {
              // Create new user profile document in Firestore
              const newProfile: UserProfile = {
                id: fbUser.uid, // Firebase UID as primary key
                name: fbUser.displayName || 'StudyMate Scholar',
                email: fbUser.email || '',
                avatarUrl: fbUser.photoURL || undefined,
                googleId: fbUser.uid,
                role: 'owner',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              await setDoc(userDocRef, newProfile);
              setUser(newProfile);
            }
          } else {
            // Fallback profile from Firebase user info
            setUser({
              id: fbUser.uid,
              name: fbUser.displayName || 'StudyMate Scholar',
              email: fbUser.email || '',
              avatarUrl: fbUser.photoURL || undefined,
              role: 'owner',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err: any) {
          console.error('Error synchronizing user profile with Firestore:', err);
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || 'StudyMate Scholar',
            email: fbUser.email || '',
            avatarUrl: fbUser.photoURL || undefined,
            role: 'owner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        setFirebaseUser(null);
        // Only load demo user if explicitly stored from manual demo button click
        const savedDemoUserId = localStorage.getItem('studymate_active_demo_uid');
        if (savedDemoUserId) {
          const found = INITIAL_USERS.find((u) => u.id === savedDemoUserId);
          if (found) {
            setUser(found);
            setIsDemoUser(true);
          } else {
            setUser(null);
            setIsDemoUser(false);
          }
        } else {
          setUser(null);
          setIsDemoUser(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);

    if (!auth || !googleProvider || !firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_') || firebaseConfig.apiKey.includes('placeholder')) {
      setAuthError(
        'Valid Firebase API Key is required. Please replace "your_firebase_api_key" in .env with your real Web API Key from the Firebase Console.'
      );
      setLoading(false);
      return;
    }

    try {
      // Clear any prior demo session so real Firebase login takes full precedence
      localStorage.removeItem('studymate_active_demo_uid');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsDemoUser(false);
      }
    } catch (err: any) {
      console.error('Firebase Google Sign-In failed:', err);
      let message = err.message || 'Failed to sign in with Google. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in popup was closed before completing.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        message = 'Only one sign-in popup request can be open at a time.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Sign-in popup was blocked by the browser. Please allow popups for this site.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = `Domain "${window.location.hostname}" is not authorized in Firebase Console (Authentication > Settings > Authorized domains).`;
      } else if (err.code === 'auth/invalid-api-key' || err.code === 'auth/api-key-not-valid') {
        message = 'Firebase API Key is invalid or expired. Check VITE_FIREBASE_API_KEY in .env.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Google Sign-In is not enabled in Firebase Console (Authentication > Sign-in method).';
      }
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  const signInDemoUser = (role: 'owner' | 'brother') => {
    const selected = role === 'brother' ? INITIAL_USERS[1] : INITIAL_USERS[0];
    localStorage.setItem('studymate_active_demo_uid', selected.id);
    setUser(selected);
    setIsDemoUser(true);
    setAuthError(null);
  };

  const signOutUser = async () => {
    setLoading(true);
    localStorage.removeItem('studymate_active_demo_uid');
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Sign-out error:', err);
      }
    }
    setUser(null);
    setFirebaseUser(null);
    setIsDemoUser(false);
    setLoading(false);
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        authError,
        isOnline,
        isDemoUser,
        signInWithGoogle,
        signInDemoUser,
        signOutUser,
        clearAuthError,
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
