import { GetServerSideProps } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ShortLink } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { useEffect } from "react";
import { recordLinkClick } from "@/services/linkService";

// Client-side redirect component
export default function RedirectPage({ redirectUrl, shortCode }: { redirectUrl: string; shortCode: string }) {
  useEffect(() => {
    const handleRedirect = async () => {
      if (!redirectUrl || !shortCode) return;

      try {
        // First record the click
        console.log('Recording click for shortCode:', shortCode);
        await recordLinkClick(shortCode);
        console.log('Click recorded successfully, redirecting to:', redirectUrl);
        
        // Then redirect after a small delay to ensure the click is recorded
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 100);
      } catch (error) {
        console.error("Error recording click:", error);
        // Still redirect even if click recording fails
        window.location.href = redirectUrl;
      }
    };

    handleRedirect();
  }, [redirectUrl, shortCode]);
  
  return (
    <Layout title="Redirecting...">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting you...</h1>
        <p>If you are not redirected automatically, <a href={redirectUrl} className="text-blue-600 hover:underline">click here</a>.</p>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
    
    return {
      props: {
        redirectUrl,
        shortCode
      }
    };
  } catch (error) {
    console.error("Error in redirect:", error);
    
    return {
      notFound: true
    };
  }
};
