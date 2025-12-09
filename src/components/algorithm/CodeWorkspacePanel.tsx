import React, { useState, useEffect, useRef } from "react";
import {
  Code2,
  Lightbulb,
  PanelRightClose,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/AuthGuard";
import { TabWarning } from "@/components/TabWarning";
import { CodeRunner } from "@/components/CodeRunner/CodeRunner";
import { BrainstormSection } from "@/components/brainstorm/BrainstormSection";

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
}

export const CodeWorkspacePanel: React.FC<CodeWorkspacePanelProps> = ({
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
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

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
    <div ref={containerRef} className="h-full flex flex-col bg-card/30 backdrop-blur-sm">
      <div className="flex-1 overflow-hidden p-0">
         <Tabs defaultValue="code" className="h-full flex flex-col">
            <div className="flex items-stretch border-b bg-muted/10 shrink-0">
               {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleRightPanel} 
                  title="Collapse Panel"
                  className="h-10 w-10 rounded-none border-l border-border/50 hover:bg-primary/10 hover:text-primary shrink-0"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              )}
              
              <TabsList className="flex-1 flex p-0 bg-transparent gap-0 rounded-none">
                <TooltipProvider>
                  <TabsTrigger 
                    value="code" 
                    className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10"
                  >
                    {isCompact ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center justify-center w-full h-full">
                             <Code2 className="w-4 h-4" />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Code</TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <Code2 className="w-4 h-4 mr-2" />
                        Code
                      </>
                    )}
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="brainstorm"
                    className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-10"
                  >
                    {isCompact ? (
                       <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center justify-center w-full h-full">
                            <Lightbulb className="w-4 h-4" />
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>Brainstorm</TooltipContent>
                      </Tooltip>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Brainstorm
                      </>
                    )}
                  </TabsTrigger>
                </TooltipProvider>
              </TabsList>
            </div>
            
            <TabsContent value="code" className="flex-1 m-0 overflow-hidden relative group flex flex-col data-[state=inactive]:hidden">
               {algorithm?.controls?.tabs?.code === false ? (
                  <TabWarning message="Code Runner is not available for this problem." />
               ) : (
                 <AuthGuard
                   fallbackTitle="Sign in to use Code Runner"
                   fallbackDescription="Create an account or sign in to run and test your code solutions."
                 >
                   {algorithmId && algorithm && (
                     <CodeRunner 
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
                     />
                   )}
                 </AuthGuard>
               )}
            </TabsContent>

            <TabsContent value="brainstorm" className="flex-1 m-0 overflow-hidden data-[state=inactive]:hidden">
               {algorithm?.controls?.tabs?.brainstorm === false ? (
                  <TabWarning message="Brainstorming tools are disabled for this session." />
               ) : (
                  <div className="h-full flex flex-col">
                    <AuthGuard
                      fallbackTitle="Sign in to Brainstorm"
                      fallbackDescription="Create an account or sign in to access whiteboard and notes."
                    >
                      <BrainstormSection 
                        algorithmId={algorithmId || ""}
                        algorithmTitle={algorithm?.title || ""}
                        controls={algorithm?.controls?.brainstorm}
                      />
                    </AuthGuard>
                  </div>
               )}
            </TabsContent>
          </Tabs>
      </div>
    </div>
  );
};
