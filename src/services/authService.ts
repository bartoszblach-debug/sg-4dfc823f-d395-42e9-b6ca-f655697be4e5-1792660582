import { auth } from "@/lib/firebase";
import { User } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  sendPasswordResetEmail
} from "firebase/auth";

// Register a new user
export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Sign in a user
export const signInUser = async (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out the current user
export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};

// Get the current user
export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || undefined
  };
};

// Listen for auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || undefined
      });
    } else {
      callback(null);
    }
  });
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};