import { useEffect, useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { getUserLinks } from "@/services/linkService";
import { ShortLink } from "@/types";
import { LinkShortener } from "@/components/LinkShortener";
import { LinkItem } from "@/components/LinkItem";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("links");

  // Use useCallback to memoize the fetchLinks function
  const fetchLinks = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userLinks = await getUserLinks(user.uid);
      setLinks(userLinks);
    } catch (err) {
      console.error("Error getting user links:", err);
      setError("Failed to load your links. Please try again. If this persists, try refreshing the page.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Fetch user's links
    if (user) {
      fetchLinks();
    }
  }, [user, fetchLinks]);

  const switchToCreateTab = () => {
    setActiveTab("create");
  };

  const switchToLinksTab = () => {
    setActiveTab("links");
  };
  
  // Handle link creation in the dashboard
  const handleLinkCreated = () => {
    // Fetch the updated links
    fetchLinks();
    
    // Switch to the links tab after a short delay
    setTimeout(() => {
      switchToLinksTab();
    }, 1000);
  };

  if (authLoading) {
    return (
      <Layout title="Dashboard - shrlink">
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout title='Dashboard - shrlink'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-900 mb-8 border-b-2 border-blue-500 pb-2 inline-block'>Your Dashboard</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className='mb-8'>
            <TabsList className='border-b border-gray-200 w-full mb-2'>
              <TabsTrigger value='links' className='text-lg font-medium'>Your Links</TabsTrigger>
              <TabsTrigger value='create' className='text-lg font-medium'>Create New Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value='links'>
              <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
                <h2 className='text-2xl font-bold mb-6 text-blue-700 border-b border-gray-200 pb-2'>Your Short Links</h2>
                
                {error && (
                  <Alert variant='destructive' className='mb-4'>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {loading ? (
                  <div className='flex justify-center py-8'>
                    <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
                  </div>
                ) : links.length === 0 ? (
                  <div className='text-center py-8'>
                    <p className='text-gray-600 mb-4'>You haven't created any links yet.</p>
                    <Button onClick={switchToCreateTab} size='lg' className='font-medium'>
                      Create your first link
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className='mb-6'>
                      <Button 
                        variant='outline' 
                        onClick={fetchLinks} 
                        className='font-medium flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                      >
                        <Loader2 className='h-4 w-4' /> Refresh
                      </Button>
                    </div>
                    
                    <div>
                      {links.map((link) => (
                        <LinkItem 
                          key={link.id} 
                          link={link} 
                          userId={user.uid} 
                          onUpdate={fetchLinks} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value='create'>
              <div className='bg-white p-6 rounded-lg shadow-md border border-gray-200'>
                <h2 className='text-2xl font-bold mb-6 text-blue-700 border-b border-gray-200 pb-2'>Create a New Short Link</h2>
                <LinkShortener onLinkCreated={handleLinkCreated} />
                <div className='mt-6 text-center'>
                  <Button 
                    variant='link' 
                    onClick={() => {
                      fetchLinks();
                      switchToLinksTab();
                    }}
                    className='text-blue-700 font-medium'
                  >
                    View your links
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}