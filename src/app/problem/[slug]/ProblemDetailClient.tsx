'use client';

import React, { useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, ArrowLeft, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { usePostHog } from "@posthog/react";
import { supabase } from "@/integrations/supabase/client";
import dynamic from 'next/dynamic';

// Components
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { PremiumLoader } from "@/components/PremiumLoader";
import { CodeRunnerRef } from "@/components/CodeRunner/CodeRunner";

// Refactored Components
import { AlgorithmHeader } from "@/components/algorithm/AlgorithmHeader";
import { ProblemDescriptionPanel } from "@/components/algorithm/ProblemDescriptionPanel";
import { CodeWorkspacePanel } from "@/components/algorithm/CodeWorkspacePanel";
import { Paywall } from "@/components/Paywall";

// Hooks
import { useAlgorithmLayout } from "@/hooks/useAlgorithmLayout";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { useAlgorithmInteractions } from "@/hooks/useAlgorithmInteractions";
import { useUserAlgorithmData } from "@/hooks/useUserAlgorithmData";
import { useAlgorithm } from "@/hooks/useAlgorithm";
import { useApp } from "@/contexts/AppContext";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { useAlgorithms } from "@/hooks/useAlgorithms";

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ProblemSidebar } from "@/components/ProblemSidebar";
import { LIST_TYPE_LABELS } from "@/types/algorithm";

// Helper for scrolling to code section on mobile
const scrollToCode = () => {
  const codeSection = document.getElementById('mobile-code-section');
  if (codeSection) {
    codeSection.scrollIntoView({ behavior: 'smooth' });
  }
};

interface ProblemDetailClientProps {
  initialAlgorithm: any;
  slug: string;
}

