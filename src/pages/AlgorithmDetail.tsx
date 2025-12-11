import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Code2, ArrowLeft, Eye, Lightbulb, Minimize2, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Components
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { PremiumLoader } from "@/components/PremiumLoader";
import AlgoMetaHead from "@/services/meta.injectot";
import { CodeRunner } from "@/components/CodeRunner/CodeRunner";
import { BrainstormSection } from "@/components/brainstorm/BrainstormSection";

// New Refactored Components
import { AlgorithmHeader } from "@/components/algorithm/AlgorithmHeader";
import { ProblemDescriptionPanel } from "@/components/algorithm/ProblemDescriptionPanel";
import { CodeWorkspacePanel } from "@/components/algorithm/CodeWorkspacePanel";

// New Hooks
import { useAlgorithmLayout } from "@/hooks/useAlgorithmLayout";
import { useInterviewSession } from "@/hooks/useInterviewSession";
import { useAlgorithmInteractions } from "@/hooks/useAlgorithmInteractions";
import { useUserAlgorithmData } from "@/hooks/useUserAlgorithmData";

// Helper for scrolling to code section on mobile
const scrollToCode = () => {
  const codeSection = document.getElementById('mobile-code-section');
  if (codeSection) {
    codeSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const AlgorithmDetail: React.FC = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  // Support both /algorithm/:id and /blind75/:slug
  const algorithmIdOrSlug = id || slug; 
  const navigate = useNavigate();
  
  // -- Data Fetching State --
  const [algorithm, setAlgorithm] = useState<any>(undefined);
  const [isLoadingAlgorithm, setIsLoadingAlgorithm] = useState(true);
  const [user, setUser] = useState<any>(null);

  // -- Hooks --
  const layout = useAlgorithmLayout();
  const session = useInterviewSession();
  
  // Fetch user data hook
  const { data: userAlgoData, loading: loadingUserData, refetch: refetchUserData } = useUserAlgorithmData({
    userId: user?.id,
    algorithmId: algorithmIdOrSlug || '',
    enabled: !!user && !!algorithmIdOrSlug,
  });

  const interactions = useAlgorithmInteractions({
    user,
    algorithmId: algorithmIdOrSlug,
    algorithm,
    userAlgoData,
    refetchUserData,
  });

  const submissions = useMemo(() => userAlgoData?.submissions || [], [userAlgoData?.submissions]);

  // -- Effects --
  
  // 1. Auth Listener
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Algorithm Data
  useEffect(() => {
    const fetchAlgorithm = async () => {
      if (!algorithmIdOrSlug) return;
      if (!supabase) {
        setIsLoadingAlgorithm(false);
        return;
      }

      setIsLoadingAlgorithm(true);
      try {
        let query = supabase.from('algorithms').select('*');
        const isSlug = algorithmIdOrSlug.includes('-') && !algorithmIdOrSlug.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        
        query = query.eq('id', algorithmIdOrSlug);
        
        const { data, error } = await query.single();
        if (error) throw error;
        
        const metadata = data.metadata || {};
        const metadataObj = (typeof metadata === 'object' && metadata !== null ? metadata : {}) as Record<string, any>;
        const transformedData = {
          ...data,
          ...metadataObj,
          metadata: data.metadata
        };
        
        setAlgorithm(transformedData);
        // Initial like/dislike counts
        interactions.setLikes((metadataObj.likes as number) || 0);
        interactions.setDislikes((metadataObj.dislikes as number) || 0);
      } catch (error) {
        console.error('Error fetching algorithm:', error);
        toast.error('Failed to load algorithm details');
      } finally {
        setTimeout(() => {
          setIsLoadingAlgorithm(false);
        }, 1500);
      }
    };

    fetchAlgorithm();
  }, [algorithmIdOrSlug]);

  // -- Handlers --
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
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
      algorithm={algorithm}
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
    />
  ), [
    algorithm, 
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
    submissions
  ]);

  // -- Render Guards --

  if (isLoadingAlgorithm) {
    return <PremiumLoader text="Fetching Algorithm Details" />;
  }



  // Not Found
  if (!algorithm) {
    return (
      <>
        <AlgoMetaHead id={id} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
             <h2 className="text-2xl font-bold">Algorithm not found</h2>
             <Link to="/">
               <Button>Go Home</Button>
             </Link>
          </div>
        </div>
      </>
    );
  }



  // Determine layout mode
  const isTablet = layout.windowWidth >= 480 && layout.windowWidth < 778;
  const showHorizontalScroll = isTablet; 
  const isMobileView = layout.windowWidth < 480;



  return (
    <div className={`h-screen w-full overflow-hidden flex flex-col bg-background ${session.isInterviewMode ? 'border-4 border-green-500/30' : ''}`}>
      <AlgoMetaHead id={algorithmIdOrSlug} />

      <AlgorithmHeader
        user={user}
        algorithm={algorithm}
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
        handleShare={interactions.handleShare}
        handleSignOut={handleSignOut}
      />

      <div className={`flex-1 relative ${showHorizontalScroll ? 'overflow-x-auto overflow-y-hidden' : 'overflow-hidden'}`}>
         
         {algorithm?.controls?.maintenance_mode ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-card/30 backdrop-blur-sm p-4 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                 <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                 <div className="bg-primary/10 p-6 rounded-full">
                    <Code2 className="w-12 h-12 text-primary animate-bounce duration-1000" />
                 </div>
              </div>
              <div className="space-y-2 max-w-md">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Under Maintenance
                </h1>
                <p className="text-muted-foreground">
                  This algorithm is currently getting a makeover. Please check back shortly!
                </p>
              </div>
              <Link to="/">
                <Button variant="outline" className="gap-2 hover:bg-primary/10">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Problems
                </Button>
              </Link>
            </div>
         ) : (
             /* Normal Content */
             isMobileView ? (
               <div className="h-full overflow-y-auto no-scrollbar pb-20 scroll-smooth">
                  {/* Top: Description */}
                  <div className="min-h-screen">
                    <ProblemDescriptionPanel
                       algorithm={algorithm}
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

                  {/* Bottom: Code Workspace */}
                  <div id="mobile-code-section" className="min-h-screen border-t-4 border-muted">
                     <CodeWorkspacePanel
                        algorithm={algorithm}
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
                  
                  {/* Floating Action Button for Mobile Scroll */}
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
               /* Tablet/Desktop View (>= 480px): Resizable Panels */
               <div className={`h-full ${showHorizontalScroll ? 'min-w-[778px]' : 'w-full'}`}>
                 <ResizablePanelGroup direction="horizontal" className="h-full">
                    {/* Left Panel */}
                    <ResizablePanel
                       ref={layout.leftPanelRef}
                       defaultSize={40}
                       minSize={20}
                       maxSize={80}
                       collapsible={true}
                       onCollapse={() => {
                          // If utilizing local storage sync, update it here
                       }}
                       className={layout.isLeftCollapsed ? 'min-w-[0px]' : ''}
                    >
                       <ProblemDescriptionPanel
                          algorithm={algorithm}
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

                    {/* Right Panel */}
                    <ResizablePanel
                       ref={layout.rightPanelRef}
                       defaultSize={60}
                       minSize={20}
                       maxSize={80}
                       collapsible={true}
                       onCollapse={() => {}}
                       className={layout.isRightCollapsed ? 'min-w-[0px]' : ''}
                    >
                       {codeWorkspacePanel}
                    </ResizablePanel>
                 </ResizablePanelGroup>
               </div>
             )
         )}
      </div>
    </div>
  );
};

export default AlgorithmDetail;
