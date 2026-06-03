import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { IsolatedCodeEditor } from './IsolatedCodeEditor';
import { Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface AnimatedCodeEditorProps {
  code: string;
  language: string;
  highlightedLines?: number[];
  className?: string;
}

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

  useEffect(() => {
    const saved = localStorage.getItem('visualization-code-blurred');
    if (saved !== null) {
      setIsBlurred(saved === 'true');
    }
  }, []);

  const handleBlurChange = (val: boolean) => {
    setIsBlurred(val);
    localStorage.setItem('visualization-code-blurred', String(val));
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
      <div className="bg-muted px-4 py-2 border-b border-border flex justify-between items-center">
        <span className="text-xs font-semibold text-foreground">{language}</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {isBlurred ? 'Show' : 'Hide'}
            </span>
            <Switch 
              checked={isBlurred} 
              onCheckedChange={handleBlurChange}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          {!isReady && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-muted-foreground animate-pulse">Initializing...</span>
            </div>
          )}
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
