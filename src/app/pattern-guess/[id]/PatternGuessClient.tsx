"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import { Paywall } from "@/components/Paywall";
import { ProblemSidebar } from "@/components/ProblemSidebar";
import { ProblemDescriptionPanel } from "@/components/algorithm/ProblemDescriptionPanel";
import { PatternGuessPanel } from "@/components/algorithm/PatternGuessPanel";
import { PatternOutputPanel } from "@/components/algorithm/PatternOutputPanel";
import { useAlgorithm } from "@/hooks/useAlgorithm";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { useAlgorithmLayout } from "@/hooks/useAlgorithmLayout";
import { useApp } from "@/contexts/AppContext";
import { useFeatureFlag } from "@/contexts/FeatureFlagContext";
import { useUserAlgorithmData } from "@/hooks/useUserAlgorithmData";
import { updatePatternAssessmentProgress } from "@/utils/userAlgorithmDataHelpers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_ORDER, resolveAlgoCategories } from '@/constants/categories';

interface PatternGuessClientProps {
  initialAlgorithm: any;
  slug: string;
  isCrawler?: boolean;
}

const PatternGuessClient: React.FC<PatternGuessClientProps> = ({
  initialAlgorithm,
  slug,
  isCrawler = false,
}) => {
  const router = useRouter();
  const { data: algorithm } = useAlgorithm(slug);
  const { data: allAlgorithmsData } = useAlgorithms();
  const activeAlgorithm = algorithm || initialAlgorithm;

  const { user, hasPremiumAccess, profile, progressMap } = useApp();
  const layout = useAlgorithmLayout();
  const isUserAdmin = profile?.role === "admin";
  const isPaywallEnabled = useFeatureFlag("paywall_enabled");
  const isPremiumAlgorithm = useMemo(() => {
    return !!(
      activeAlgorithm?.is_premium ||
      activeAlgorithm?.is_pro ||
      activeAlgorithm?.metadata?.is_pro
    );
  }, [activeAlgorithm]);

  // Ensure this problem actually has pattern guess enabled
  const hasPatternGuess = activeAlgorithm?.controls?.has_pattern_guess;

  // -- User Data --
  const { data: userAlgoData, refetch: refetchUserData } = useUserAlgorithmData({
    userId: user?.id,
    algorithmId: slug || "",
    numericAlgorithmId: activeAlgorithm?.id?.toString(),
    enabled: !!user && !!slug,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedGuessPatterns, setSelectedGuessPatterns] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // -- Pattern Guess State --
  const [outputPanelState, setOutputPanelState] = useState<{
    isOpen: boolean;
    result: 'pass' | 'fail' | null;
    selectedPatterns: string[];
    isExpanded: boolean;
  }>({
    isOpen: false,
    result: null,
    selectedPatterns: [],
    isExpanded: false
  });
  
  const bottomPanelRef = useRef<ImperativePanelHandle>(null);

  const handleToggleExpand = () => {
    if (outputPanelState.isExpanded) {
      bottomPanelRef.current?.resize(40);
      setOutputPanelState(prev => ({ ...prev, isExpanded: false }));
    } else {
      bottomPanelRef.current?.resize(100);
      setOutputPanelState(prev => ({ ...prev, isExpanded: true }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawCategories = activeAlgorithm?.categories || [];
  
  const correctPatterns = useMemo(() => {
    const options = new Set([
      "Array", "Hash Map", "Sorting", "Two Pointers", "Prefix Sum", "Sliding Window",
      "Binary Search", "Stack", "Linked List", "Intervals", "Backtracking",
      "Trees", "Graphs", "Tries", "Greedy", "Dynamic Programming",
      "Math & Geometry", "Bit Manipulation", "Heap / Priority Queue",
      "Advanced Algorithms", "Design Pattern", "Divide and Conquer",
      "BFS", "DFS"
    ]);

    const result = new Set<string>();
    
    const exactMap: Record<string, string> = {
      "hash table": "Hash Map",
      "hashing": "Hash Map",
      "tree": "Trees",
      "bst": "Trees",
      "binary search tree": "Trees",
      "binary tree": "Trees",
      "graph": "Graphs",
      "bfs": "BFS",
      "dfs": "DFS",
      "trie": "Tries",
      "priority queue": "Heap / Priority Queue",
      "heap": "Heap / Priority Queue",
      "advanced graph": "Advanced Algorithms",
      "advanced graphs": "Advanced Algorithms",
      "union find": "Advanced Algorithms",
      "disjoint set": "Advanced Algorithms",
      "dynamic programming": "Dynamic Programming",
      "1-d dp": "Dynamic Programming",
      "2-d dp": "Dynamic Programming",
      "1-d dynamic programming": "Dynamic Programming",
      "2-d dynamic programming": "Dynamic Programming",
      "dp": "Dynamic Programming",
      "math": "Math & Geometry",
      "geometry": "Math & Geometry",
      "matrix": "Array",
      "simulation": "Array",
      "sorting": "Sorting",
      "merge sort": "Sorting",
      "bucket sort": "Sorting",
      "quick select": "Sorting",
      "quickselect": "Sorting",
      "arrays and sorting": "Sorting",
      "divide and conquer": "Divide and Conquer",
      "divide & conquer": "Divide and Conquer",
      "divide conquer": "Divide and Conquer"
    };

    rawCategories.forEach((c: string) => {
      const lowerC = c.toLowerCase().trim();
      
      let matched = false;
      for (const opt of options) {
        if (opt.toLowerCase() === lowerC) {
          result.add(opt);
          matched = true;
          break;
        }
      }
      if (matched) return;

      if (exactMap[lowerC]) {
        result.add(exactMap[lowerC]);
        return;
      }
      
      if (lowerC.includes('array')) result.add("Array");
      else if (lowerC.includes('hash')) result.add("Hash Map");
      else if (lowerC.includes('tree')) result.add("Trees");
      else if (lowerC.includes('graph')) result.add("Graphs");
    });

    return Array.from(result);
  }, [rawCategories]);

  const explanations = activeAlgorithm?.metadata?.pattern_explanations || {};

  const handleSubmitPatterns = async () => {
    if (!user?.id) {
      toast.error("Sign in to submit");
      return;
    }

    const selected = Array.from(selectedGuessPatterns);
    setIsSubmitting(true);
    
    // Evaluate
    // Correct if all selected are in correctPatterns AND all correctPatterns are selected
    const selectedSet = new Set(selected.map(p => p.toLowerCase()));
    const correctSet = new Set(correctPatterns.map(p => p.toLowerCase()));
    
    // Ignore 'Array' in evaluation unless it is the ONLY correct pattern
    const correctHasOnlyArray = correctSet.size === 1 && correctSet.has('array');
    if (!correctHasOnlyArray) {
      selectedSet.delete('array');
      correctSet.delete('array');
    }
    
    let isPass = true;
    if (selectedSet.size !== correctSet.size) {
      isPass = false;
    } else {
      for (const p of selectedSet) {
        if (!correctSet.has(p)) isPass = false;
      }
    }

    // Save to DB
    const historyUpdate = [...(userAlgoData?.pattern_assessment_history || [])];
    historyUpdate.push({
      timestamp: new Date().toISOString(),
      selected,
      result: isPass ? 'pass' : 'fail'
    });

    await updatePatternAssessmentProgress(
      user.id,
      activeAlgorithm.id,
      isPass || (userAlgoData?.pattern_assessment_completed || false),
      historyUpdate
    );
    refetchUserData();

    setIsSubmitting(false);
    setOutputPanelState({
      isOpen: true,
      result: isPass ? 'pass' : 'fail',
      selectedPatterns: selected,
      isExpanded: false
    });
  };

  const handleTogglePattern = (pattern: string) => {
    setSelectedGuessPatterns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pattern)) newSet.delete(pattern);
      else newSet.add(pattern);
      return newSet;
    });
  };

  // -- Render Guards --
  if (isPaywallEnabled && isPremiumAlgorithm && !hasPremiumAccess && !isCrawler) {
    return <Paywall />;
  }

  if (!hasPatternGuess && !isCrawler) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
         <Lock className="w-12 h-12 text-muted-foreground mb-4" />
         <h1 className="text-xl font-bold">Pattern Assessment Not Available</h1>
         <p className="text-muted-foreground mt-2">This problem does not have a pattern assessment yet.</p>
      </div>
    );
  }

  const isMobileView = layout.windowWidth < 768;

  // We enforce layout for Pattern Guess mode: no Code editor, no Thinkpad.
  // We can pass a prop or just rely on ProblemDescriptionPanel handling its own left tabs.
  const [leftTabs, setLeftTabs] = useState(["description", "solutions"]);
  const [activeLeftTab, setActiveLeftTab] = useState("description");

  const handleToggleTab = (tabId: string) => {
    if (leftTabs.includes(tabId)) {
        setActiveLeftTab(tabId);
    } else {
        setLeftTabs([...leftTabs, tabId]);
        setActiveLeftTab(tabId);
    }
  };

  const patternAlgorithms = useMemo(() => {
    return (allAlgorithmsData?.algorithms ?? [])
        .filter(algo => algo.controls?.has_pattern_guess)
        .filter(algo => algo.published !== false || isUserAdmin)
        .sort((a, b) => (a.serial_no || 0) - (b.serial_no || 0));
  }, [allAlgorithmsData, isUserAdmin]);

  const currentIndex = useMemo(() => {
    if (!patternAlgorithms.length || !activeAlgorithm) return -1;
    return patternAlgorithms.findIndex(a => a.id === activeAlgorithm.id);
  }, [patternAlgorithms, activeAlgorithm]);

  const handleNextProblem = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < patternAlgorithms.length - 1) {
      router.push(`/pattern-guess/${patternAlgorithms[currentIndex + 1].id}`);
    }
  }, [currentIndex, patternAlgorithms, router]);

  const handlePreviousProblem = useCallback(() => {
    if (currentIndex > 0) {
      router.push(`/pattern-guess/${patternAlgorithms[currentIndex - 1].id}`);
    }
  }, [currentIndex, patternAlgorithms, router]);

  const handleRandomProblem = useCallback(() => {
    if (patternAlgorithms.length > 0) {
      const idx = Math.floor(Math.random() * patternAlgorithms.length);
      router.push(`/pattern-guess/${patternAlgorithms[idx].id}`);
    }
  }, [patternAlgorithms, router]);

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <style
        dangerouslySetInnerHTML={{
          __html: ".global-nav { display: none !important; }",
        }}
      />
      <div className="h-screen w-full overflow-hidden flex flex-col bg-background">
        <Navbar
          isLoggedIn={!!user}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          isProblemMode={true}
          algorithm={activeAlgorithm}
          handleNextProblem={handleNextProblem}
          handlePreviousProblem={handlePreviousProblem}
          handleRandomProblem={handleRandomProblem}
          hideFeedback={true}
          activeListType="pattern-guess"
          onOpenRulo={() => handleToggleTab("rulo")}
        />
        
        <div className="flex-1 overflow-hidden relative">
          <ResizablePanelGroup
            direction={isMobileView ? "vertical" : "horizontal"}
            className="h-full relative"
          >
            {/* Left Panel: Description */}
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="h-full flex flex-col"
            >
              <div className="h-full p-1.5 pt-0 pr-0 sm:p-2 sm:pt-0 sm:pr-0">
                <div className="h-full rounded-xl overflow-hidden border border-border/70 shadow-md bg-card/30 backdrop-blur-sm">
                  <ProblemDescriptionPanel
                    algorithm={activeAlgorithm}
                    activeTab={activeLeftTab}
                    tabs={leftTabs}
                    setActiveTab={setActiveLeftTab}
                    onRemoveTab={(tab) => setLeftTabs(tabs => tabs.filter(t => t !== tab))}
                    onAddTab={(tab) => handleToggleTab(tab)}
                    isMobile={layout.isMobile}
                    toggleLeftPanel={() => {}}
                    isCompleted={userAlgoData?.pattern_assessment_completed || false}
                    likes={activeAlgorithm?.metadata?.likes || 0}
                    dislikes={activeAlgorithm?.metadata?.dislikes || 0}
                    userVote={userAlgoData?.user_vote || null}
                    isFavorite={userAlgoData?.is_favorite || false}
                    handleVote={() => {}}
                    toggleFavorite={() => {}}
                    isVisualizationMaximized={false}
                    setIsVisualizationMaximized={() => {}}
                    handleRichTextClick={() => {}}
                    hasPremiumAccess={hasPremiumAccess}
                    user={user}
                    submissions={[]}
                    isSubmissionsLoading={false}
                    panelId="left"
                    onActivateTab={handleToggleTab}
                    isPatternGuessContext={true}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="bg-transparent hover:bg-primary/5 data-[resize-handle-active]:bg-primary/10 transition-colors w-1 group">
              <div className="z-10 flex h-10 w-1 items-center justify-center rounded-full bg-muted-foreground/40 group-hover:bg-primary transition-colors shadow-sm" />
            </ResizableHandle>

            {/* Right Panel: Pattern Guess */}
            <ResizablePanel
              defaultSize={50}
              minSize={30}
              className="h-full flex flex-col relative bg-background"
            >
               <div className="h-full pt-0 pl-0 pr-0 sm:pt-0 sm:pl-0 sm:pr-0 pb-1.5 sm:pb-2 mr-2">
                 <div className="h-full rounded-lg overflow-hidden border border-border/70 shadow-md bg-card/30 backdrop-blur-sm relative flex flex-col">
                   <div className="flex-1 min-h-0 flex flex-col">
                     <ResizablePanelGroup direction="vertical" className="h-full">
                       <ResizablePanel defaultSize={outputPanelState.isOpen ? (outputPanelState.isExpanded ? 0 : 50) : 100} minSize={20}>
                         <PatternGuessPanel 
                            algorithm={activeAlgorithm}
                            selected={selectedGuessPatterns}
                            onToggle={handleTogglePattern}
                            submittedState={outputPanelState.isOpen ? 'submitted' : 'idle'}
                            searchQuery={searchQuery}
                         />
                       </ResizablePanel>

                       {outputPanelState.isOpen && (
                         <>
                           <ResizableHandle withHandle className="bg-muted/50 hover:bg-primary/20 data-[resize-handle-active]:bg-primary/40 transition-colors z-50" />
                           <ResizablePanel ref={bottomPanelRef} defaultSize={outputPanelState.isExpanded ? 100 : 50} minSize={20}>
                             <PatternOutputPanel 
                                isOpen={true}
                                onClose={() => setOutputPanelState(prev => ({...prev, isOpen: false}))}
                                result={outputPanelState.result}
                                selectedPatterns={outputPanelState.selectedPatterns}
                                correctPatterns={correctPatterns}
                                explanations={explanations}
                                isExpanded={outputPanelState.isExpanded}
                                onToggleExpand={handleToggleExpand}
                             />
                           </ResizablePanel>
                         </>
                       )}
                     </ResizablePanelGroup>
                   </div>
                   
                   {/* Custom Footer mimicking RunnerFooter */}
                   <div className="flex items-center pl-0 pr-1 bg-background border-t border-border shrink-0 z-20 h-10 relative">
                       <div className="flex-1 flex justify-start items-center gap-2">
                           <button
                               onClick={() => {
                                   if (!outputPanelState.isOpen) {
                                       setOutputPanelState(prev => ({...prev, isOpen: true, isExpanded: true}));
                                   } else {
                                       setOutputPanelState(prev => ({...prev, isOpen: false}));
                                   }
                               }}
                               className="flex items-center gap-2 text-xs font-semibold py-1.5 pl-4 pr-3 rounded-md hover:bg-muted transition-colors text-foreground/80 hover:text-foreground group h-[40px]"
                           >
                               <span>Console</span>
                               {outputPanelState.isOpen ? (
                                   <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                               ) : (
                                   <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                               )}
                           </button>
                           
                           <div className="relative hidden sm:block">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                              <input 
                                 type="text" 
                                 placeholder="Search pattern..." 
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                                 className="h-7 w-32 sm:w-48 bg-muted/50 border border-border rounded-md pl-8 pr-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200"
                              />
                           </div>
                       </div>
                       <div className="flex-none flex justify-center gap-2 pr-4 sm:pr-2">
                           <Button 
                               size="sm" 
                               onClick={handleSubmitPatterns}
                               disabled={isSubmitting || selectedGuessPatterns.size === 0}
                               className="h-8 px-5 text-xs font-bold rounded-md bg-primary text-black hover:text-black hover:bg-primary/90 shadow-sm"
                           >
                               {isSubmitting ? (
                                   <div className="flex items-center gap-2"><div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Submitting...</div>
                               ) : (
                                   <div className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> Submit</div>
                               )}
                           </Button>
                       </div>
                       <div className="flex-1 flex justify-end"></div>
                   </div>
                 </div>
               </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        <SheetContent
          side="right"
          className="w-full sm:max-w-[600px] p-0 border-l border-border shadow-2xl flex flex-col gap-0 [&>button]:top-[6px]"
        >
          <div className="flex items-center justify-between py-2 px-4 border-b border-border bg-background gap-4">
            <h3 className="font-semibold text-sm">Guess the Pattern</h3>
          </div>
          <div className="flex-1 overflow-hidden">
            <ProblemSidebar
              algorithms={patternAlgorithms}
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

export default PatternGuessClient;
