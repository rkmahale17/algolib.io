import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { Language } from '@/types/algorithm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Maximize, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { RichText } from '@/components/RichText';
import { IsolatedCodeEditor } from "./visualizations/shared/IsolatedCodeEditor";
import { VideoTutorialCard } from "./algorithm/VideoTutorialCard";
const LANGUAGE_ORDER = ['python', 'cpp', 'java', 'typescript'];

interface CodeBlock {
  codeType: string;
  code: string;
  explanationBefore?: string;
  explanationAfter?: string;
  isVisible?: boolean;
  showExplanationBefore?: boolean;
  showExplanationAfter?: boolean;
}

interface CodeImplementation {
  codeType: string;
  code: string;
  explanationBefore?: string;
  explanationAfter?: string;
}

interface SolutionData {
  lang: string;
  code: CodeImplementation[];
}

interface SolutionViewerProps {
  implementations: SolutionData[];
  approachName?: string;
  explanation?: string;
  complexityExplanation?: string;
  controls?: {
    approaches?: boolean;
    languages?: boolean | Record<string, boolean>; // Supported granular control
    explanation_before?: boolean;
    explanation_after?: boolean;
    show_hide_code?: boolean;
  };
  tutorial?: {
    url: string;
    moreInfo?: string;
  };
  problemName?: string;
}

export const SolutionViewer: React.FC<SolutionViewerProps> = ({
  implementations,
  approachName = "Optimal Solution",
  explanation,
  complexityExplanation,
  controls,
  tutorial,
  problemName,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isAppDark, setIsAppDark] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  // Load blurred state and listen to custom event to sync with visualizer/other solutions
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

  // Detect theme from document class
  useEffect(() => {
    const checkTheme = () => {
      setIsAppDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const effectiveTheme = isAppDark ? 'vs-dark' : 'light';

  const handleCopy = async (code: string, tabName: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTab(tabName);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const getLanguageForMonaco = (lang: string) => {
    const langMap: Record<string, string> = {
      typescript: 'typescript',
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
    };
    return langMap[lang.toLowerCase()] || 'typescript';
  };

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

  const getFileExtension = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python': return 'py';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      case 'c': return 'c';
      case 'javascript': return 'js';
      case 'typescript': return 'mts';
      default: return 'mts';
    }
  };

  if (implementations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
        No solutions available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Explanation - Future field */}
      {explanation && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: explanation }} />
        </div>
      )}

      {(() => {
        // Group implementations by code type (approach)
        const approachesByType: Record<string, { lang: string; code: string; explanationBefore?: string; explanationAfter?: string; showExplanationBefore?: boolean; showExplanationAfter?: boolean }[]> = {};

        implementations.forEach((impl) => {
          // Check if language is enabled
          const normalizedLang = impl.lang.toLowerCase();
          const isLangEnabled = !controls?.languages ||
            (typeof controls.languages === 'boolean' ? controls.languages : controls.languages[normalizedLang] !== false);

          if (!isLangEnabled) return;

          impl.code.forEach((codeImpl) => {
            // Check for granular visibility (default to true if undefined)
            if ((codeImpl as any).isVisible === false) return;

            if (codeImpl.codeType !== 'starter') {
              if (!approachesByType[codeImpl.codeType]) {
                approachesByType[codeImpl.codeType] = [];
              }
              approachesByType[codeImpl.codeType].push({
                lang: impl.lang,
                code: codeImpl.code,
                explanationBefore: codeImpl.explanationBefore,
                explanationAfter: codeImpl.explanationAfter,
                showExplanationBefore: (codeImpl as any).showExplanationBefore,
                showExplanationAfter: (codeImpl as any).showExplanationAfter,
              });
            }
          });
        });

        const approaches = Object.entries(approachesByType);

        // Filter approaches based on controls
        const filteredApproaches = (controls?.approaches === false)
          ? approaches.slice(0, 1)
          : approaches;

        if (filteredApproaches.length === 0) {
          return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
              No solutions available.
              {implementations.length > 0 && (
                <p className="text-xs mt-2 text-muted-foreground/80">
                  Some solutions might be hidden by your display settings.
                </p>
              )}
            </div>
          );
        }

        const optimizedCodeType = filteredApproaches.find(([type]) => type === 'optimize' || type === 'solution')?.[0]
          || filteredApproaches[filteredApproaches.length - 1]?.[0];

        return (
          <div className="space-y-12">
            {filteredApproaches.map(([codeType, langImplementations], approachIndex) => (
              <SolutionApproach
                key={codeType}
                codeType={codeType}
                langImplementations={langImplementations}
                approachIndex={approachIndex}
                controls={controls}
                handleCopy={handleCopy}
                copiedTab={copiedTab}
                editorTheme={effectiveTheme}
                getLanguageDisplayName={getLanguageDisplayName}
                getLanguageForMonaco={getLanguageForMonaco}
                getFileExtension={getFileExtension}
                approachName={approachName}
                tutorial={codeType === optimizedCodeType ? tutorial : undefined}
                problemName={problemName}
                isBlurred={isBlurred}
                onBlurChange={handleBlurChange}
              />
            ))}
          </div>
        );
      })()}

      {/* Complexity Explanation - Future field */}
      {complexityExplanation && (
        <div className="prose prose-sm max-w-none dark:prose-invert border-t pt-6">
          <h4 className="text-base font-medium mb-3">Complexity Analysis</h4>
          <div dangerouslySetInnerHTML={{ __html: complexityExplanation }} />
        </div>
      )}
    </div>
  );
};

