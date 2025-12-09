import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ProblemDescriptionPanel } from "@/components/algorithm/ProblemDescriptionPanel";
import { CodeWorkspacePanel } from "@/components/algorithm/CodeWorkspacePanel";
import { AlgorithmHeader } from "@/components/algorithm/AlgorithmHeader";
import { Code2, Minimize2, Eye, Lightbulb, Maximize2 } from "lucide-react";
import { CodeRunner } from "@/components/CodeRunner/CodeRunner";
import { BrainstormSection } from "@/components/brainstorm/BrainstormSection";

interface AlgorithmPreviewProps {
  algorithm: any;
}

export function AlgorithmPreview({ algorithm }: AlgorithmPreviewProps) {
  // Mock State for Preview
  const [activeTab, setActiveTab] = useState("description");
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("typescript");
  const [isCodeRunnerMaximized, setIsCodeRunnerMaximized] = useState(false);
  const [isVisualizationMaximized, setIsVisualizationMaximized] = useState(false);
  const [isBrainstormMaximized, setIsBrainstormMaximized] = useState(false);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  // Mock Handlers
  const toggleLeftPanel = () => setIsLeftCollapsed(!isLeftCollapsed);
  const toggleRightPanel = () => setIsRightCollapsed(!isRightCollapsed);

  if (!algorithm || !algorithm.name) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Fill in the form to see a preview
        </CardContent>
      </Card>
    );
  }

  // Ensure implementations exist for CodeWorkspacePanel
  const previewAlgorithm = {
    ...algorithm,
    implementations: algorithm.implementations || []
  };

  // Render Maximize Overlays
  const renderMaximizedOverlays = () => (
    <>
      {isCodeRunnerMaximized && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Code Runner
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsCodeRunnerMaximized(false)}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
             <CodeRunner 
                algorithmId="preview-mode"
                algorithmData={previewAlgorithm}
                isMaximized={true}
                onToggleFullscreen={() => setIsCodeRunnerMaximized(false)}
                className="h-full border-0 rounded-none shadow-none"
                initialCode=""
                onCodeChange={() => {}}
                onSuccess={() => {}}
              />
          </div>
        </div>
      )}

      {isVisualizationMaximized && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
           <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Visualization
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsVisualizationMaximized(false)}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-6 pb-20">
             {previewAlgorithm.metadata?.visualizationUrl ? (
                <iframe src={previewAlgorithm.metadata.visualizationUrl} className="w-full h-full border-0" title="Viz" />
             ) : (
                <div className="text-center p-10">Maximize mode not fully supported for this visualization type yet.</div>
             )}
          </div>
        </div>
      )}

      {isBrainstormMaximized && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
           <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Brainstorm
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsBrainstormMaximized(false)}>
              <Minimize2 className="w-4 h-4 mr-2" />
              Exit Fullscreen
            </Button>
          </div>
          <div className="flex-1 overflow-auto p-6">
             <BrainstormSection algorithmId="preview-mode" algorithmTitle={previewAlgorithm.name} />
          </div>
        </div>
      )}

      {/* Global Preview Expand Overlay */}
      {/* Global Preview Expand Overlay */}
      <Dialog open={isPreviewExpanded} onOpenChange={setIsPreviewExpanded}>
        <DialogContent className="max-w-[100vw] w-screen h-screen p-0 border-0 rounded-none bg-background flex flex-col focus:outline-none">
           <DialogTitle className="sr-only">Live Preview Fullscreen</DialogTitle>
           <div className="flex items-center justify-between p-3 border-b bg-background shadow-sm shrink-0">
             <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                    Live Preview 
                </h2>
                <Badge variant="secondary" className="font-normal">Fullscreen Mode</Badge>
             </div>
             <Button variant="ghost" size="sm" onClick={() => setIsPreviewExpanded(false)} className="gap-2 hover:bg-destructive/10 hover:text-destructive">
               <Minimize2 className="w-4 h-4" />
               Exit Preview
             </Button>
           </div>
           
           <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Header Mock */}
            <div className="pointer-events-none opacity-80 border-b">
                 <AlgorithmHeader 
                    user={{ email: 'preview@example.com' } as any}
                    algorithm={previewAlgorithm}
                    isMobile={false}
                    isInterviewMode={false}
                    toggleInterviewMode={() => {}}
                    timerSeconds={0}
                    isTimerRunning={false}
                    setIsTimerRunning={() => {}}
                    setTimerSeconds={() => {}}
                    formatTime={() => "00:00"}
                    handleRandomProblem={() => {}}
                    handleNextProblem={() => {}}
                    handleShare={() => {}}
                    handleSignOut={() => {}}
                 />
            </div>
               <div className="flex-1 overflow-hidden relative">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Left Panel */}
                    <ResizablePanel
                        defaultSize={40}
                        minSize={20}
                        collapsible={true}
                        onCollapse={() => setIsLeftCollapsed(true)}
                        onExpand={() => setIsLeftCollapsed(false)}
                        className={isLeftCollapsed ? 'min-w-[0px]' : ''}
                    >
                        <ProblemDescriptionPanel
                            algorithm={previewAlgorithm}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isMobile={false}
                            toggleLeftPanel={toggleLeftPanel}
                            // Mock interactions
                            isCompleted={false}
                            likes={previewAlgorithm.metadata?.likes || 0}
                            dislikes={previewAlgorithm.metadata?.dislikes || 0}
                            userVote={null}
                            isFavorite={false}
                            handleVote={() => {}}
                            toggleFavorite={() => {}}
                            setIsVisualizationMaximized={setIsVisualizationMaximized}
                            handleRichTextClick={() => {}}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Panel */}
                    <ResizablePanel
                        defaultSize={60}
                        minSize={20}
                        collapsible={true}
                        onCollapse={() => setIsRightCollapsed(true)}
                        onExpand={() => setIsRightCollapsed(false)}
                        className={isRightCollapsed ? 'min-w-[0px]' : ''}
                    >
                        <CodeWorkspacePanel
                            algorithm={previewAlgorithm}
                            algorithmId="preview-mode"
                            isMobile={false}
                            toggleRightPanel={toggleRightPanel}
                            savedCode=""
                            handleCodeChange={() => {}}
                            handleCodeSuccess={() => {}}
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                            isCodeRunnerMaximized={isCodeRunnerMaximized}
                            setIsCodeRunnerMaximized={setIsCodeRunnerMaximized}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
           </div>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <div className="sticky top-4 space-y-4">
      <Card className="border-2 overflow-hidden flex flex-col h-[calc(100vh-100px)]">
        <CardHeader className="border-b bg-muted/30 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                Live Preview
                <span className="font-normal text-muted-foreground">(Interactive)</span>
            </CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsPreviewExpanded(true)} title="Expand Preview">
                    <Maximize2 className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="text-xs">
                Production View
                </Badge>
            </div>
          </div>
        </CardHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden relative bg-background">
            {/* Header Mock */}
            <div className="pointer-events-none opacity-80 border-b">
                 <AlgorithmHeader 
                    user={{ email: 'preview@example.com' } as any}
                    algorithm={previewAlgorithm}
                    isMobile={false}
                    isInterviewMode={false}
                    toggleInterviewMode={() => {}}
                    timerSeconds={0}
                    isTimerRunning={false}
                    setIsTimerRunning={() => {}}
                    setTimerSeconds={() => {}}
                    formatTime={() => "00:00"}
                    handleRandomProblem={() => {}}
                    handleNextProblem={() => {}}
                    handleShare={() => {}}
                    handleSignOut={() => {}}
                 />
            </div>

            <div className="flex-1 overflow-hidden relative">
                <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Left Panel */}
                    <ResizablePanel
                        defaultSize={40}
                        minSize={20}
                        collapsible={true}
                        onCollapse={() => setIsLeftCollapsed(true)}
                        onExpand={() => setIsLeftCollapsed(false)}
                        className={isLeftCollapsed ? 'min-w-[0px]' : ''}
                    >
                        <ProblemDescriptionPanel
                            algorithm={previewAlgorithm}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            isMobile={false}
                            toggleLeftPanel={toggleLeftPanel}
                            // Mock interactions
                            isCompleted={false}
                            likes={previewAlgorithm.metadata?.likes || 0}
                            dislikes={previewAlgorithm.metadata?.dislikes || 0}
                            userVote={null}
                            isFavorite={false}
                            handleVote={() => {}}
                            toggleFavorite={() => {}}
                            setIsVisualizationMaximized={setIsVisualizationMaximized}
                            handleRichTextClick={() => {}}
                        />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* Right Panel */}
                    <ResizablePanel
                        defaultSize={60}
                        minSize={20}
                        collapsible={true}
                        onCollapse={() => setIsRightCollapsed(true)}
                        onExpand={() => setIsRightCollapsed(false)}
                        className={isRightCollapsed ? 'min-w-[0px]' : ''}
                    >
                        <CodeWorkspacePanel
                            algorithm={previewAlgorithm}
                            algorithmId="preview-mode"
                            isMobile={false}
                            toggleRightPanel={toggleRightPanel}
                            savedCode=""
                            handleCodeChange={() => {}}
                            handleCodeSuccess={() => {}}
                            selectedLanguage={selectedLanguage}
                            setSelectedLanguage={setSelectedLanguage}
                            isCodeRunnerMaximized={isCodeRunnerMaximized}
                            setIsCodeRunnerMaximized={setIsCodeRunnerMaximized}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
      </Card>

      {renderMaximizedOverlays()}
    </div>
  );
}
