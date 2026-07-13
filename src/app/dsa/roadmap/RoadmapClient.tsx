"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAlgorithms } from '@/hooks/useAlgorithms';
import { useApp } from '@/contexts/AppContext';
import { getGroupedByCategory, normalizeCategory, slugifyCategory } from '@/constants/categories';
import { ListType, DIFFICULTY_MAP } from '@/types/algorithm';
import {
  Compass,
  Brain,
  Target,
  Layers,
  Sparkles,
  BookOpen,
  Activity,
  Play,
  Check,
  CheckCircle2,
  Lock,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Star,
  ChevronRight,
  ChevronDown,
  Eye,
  Info,
  Circle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CompanyIcon } from '@/components/CompanyIcon';
import { slugifyCompany } from '@/constants/companies';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateProgress,
  updateDrawingProgress,
  updateVisualizationProgress,
  updateSolutionProgress,
  updateSocial,
} from '@/utils/userAlgorithmDataHelpers';
import { PremiumProblemCard } from '@/components/listing/PremiumProblemCard';


interface Step {
  id: string;
  label: string;
  desc: string;
  tab: string;
  icon: any;
}

const ROADMAP_STEPS: Step[] = [
  { id: 'learn', label: 'Read', desc: 'Read problem description', tab: 'description', icon: BookOpen },
  { id: 'visualize', label: 'Visualize', desc: 'Step-by-step visual animation', tab: 'visualizations', icon: Activity },
  { id: 'thinkpad', label: 'Thinkpad', desc: 'Sketch ideas on whiteboard', tab: 'thinkpad', icon: Sparkles },
  { id: 'practice', label: 'Practice', desc: 'Write and run your code', tab: 'editor', icon: Play },
  { id: 'review', label: 'Review', desc: 'Check optimal solution notes', tab: 'solutions', icon: CheckCircle2 },
];

const ROADMAP_TABS = [
  { value: 'blind', label: 'Blind 75', icon: Brain },
  { value: 'blind150', label: 'Rulcode 150', icon: Layers },
];

