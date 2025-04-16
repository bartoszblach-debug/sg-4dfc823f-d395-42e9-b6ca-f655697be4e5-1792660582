
import { useState } from "react";
import { createShortLink, isShortCodeAvailable } from "@/services/linkService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Copy, Link as LinkIcon } from "lucide-react";

export function LinkShortener() {
  const { user } = useAuth();
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortCode, setCustomShortCode] = useState("");
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortLink(null);
    setCopied(false);

    // Validate URL
    if (!originalUrl) {
      setError("Please enter a URL");
      return;
    }

    try {
      // Simple URL validation
      new URL(originalUrl);
    } catch (err) {
      setError("Please enter a valid URL");
      return;
    }

    // Validate custom short code if provided
    if (customShortCode) {
      if (!/^[a-zA-Z0-9-_]+$/.test(customShortCode)) {
        setError("Custom short code can only contain letters, numbers, hyphens, and underscores");
        return;
      }
    }

    setLoading(true);

    try {
      // Check if custom short code is available
      if (customShortCode) {
        const isAvailable = await isShortCodeAvailable(customShortCode);
        if (!isAvailable) {
          setError("This short code is already taken. Please choose another one.");
          setLoading(false);
          return;
        }
      }

      // Create short link
      const result = await createShortLink(
        originalUrl,
        customShortCode,
        user?.uid
      );

      if (result) {
        const baseUrl = window.location.origin;
        setShortLink(`${baseUrl}/${result.shortCode}`);
      } else {
        setError("Failed to create short link. Please try again.");
      }
    } catch (err) {
      console.error("Error creating short link:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortLink) {
      navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Shorten Your URL</CardTitle>
        <CardDescription>
          Create a short link for easy sharing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Long URL
            </label>
            <Input
              id="originalUrl"
              type="text"
              placeholder="https://example.com/very/long/url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="customShortCode" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Short Code (Optional)
            </label>
            <Input
              id="customShortCode"
              type="text"
              placeholder="my-link"
              value={customShortCode}
              onChange={(e) => setCustomShortCode(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to generate a random code
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Short Link"}
          </Button>
        </form>
        
        {shortLink && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-gray-700 mb-2">Your short link:</p>
            <div className="flex items-center">
              <div className="flex-1 bg-white border border-gray-300 rounded-l-md p-2 truncate">
                <a 
                  href={shortLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <LinkIcon className="h-4 w-4 mr-1 inline" />
                  {shortLink}
                </a>
              </div>
              <Button
                type="button"
                onClick={copyToClipboard}
                className="rounded-l-none"
                variant="secondary"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
