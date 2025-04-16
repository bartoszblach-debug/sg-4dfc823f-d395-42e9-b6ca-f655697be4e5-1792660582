import { useEffect, useState } from "react";
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
  }, [user]);

  const fetchLinks = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userLinks = await getUserLinks(user.uid);
      setLinks(userLinks);
    } catch (err) {
      console.error("Error fetching links:", err);
      setError("Failed to load your links. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Layout title="Dashboard - LinkShort">
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
    <Layout title="Dashboard - LinkShort">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Dashboard</h1>
          
          <Tabs defaultValue="links" className="mb-8">
            <TabsList>
              <TabsTrigger value="links">Your Links</TabsTrigger>
              <TabsTrigger value="create">Create New Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="links">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Your Short Links</h2>
                
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : links.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't created any links yet.</p>
                    <Button onClick={() => document.querySelector('[data-value="create"]')?.click()}>
                      Create your first link
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <Button variant="outline" onClick={fetchLinks} className="text-sm">
                        Refresh
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
            
            <TabsContent value="create">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Create a New Short Link</h2>
                <LinkShortener />
                <div className="mt-4 text-center">
                  <Button 
                    variant="link" 
                    onClick={() => {
                      fetchLinks();
                      document.querySelector('[data-value="links"]')?.click();
                    }}
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