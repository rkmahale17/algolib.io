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
  /**
   * When true, the built-in top bar (language label + eye/copy buttons) is hidden.
   * Use this when a parent component (e.g. VisualizationCodePanel) provides its own header.
   * In this mode, pass `isBlurred` and `onBlurChange` for controlled blur state.
   */
  hideHeader?: boolean;
  /** Controlled blur state — only used when hideHeader=true */
  isBlurred?: boolean;
  /** Called when blur should toggle — only used when hideHeader=true */
  onBlurChange?: (val: boolean) => void;
  /** Custom height for the editor. If not provided, dynamic height is calculated from the code lines. */
  height?: string;
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
  className = '',
  hideHeader = false,
  isBlurred: isBlurredProp,
  onBlurChange,
  height,
}: AnimatedCodeEditorProps) => {
  const { theme, resolvedTheme } = useTheme();
  const colorRef = useRef<HTMLDivElement>(null);
  const [primaryColor, setPrimaryColor] = useState('#84CC16');
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isBlurredInternal, setIsBlurredInternal] = useState(false);
  const [copied, setCopied] = useState(false);

  // When hideHeader=true, blur is controlled externally. Otherwise use internal state.
  const isBlurred = hideHeader ? (isBlurredProp ?? false) : isBlurredInternal;

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

  // Internal blur state management (only active when header is shown)
  useEffect(() => {
    if (hideHeader) return;
    const checkBlurred = () => {
      const saved = localStorage.getItem('visualization-code-blurred');
      if (saved !== null) setIsBlurredInternal(saved === 'true');
    };
    checkBlurred();
    window.addEventListener('code-blur-change', checkBlurred);
    return () => window.removeEventListener('code-blur-change', checkBlurred);
  }, [hideHeader]);

  const handleBlurChange = (val: boolean) => {
    if (hideHeader && onBlurChange) {
      onBlurChange(val);
    } else {
      setIsBlurredInternal(val);
      localStorage.setItem('visualization-code-blurred', String(val));
      window.dispatchEvent(new Event('code-blur-change'));
    }
  };

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
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

  const isDark = mounted ? (resolvedTheme || theme) === 'dark' : false;

  // Calculate height dynamically if not provided
  const editorHeight = React.useMemo(() => {
    if (height) return height;
    const lineCount = code.split('\n').length;
    return `${Math.min(Math.max(lineCount * 20 + 32, 200), 600)}px`;
  }, [code, height]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg border border-border overflow-hidden bg-card h-fit self-start w-full ${className}`}
    >
      <div ref={colorRef} className="bg-primary hidden" />

      {/* Built-in header — shown only when not controlled by a parent */}
      {!hideHeader && (
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
              <Button
                variant="ghost" size="sm"
                onClick={() => handleBlurChange(!isBlurred)}
                className="gap-2 h-10 w-10 p-0 rounded-none border-l shrink-0 hover:bg-primary/10 hover:text-primary flex items-center justify-center"
                title={isBlurred ? 'Show Code' : 'Hide Code'}
              >
                {isBlurred ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </Button>
              <Button
                variant="ghost" size="sm"
                onClick={handleCopy}
                className="gap-2 h-10 w-10 p-0 rounded-none border-l shrink-0 hover:bg-primary/10 hover:text-primary flex items-center justify-center"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative" style={{ height: editorHeight }}>
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
            height={editorHeight}
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
