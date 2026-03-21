import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { IsolatedCodeEditor } from './IsolatedCodeEditor';

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

  const isDark = (resolvedTheme || theme) === 'dark';

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
        {!isReady && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] text-muted-foreground animate-pulse">Initializing...</span>
          </div>
        )}
      </div>
      <div className="h-[500px] relative">
        {!isReady && (
          <div className={`absolute inset-0 z-10 animate-shimmer ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`} />
        )}
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
    </motion.div>
  );
};
