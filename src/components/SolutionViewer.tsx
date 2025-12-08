import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeImplementation {
  codeType: string;
  code: string;
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
}

export const SolutionViewer: React.FC<SolutionViewerProps> = ({
  implementations,
  approachName = "Optimal Solution",
  explanation,
  complexityExplanation,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect theme from document class
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
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
        const approachesByType: Record<string, { lang: string; code: string }[]> = {};
        
        implementations.forEach((impl) => {
          impl.code.forEach((codeImpl) => {
            if (codeImpl.codeType !== 'starter') {
              if (!approachesByType[codeImpl.codeType]) {
                approachesByType[codeImpl.codeType] = [];
              }
              approachesByType[codeImpl.codeType].push({
                lang: impl.lang,
                code: codeImpl.code,
              });
            }
          });
        });

        const approaches = Object.entries(approachesByType);

        if (approaches.length === 0) {
          return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
              No solutions available.
            </div>
          );
        }

        return approaches.map(([codeType, langImplementations], approachIndex) => (
          <div key={codeType} className="space-y-3">
            {/* Approach Header */}
            <h3 className="text-base font-semibold">
              Approach {approachIndex + 1}: {codeType === 'optimize' ? 'Optimized' : codeType.charAt(0).toUpperCase() + codeType.slice(1)}
            </h3>

            {/* Language Tabs for this approach */}
            <Tabs defaultValue={langImplementations[0]?.lang || 'typescript'} className="w-full">
              {langImplementations.map((langImpl) => (
                <TabsContent key={langImpl.lang} value={langImpl.lang} className="mt-0">
                  <div className="relative rounded-lg border overflow-hidden">
                    {/* Header with Language Tabs and Copy Button - Theme aware */}
                    <div className="flex items-stretch border-b bg-muted/10 shrink-0">
                      {/* Language Tabs - Compact style like AlgorithmDetailNew */}
                      <TabsList className="flex-1 flex p-0 bg-transparent gap-0 rounded-none">
                        {langImplementations.map((impl) => (
                          <TabsTrigger
                            key={impl.lang}
                            value={impl.lang}
                            className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10 text-sm"
                          >
                            {getLanguageDisplayName(impl.lang)}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {/* Copy Button - Right side */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(langImpl.code, `${codeType}-${langImpl.lang}`)}
                        className="gap-2 h-10 rounded-none border-l shrink-0 hover:bg-primary/10 hover:text-primary"
                      >
                        {copiedTab === `${codeType}-${langImpl.lang}` ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Monaco Editor - Read Only */}
                    <Editor
                      height="500px"
                      path={`/solution/${codeType}/${langImpl.lang}/solution.${langImpl.lang === 'python' ? 'py' : langImpl.lang === 'java' ? 'java' : langImpl.lang === 'cpp' ? 'cpp' : 'ts'}`}
                      language={getLanguageForMonaco(langImpl.lang)}
                      value={langImpl.code}
                      theme={isDark ? 'vs-dark' : 'light'}
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
                      }}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        ));
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
