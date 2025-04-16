
import { GetServerSideProps } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { ShortLink } from "@/types";

// This component doesn't render anything visible
// It's just a placeholder for the server-side redirect
export default function RedirectPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const shortCode = params?.shortCode as string;
  
  if (!shortCode) {
    return {
      notFound: true
    };
  }
  
  try {
    // Get the short link directly from Firestore
    const linkRef = doc(db, "shortLinks", shortCode);
    const linkSnap = await getDoc(linkRef);
    
    if (!linkSnap.exists()) {
      return {
        notFound: true
      };
    }
    
    const linkData = linkSnap.data() as ShortLink;
    
    // Make sure the URL has a protocol
    let redirectUrl = linkData.originalUrl;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }
    
    // Record the click (don't await to avoid delaying the redirect)
    try {
      // Use a separate try/catch to prevent redirect failures if click tracking fails
      updateDoc(linkRef, {
        clicks: increment(1),
        lastClickedAt: Date.now()
      }).catch(err => {
        console.error("Error recording link click:", err);
      });
    } catch (clickError) {
      // Don't let click recording errors affect the redirect
      console.error("Error updating click count:", clickError);
    }
    
    // Return a redirect instead of using res.writeHead
    return {
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    };
  } catch (error) {
    console.error("Error in redirect:", error);
    
    return {
      notFound: true
    };
  }
};
