import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { IsolatedCodeEditor } from './IsolatedCodeEditor';
import { Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AnimatedCodeEditorProps {
  code: string;
  language: string;
  highlightedLines?: number[];
  className?: string;
}

const getLanguageDisplayName = (lang: string) => {
  const displayNames: Record<string, string> = {
    typescript: 'TypeScript',
    javascript: 'JavaScript',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
  };
  return displayNames[lang.toLowerCase()] || lang;
};

export const AnimatedCodeEditor = ({
  code,
  language,
  highlightedLines = [],
  className = ''
}: AnimatedCodeEditorProps) => {
  const { theme, resolvedTheme } = useTheme();
  const colorRef = useRef<HTMLDivElement>(null);
  const [primaryColor, setPrimaryColor] = useState('#84CC16'); // Fallback to the green from index.css
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  useEffect(() => {
    const checkBlurred = () => {
      const saved = localStorage.getItem('visualization-code-blurred');
      if (saved !== null) {
        setIsBlurred(saved === 'true');
      }
    };

    checkBlurred();

    const handleBlurEvent = () => {
      checkBlurred();
    };

    window.addEventListener('code-blur-change', handleBlurEvent);
    return () => {
      window.removeEventListener('code-blur-change', handleBlurEvent);
    };
  }, []);

  const handleBlurChange = (val: boolean) => {
    setIsBlurred(val);
    localStorage.setItem('visualization-code-blurred', String(val));
    window.dispatchEvent(new Event('code-blur-change'));
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Small delay to ensure styles are applied and we get the correct primary color
    const timer = setTimeout(() => {
      if (colorRef.current) {
        const style = window.getComputedStyle(colorRef.current);
        const color = style.backgroundColor;
        if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
          setPrimaryColor(color);
        }
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [resolvedTheme]);

  // Use a stable default during SSR/hydration, then switch to actual theme once mounted
  const isDark = mounted ? (resolvedTheme || theme) === 'dark' : false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border border-border overflow-hidden bg-card ${className}`}
    >
      <div ref={colorRef} className="bg-primary hidden" />
      <div className="bg-muted pl-4 pr-0 border-b border-border flex justify-between items-center h-10 shrink-0">
        <span className="text-xs font-semibold text-foreground">{getLanguageDisplayName(language)}</span>
        <div className="flex items-center gap-3 shrink-0 h-full">
          {!isReady && (
            <div className="flex items-center gap-1.5 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Initializing...</span>
            </div>
          )}

          <div className="flex items-center shrink-0 h-full">
            {/* Eye Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBlurChange(!isBlurred)}
              className="gap-2 h-10 w-10 p-0 rounded-none border-l shrink-0 hover:bg-primary/10 hover:text-primary flex items-center justify-center"
              title={isBlurred ? "Show Code" : "Hide Code"}
            >
              {isBlurred ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>

            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="gap-2 h-10 w-10 p-0 rounded-none border-l shrink-0 hover:bg-primary/10 hover:text-primary flex items-center justify-center"
              title="Copy Code"
            >
              {copied ? (
                <Check className="w-4 h-4 text-primary" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[500px] relative">
        {!isReady && (
          <div className={`absolute inset-0 z-10 animate-shimmer ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`} />
        )}
        <div className={`h-full w-full transition-all duration-300 ${isBlurred ? 'blur-md opacity-40 pointer-events-none' : ''}`}>
          <IsolatedCodeEditor
            code={code}
            language={language.toLowerCase()}
            theme={isDark ? 'vs-dark' : 'light'}
            highlightedLines={(highlightedLines || []).map(l => Math.max(1, l))}
            readOnly={true}
            height="500px"
            primaryColor={primaryColor}
            onReady={() => setIsReady(true)}
          />
        </div>
        {isBlurred && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <button 
              onClick={() => handleBlurChange(false)}
              className="backdrop-blur-md bg-background/60 hover:bg-background/80 border border-border/50 text-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all shadow-lg hover:scale-105"
            >
              <Eye size={14} />
              Reveal Code
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
