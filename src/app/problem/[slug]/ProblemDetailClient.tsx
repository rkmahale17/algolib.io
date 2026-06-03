"use client";

import { AlignLeft, Maximize, Minimize2, RotateCcw } from "lucide-react";
import { ArrowDown, ArrowLeft, Code2 } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
// Components
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { CodeRunnerRef } from "@/components/CodeRunner/CodeRunner";
import { CodeWorkspacePanel } from "@/components/algorithm/CodeWorkspacePanel";
import { LIST_TYPE_LABELS } from "@/types/algorithm";
import { LanguageSelector } from "@/components/CodeRunner/LanguageSelector";
import Link from "next/link";
// Refactored Components
import Navbar from "@/components/Navbar";
import { Paywall } from "@/components/Paywall";
import { ProblemDescriptionPanel } from "@/components/algorithm/ProblemDescriptionPanel";
import { ProblemSidebar } from "@/components/ProblemSidebar";
import { Progress } from "@/components/ui/progress";
import { SettingsPopover } from "@/components/CodeRunner/SettingsPopover";
import dynamic from "next/dynamic";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAlgorithm } from "@/hooks/useAlgorithm";
import { useAlgorithmInteractions } from "@/hooks/useAlgorithmInteractions";
// Hooks
import { useAlgorithmLayout } from "@/hooks/useAlgorithmLayout";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { useApp } from "@/contexts/AppContext";
import { useEditorSettings } from "@/hooks/useEditorSettings";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { usePostHog } from "@posthog/react";
import { useRouter } from "next/navigation";
import { useUserAlgorithmData } from "@/hooks/useUserAlgorithmData";

// Helper for scrolling to code section on mobile
const scrollToCode = () => {
  const codeSection = document.getElementById("mobile-code-section");
  if (codeSection) {
    codeSection.scrollIntoView({ behavior: "smooth" });
  }
};

interface ProblemDetailClientProps {
  initialAlgorithm: any;
  slug: string;
  isCrawler?: boolean;
}

