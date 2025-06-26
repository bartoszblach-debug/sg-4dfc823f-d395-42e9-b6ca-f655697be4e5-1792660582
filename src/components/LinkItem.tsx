import { useState, useEffect } from "react";
import { ShortLink } from "@/types";
import { updateShortLink, deleteShortLink, isShortCodeAvailable, getShortLink } from "@/services/linkService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Copy, Edit, ExternalLink, Save, Trash, X } from "lucide-react";

interface LinkItemProps {
  link: ShortLink;
  userId: string;
  onUpdate: () => void;
}

export function LinkItem({ link, userId, onUpdate }: LinkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [shortCode, setShortCode] = useState(link.shortCode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const fullShortUrl = `${baseUrl}/${link.shortCode}`;
  
  const handleEdit = () => {
    setOriginalUrl(link.originalUrl);
    setShortCode(link.shortCode);
    setError(null);
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };
  
  const handleSave = async () => {
    setError(null);
    
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
    
    // Validate short code
    if (!shortCode) {
      setError("Please enter a short code");
      return;
    }
    
    if (!/^[a-zA-Z0-9-_]+$/.test(shortCode)) {
      setError("Short code can only contain letters, numbers, hyphens, and underscores");
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if the new short code is available (if changed)
      if (shortCode !== link.shortCode) {
        const isAvailable = await isShortCodeAvailable(shortCode);
        if (!isAvailable) {
          setError("This short code is already taken. Please choose another one.");
          setLoading(false);
          return;
        }
      }
      
      // Update the link
      const result = await updateShortLink(
        link.shortCode,
        originalUrl,
        shortCode,
        userId
      );
      
      if (result) {
        setIsEditing(false);
        onUpdate();
      } else {
        setError("Failed to update link. Please try again.");
      }
    } catch (err) {
      console.error("Error updating link:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      setLoading(true);
      
      try {
        const success = await deleteShortLink(link.shortCode, userId);
        
        if (success) {
          onUpdate();
        } else {
          setError("Failed to delete link. Please try again.");
        }
      } catch (err) {
        console.error("Error deleting link:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Add new effect to periodically refresh link data
  useEffect(() => {
    const refreshLinkData = async () => {
      const updatedLink = await getShortLink(link.shortCode);
      if (updatedLink && updatedLink.clicks !== link.clicks) {
        onUpdate();
      }
    };
    
    // Initial check
    refreshLinkData();
    
    // Refresh every 5 seconds if the component is mounted
    const interval = setInterval(refreshLinkData, 5000);
    
    return () => clearInterval(interval);
  }, [link.shortCode, link.clicks, onUpdate]);
  
  return (
    <Card className='mb-4'>
      <CardContent className='p-4'>
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isEditing ? (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Long URL
              </label>
              <Input
                type='text'
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder='https://example.com/very/long/url'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Short Code
              </label>
              <Input
                type='text'
                value={shortCode}
                onChange={(e) => setShortCode(e.target.value)}
                placeholder='my-link'
              />
            </div>
            
            <div className='flex flex-wrap gap-2'>
              <Button 
                onClick={handleSave} 
                disabled={loading}
                className='flex items-center'
              >
                <Save className='h-4 w-4 mr-1' />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant='outline' 
                onClick={handleCancel}
                className='flex items-center'
              >
                <X className='h-4 w-4 mr-1' />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className='flex flex-col mb-2'>
              <h3 className='font-medium text-gray-900 truncate max-w-full'>
                {link.originalUrl}
              </h3>
              
              <div className='flex items-center mt-1 mb-2'>
                <div className='flex-1 min-w-0 overflow-hidden text-ellipsis'>
                  <a 
                    href={fullShortUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline flex items-center truncate'
                  >
                    {fullShortUrl}
                  </a>
                </div>
              </div>
              
              <div className='text-xs text-gray-500 flex flex-col gap-y-1 mb-2'>
                <span>Created: {formatDate(link.createdAt)}</span>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md border border-green-200'>
                    👆 Clicks: {link.clicks || 0}
                  </span>
                  {link.clicks > 0 && (
                    <span className='text-xs text-gray-400'>
                      ({link.clicks === 1 ? '1 click' : `${link.clicks} clicks`})
                    </span>
                  )}
                </div>
                {link.lastClickedAt && (
                  <span className='text-xs text-gray-400'>
                    Last clicked: {formatDate(link.lastClickedAt)}
                  </span>
                )}
              </div>
              
              <div className='flex items-center space-x-2 mt-2 pt-2 border-t border-gray-100'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={copyToClipboard}
                  className='h-8 w-8 p-0'
                >
                  {copied ? <Check className='h-4 w-4' /> : <Copy className='h-4 w-4' />}
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleEdit}
                  className='h-8 w-8 p-0'
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={handleDelete}
                  className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
                >
                  <Trash className='h-4 w-4' />
                </Button>
                <a
                  href={link.originalUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                >
                  <ExternalLink className='h-4 w-4' />
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
