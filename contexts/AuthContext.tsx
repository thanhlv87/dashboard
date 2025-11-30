import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  /**
   * Sign up with email and password
   */
  const signup = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        displayName,
        photoURL: userCredential.user.photoURL || '',
        createdAt: Timestamp.now()
      });
    }

    return userCredential;
  };

  /**
   * Logout current user
   */
  const logout = async (): Promise<void> => {
    return signOut(auth);
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email);
  };

  /**
   * Update user profile (display name and photo URL)
   */
  const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    if (!currentUser) throw new Error('No user logged in');

    await updateProfile(currentUser, {
      displayName,
      ...(photoURL && { photoURL })
    });

    // Update Firestore user document
    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        displayName,
        ...(photoURL && { photoURL }),
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // If user exists, ensure their Firestore document exists
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // Create user document if it doesn't exist
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName || 'User',
            photoURL: user.photoURL || '',
            createdAt: Timestamp.now()
          });
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
