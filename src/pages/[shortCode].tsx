import { GetServerSideProps } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { ShortLink } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { useEffect } from "react";
import { useRouter } from "next/router";

// Client-side redirect component
export default function RedirectPage({ redirectUrl }: { redirectUrl: string }) {
  const router = useRouter();
  
  useEffect(() => {
    // Client-side redirect
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);
  
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
    
    // Record the click (don't await to avoid delaying the redirect)
    try {
      await updateDoc(linkRef, {
        clicks: increment(1),
        lastClickedAt: Date.now()
      });
      console.log(`Click recorded for ${shortCode}`);
    } catch (clickError) {
      console.error("Error updating click count:", clickError);
    }
    
    // Return the redirect URL as a prop instead of using Next.js redirect
    return {
      props: {
        redirectUrl
      }
    };
  } catch (error) {
    console.error("Error in redirect:", error);
    
    return {
      notFound: true
    };
  }
};