// Extracted Component for Per-Approach State and Layout
const SolutionApproach: React.FC<{
  codeType: string;
  langImplementations: { lang: string; code: string; explanationBefore?: string; explanationAfter?: string; showExplanationBefore?: boolean; showExplanationAfter?: boolean }[];
  approachIndex: number;
  controls: SolutionViewerProps['controls'];
  handleCopy: (code: string, id: string) => void;
  copiedTab: string | null;
  editorTheme: string;
  getLanguageDisplayName: (lang: string) => string;
  getLanguageForMonaco: (lang: string) => string;
  getFileExtension: (lang: string) => string;
  approachName: string;
  tutorial?: SolutionViewerProps['tutorial'];
  problemName?: string;
  isBlurred: boolean;
  onBlurChange: (val: boolean) => void;
}> = ({
  codeType,
  langImplementations,
  approachIndex,
  controls,
  handleCopy,
  copiedTab,
  editorTheme,
  getLanguageDisplayName,
  getLanguageForMonaco,
  getFileExtension,
  approachName,
  tutorial,
  problemName,
  isBlurred,
  onBlurChange,
}) => {
    // Sort implementations based on the specified order
    const sortedImplementations = [...langImplementations].sort((a, b) => {
      const indexA = LANGUAGE_ORDER.indexOf(a.lang.toLowerCase());
      const indexB = LANGUAGE_ORDER.indexOf(b.lang.toLowerCase());
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    // Local state for the active tab, defaulting to typescript if available, otherwise the first sorted one
    const { preferredLanguage, setPreferredLanguage } = useLanguagePreference('solution');

    // Local state for the active tab, defaulting to preference if available, otherwise typescript, otherwise first sorted one
    const initialLang = useMemo(() => {
        const preferred = sortedImplementations.find(i => i.lang.toLowerCase() === preferredLanguage.toLowerCase());
        if (preferred) return preferred.lang;

        return sortedImplementations.find(i => i.lang.toLowerCase() === 'typescript')?.lang || sortedImplementations[0]?.lang || 'typescript';
    }, [sortedImplementations, preferredLanguage]);

    const [activeLang, setActiveLang] = useState(initialLang);

    // Sync with global preference when it changes elsewhere
    useEffect(() => {
        const preferred = sortedImplementations.find(i => i.lang.toLowerCase() === preferredLanguage.toLowerCase());
        if (preferred && preferred.lang !== activeLang) {
            setActiveLang(preferred.lang);
        }
    }, [preferredLanguage, sortedImplementations, activeLang]);

    // Handle manual language change
    const handleLanguageChange = (lang: string) => {
        setActiveLang(lang);
        setPreferredLanguage(lang.toLowerCase() as Language);
    };
    const [isNarrow, setIsNarrow] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [monacoLoaded, setMonacoLoaded] = useState(false);

    // ResizeObserver to detect container width
    useEffect(() => {
      if (!containerRef.current) return;

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setIsNarrow(entry.contentRect.width < 580);
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => resizeObserver.disconnect();
    }, []);

    // Find current code based on activeLang
    const activeImpl = sortedImplementations.find(i => i.lang === activeLang) || sortedImplementations[0];
    const explanationBefore = sortedImplementations[0]?.explanationBefore;
    const explanationAfter = sortedImplementations[0]?.explanationAfter;

    const showPre = activeImpl.showExplanationBefore !== false;
    const showPost = activeImpl.showExplanationAfter !== false;

    return (
      <div className="space-y-4" ref={containerRef}>
        {/* Approach Header */}
        {controls?.approaches !== false && (
          <h3 className="text-base font-medium">
            {codeType === 'solution'
              ? approachName
              : `Approach ${approachIndex + 1}: ${codeType === 'optimize' ? 'Optimized' : codeType.charAt(0).toUpperCase() + codeType.slice(1)}`
            }
          </h3>
        )}

        {/* Explanation Before */}
        {explanationBefore && controls?.explanation_before !== false && showPre && (
          <RichText
            content={explanationBefore}
            className="text-sm text-muted-foreground mb-4"
          />
        )}

        {/* Language Tabs for this approach */}
        <Tabs
          value={activeLang}
          onValueChange={handleLanguageChange}
          className="w-full"
        >
          <div className="relative rounded-lg border overflow-hidden">
            {/* Header with Language Tabs/Dropdown and Copy Button */}
            <div className="flex items-center justify-between border-b shrink-0">
              {/* LEFT SIDE: Language Selection (Tabs or Dropdown) */}
              <div className="flex-1 overflow-hidden min-w-0">

                {/* DESKTOP: Tabs List */}
                {(controls?.languages !== false && langImplementations.length > 1) && !isNarrow && (
                  <div className="overflow-hidden">
                    <TabsList className="flex p-0 bg-transparent gap-0 rounded-none w-full justify-start overflow-x-auto no-scrollbar">
                      {sortedImplementations.map((impl) => (
                        <TabsTrigger
                          key={impl.lang}
                          value={impl.lang}
                          className="flex-1 min-w-[100px] data-[state=active]:bg-transparent data-[state=active]:text-foreground border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4 whitespace-nowrap"
                        >
                          {getLanguageDisplayName(impl.lang)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                )}

                {/* MOBILE: Select Dropdown */}
                {(controls?.languages !== false && langImplementations.length > 1) && isNarrow && (
                  <div className="px-2 py-1">
                    <Select value={activeLang} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="h-8 w-[140px] border-none shadow-none bg-transparent focus:ring-0 focus:ring-offset-0 text-sm font-medium">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedImplementations.map((impl) => (
                          <SelectItem key={impl.lang} value={impl.lang}>
                            {getLanguageDisplayName(impl.lang)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Single Language Header - Show if only 1 language or tabs disabled */}
                {(controls?.languages === false || langImplementations.length === 1) && (
                  <div className="px-4 flex items-center h-10 text-sm font-medium text-muted-foreground bg-muted/5">
                    {getLanguageDisplayName(activeImpl?.lang || 'Code')}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: Eye/EyeOff (Show/Hide) and Copy Buttons */}
              <div className="flex items-center shrink-0">
                {controls?.show_hide_code !== false && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onBlurChange(!isBlurred)}
                    className="gap-2 h-10 w-10 p-0 rounded-none border-l shrink-0 hover:bg-primary/10 hover:text-primary flex items-center justify-center"
                    title={isBlurred ? "Show Code" : "Hide Code"}
                  >
                    {isBlurred ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(activeImpl.code, `${codeType}-${activeLang}`)}
                  className="gap-2 h-10 rounded-none border-l shrink-0 hover:bg-primary/10 hover:text-primary"
                >
                  {copiedTab === `${codeType}-${activeLang}` ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className={isNarrow ? "" : "hidden sm:inline"}>
                        {!isNarrow ? "Copied" : ""}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Resizable Container for Editor */}
            <div className="resize-y overflow-hidden h-[500px] min-h-[200px] w-full border-b relative group">
              {/* Resize Hint Overlay */}
              <div className="absolute bottom-1 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <Maximize className="w-3 h-3 text-muted-foreground/50" />
              </div>

              <div className={`h-full w-full transition-all duration-300 ${isBlurred ? 'blur-md opacity-40 pointer-events-none' : ''}`}>
                {sortedImplementations.map(langImpl => (
                  langImpl.lang === activeLang && (
                    <TabsContent key={langImpl.lang} value={langImpl.lang} className="absolute inset-0 mt-0">
                      <IsolatedCodeEditor
                        code={langImpl.code}
                        language={getLanguageForMonaco(langImpl.lang)}
                        theme={editorTheme as any}
                        readOnly={true}
                      />
                    </TabsContent>
                  )
                ))}
              </div>

              {isBlurred && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/10 backdrop-blur-[2px]">
                  <Button 
                    onClick={() => onBlurChange(false)}
                    variant="outline"
                    className="backdrop-blur-md bg-background/60 hover:bg-background/80 border border-border/50 text-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all shadow-lg hover:scale-105 pointer-events-auto"
                  >
                    <Eye size={14} />
                    Reveal Code
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Tabs>

        {/* Explanation After */}
        {explanationAfter && controls?.explanation_after !== false && showPost && (
          <RichText
            content={explanationAfter}
            className="text-sm text-muted-foreground mt-4"
          />
        )}

        {/* Video Tutorial (only for optimized solution) */}
        {tutorial && (
          <div className="mt-6">
            <VideoTutorialCard tutorial={tutorial} title={`${problemName || 'Problem'} Tutorial`} />
          </div>
        )}
      </div>
    );
  };
