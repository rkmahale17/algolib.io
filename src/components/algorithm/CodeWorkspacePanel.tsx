import React, { useState, useEffect, useRef } from "react";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { usePostHog } from "@posthog/react";
import {
  Book,
  Code,
  Code2,
  Lightbulb,
  PanelRightClose,
  TestTube2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/AuthGuard";
import { TabWarning } from "@/components/TabWarning";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { Submission } from "@/types/userAlgorithmData";

const CodeRunner = dynamic(() => import("@/components/CodeRunner/CodeRunner").then(mod => mod.CodeRunner), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center h-full">
      <Skeleton className="h-[80%] w-[90%]" />
    </div>
  )
});

interface CodeWorkspacePanelProps {
  algorithm: any;
  algorithmId: string;
  isMobile: boolean;
  toggleRightPanel: () => void;
  savedCode: string;
  handleCodeChange: (code: string) => void;
  handleCodeSuccess: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  isCodeRunnerMaximized: boolean;
  setIsCodeRunnerMaximized: (val: boolean) => void;
  submissions: Submission[];
  className?: string;
  isInterviewMode?: boolean;
  codeRunnerRef?: React.RefObject<any>;
  onRunnerStateChange?: (state: any) => void;
  isLoading?: boolean;
  isPlatformPreview?: boolean;
  hasPremiumAccess?: boolean;
}

export const CodeWorkspacePanel = React.memo(({
  algorithm,
  algorithmId,
  isMobile,
  toggleRightPanel,
  savedCode,
  handleCodeChange,
  handleCodeSuccess,
  selectedLanguage,
  setSelectedLanguage,
  isCodeRunnerMaximized,
  setIsCodeRunnerMaximized,
  submissions,
  className,
  isInterviewMode,
  codeRunnerRef,
  onRunnerStateChange,
  isLoading = false,
  isPlatformPreview = false,
  hasPremiumAccess = false,
}: CodeWorkspacePanelProps) => {
  const posthog = usePostHog();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  const isCodeRunnerGlobalEnabled = useFeatureFlag('code_runner_tab');
  const isBrainstormGlobalEnabled = useFeatureFlag('brainstrom_tab');

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setIsCompact(entry.contentRect.width < 400);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`h-full flex flex-col ${className || ''}`}>
      <div className="flex-1 overflow-hidden p-0">
        {(algorithm?.controls?.tabs?.code === false || algorithm?.controls?.code_runner === false || !isCodeRunnerGlobalEnabled) ? (
          <TabWarning message={!isCodeRunnerGlobalEnabled ? "Code Runner is currently disabled globally." : "Code Runner is not available for this problem."} />
        ) : (
          <AuthGuard
            fallbackTitle="Sign in to use Code Runner"
            fallbackDescription="Create an account or sign in to run and test your code solutions."
            disabled={isPlatformPreview}
          >
            {algorithmId && algorithm ? (
              <CodeRunner
                key={algorithmId}
                algorithmId={algorithmId}
                algorithmData={algorithm}
                onToggleFullscreen={() => setIsCodeRunnerMaximized(!isCodeRunnerMaximized)}
                isMaximized={isCodeRunnerMaximized}
                className={isCodeRunnerMaximized ? "fixed inset-0 z-50 h-screen w-screen bg-background" : "h-full flex-1 border-0 rounded-none"}
                initialCode={savedCode}
                onCodeChange={handleCodeChange}
                language={selectedLanguage as any}
                onLanguageChange={(lang) => {
                  setSelectedLanguage(lang);
                  localStorage.setItem('preferredLanguage', lang);
                }}
                onSuccess={handleCodeSuccess}
                controls={algorithm.controls?.code_runner}
                submissions={submissions}
                isInterviewMode={isInterviewMode}
                ref={codeRunnerRef}
                onStateChange={onRunnerStateChange}
                isMobile={isMobile}
                isLoading={isLoading}
                onToggleRightPanel={toggleRightPanel}
                brainstormProps={isBrainstormGlobalEnabled && algorithm?.controls?.brainstorm !== false ? {
                  algorithmId: algorithmId,
                  algorithmTitle: algorithm?.title || algorithm?.name || "",
                  controls: algorithm?.controls?.brainstorm
                } : undefined}
                hasPremiumAccess={hasPremiumAccess}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-[80%] w-[90%]" />
              </div>
            )}
          </AuthGuard>
        )}
      </div>
    </div>
  );
});
