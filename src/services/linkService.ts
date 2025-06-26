import { db } from "@/lib/firebase";
import { ShortLink } from "@/types";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  updateDoc,
  increment,
  orderBy
} from "firebase/firestore";
import { nanoid } from "nanoid";

const LINKS_COLLECTION = "shortLinks";

// Generate a random short code if not provided
export const generateShortCode = (): string => {
  return nanoid(6); // Generates a 6-character random code
};

// Check if a short code is already taken
export const isShortCodeAvailable = async (shortCode: string): Promise<boolean> => {
  const linkRef = doc(db, LINKS_COLLECTION, shortCode);
  const linkSnap = await getDoc(linkRef);
  return !linkSnap.exists();
};

// Create a new short link
export const createShortLink = async (
  originalUrl: string, 
  shortCode: string = '', 
  userId?: string
): Promise<ShortLink | null> => {
  try {
    // If no short code is provided, generate one
    let finalShortCode = shortCode.trim() || generateShortCode();
    
    // Check if the short code is available
    if (!(await isShortCodeAvailable(finalShortCode))) {
      return null; // Short code is already taken
    }
    
    // Create the base link object without userId
    const newLink: Omit<ShortLink, 'userId'> & { userId?: string } = {
      id: finalShortCode,
      originalUrl,
      shortCode: finalShortCode,
      createdAt: Date.now(),
      clicks: 0
    };
    
    // Only add userId if it exists
    if (userId) {
      newLink.userId = userId;
    }
    
    // Save to Firestore with better error handling
    await setDoc(doc(db, LINKS_COLLECTION, finalShortCode), newLink);
    
    return newLink as ShortLink;
  } catch (error: any) {
    console.error('Error creating short link:', error);
    
    // Provide specific error messages based on error type
    if (error?.code === 'permission-denied') {
      throw new Error("You don't have permission to create links. Please sign in and try again.");
    } else if (error?.code === 'unavailable') {
      throw new Error("Service temporarily unavailable. Please try again in a moment.");
    } else {
      throw new Error("Failed to create short link. Please try again.");
    }
  }
};

// Get a short link by its code
export const getShortLink = async (shortCode: string): Promise<ShortLink | null> => {
  try {
    const linkRef = doc(db, LINKS_COLLECTION, shortCode);
    const linkSnap = await getDoc(linkRef);
    
    if (linkSnap.exists()) {
      return linkSnap.data() as ShortLink;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting short link:", error);
    return null;
  }
};

// Record a click on a short link
export const recordLinkClick = async (shortCode: string): Promise<void> => {
  try {
    const linkRef = doc(db, LINKS_COLLECTION, shortCode);
    await updateDoc(linkRef, {
      clicks: increment(1),
      lastClickedAt: Date.now()
    });
  } catch (error) {
    console.error("Error recording link click:", error);
  }
};

// Get all links for a user
export const getUserLinks = async (userId: string): Promise<ShortLink[]> => {
  try {
    // Use the indexed query with proper error handling
    const linksQuery = query(
      collection(db, LINKS_COLLECTION), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(linksQuery);
    const links: ShortLink[] = [];
    
    querySnapshot.forEach((doc) => {
      links.push(doc.data() as ShortLink);
    });
    
    return links;
  } catch (error: any) {
    // Check if it's an index error
    if (error?.code === 'failed-precondition' || error?.message?.includes('index')) {
      console.warn("Firestore index not ready yet, falling back to simple query:", error);
      
      try {
        // Fallback to simple query without orderBy
        const fallbackQuery = query(
          collection(db, LINKS_COLLECTION), 
          where("userId", "==", userId)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        const fallbackLinks: ShortLink[] = [];
        
        fallbackSnapshot.forEach((doc) => {
          fallbackLinks.push(doc.data() as ShortLink);
        });
        
        // Sort manually
        return fallbackLinks.sort((a, b) => b.createdAt - a.createdAt);
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        throw new Error("Unable to fetch your links. Please try again in a few moments.");
      }
    }
    
    // For other errors, provide a user-friendly message
    console.error("Error getting user links:", error);
    throw new Error("Failed to load your links. Please check your connection and try again.");
  }
};

// Update a short link
export const updateShortLink = async (
  oldShortCode: string,
  originalUrl: string,
  newShortCode: string,
  userId: string
): Promise<ShortLink | null> => {
  try {
    // Check if the link belongs to the user
    const linkRef = doc(db, LINKS_COLLECTION, oldShortCode);
    const linkSnap = await getDoc(linkRef);
    
    if (!linkSnap.exists() || linkSnap.data()?.userId !== userId) {
      return null; // Link doesn't exist or doesn't belong to the user
    }
    
    const linkData = linkSnap.data() as ShortLink;
    
    // If short code is changing, check availability and create new document
    if (oldShortCode !== newShortCode) {
      // Check if the new short code is available
      if (!(await isShortCodeAvailable(newShortCode))) {
        return null; // New short code is already taken
      }
      
      // Create new document with the new short code
      const updatedLink: ShortLink = {
        ...linkData,
        id: newShortCode,
        shortCode: newShortCode,
        originalUrl
      };
      
      await setDoc(doc(db, LINKS_COLLECTION, newShortCode), updatedLink);
      
      // Delete the old document
      await deleteDoc(linkRef);
      
      return updatedLink;
    } else {
      // Just update the original URL
      const updatedLink: ShortLink = {
        ...linkData,
        originalUrl
      };
      
      await updateDoc(linkRef, { originalUrl });
      
      return updatedLink;
    }
  } catch (error) {
    console.error("Error updating short link:", error);
    return null;
  }
};

// Delete a short link
export const deleteShortLink = async (shortCode: string, userId: string): Promise<boolean> => {
  try {
    // Check if the link belongs to the user
    const linkRef = doc(db, LINKS_COLLECTION, shortCode);
    const linkSnap = await getDoc(linkRef);
    
    if (!linkSnap.exists() || linkSnap.data()?.userId !== userId) {
      return false; // Link doesn't exist or doesn't belong to the user
    }
    
    // Delete the document
    await deleteDoc(linkRef);
    
    return true;
  } catch (error) {
    console.error("Error deleting short link:", error);
    return false;
  }
};
