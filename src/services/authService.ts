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
  signInWithPopup,
  browserPopupRedirectResolver
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
    
    // Add scopes for additional permissions if needed
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    
    // Set custom parameters for the auth provider
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Use the popup with explicit resolver to avoid common issues
    return await signInWithPopup(auth, provider, browserPopupRedirectResolver);
  } catch (error: any) {
    console.error("Google sign-in error:", error);
    
    // More detailed error handling
    if (error.code === "auth/cancelled-popup-request" || error.code === "auth/popup-closed-by-user") {
      throw new Error("Sign-in was cancelled");
    } else if (error.code === "auth/popup-blocked") {
      throw new Error("Sign-in popup was blocked by your browser");
    } else if (error.code === "auth/account-exists-with-different-credential") {
      throw new Error("An account already exists with the same email address but different sign-in credentials");
    } else if (error.code === "auth/unauthorized-domain") {
      throw new Error("This domain is not authorized for OAuth operations. Add your domain in the Firebase Console.");
    } else if (error.code === "auth/operation-not-allowed") {
      throw new Error("Google sign-in is not enabled. Enable it in the Firebase Console.");
    } else {
      // Pass the original error message for debugging
      throw new Error(`Google sign-in failed: ${error.message}`);
    }
  }
};