export default function RoadmapClient() {
  const router = useRouter();
  const { data: algorithmsData, isLoading: isAlgosLoading } = useAlgorithms();
  const { userAlgorithmData, progressMap, hasPremiumAccess, user } = useApp();

  // Active roadmap selection: 'blind' | 'blind150'
  const [activeRoadmap, setActiveRoadmap] = useState<'blind' | 'blind150'>('blind');
  
  // Selected problem ID for the right side details
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);

  // Key to trigger highlight animation on the right side panel
  const [highlightKey, setHighlightKey] = useState(0);

  // Modal dialog state for mobile and tablet viewports
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Accordion collapsed state: Category Name -> boolean (true if expanded)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const [isMounted, setIsMounted] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Load UI state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedStateStr = localStorage.getItem('roadmap_ui_state');
        if (savedStateStr) {
          const savedState = JSON.parse(savedStateStr);
          if (savedState.activeRoadmap) setActiveRoadmap(savedState.activeRoadmap);
          if (savedState.selectedProblemId) setSelectedProblemId(savedState.selectedProblemId);
          if (savedState.expandedCategories) setExpandedCategories(savedState.expandedCategories);
        }
      } catch (e) {
        console.error('Failed to load roadmap UI state', e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save UI state whenever it changes
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('roadmap_ui_state', JSON.stringify({
        activeRoadmap,
        selectedProblemId,
        expandedCategories
      }));
    }
  }, [activeRoadmap, selectedProblemId, expandedCategories, isMounted]);

  // Selected active step ID for detail view
  const [activeStepId, setActiveStepId] = useState<string>('learn');

  // Local storage tracking for the "Learn" step (since there is no database column for it)
  const [learnedProblems, setLearnedProblems] = useState<Set<string>>(new Set());

  // Load learned problems from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('roadmap_learned_problems');
        if (saved) {
          setLearnedProblems(new Set(JSON.parse(saved)));
        }
      } catch (e) {
        console.error('Failed to load learned problems', e);
      }
    }
  }, []);

  // Filter algorithms by the selected roadmap type
  const filteredAlgorithms = useMemo(() => {
    if (!algorithmsData?.algorithms) return [];

    return algorithmsData.algorithms.filter((algo) => {
      // Must be DSA
      if (algo.problemType !== 'dsa') return false;

      const types = algo.listTypes || (algo.list_type ? [algo.list_type] : ['blind']);
      if (activeRoadmap === 'blind') {
        return types.includes(ListType.Blind75);
      }
      if (activeRoadmap === 'blind150') {
        return types.includes(ListType.Blind150) || types.includes(ListType.Blind75);
      }
      return true;
    });
  }, [algorithmsData, activeRoadmap]);

  // Group filtered algorithms by category
  const categories = useMemo(() => {
    return getGroupedByCategory(filteredAlgorithms);
  }, [filteredAlgorithms]);


  const handleProblemClick = (problemId: string) => {
    setSelectedProblemId(problemId);
    setHighlightKey(prev => prev + 1);
    
    // Find category and expand it
    const categoryTuple = categories.find(([_, problems]) => problems.some(p => p.id === problemId));
    if (categoryTuple) {
      setExpandedCategories(prev => ({ ...prev, [categoryTuple[0]]: true }));
    }

    if (typeof window !== 'undefined' && window.innerWidth < 1280) {
      setIsModalOpen(true);
    }
  };

  // Select the first problem of the first category by default if none is selected
  useEffect(() => {
    if (isMounted && categories.length > 0 && !selectedProblemId) {
      // Find first category with problems
      const firstNonEmpty = categories.find(([_, problems]) => problems.length > 0);
      if (firstNonEmpty) {
        setSelectedProblemId(firstNonEmpty[1][0].id);
        setExpandedCategories(prev => ({ ...prev, [firstNonEmpty[0]]: true }));
      }
    }
  }, [categories, selectedProblemId, isMounted]);

  // Scroll to selected problem on initial load
  useEffect(() => {
    if (!isMounted || isAlgosLoading || categories.length === 0 || hasScrolled) return;
    
    if (selectedProblemId) {
      const categoryTuple = categories.find(([_, problems]) => problems.some(p => p.id === selectedProblemId));
      if (categoryTuple) {
        const catName = categoryTuple[0];
        if (!expandedCategories[catName]) {
          setExpandedCategories(prev => ({ ...prev, [catName]: true }));
        }
        
        setTimeout(() => {
          const el = document.getElementById(`problem-card-${selectedProblemId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          setHasScrolled(true);
        }, 300);
        return;
      }
    }
    
    setHasScrolled(true);
  }, [isMounted, isAlgosLoading, categories, hasScrolled, selectedProblemId, expandedCategories]);

  // Handle roadmap selector clicks
  const handleRoadmapChange = (roadmap: 'blind' | 'blind150') => {
    setActiveRoadmap(roadmap);
    setSelectedProblemId(null);
  };

  // Find the currently selected problem object
  const selectedProblem = useMemo(() => {
    if (!selectedProblemId) return null;
    return filteredAlgorithms.find((algo) => algo.id === selectedProblemId) || null;
  }, [selectedProblemId, filteredAlgorithms]);

  // Get user progress details for the selected problem
  const selectedProblemUserData = useMemo(() => {
    if (!selectedProblem || !userAlgorithmData) return null;
    return userAlgorithmData.find((data) => data.algorithm_id === selectedProblem.id) || null;
  }, [selectedProblem, userAlgorithmData]);

  // Helper to determine if a specific step is completed for the selected problem
  const isStepCompleted = (stepId: string): boolean => {
    if (!selectedProblem) return false;
    
    if (stepId === 'learn') {
      return learnedProblems.has(selectedProblem.id);
    }
    
    if (!selectedProblemUserData) return false;
    
    switch (stepId) {
      case 'visualize':
        return !!selectedProblemUserData.visualization_completed;
      case 'thinkpad':
        return !!selectedProblemUserData.drawing_completed;
      case 'practice':
        return !!selectedProblemUserData.completed;
      case 'review':
        return !!selectedProblemUserData.solution_completed;
      default:
        return false;
    }
  };

  // Find recommended next step (first incomplete step in sequence)
  const recommendedStep = useMemo(() => {
    if (!selectedProblem) return null;
    return ROADMAP_STEPS.find((step) => !isStepCompleted(step.id)) || ROADMAP_STEPS[ROADMAP_STEPS.length - 1];
  }, [selectedProblem, selectedProblemUserData, learnedProblems]);

  // Update activeStepId when selected problem changes
  useEffect(() => {
    if (selectedProblemId) {
      const incomplete = ROADMAP_STEPS.find((step) => !isStepCompleted(step.id));
      setActiveStepId(incomplete?.id || 'learn');
    }
  }, [selectedProblemId]);

  // Toggle step completion status
  const handleToggleStep = async (stepId: string) => {
    if (!user) {
      toast.error('Please sign in to track progress');
      return;
    }
    if (!selectedProblem) return;

    const problemId = selectedProblem.id;
    try {
      let success = false;
      const isCurrentlyCompleted = isStepCompleted(stepId);
      const nextVal = !isCurrentlyCompleted;

      if (stepId === 'learn') {
        const newLearned = new Set(learnedProblems);
        if (newLearned.has(problemId)) {
          newLearned.delete(problemId);
        } else {
          newLearned.add(problemId);
        }
        setLearnedProblems(newLearned);
        localStorage.setItem('roadmap_learned_problems', JSON.stringify(Array.from(newLearned)));
        success = true;
      } else if (stepId === 'visualize') {
        success = await updateVisualizationProgress(user.id, problemId, nextVal);
      } else if (stepId === 'thinkpad') {
        success = await updateDrawingProgress(user.id, problemId, nextVal);
      } else if (stepId === 'practice') {
        success = await updateProgress(user.id, problemId, { completed: nextVal });
      } else if (stepId === 'review') {
        success = await updateSolutionProgress(user.id, problemId, nextVal);
      }

      if (success) {
        toast.success(`${ROADMAP_STEPS.find(s => s.id === stepId)?.label} step updated!`);

        // Check if all steps are now completed to auto-mark the problem as fully completed
        const wouldBeLearned = stepId === 'learn' ? nextVal : learnedProblems.has(problemId);
        const wouldBeVisualized = stepId === 'visualize' ? nextVal : !!selectedProblemUserData?.visualization_completed;
        const wouldBeThinkpad = stepId === 'thinkpad' ? nextVal : !!selectedProblemUserData?.drawing_completed;
        const wouldBePractice = stepId === 'practice' ? nextVal : !!selectedProblemUserData?.completed;
        const wouldBeReview = stepId === 'review' ? nextVal : !!selectedProblemUserData?.solution_completed;

        const isAllDone = wouldBeLearned && wouldBeVisualized && wouldBeThinkpad && wouldBePractice && wouldBeReview;

        if (isAllDone && !selectedProblemUserData?.completed) {
          // Auto complete the practice step/problem in DB
          await updateProgress(user.id, problemId, { completed: true });
          toast.success('🎉 Amazing! You completed all steps. Problem marked as complete!');
        }
      } else {
        toast.error('Failed to update progress');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating progress');
    }
  };

  const getStepExplanation = (stepId: string): string => {
    switch (stepId) {
      case 'learn':
        return "Understand the problem description, review the input/output constraints, and analyze the given examples to build initial intuition. Learn the core patterns underlying the problem.";
      case 'visualize':
        return "Interact with the step-by-step visual animation. Step through the array or tree traversal to see how the algorithm constructs the solution visually and handles edge cases.";
      case 'thinkpad':
        return "Use the digital whiteboard to sketch diagrams, dry-run test cases, write pseudo-code, or trace variable state changes. Think through the logic before you write code.";
      case 'practice':
        return "Write your code in the compiler, run the test suite to verify correctness on edge cases, and submit to pass all test cases.";
      case 'review':
        return "Analyze the optimal solutions, compare your approach's time/space complexity with the best-known bounds, and review key takeaways and follow-ups.";
      default:
        return "";
    }
  };

  // Toggle category accordion open/closed
  const toggleCategory = (catName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catName]: !prev[catName],
    }));
  };

  // Check if a problem is completed (only when all steps are completed)
  const isProblemCompleted = (probId: string): boolean => {
    // Check if all steps are complete in memory
    const userAlgo = userAlgorithmData?.find(d => d.algorithm_id === probId);
    const learned = learnedProblems.has(probId);
    const visualized = !!userAlgo?.visualization_completed;
    const drawn = !!userAlgo?.drawing_completed;
    
    // Practice step can be completed either by the roadmap toggle or by actually solving it (which sets completed to true or progressMap to 'solved')
    const isDbCompleted = progressMap?.[probId] === 'solved';
    const solved = !!userAlgo?.completed || isDbCompleted;
    
    const reviewed = !!userAlgo?.solution_completed;

    return learned && visualized && drawn && solved && reviewed;
  };

  // Calculate statistics for the active roadmap
  const roadmapStats = useMemo(() => {
    const total = filteredAlgorithms.length;
    const completed = filteredAlgorithms.filter((algo) => isProblemCompleted(algo.id)).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [filteredAlgorithms, progressMap, userAlgorithmData, learnedProblems]);

  // Social interactions
  const handleVote = async (vote: 'like' | 'dislike') => {
    if (!user || !selectedProblem) {
      toast.error('Please sign in to vote');
      return;
    }
    const currentVote = selectedProblemUserData?.user_vote || null;
    const newVote = currentVote === vote ? null : vote;

    try {
      const success = await updateSocial(user.id, selectedProblem.id, {
        user_vote: newVote,
      });
      if (success) {
        toast.success(newVote ? `Marked as ${newVote}d!` : 'Vote removed');
      } else {
        toast.error('Failed to update vote');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving vote');
    }
  };

  const handleShare = () => {
    if (!selectedProblem) return;
    const url = `${window.location.origin}/problem/${selectedProblem.slug || selectedProblem.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Problem link copied to clipboard!');
  };

  const handleToggleFavorite = async () => {
    if (!user || !selectedProblem) {
      toast.error('Please sign in to save favorites');
      return;
    }
    const isCurrent = !!selectedProblemUserData?.is_favorite;
    try {
      const success = await updateSocial(user.id, selectedProblem.id, {
        is_favorite: !isCurrent,
      });
      if (success) {
        toast.success(!isCurrent ? 'Added to favorites!' : 'Removed from favorites');
      } else {
        toast.error('Failed to update favorites');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving favorite');
    }
  };

  // Check companies lists from metadata or root
  const companiesList = useMemo(() => {
    if (!selectedProblem) return [];
    const fromMeta = selectedProblem.metadata?.companies;
    if (Array.isArray(fromMeta)) return fromMeta;
    const fromRoot = selectedProblem.companies;
    if (Array.isArray(fromRoot)) return fromRoot;
    return [];
  }, [selectedProblem]);

  const getCleanShortDescription = (desc: string): string => {
    if (!desc) return '';

    // First strip HTML tags to get pure text content
    let text = desc.replace(/<[^>]*>/g, ' ');
    
    // Replace HTML entities
    text = text
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // Collapse multiple spaces
    text = text.replace(/\s+/g, ' ').trim();

    // Split by common separators to strip examples/constraints
    const separators = ['Example 1', 'Example:', 'Example ', 'Examples:', 'Constraints:'];
    for (const sep of separators) {
      const idx = text.indexOf(sep);
      if (idx !== -1) {
        text = text.substring(0, idx);
      }
    }

    text = text.trim();

    // Limit to 100 characters
    if (text.length > 100) {
      text = text.substring(0, 100).trim() + '...';
    }

    return text;
  };

  const nextProblemToSolve = useMemo(() => {
    if (!selectedProblem) return null;

    const currentIndex = filteredAlgorithms.findIndex(a => a.id === selectedProblem.id);
    if (currentIndex === -1) return null;

    const nextIncomplete = filteredAlgorithms
      .slice(currentIndex + 1)
      .find(a => !isProblemCompleted(a.id));

    if (nextIncomplete) return nextIncomplete;

    return filteredAlgorithms.find(a => !isProblemCompleted(a.id) && a.id !== selectedProblem.id) || null;
  }, [selectedProblem, filteredAlgorithms, progressMap, userAlgorithmData, learnedProblems]);

  const renderProblemDetailContent = (isModal: boolean = false) => {
    if (!selectedProblem) return null;

    const displayDifficulty = DIFFICULTY_MAP[selectedProblem.difficulty?.toLowerCase()] || 'Medium';

    return (
      <>
        {/* Header Information */}
        <div className="space-y-1.5">
          <div className={cn("flex items-start justify-between gap-2", isModal && "pr-8")}>
            <h2 className="text-[15px] font-medium text-foreground tracking-tight leading-snug flex-1 min-w-0">
              {selectedProblem.serial_no ? `${selectedProblem.serial_no}. ` : ''}{selectedProblem.title || selectedProblem.name}
              <span className={cn(
                'ml-2 inline-block text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 border rounded-full align-middle relative -top-px',
                displayDifficulty === 'Easy' && 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
                displayDifficulty === 'Medium' && 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
                displayDifficulty === 'Hard' && 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
              )}>
                {displayDifficulty}
              </span>
            </h2>
            {/* Favorite button */}
            <button
              onClick={handleToggleFavorite}
              title={selectedProblemUserData?.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
              className={cn(
                'shrink-0 flex items-center justify-center w-7 h-7 rounded-lg border transition-all duration-300 active:scale-95',
                selectedProblemUserData?.is_favorite
                  ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/20'
                  : 'bg-muted/20 border-border/40 text-muted-foreground/50 hover:text-yellow-500 hover:border-yellow-500/30 hover:bg-yellow-500/10'
              )}
            >
              <Star className={cn('w-3.5 h-3.5', selectedProblemUserData?.is_favorite && 'fill-current')} />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed font-normal">
            {getCleanShortDescription(selectedProblem.description)}
          </p>
        </div>

        {/* Horizontal Progress Stepper */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <h3 className="text-xs font-semibold text-foreground">
            Your progress
          </h3>

          <TooltipProvider>
            {/* Stepper row */}
            <div className="flex items-start justify-between gap-0 relative">
              {ROADMAP_STEPS.map((step, idx) => {
                const completed = isStepCompleted(step.id);
                const isRec = recommendedStep?.id === step.id;
                const isActive = activeStepId === step.id;
                const isLast = idx === ROADMAP_STEPS.length - 1;
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex flex-col items-center flex-1 min-w-0 relative z-10">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {/* Step node + label */}
                        <button
                          onClick={() => {
                            setActiveStepId(step.id);
                          }}
                          className="flex flex-col items-center gap-1.5 group w-full"
                        >
                          {/* Circle */}
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 relative z-10',
                            isActive && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
                            completed
                              ? 'bg-green-500 border-green-500 text-white shadow-sm'
                              : isRec
                              ? 'bg-card border-primary text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]'
                              : 'bg-card border-muted-foreground/30 text-muted-foreground/60'
                          )}>
                            {completed
                              ? <Check className="w-4 h-4 stroke-[3]" />
                              : isRec
                              ? <Circle className="w-2.5 h-2.5 fill-primary stroke-0" />
                              : <Circle className="w-2.5 h-2.5 stroke-[2]" />
                            }
                          </div>
                          {/* Label */}
                          <span className={cn(
                            'text-[10px] text-center leading-tight font-medium max-w-[64px]',
                            isActive ? 'text-primary font-bold' : completed ? 'text-muted-foreground line-through' : isRec ? 'text-primary' : 'text-muted-foreground/80'
                          )}>
                            {step.label}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="p-3 max-w-[240px]">
                        <div className="space-y-1.5">
                          <p className="font-semibold text-xs text-foreground">{step.label}</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">{step.desc}</p>
                          <div className="border-t border-border/30 my-1 pt-1.5">
                            {completed ? (
                              <p className="text-[11px] text-green-600 dark:text-green-400 font-medium">
                                This step is completed
                              </p>
                            ) : (
                              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-normal leading-normal">
                                {step.id === 'learn' && "Not completed yet. Scroll to the bottom of the article to complete."}
                                {step.id === 'visualize' && "Not completed yet. Click through the visualization to the last step to complete."}
                                {step.id === 'thinkpad' && "Not completed yet. Open the Thinkpad and click Mark Complete to complete."}
                                {step.id === 'practice' && "Not completed yet. Submit an accepted solution in the editor to complete."}
                                {step.id === 'review' && "Not completed yet. Open the Review section and click Mark Complete to complete."}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const tabQuery = step.tab ? `?tab=${step.tab}` : '';
                              router.push(`/problem/${selectedProblem.slug || selectedProblem.id}${tabQuery}`);
                              setIsModalOpen(false);
                            }}
                            className="w-full text-left text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 mt-1"
                          >
                            Go to {step.label} →
                          </button>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Connector line (not after last) */}
                    {!isLast && (
                      <div
                        style={{
                          left: 'calc(50% + 16px)',
                          right: 'calc(-50% + 16px)',
                        }}
                        className="absolute top-4 -translate-y-1/2 h-[2px] bg-muted-foreground/30 -z-10 overflow-hidden"
                      >
                        <div className={cn(
                          'h-full transition-all duration-500',
                          completed ? 'w-full bg-green-500/60' : 'w-0'
                        )} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        </div>

        {/* Active Step details and complete actions */}
        {(() => {
          const activeStep = ROADMAP_STEPS.find(s => s.id === activeStepId);
          if (!activeStep) return null;
          const completed = isStepCompleted(activeStep.id);
          const Icon = activeStep.icon;
          
          return (
            <div className="space-y-3 bg-muted/20 border border-border/40 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-foreground">
                    Step {ROADMAP_STEPS.indexOf(activeStep) + 1}: {activeStep.label}
                  </span>
                </div>
                {completed && (
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                    Completed
                  </span>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                {getStepExplanation(activeStep.id)}
              </p>

              <div className="flex items-center gap-2.5 pt-1">
                {completed && (
                  <Button
                    size="sm"
                    onClick={() => handleToggleStep(activeStep.id)}
                    className="text-xs font-medium h-8 px-4 rounded-lg transition-all active:scale-95 bg-muted text-muted-foreground hover:bg-muted/80 border border-border/40"
                  >
                    Mark Incomplete
                  </Button>
                )}
                {!completed && (
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 flex-1">
                    {activeStep.id === 'learn' && "Scroll to the bottom of the article to complete."}
                    {activeStep.id === 'visualize' && "Click through the visualization to the last step to complete."}
                    {activeStep.id === 'thinkpad' && "Open the Thinkpad and click Mark Complete to complete."}
                    {activeStep.id === 'practice' && "Submit an accepted solution in the editor to complete."}
                    {activeStep.id === 'review' && "Open the Review section and click Mark Complete to complete."}
                  </p>
                )}
                
                <Button
                  variant="secondary"
                  onClick={() => {
                    const tabQuery = activeStep.tab ? `?tab=${activeStep.tab}` : '';
                    router.push(`/problem/${selectedProblem.slug || selectedProblem.id}${tabQuery}`);
                    setIsModalOpen(false);
                  }}
                  className="group text-sm font-semibold h-10 px-5 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-md"
                >
                  Open Problem
                  <ChevronRight className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          );
        })()}

        {/* Next Problem to Solve card */}
        {(() => {
          const nextProblem = nextProblemToSolve;
          if (!nextProblem) return null;
          const nextDifficulty = DIFFICULTY_MAP[nextProblem.difficulty?.toLowerCase()] || 'Medium';

          return (
            <div className="space-y-3 bg-muted/20 border border-border/40 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground">
                  Next problem to solve
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-xs font-medium text-foreground truncate">
                  {nextProblem.serial_no ? `${nextProblem.serial_no}. ` : ''}{nextProblem.title || nextProblem.name}
                </span>
                <span className={cn(
                  'text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 border rounded-full shrink-0',
                  nextDifficulty === 'Easy' && 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
                  nextDifficulty === 'Medium' && 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
                  nextDifficulty === 'Hard' && 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
                )}>
                  {nextDifficulty}
                </span>
              </div>

              <div className="pt-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleProblemClick(nextProblem.id)}
                  className="text-xs font-medium h-8 px-4 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Go to Problem
                </Button>
              </div>
            </div>
          );
        })()}

        {/* Companies Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Companies
          </h3>

          {hasPremiumAccess ? (
            companiesList.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-0.5">
                {companiesList.map((company) => (
                  <div
                    key={company}
                    className="flex items-center gap-1.5 bg-muted/60 border border-border/30 rounded-lg px-2.5 py-1 text-xs text-foreground font-medium"
                  >
                    <CompanyIcon
                      company={slugifyCompany(company)}
                      className="w-3.5 h-3.5 shrink-0"
                      forceLoad={true}
                    />
                    <span>{company}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-medium italic">
                Frequently asked in standard technical interviews.
              </p>
            )
          ) : (
            <div className="relative border border-border/40 rounded-xl overflow-hidden bg-muted/10 p-4">
              {/* Blurred mockup items */}
              <div className="filter blur-[3.5px] select-none pointer-events-none opacity-20 flex flex-wrap gap-2">
                {['Google', 'Amazon', 'Meta', 'Bloomberg', 'Two Sigma'].map((mockComp) => (
                  <div
                    key={mockComp}
                    className="flex items-center gap-1.5 bg-muted border rounded-lg px-2 py-0.5 text-[10px]"
                  >
                    <div className="w-3 h-3 bg-zinc-400 rounded-full" />
                    <span>{mockComp}</span>
                  </div>
                ))}
              </div>

              {/* Locked CTA Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-card/40 backdrop-blur-[0.5px]">
                <Lock className="w-4 h-4 text-primary shrink-0 mb-1" />
                <span className="text-[11px] font-medium text-foreground">
                  Pro to unlock
                </span>
                <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px]">
                  Unlock company preparation stats for this problem and 200+ others.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    router.push('/pricing');
                    setIsModalOpen(false);
                  }}
                  className="mt-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground dark:text-zinc-950 px-4 py-1.5 rounded-lg flex items-center gap-0.5 active:scale-95 shadow-sm"
                >
                  Go Pro
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full max-w-[1164px] mx-auto min-h-[calc(100vh-3.5rem)] px-4 py-4 md:p-6 lg:p-8">
      {/* Selector Tabs */}
      <div className="w-full border-b border-border/40 mb-6">
        <div className="flex justify-start gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {ROADMAP_TABS.map((tab) => {
            const isActive = activeRoadmap === tab.value;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => handleRoadmapChange(tab.value as any)}
                className={cn(
                  "relative h-12 bg-transparent px-0 pb-3 pt-2 font-medium text-xs sm:text-sm text-muted-foreground transition-all duration-200 shrink-0 border-b-2 border-transparent hover:text-foreground/80 flex items-center gap-2",
                  isActive && "border-primary text-foreground"
                )}
              >
                <TabIcon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground/60")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isAlgosLoading ? (
        <div className="flex flex-col xl:flex-row gap-6 justify-center items-start w-full animate-pulse">
          <div className="w-full xl:max-w-[640px] flex-1 space-y-4">
            <div className="h-[500px] bg-card rounded-2xl border border-border/40" />
          </div>
          <div className="hidden xl:block w-full xl:max-w-[400px] shrink-0">
            <div className="h-[600px] bg-card rounded-2xl border border-border/40" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-6 justify-center items-start w-full">
          
          {/* COLUMN 1: LEFT/MIDDLE CONTENT (Category Accordions & Problem Lists) */}
          <div className="w-full xl:max-w-[640px] flex-1 space-y-5">
            
            {/* Categories Card List (unified card with no spacing) */}
            {categories.length === 0 ? (
              <div className="border border-border/40 rounded-xl bg-card overflow-hidden shadow-sm min-h-[200px] flex flex-col items-center justify-center py-20 text-center text-muted-foreground p-5">
                <HelpCircle className="w-12 h-12 stroke-[1.2] opacity-50 mb-3" />
                <p className="font-medium text-sm">No problems found</p>
                <p className="text-xs opacity-75 mt-1">This roadmap is empty or under development.</p>
              </div>
            ) : (
              <div className="border border-border/40 rounded-xl bg-card overflow-hidden shadow-sm">
                {(() => {
                  const visibleCategories = categories.filter(([_, problems]) => problems.length > 0);
                  return visibleCategories.map(([catName, problems], catIdx) => {
                    const isExpanded = !!expandedCategories[catName];
                    const isLastCategory = catIdx === visibleCategories.length - 1;

                    // Calculate category progress
                    const catCompleted = problems.filter((p) => isProblemCompleted(p.id)).length;
                    const isCatFullyCompleted = catCompleted === problems.length;

                    return (
                      <div
                        key={catName}
                        className={cn(
                          "transition-all duration-300",
                          !isLastCategory && "border-b border-border/40"
                        )}
                      >
                        {/* Category Header (Trigger) */}
                        <button
                          onClick={() => toggleCategory(catName)}
                          className={cn(
                            'w-full flex items-center justify-between px-5 py-4 sm:py-5 transition-colors text-left bg-muted/15 hover:bg-muted/25',
                            isExpanded && 'bg-muted/20 border-b border-border/20'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Category Status Circle */}
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              {isCatFullyCompleted ? (
                                <div className="w-5 h-5 rounded-full bg-green-500 border border-green-500 text-white flex items-center justify-center">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              ) : catCompleted > 0 ? (
                                <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center bg-green-500/10">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-muted-foreground/30 flex items-center justify-center bg-muted/5">
                                  {/* empty */}
                                </div>
                              )}
                            </div>
                            <span className="font-semibold text-sm sm:text-[15px] text-foreground/90 truncate">
                              {catName}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 shrink-0">
                            {/* Inline progress bar + count */}
                            <div className="hidden sm:flex items-center gap-2">
                              <div className="w-16 h-1 bg-muted-foreground/30 rounded-full overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full transition-all duration-500 ease-out rounded-full',
                                    isCatFullyCompleted ? 'bg-green-500/80' : 'bg-primary/60'
                                  )}
                                  style={{ width: problems.length > 0 ? `${(catCompleted / problems.length) * 100}%` : '0%' }}
                                />
                              </div>
                              <span className="w-11 text-right text-xs font-normal text-muted-foreground tabular-nums">
                                {catCompleted} / {problems.length}
                              </span>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                            )}
                          </div>
                        </button>

                        {/* Problems List */}
                        {isExpanded && (
                          <div className="p-4 bg-muted/5 space-y-0">
                            {problems.map((prob, idx) => {
                              const isSelected = selectedProblemId === prob.id;
                              const isSolved = isProblemCompleted(prob.id);
                              const isFirstProblem = idx === 0;
                              const isLastProblem = idx === problems.length - 1;

                              const isPathActive = problems.slice(idx).some(p => isProblemCompleted(p.id));
                              const isNextPathActive = !isLastProblem && problems.slice(idx + 1).some(p => isProblemCompleted(p.id));

                              return (
                                <div key={prob.id} id={`problem-card-${prob.id}`} className="relative pl-[44px] pb-3 last:pb-0">
                                  {/* Upper Vertical Line */}
                                  <div
                                    className={cn(
                                      "absolute left-[30px] w-[2px] -translate-x-1/2 transition-colors duration-500",
                                      isFirstProblem ? "top-[-16px] h-[36px]" : "top-0 h-[20px]",
                                      isPathActive
                                        ? "border-l-2 border-green-500/80 border-solid"
                                        : "border-l-2 border-muted-foreground/30 border-dashed"
                                    )}
                                  />
                                  
                                  {/* Lower Vertical Line (not for last item) */}
                                  {!isLastProblem && (
                                    <div
                                      className={cn(
                                        "absolute left-[30px] top-[20px] bottom-0 w-[2px] -translate-x-1/2 transition-colors duration-500",
                                        isNextPathActive
                                          ? "border-l-2 border-green-500/80 border-solid"
                                          : "border-l-2 border-muted-foreground/30 border-dashed"
                                      )}
                                    />
                                  )}

                                  {/* Horizontal Branch Line */}
                                  <div
                                    className={cn(
                                      "absolute left-[30px] top-[20px] w-[26px] h-[2px] -translate-y-1/2 transition-colors duration-500",
                                      isSolved
                                        ? "border-t-2 border-green-500/80 border-solid"
                                        : "border-t-2 border-muted-foreground/30 border-dashed"
                                    )}
                                  />

                                  <PremiumProblemCard
                                    algorithm={prob}
                                    status={isSolved ? 'solved' : 'none'}
                                    index={idx}
                                    isFirst={true}
                                    isLast={true}
                                    disableRounding={true}
                                    isSelected={isSelected}
                                    compact={true}
                                    onClick={(e) => { e.preventDefault(); handleProblemClick(prob.id); }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>

          {/* COLUMN 2: RIGHT PANEL (Desktop Sticky Problem Detail & Steps Checklist) */}
          <div className="hidden xl:block w-full xl:max-w-[400px] shrink-0 xl:self-stretch">
            <div className="sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto pr-1 space-y-5 flex flex-col">
              
              {/* Overall Progress Card */}
              <Card className="p-4 border-border/40 shadow-sm rounded-2xl bg-card space-y-3 shrink-0">
                <div className="space-y-1 select-none">
                  <h2 className="text-sm font-semibold text-foreground">
                    Roadmap Progress
                  </h2>
                  <p className="text-xs text-muted-foreground font-medium">
                    <span className="text-foreground font-semibold">{roadmapStats.completed} / {roadmapStats.total}</span> completed
                  </p>
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${roadmapStats.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground tabular-nums">
                    {roadmapStats.percentage}%
                  </span>
                </div>
              </Card>

              {selectedProblem ? (
                <Card 
                  key={highlightKey}
                  className="p-5 border-border/40 shadow-sm rounded-2xl bg-card space-y-6 w-full animate-in fade-in zoom-in-[0.98] slide-in-from-right-2 duration-300"
                >
                  {renderProblemDetailContent(false)}
                </Card>
              ) : (
                <Card className="p-8 border-border/40 shadow-sm rounded-2xl bg-card flex flex-col items-center justify-center text-center min-h-[400px] w-full">
                  <Compass className="w-12 h-12 stroke-[1.2] text-muted-foreground opacity-50 mb-3 animate-spin duration-10000" />
                  <p className="font-medium text-sm text-foreground">Select a Problem</p>
                  <p className="text-xs text-muted-foreground max-w-[220px] mt-1.5 leading-relaxed">
                    Choose any problem from the checklist panel to track step-by-step masteries, company questions, and votes.
                  </p>
                </Card>
              )}


            </div>
          </div>

        </div>
      )}

      {/* MOBILE / TABLET VIEWPORT MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg w-[95%] p-5 overflow-y-auto max-h-[90vh] rounded-2xl border border-border bg-card">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedProblem?.title || 'Problem Details'}</DialogTitle>
          </DialogHeader>
          {selectedProblem && (
            <div className="space-y-6">
              {renderProblemDetailContent(true)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
