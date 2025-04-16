
import { GetServerSideProps } from "next";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { ShortLink } from "@/types";
import { Layout } from "@/components/layout/Layout";

// This component will render a loading message if for some reason
// the redirect doesn't happen immediately
export default function RedirectPage() {
  return (
    <Layout title="Redirecting...">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting you...</h1>
        <p>If you are not redirected automatically, please click the link you were trying to access again.</p>
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
      updateDoc(linkRef, {
        clicks: increment(1),
        lastClickedAt: Date.now()
      }).catch(err => {
        console.error("Error recording link click:", err);
      });
    } catch (clickError) {
      console.error("Error updating click count:", clickError);
    }
    
    // Use a client-side redirect approach instead
    return {
      props: {
        redirectUrl: encodeURI(redirectUrl)
      },
      redirect: {
        destination: redirectUrl,
        permanent: false
      }
    };
  } catch (error) {
    console.error("Error in redirect:", error);
    
    return {
      notFound: true
    };
  }
};
