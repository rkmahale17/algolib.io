import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { RichText } from '@/components/RichText';
import { defineThemes } from "@/utils/monacoThemes";

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
  };
}

export const SolutionViewer: React.FC<SolutionViewerProps> = ({
  implementations,
  approachName = "Optimal Solution",
  explanation,
  complexityExplanation,
  controls,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isAppDark, setIsAppDark] = useState(false);
  const [settingsTheme, setSettingsTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Load settings and listen for changes
  useEffect(() => {
    const loadSettings = () => {
        const saved = localStorage.getItem('monaco-editor-settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.theme) setSettingsTheme(parsed.theme);
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    };

    loadSettings();
    const handleSettingsChange = () => loadSettings();
    window.addEventListener('monaco-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('monaco-settings-changed', handleSettingsChange);
  }, []);

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

  const effectiveTheme = settingsTheme === 'dark' ? 'night-owl' : 
                         (settingsTheme === 'light' ? 'light' : 
                         (isAppDark ? 'night-owl' : 'light'));

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
              />
            ))}
          </div>
        );
      })()}

      {/* Complexity Explanation - Future field */}
      {complexityExplanation && (
        <div className="prose prose-sm max-w-none dark:prose-invert border-t pt-6">
          <h4 className="text-base font-semibold mb-3">Complexity Analysis</h4>
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
}) => {
  // Local state for the active tab to ensure Copy button works and persistence
  const [activeLang, setActiveLang] = useState(langImplementations[0]?.lang || 'typescript');
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
  const activeImpl = langImplementations.find(i => i.lang === activeLang) || langImplementations[0];
  const explanationBefore = langImplementations[0]?.explanationBefore;
  const explanationAfter = langImplementations[0]?.explanationAfter;

  const showPre = activeImpl.showExplanationBefore !== false;
  const showPost = activeImpl.showExplanationAfter !== false;

  return (
    <div className="space-y-4" ref={containerRef}>
      {/* Approach Header */}
      <h3 className="text-base font-semibold">
        Approach {approachIndex + 1}: {codeType === 'optimize' ? 'Optimized' : codeType.charAt(0).toUpperCase() + codeType.slice(1)}
      </h3>

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
        onValueChange={setActiveLang} 
        className="w-full"
      >
        <div className="relative rounded-lg border overflow-hidden">
          {/* Header with Language Tabs/Dropdown and Copy Button */}
          <div className="flex items-center justify-between border-b bg-muted/10 shrink-0">
            {/* LEFT SIDE: Language Selection (Tabs or Dropdown) */}
            <div className="flex-1 overflow-hidden min-w-0">
              
              {/* DESKTOP: Tabs List */}
              {(controls?.languages !== false && langImplementations.length > 1) && !isNarrow && (
                <div className="overflow-hidden">
                  <TabsList className="flex p-0 bg-transparent gap-0 rounded-none w-full justify-start overflow-x-auto no-scrollbar">
                    {langImplementations.map((impl) => (
                      <TabsTrigger
                        key={impl.lang}
                        value={impl.lang}
                        className="flex-1 min-w-[100px] data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 px-4 whitespace-nowrap"
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
                   <Select value={activeLang} onValueChange={setActiveLang}>
                    <SelectTrigger className="h-8 w-[140px] border-none shadow-none bg-transparent focus:ring-0 text-sm font-medium">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {langImplementations.map((impl) => (
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

            {/* RIGHT SIDE: Copy Button */}
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

          {/* Resizable Container for Editor */}
          <div className="resize-y overflow-hidden h-[500px] min-h-[200px] w-full border-b relative group">
             {/* Resize Hint Overlay */}
             <div className="absolute bottom-1 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <Maximize2 className="w-3 h-3 text-muted-foreground/50" />
             </div>

             {langImplementations.map(langImpl => (
               <TabsContent key={langImpl.lang} value={langImpl.lang} className="absolute inset-0 mt-0 data-[state=inactive]:hidden">
                  <Editor
                    height="100%"
                    width="100%"
                    path={`solution://${codeType}/${langImpl.lang}/solution.${getFileExtension(langImpl.lang)}`}
                    language={getLanguageForMonaco(langImpl.lang)}
                    value={langImpl.code}
                    theme={editorTheme}
                    beforeMount={defineThemes}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      fontSize: 14,
                      lineNumbers: 'on',
                      renderLineHighlight: 'none',
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                      },
                      overviewRulerLanes: 0,
                      hideCursorInOverviewRuler: true,
                      overviewRulerBorder: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 }
                    }}
                  />
               </TabsContent>
             ))}
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
    </div>
  );
};
