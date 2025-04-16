import { GetServerSideProps } from "next";
import { getShortLink, recordLinkClick } from "@/services/linkService";

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
    // Get the short link from the database
    const link = await getShortLink(shortCode);
    
    if (!link) {
      return {
        notFound: true
      };
    }
    
    // Record the click (don't await to avoid delaying the redirect)
    recordLinkClick(shortCode).catch(err => {
      console.error("Error recording link click:", err);
      // Don't let click recording errors affect the redirect
    });
    
    // Redirect to the original URL
    res.writeHead(302, {
      Location: link.originalUrl
    });
    res.end();
    
    return {
      props: {}
    };
  } catch (error) {
    console.error("Error in redirect:", error);
    
    return {
      notFound: true
    };
  }
};