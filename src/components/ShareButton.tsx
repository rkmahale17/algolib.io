import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  description: string;
}

export function ShareButton({ title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled or error occurred
        if (error instanceof Error && error.name !== 'AbortError') {
          fallbackCopy(url);
        }
      }
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
    >
      {copied ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <Share2 className="w-4 h-4 mr-2" />
      )}
      Share
    </Button>
  );
}