const ProblemDetailClient: React.FC<ProblemDetailClientProps> = ({
  initialAlgorithm,
  slug,
  isCrawler = false,
}) => {
  const algorithmIdOrSlug = slug;
  const router = useRouter();
  const posthog = usePostHog();

  // -- Data Fetching State --
  // We seed useAlgorithm with initial data from server
  const { data: algorithm } = useAlgorithm(algorithmIdOrSlug);
  const activeAlgorithm = algorithm || initialAlgorithm;

  const {
    user,
    profile,
    hasPremiumAccess,
    activeListType,
    setActiveListType,
    progressMap,
  } = useApp();
  const { data: algorithmsData } = useAlgorithms();
  const isUserAdmin = profile?.role === "admin";

  const allAlgorithms = useMemo(
    () =>
      (algorithmsData?.algorithms || [])
        .filter((algo) => algo.problemType === "dsa")
        .filter((algo) => algo.published !== false || isUserAdmin),
    [algorithmsData, isUserAdmin],
  );
  const isPaywallEnabled = useFeatureFlag("paywall_enabled");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPremiumAlgorithm = useMemo(() => {
    return !!(
      activeAlgorithm?.is_premium ||
      activeAlgorithm?.is_pro ||
      activeAlgorithm?.metadata?.is_pro
    );
  }, [activeAlgorithm]);

  // -- Hooks --
  const layout = useAlgorithmLayout();
  const session = useInterviewSession();
  const { settings, updateSetting } = useEditorSettings();

  // Fetch user data hook
  const {
    data: userAlgoData,
    loading: loadingUserData,
    refetch: refetchUserData,
  } = useUserAlgorithmData({
    userId: user?.id,
    algorithmId: algorithmIdOrSlug || "",
    enabled: !!user && !!algorithmIdOrSlug,
  });

  const filteredAlgorithms = useMemo(() => {
    if (!allAlgorithms) return [];
    if (!activeListType || activeListType === "all") return allAlgorithms;

    const currentListType = activeListType.toLowerCase();
    return allAlgorithms.filter((algo) => {
      const listTypes =
        algo.listTypes || (algo.list_type ? [algo.list_type] : []);
      const normalizedListTypes = listTypes.map((t: string) =>
        t.toLowerCase() === "corealgo" ? "core" : t.toLowerCase(),
      );
      return normalizedListTypes.includes(currentListType);
    });
  }, [allAlgorithms, activeListType]);

  const totalCount = filteredAlgorithms.length;
  const completedCount = useMemo(() => {
    if (!progressMap) return 0;
    return filteredAlgorithms.filter(
      (algo) => progressMap[algo.id] === "solved",
    ).length;
  }, [filteredAlgorithms, progressMap]);
  const progressPercentage =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const interactions = useAlgorithmInteractions({
    user,
    algorithmId: algorithmIdOrSlug,
    algorithm: activeAlgorithm,
    userAlgoData,
    refetchUserData,
    filteredAlgorithms,
  });

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (userAlgoData?.submissions) {
      setSubmissions(userAlgoData.submissions);
    }
  }, [userAlgoData?.submissions]);

  const handleSelectSubmission = useCallback(
    (submission: any) => {
      // 1. Find which panel contains the "editor" (Code) tab and activate it first
      if (layout.leftTabs.includes("editor")) {
        layout.setActiveLeftTab("editor");
      } else if (layout.rightTabs.includes("editor")) {
        layout.setActiveRightTab("editor");
      } else {
        layout.addTab("right", "editor");
      }

      // 2. Select the submission after a short timeout so Monaco mounts inside a visible container
      setTimeout(() => {
        runnerRef.current?.selectSubmission(submission);
      }, 50);
    },
    [
      layout.leftTabs,
      layout.rightTabs,
      layout.setActiveLeftTab,
      layout.setActiveRightTab,
      layout.addTab,
    ],
  );

  // -- Code Runner Control --
  const runnerRef = React.useRef<CodeRunnerRef>(null);
  const [runnerState, setRunnerState] = useState({
    isLoading: false,
    isSubmitting: false,
    lastRunSuccess: false,
    viewingSubmission: null as any,
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
      posthog?.capture("problem_opened", {
        problemId: algorithmIdOrSlug,
        problemName: activeAlgorithm.name,
        difficulty: activeAlgorithm.difficulty,
        listType: activeListType,
      });
    }
  }, [activeAlgorithm, algorithmIdOrSlug, posthog, activeListType]);

  // 3. Track Tab Switch
  useEffect(() => {
    if (activeAlgorithm) {
      posthog?.capture("problem_tab_switched", {
        problemId: algorithmIdOrSlug,
        tabName: layout.activeTab,
        panel: "left",
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

  const handleRichTextClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href === "#visualization") {
          e.preventDefault();
          if (layout.leftTabs.includes("visualizations")) {
            layout.setActiveLeftTab("visualizations");
          } else if (layout.rightTabs.includes("visualizations")) {
            layout.setActiveRightTab("visualizations");
          } else {
            layout.addTab("left", "visualizations");
          }
        }
      }
    },
    [
      layout.leftTabs,
      layout.rightTabs,
      layout.setActiveLeftTab,
      layout.setActiveRightTab,
      layout.addTab,
    ],
  );

  const activateWorkspaceTab = useCallback(
    (tabId: string) => {
      if (layout.isMobile) {
        if (layout.leftTabs.includes(tabId)) {
          layout.setActiveLeftTab(tabId);
        } else {
          layout.addTab("left", tabId);
        }
        return;
      }

      if (layout.leftTabs.includes(tabId)) {
        layout.setActiveLeftTab(tabId);
      } else if (layout.rightTabs.includes(tabId)) {
        layout.setActiveRightTab(tabId);
      } else {
        const targetPanel = tabId === "thinkpad" ? "right" : "left";
        layout.addTab(targetPanel, tabId);
      }
    },
    [
      layout.isMobile,
      layout.leftTabs,
      layout.rightTabs,
      layout.setActiveLeftTab,
      layout.setActiveRightTab,
      layout.addTab,
    ],
  );

  const isLeftPanelEditorActive =
    layout.activeLeftTab === "editor" && layout.leftTabs.includes("editor");
  const isRightPanelEditorActive =
    layout.activeRightTab === "editor" && layout.rightTabs.includes("editor");

  const availableLanguages = useMemo(() => {
    const controls = activeAlgorithm?.controls?.code_runner;
    return controls?.languages
      ? (Object.keys(controls.languages) as any[]).filter(
          (lang) => controls.languages[lang],
        )
      : undefined;
  }, [activeAlgorithm]);

  const getEditorHeaderContent = useCallback(
    (panelId: "left" | "right") => {
      const isActive =
        panelId === "left" ? isLeftPanelEditorActive : isRightPanelEditorActive;
      if (!isActive || runnerState.viewingSubmission) return null;

      const handleReset = () => {
        runnerRef.current?.reset?.();
      };

      const handleFormat = () => {
        runnerRef.current?.formatCode?.();
      };

      const isFullscreen = layout.isCodeRunnerMaximized;
      const toggleFullscreen = () => {
        layout.setIsCodeRunnerMaximized(!layout.isCodeRunnerMaximized);
      };

      return (
        <TooltipProvider>
          <div className="flex items-center h-full select-none">
            <LanguageSelector
              language={interactions.selectedLanguage as any}
              onLanguageChange={(lang) =>
                interactions.setSelectedLanguage(lang)
              }
              availableLanguages={availableLanguages}
              disabled={runnerState.isLoading || runnerState.isSubmitting}
            />
            <div className="flex items-center gap-1 pl-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={handleReset}
                    disabled={runnerState.isLoading || runnerState.isSubmitting}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[150]">
                  Reset to starter code
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={handleFormat}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[150]">
                  Format code
                </TooltipContent>
              </Tooltip>

              <SettingsPopover
                settings={settings}
                updateSetting={updateSetting}
              />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="z-[150]">
                  {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      );
    },
    [
      isLeftPanelEditorActive,
      isRightPanelEditorActive,
      interactions.selectedLanguage,
      interactions.setSelectedLanguage,
      availableLanguages,
      runnerState.isLoading,
      runnerState.isSubmitting,
      layout.isCodeRunnerMaximized,
      layout.setIsCodeRunnerMaximized,
      settings,
      updateSetting,
    ],
  );

  const codeWorkspacePanel = useMemo(
    () => (
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
        setSubmissions={setSubmissions}
        codeRunnerRef={runnerRef}
        onRunnerStateChange={handleRunnerStateChange}
        isLoading={loadingUserData}
        hasPremiumAccess={hasPremiumAccess}
        handleRandomProblem={interactions.handleRandomProblem}
        handleNextProblem={interactions.handleNextProblem}
        handlePreviousProblem={interactions.handlePreviousProblem}
        onSubmissionComplete={() => {
          refetchUserData();
          if (layout.leftTabs.includes("submissions")) {
            layout.setActiveLeftTab("submissions");
          } else if (layout.rightTabs.includes("submissions")) {
            layout.setActiveRightTab("submissions");
          } else {
            layout.addTab("left", "submissions");
          }
        }}
        hideToolbar={!layout.isMobile}
      />
    ),
    [
      activeAlgorithm,
      algorithmIdOrSlug,
      layout.isMobile,
      layout.toggleRightPanel,
      interactions.handleCodeChange,
      interactions.handleCodeSuccess,
      interactions.selectedLanguage,
      interactions.setSelectedLanguage,
      layout.isCodeRunnerMaximized,
      layout.setIsCodeRunnerMaximized,
      submissions,
      loadingUserData,
      interactions.handleRandomProblem,
      interactions.handleNextProblem,
      interactions.handlePreviousProblem,
      layout.leftTabs,
      layout.rightTabs,
      layout.setActiveLeftTab,
      layout.setActiveRightTab,
      layout.addTab,
      refetchUserData,
    ],
  );

  // -- Render Guards --

  // Paywall Logic - Bypassed for Search Engine Crawlers to allow SEO indexing of the problem descriptions
  if (
    isPaywallEnabled &&
    isPremiumAlgorithm &&
    !hasPremiumAccess &&
    !isCrawler
  ) {
    return <Paywall />;
  }

  // Determine layout mode
  const isTablet = false; // layout.windowWidth >= 768 && layout.windowWidth < 1024;
  const showHorizontalScroll = false;
  const isMobileView = layout.windowWidth < 768;

  const isUnpublished = activeAlgorithm?.published === false;

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <style
        dangerouslySetInnerHTML={{
          __html: ".global-nav { display: none !important; }",
        }}
      />
      <div
        className={`h-screen w-full overflow-hidden flex flex-col bg-background ${session.isInterviewMode ? "border-4 border-green-500/30" : ""}`}
      >
        <Navbar
          isProblemMode={true}
          algorithm={activeAlgorithm}
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
          onToggleSidebar={() => setIsSidebarOpen(true)}
          activeListType={activeListType}
        />

        {isUnpublished && (
          <div className="bg-yellow-500/20 border-b border-yellow-500/30 px-4 py-1.5 text-center text-xs font-medium text-yellow-200 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span>
              Admin Preview: This problem is a draft (unpublished) and not
              visible to regular users.
            </span>
          </div>
        )}

        <div
          className={`flex-1 relative ${showHorizontalScroll ? "overflow-x-auto overflow-y-hidden" : "overflow-hidden"}`}
        >
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
                  This algorithm is currently getting a makeover. Please check
                  back shortly!
                </p>
              </div>
              <Link href="/">
                <Button variant="outline" className="gap-2 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Problems
                </Button>
              </Link>
            </div>
          ) : isMobileView ? (
            <div className="h-full overflow-y-auto no-scrollbar pb-20 scroll-smooth">
              <div className="min-h-screen">
                <div className="min-h-screen p-3 pt-0.5">
                  <div className="h-full rounded-xl overflow-hidden border border-border/70 shadow-md bg-card/30 backdrop-blur-sm">
                    <ProblemDescriptionPanel
                      algorithm={activeAlgorithm}
                      activeTab={layout.activeLeftTab}
                      setActiveTab={layout.setActiveLeftTab}
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
                      setIsVisualizationMaximized={
                        layout.setIsVisualizationMaximized
                      }
                      handleRichTextClick={handleRichTextClick}
                      submissions={submissions}
                      user={user}
                      onSelectSubmission={handleSelectSubmission}
                      panelId="left"
                      tabs={layout.leftTabs}
                      onAddTab={(tab) => layout.addTab("left", tab)}
                      onRemoveTab={(tab) => layout.removeTab("left", tab)}
                      onActivateTab={activateWorkspaceTab}
                      editorContent={codeWorkspacePanel}
                    />
                  </div>
                </div>
              </div>

              <div
                id="mobile-code-section"
                className="min-h-screen border-t-4 border-muted p-3 pt-0.5"
              >
                <div className="h-full rounded-xl overflow-hidden border border-border/70 shadow-md bg-card/30 backdrop-blur-sm">
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
                    isInterviewMode={session.isInterviewMode}
                    handleRandomProblem={interactions.handleRandomProblem}
                    handleNextProblem={interactions.handleNextProblem}
                    handlePreviousProblem={interactions.handlePreviousProblem}
                    submissions={submissions}
                    setSubmissions={setSubmissions}
                    onSubmissionComplete={() => {
                      refetchUserData();
                      if (layout.leftTabs.includes("submissions")) {
                        layout.setActiveLeftTab("submissions");
                      } else if (layout.rightTabs.includes("submissions")) {
                        layout.setActiveRightTab("submissions");
                      } else {
                        layout.addTab("left", "submissions");
                      }
                    }}
                    className="h-[85vh]"
                  />
                </div>
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
            <div
              className={`h-full ${showHorizontalScroll ? "min-w-[778px]" : "w-full"}`}
            >
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel
                  ref={layout.leftPanelRef}
                  defaultSize={40}
                  minSize={20}
                  maxSize={80}
                  collapsible={true}
                  className={layout.isLeftCollapsed ? "min-w-[0px]" : ""}
                >
                  <div className="h-full p-1.5 pt-0 pr-0 sm:p-2 sm:pt-0 sm:pr-0">
                    <div className="h-full rounded-xl overflow-hidden border border-border/70 shadow-md bg-card/30 backdrop-blur-sm">
                      <ProblemDescriptionPanel
                        algorithm={activeAlgorithm}
                        activeTab={layout.activeLeftTab}
                        setActiveTab={layout.setActiveLeftTab}
                        isMobile={layout.isMobile}
                        toggleLeftPanel={layout.toggleLeftPanel}
                        isCompleted={interactions.isCompleted}
                        likes={interactions.likes}
                        dislikes={interactions.dislikes}
                        userVote={interactions.userVote}
                        isFavorite={interactions.isFavorite}
                        handleVote={interactions.handleVote}
                        toggleFavorite={interactions.toggleFavorite}
                        isVisualizationMaximized={
                          layout.isVisualizationMaximized
                        }
                        setIsVisualizationMaximized={
                          layout.setIsVisualizationMaximized
                        }
                        handleRichTextClick={handleRichTextClick}
                        hasPremiumAccess={hasPremiumAccess}
                        user={user}
                        submissions={submissions}
                        onSelectSubmission={handleSelectSubmission}
                        panelId="left"
                        tabs={layout.leftTabs}
                        onAddTab={(tab) => layout.addTab("left", tab)}
                        onRemoveTab={(tab) => layout.removeTab("left", tab)}
                        onActivateTab={activateWorkspaceTab}
                        editorContent={codeWorkspacePanel}
                        rightHeaderContent={getEditorHeaderContent("left")}
                      />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle className="bg-transparent hover:bg-primary/5 data-[resize-handle-active]:bg-primary/10 transition-colors w-1 group">
                  <div className="z-10 flex h-10 w-1 items-center justify-center rounded-full bg-muted-foreground/40 group-hover:bg-primary transition-colors shadow-sm" />
                </ResizableHandle>

                <ResizablePanel
                  ref={layout.rightPanelRef}
                  defaultSize={60}
                  minSize={20}
                  maxSize={80}
                  collapsible={true}
                  className={layout.isRightCollapsed ? "min-w-[0px]" : ""}
                >
                  <div className="h-full pt-0 pl-0 pr-0 sm:pt-0 sm:pl-0 sm:pr-0 pb-1.5 sm:pb-2 mr-2">
                    <div className="h-full rounded-lg overflow-hidden border border-border/70 shadow-md bg-card/30 backdrop-blur-sm">
                      <ProblemDescriptionPanel
                        algorithm={activeAlgorithm}
                        activeTab={layout.activeRightTab}
                        setActiveTab={layout.setActiveRightTab}
                        isMobile={layout.isMobile}
                        toggleLeftPanel={layout.toggleRightPanel}
                        isCompleted={interactions.isCompleted}
                        likes={interactions.likes}
                        dislikes={interactions.dislikes}
                        userVote={interactions.userVote}
                        isFavorite={interactions.isFavorite}
                        handleVote={interactions.handleVote}
                        toggleFavorite={interactions.toggleFavorite}
                        isVisualizationMaximized={
                          layout.isVisualizationMaximized
                        }
                        setIsVisualizationMaximized={
                          layout.setIsVisualizationMaximized
                        }
                        handleRichTextClick={handleRichTextClick}
                        hasPremiumAccess={hasPremiumAccess}
                        user={user}
                        submissions={submissions}
                        onSelectSubmission={handleSelectSubmission}
                        panelId="right"
                        tabs={layout.rightTabs}
                        onAddTab={(tab) => layout.addTab("right", tab)}
                        onRemoveTab={(tab) => layout.removeTab("right", tab)}
                        onActivateTab={activateWorkspaceTab}
                        editorContent={codeWorkspacePanel}
                        rightHeaderContent={getEditorHeaderContent("right")}
                      />
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          )}
        </div>

        <SheetContent
          side="right"
          className="w-full sm:max-w-[600px] p-0 border-l border-border shadow-2xl flex flex-col gap-0 [&>button]:top-[6px]"
        >
          <div className="flex items-center justify-between py-2 px-4 pr-14 border-b border-border bg-background gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Select
                value={activeListType || "all"}
                onValueChange={(val) => setActiveListType(val as any)}
              >
                <SelectTrigger className="border border-border/80 bg-muted/50 hover:bg-muted/85 focus:ring-0 px-3 h-8 text-sm font-medium w-fit min-w-[130px] gap-2 transition-colors rounded-md shrink-0">
                  <SelectValue>
                    {LIST_TYPE_LABELS[activeListType as any] || "Problem List"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Problems</SelectItem>
                  {Object.entries(LIST_TYPE_LABELS)
                    .filter(([key]) => key !== "all" && key !== "blind150")
                    .map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Progress Bar */}
              <div className="flex items-center gap-2.5 flex-1 max-w-[200px] min-w-[100px] border border-border/80 bg-muted/30 px-2.5 h-8 rounded-md">
                <Progress value={progressPercentage} className="h-1.5 flex-1 bg-muted" />
                <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
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
