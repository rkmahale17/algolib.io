import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Twitter, Linkedin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


interface ShareableProfileLinkProps {
  username: string;
  className?: string;
}

export const ShareableProfileLink = ({ username, className }: ShareableProfileLinkProps) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const profileUrl = `${window.location.origin}/profile/${username}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleTwitterShare = () => {
    const text = `Check out my algorithmic journey on RulCode! 🚀\n\n${profileUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md max-w-[280px]",
      className
    )}>
      <div className="flex items-center gap-4">
        {/* Logo Container */}
        <div className="shrink-0 h-16 w-16 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center p-3 relative overflow-hidden">
            {!imageError ? (
                <img 
                  src="/logo.svg" 
                  alt="RulCode" 
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
            ) : (
                <div className="text-2xl font-bold text-primary uppercase">
                    {username?.charAt(0) || 'R'}
                </div>
            )}
        </div>

        {/* Info Text */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                    Public
                </p>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-base font-bold text-foreground truncate font-mono">
                    @{username}
                </p>
                <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    className={cn(
                        "h-6 w-6 transition-all rounded-full p-0.5",
                         copied ? "text-green-600 bg-green-500/10" : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                    )}
                >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
            </div>
        </div>
      </div>

      {/* Footer: URL Preview + Social Buttons */}
      <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-1.5 flex-1 min-w-0">
            <div className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
            <p className="text-[10px] text-muted-foreground truncate font-mono flex-1">
              {profileUrl}
            </p>
          </div>

      
      </div>
          <div className="flex items-center justify-end gap-1.5 shrink-0">
                <Button
                    onClick={handleTwitterShare}
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-200 transition-colors"
                >
                    <Twitter className="w-3.5 h-3.5" />
                </Button>

                <Button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank')}
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 hover:bg-blue-600/10 hover:text-blue-700 hover:border-blue-200 transition-colors"
                >
                    <Linkedin className="w-3.5 h-3.5" />
                </Button>
          </div>
    </div>
  );
};
