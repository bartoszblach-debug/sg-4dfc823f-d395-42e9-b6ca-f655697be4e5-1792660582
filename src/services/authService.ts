import { auth } from "@/lib/firebase";
import { User } from "@/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

// Register a new user
export const registerUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    // Enhanced error handling
    if (error.code === "auth/invalid-api-key" || error.message?.includes("API key")) {
      console.error("Firebase API key configuration error:", error);
      throw new Error("Authentication service configuration error");
    }
    throw error;
  }
};

// Sign in a user
export const signInUser = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    // Enhanced error handling
    if (error.code === "auth/invalid-api-key" || error.message?.includes("API key")) {
      console.error("Firebase API key configuration error:", error);
      throw new Error("Authentication service configuration error");
    }
    throw error;
  }
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
  try {
    return await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    // Enhanced error handling
    if (error.code === "auth/invalid-api-key" || error.message?.includes("API key")) {
      console.error("Firebase API key configuration error:", error);
      throw new Error("Authentication service configuration error");
    }
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    
    // Enhanced error handling
    if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled");
    } else if (error.code === "auth/popup-blocked") {
      throw new Error("Sign-in popup was blocked by your browser");
    } else if (error.code === "auth/account-exists-with-different-credential") {
      throw new Error("An account already exists with the same email address but different sign-in credentials");
    } else {
      throw error;
    }
  }
};