import React, { useState, useMemo } from 'react';
import { RichText } from '@/components/RichText';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface ProgressiveHintsProps {
  hintsHtml: string;
}

export const ProgressiveHints: React.FC<ProgressiveHintsProps> = ({ hintsHtml }) => {
  const hints = useMemo(() => {
    if (!hintsHtml) return [];
    
    // Fallback if not an HTML list
    if (!hintsHtml.includes('<li')) {
      return [hintsHtml];
    }

    const extracted: string[] = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let match;
    while ((match = liRegex.exec(hintsHtml)) !== null) {
      extracted.push(match[1].trim());
    }
    return extracted.length > 0 ? extracted : [hintsHtml];
  }, [hintsHtml]);

  const [revealedCount, setRevealedCount] = useState(1);

  if (hints.length === 0) return null;

  return (
    <div className="space-y-4 w-full">
      {hints.slice(0, revealedCount).map((hint, index) => (
        <div key={index} className="flex gap-3 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary mt-0.5">
            <span className="text-xs font-bold">{index + 1}</span>
          </div>
          <div className="flex-1 text-sm text-foreground">
            <RichText content={hint} />
          </div>
        </div>
      ))}
      
      {revealedCount < hints.length && (
        <div className="pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setRevealedCount(prev => prev + 1)}
            className="w-full sm:w-auto flex items-center gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors text-xs font-semibold"
          >
            <Eye className="w-3.5 h-3.5" />
            Reveal Next Hint ({hints.length - revealedCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};