const ProblemDetailClient: React.FC<ProblemDetailClientProps> = ({ initialAlgorithm, slug }) => {
  const algorithmIdOrSlug = slug;
  const router = useRouter();
  const posthog = usePostHog();

  // -- Data Fetching State --
  // We seed useAlgorithm with initial data from server
  const { data: algorithm } = useAlgorithm(algorithmIdOrSlug);
  const activeAlgorithm = algorithm || initialAlgorithm;

  const { user, hasPremiumAccess, activeListType, setActiveListType, progressMap } = useApp();
  const { data: algorithmsData } = useAlgorithms();
  const allAlgorithms = algorithmsData?.algorithms || [];
  const isPaywallEnabled = useFeatureFlag('paywall_enabled');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPremiumAlgorithm = useMemo(() => {
    return !!(activeAlgorithm?.is_premium || activeAlgorithm?.is_pro || activeAlgorithm?.metadata?.is_pro);
  }, [activeAlgorithm]);

  // -- Hooks --
  const layout = useAlgorithmLayout();
  const session = useInterviewSession();

  // Fetch user data hook
  const { data: userAlgoData, loading: loadingUserData, refetch: refetchUserData } = useUserAlgorithmData({
    userId: user?.id,
    algorithmId: algorithmIdOrSlug || '',
    enabled: !!user && !!algorithmIdOrSlug,
  });

  const filteredAlgorithms = useMemo(() => {
    if (!allAlgorithms) return [];
    if (!activeListType || activeListType === 'all') return allAlgorithms;
    
    return allAlgorithms.filter(algo => {
      const algoListType = (algo.list_type || (algo as any).listType || 'core').toLowerCase();
      const currentListType = activeListType.toLowerCase();

      if (currentListType === 'core') {
        return algoListType === 'core' || algoListType === 'core+blind75';
      } else if (currentListType === 'blind75') {
        return algoListType === 'blind75' || algoListType === 'core+blind75';
      } else if (currentListType === 'core+blind75') {
        return algoListType === 'core+blind75';
      }
      return true;
    });
  }, [allAlgorithms, activeListType]);

  const interactions = useAlgorithmInteractions({
    user,
    algorithmId: algorithmIdOrSlug,
    algorithm: activeAlgorithm,
    userAlgoData,
    refetchUserData,
    filteredAlgorithms,
  });

  const submissions = useMemo(() => userAlgoData?.submissions || [], [userAlgoData?.submissions]);

  // -- Code Runner Control --
  const runnerRef = React.useRef<CodeRunnerRef>(null);
  const [runnerState, setRunnerState] = useState({
    isLoading: false,
    isSubmitting: false,
    lastRunSuccess: false
  });

  const handleRunnerStateChange = useCallback((state: any) => {
    setRunnerState(state);
  }, []);

  const handleRun = useCallback(() => {
    runnerRef.current?.run();
  }, []);

  const handleSubmit = useCallback(() => {
    runnerRef.current?.submit();
  }, []);

  // -- Effects --

  // 1. Set Likes/Dislikes Initial State from Algorithm Data
  useEffect(() => {
    if (activeAlgorithm?.metadata) {
      const meta = activeAlgorithm.metadata as any;
      interactions.setLikes((meta.likes as number) || 0);
      interactions.setDislikes((meta.dislikes as number) || 0);
    }
  }, [activeAlgorithm]);

  // 2. Track Problem Opened
  useEffect(() => {
    if (activeAlgorithm) {
      posthog?.capture('problem_opened', {
        problemId: algorithmIdOrSlug,
        problemName: activeAlgorithm.name,
        difficulty: activeAlgorithm.difficulty,
        listType: activeListType
      });
    }
  }, [activeAlgorithm, algorithmIdOrSlug, posthog, activeListType]);

  // 3. Track Tab Switch
  useEffect(() => {
    if (activeAlgorithm) {
      posthog?.capture('problem_tab_switched', {
        problemId: algorithmIdOrSlug,
        tabName: layout.activeTab,
        panel: 'left'
      });
    }
  }, [layout.activeTab, algorithmIdOrSlug, posthog, activeAlgorithm]);

  // -- Handlers --
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  const handleRichTextClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#visualization') {
        e.preventDefault();
        layout.setActiveTab('visualizations');
      }
    }
  }, [layout.setActiveTab]);

  const codeWorkspacePanel = useMemo(() => (
    <CodeWorkspacePanel
      algorithm={activeAlgorithm}
      algorithmId={algorithmIdOrSlug || ""}
      isMobile={layout.isMobile}
      toggleRightPanel={layout.toggleRightPanel}
      savedCode={interactions.savedCode}
      handleCodeChange={interactions.handleCodeChange}
      handleCodeSuccess={interactions.handleCodeSuccess}
      selectedLanguage={interactions.selectedLanguage}
      setSelectedLanguage={interactions.setSelectedLanguage}
      isCodeRunnerMaximized={layout.isCodeRunnerMaximized}
      setIsCodeRunnerMaximized={layout.setIsCodeRunnerMaximized}
      submissions={submissions}
      codeRunnerRef={runnerRef}
      onRunnerStateChange={handleRunnerStateChange}
      isLoading={loadingUserData}
    />
  ), [
    activeAlgorithm,
    algorithmIdOrSlug,
    layout.isMobile,
    layout.toggleRightPanel,
    interactions.savedCode,
    interactions.handleCodeChange,
    interactions.handleCodeSuccess,
    interactions.selectedLanguage,
    interactions.setSelectedLanguage,
    layout.isCodeRunnerMaximized,
    layout.setIsCodeRunnerMaximized,
    submissions,
    loadingUserData
  ]);

  // -- Render Guards --

  // Paywall Logic
  if (isPaywallEnabled && isPremiumAlgorithm && !hasPremiumAccess) {
    return <Paywall />;
  }

  // Determine layout mode
  const isTablet = layout.windowWidth >= 480 && layout.windowWidth < 778;
  const showHorizontalScroll = isTablet;
  const isMobileView = layout.windowWidth < 480;

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <div className={`h-screen w-full overflow-hidden flex flex-col bg-background ${session.isInterviewMode ? 'border-4 border-green-500/30' : ''}`}>
        <AlgorithmHeader
          user={user}
          algorithm={activeAlgorithm}
          isMobile={layout.isMobile}
          windowWidth={layout.windowWidth}
          isInterviewMode={session.isInterviewMode}
          toggleInterviewMode={session.toggleInterviewMode}
          timerSeconds={session.timerSeconds}
          isTimerRunning={session.isTimerRunning}
          setIsTimerRunning={session.setIsTimerRunning}
          setTimerSeconds={session.setTimerSeconds}
          formatTime={session.formatTime}
          handleRandomProblem={interactions.handleRandomProblem}
          handleNextProblem={interactions.handleNextProblem}
          handlePreviousProblem={interactions.handlePreviousProblem}
          handleShare={interactions.handleShare}
          handleSignOut={handleSignOut}
          onRun={handleRun}
          onSubmit={handleSubmit}
          onThinkpad={() => runnerRef.current?.openThinkpad()}
          isRunnerLoading={runnerState.isLoading}
          isRunnerSubmitting={runnerState.isSubmitting}
          lastRunSuccess={runnerState.lastRunSuccess}
          activeListType={activeListType}
          onToggleSidebar={() => setIsSidebarOpen(true)}
        />

        <div className={`flex-1 relative ${showHorizontalScroll ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'}`}>
          {(activeAlgorithm?.controls as any)?.maintenance_mode ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-card/30 backdrop-blur-sm p-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                <div className="bg-primary/10 p-6 rounded-full">
                  <Code2 className="w-12 h-12 text-primary animate-bounce duration-1000" />
                </div>
              </div>
              <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font- tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Under Maintenance
                </h1>
                <p className="text-muted-foreground">
                  This algorithm is currently getting a makeover. Please check back shortly!
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" className="gap-2 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Problems
                </Button>
              </Link>
            </div>
          ) : (
            isMobileView ? (
              <div className="h-full overflow-y-auto no-scrollbar pb-20 scroll-smooth">
                <div className="min-h-screen">
                  <ProblemDescriptionPanel
                    algorithm={activeAlgorithm}
                    activeTab={layout.activeTab}
                    setActiveTab={layout.setActiveTab}
                    isMobile={true}
                    toggleLeftPanel={layout.toggleLeftPanel}
                    isCompleted={interactions.isCompleted}
                    likes={interactions.likes}
                    dislikes={interactions.dislikes}
                    userVote={interactions.userVote}
                    isFavorite={interactions.isFavorite}
                    handleVote={interactions.handleVote}
                    toggleFavorite={interactions.toggleFavorite}
                    isVisualizationMaximized={layout.isVisualizationMaximized}
                    setIsVisualizationMaximized={layout.setIsVisualizationMaximized}
                    handleRichTextClick={handleRichTextClick}
                  />
                </div>

                <div id="mobile-code-section" className="min-h-screen border-t-4 border-muted">
                  <CodeWorkspacePanel
                    algorithm={activeAlgorithm}
                    algorithmId={algorithmIdOrSlug || ""}
                    isMobile={true}
                    toggleRightPanel={layout.toggleRightPanel}
                    savedCode={interactions.savedCode}
                    handleCodeChange={interactions.handleCodeChange}
                    handleCodeSuccess={interactions.handleCodeSuccess}
                    selectedLanguage={interactions.selectedLanguage}
                    setSelectedLanguage={interactions.setSelectedLanguage}
                    isCodeRunnerMaximized={layout.isCodeRunnerMaximized}
                    setIsCodeRunnerMaximized={layout.setIsCodeRunnerMaximized}
                    submissions={submissions}
                    className="h-[85vh]"
                    isInterviewMode={session.isInterviewMode}
                  />
                </div>

                <div className="fixed bottom-6 right-6 z-50">
                  <Button
                    size="icon"
                    className="rounded-full h-12 w-12 shadow-lg hover:shadow-xl transition-shadow bg-primary text-primary-foreground"
                    onClick={scrollToCode}
                  >
                    <ArrowDown className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`h-full ${showHorizontalScroll ? 'min-w-[778px]' : 'w-full'}`}>
                <ResizablePanelGroup direction="horizontal" className="h-full">
                  <ResizablePanel
                    ref={layout.leftPanelRef}
                    defaultSize={40}
                    minSize={20}
                    maxSize={80}
                    collapsible={true}
                    className={layout.isLeftCollapsed ? 'min-w-[0px]' : ''}
                  >
                    <ProblemDescriptionPanel
                      algorithm={activeAlgorithm}
                      activeTab={layout.activeTab}
                      setActiveTab={layout.setActiveTab}
                      isMobile={layout.isMobile}
                      toggleLeftPanel={layout.toggleLeftPanel}
                      isCompleted={interactions.isCompleted}
                      likes={interactions.likes}
                      dislikes={interactions.dislikes}
                      userVote={interactions.userVote}
                      isFavorite={interactions.isFavorite}
                      handleVote={interactions.handleVote}
                      toggleFavorite={interactions.toggleFavorite}
                      isVisualizationMaximized={layout.isVisualizationMaximized}
                      setIsVisualizationMaximized={layout.setIsVisualizationMaximized}
                      handleRichTextClick={handleRichTextClick}
                    />
                  </ResizablePanel>

                  <ResizableHandle withHandle className="bg-border hover:bg-primary/20 data-[resize-handle-active]:bg-primary/40 transition-colors" />

                  <ResizablePanel
                    ref={layout.rightPanelRef}
                    defaultSize={60}
                    minSize={20}
                    maxSize={80}
                    collapsible={true}
                    className={layout.isRightCollapsed ? 'min-w-[0px]' : ''}
                  >
                    {codeWorkspacePanel}
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            )
          )}
        </div>

        <SheetContent side="left" className="w-full sm:max-w-[600px] p-0 border-r border-border shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border bg-background">
            <Select 
              value={activeListType || "all"} 
              onValueChange={(val) => setActiveListType(val as any)}
            >
              <SelectTrigger className="border-none bg-transparent hover:bg-muted/50 focus:ring-0 px-2 h-9 text-sm font-medium w-fit min-w-[140px] gap-2 transition-colors">
                <SelectValue>
                  {LIST_TYPE_LABELS[activeListType as any] || 'Problem List'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Problems</SelectItem>
                {Object.entries(LIST_TYPE_LABELS)
                  .filter(([key]) => key !== 'all')
                  .map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 overflow-hidden">
            <ProblemSidebar
              algorithms={filteredAlgorithms as any}
              progressMap={progressMap || {}}
              isPaywallEnabled={isPaywallEnabled}
              hasPremiumAccess={hasPremiumAccess}
              className="h-full"
              onItemClick={() => setIsSidebarOpen(false)}
            />
          </div>
        </SheetContent>
      </div>
    </Sheet>
  );
};

export default ProblemDetailClient;
