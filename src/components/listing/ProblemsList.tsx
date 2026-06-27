import { useState, useMemo, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";
import { useApp } from '@/contexts/AppContext';
import { useAppSelector } from "@/store/hooks";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getGroupedByCategory, normalizeCategory, resolveAlgoCategories, slugifyCategory } from "@/constants/categories";
import { Brain, Target, ListFilter, SearchX, RotateCcw, Flame, Trophy, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SolvedProgressCard } from "@/components/profile/SolvedProgressCard";
import { cn } from "@/lib/utils";
import { ProOverlay } from "@/components/ProOverlay";
import { Button } from "@/components/ui/button";
import { ProblemFilterPopup } from "@/components/ProblemFilterPopup";
import { RecommendedProblems } from "@/components/listing/RecommendedProblems";
import { ContinueLearningCard } from "@/components/listing/ContinueLearningCard";
import { supabase } from "@/integrations/supabase/client";
import { StreakCalendar } from "@/components/profile/StreakCalendar";
import { parseISO, eachDayOfInterval, format } from 'date-fns';

interface ProblemsListProps {
  algorithms: any[];
  title: string;
  description: string;
  listType?: string;
  showRecommendation?: boolean;
  showCategoryToggle?: boolean;
  initialCategoryWise?: boolean;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  progressTitle?: string;
  isLoading?: boolean;
  icon?: any;
  initialSelectedTopics?: string[];
  initialSelectedCompanies?: string[];
  initialExpandAll?: boolean;
  stickyHeaderSlot?: ReactNode;
  potd?: any;
}

const EMPTY_ARRAY: string[] = [];

export const ProblemsList = ({
  algorithms,
  title,
  description,
  listType,
  showRecommendation = false,
  showCategoryToggle = true,
  initialCategoryWise = false,
  headerSlot,
  footerSlot,
  progressTitle = "Progress",
  isLoading = false,
  icon,
  initialSelectedTopics = EMPTY_ARRAY,
  initialSelectedCompanies = EMPTY_ARRAY,
  initialExpandAll = false,
  stickyHeaderSlot,
  potd
}: ProblemsListProps) => {
  const { activeListType, setActiveListType, progressMap, hasPremiumAccess } = useApp();
  const { lastFetched, error: reduxError } = useAppSelector(state => state.algorithms);
  const userProgressData = useAppSelector(state => state.userProgress?.data || []);
  const router = useRouter();
  const pathname = usePathname();

  const listTopRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!listTopRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Show button only when we have scrolled down by exactly one full screen height (or more) past the anchor
        setShowScrollTop(!entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: '100% 0px 0px 0px' }
    );
    
    observer.observe(listTopRef.current);
    
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    listTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submissionsData = useMemo(() => {
    const map = new Map<string, any[]>();
    userProgressData.forEach(item => {
      if (item.submissions && Array.isArray(item.submissions)) {
        item.submissions.forEach((sub: any) => {
          if (sub.timestamp) {
            const date = new Date(sub.timestamp).toISOString().split('T')[0];
            const current = map.get(date) || [];
            const algo = algorithms.find(a => a.id === item.algorithm_id);
            current.push({ 
                ...sub, 
                algorithm_id: item.algorithm_id,
                algorithm_title: algo?.title || 'Unknown Problem',
                difficulty: algo?.difficulty || 'EASY'
            });
            map.set(date, current);
          }
        });
      }
    });
    return Array.from(map.entries()).map(([date, list]) => ({ date, count: list.length, activities: list }));
  }, [userProgressData, algorithms]);

  const { currentStreak, maxStreak } = useMemo(() => {
    let current = 0;
    let max = 0;
    const sortedDates = [...submissionsData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (sortedDates.length === 0) return { currentStreak: 0, maxStreak: 0 };
    const submissionMap = new Map(sortedDates.map(s => [s.date, s.count]));
    const firstDate = parseISO(sortedDates[0].date);
    const today = new Date();
    const days = eachDayOfInterval({ start: firstDate, end: today });
    let streak = 0;
    days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        if (submissionMap.get(dateStr)) {
            streak++;
            max = Math.max(max, streak);
        } else {
            streak = 0;
        }
    });
    current = streak;
    return { currentStreak: current, maxStreak: max };
  }, [submissionsData]);

  const handleResetStreak = async () => {
    if (typeof window !== 'undefined' && confirm("Are you sure you want to reset your streaks? This will clear your submission history but keep your completed status.")) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('user_algorithm_data').update({ submissions: [] }).eq('user_id', user.id);
          window.location.reload();
        }
      } catch (err) {
        console.error("Error resetting streaks:", err);
      }
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('serial-asc');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(initialSelectedTopics.map(normalizeCategory));
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(initialSelectedCompanies);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [isCategoryWise, setIsCategoryWise] = useState(initialCategoryWise);
  const [popupFilters, setPopupFilters] = useState({
    status: 'all',
    difficulty: [] as string[],
    topics: [] as string[],
    companies: [] as string[],
    language: 'all'
  });

  const handleSetPopupFilters = useCallback((update: any) => {
    setPopupFilters(prev => {
      const next = typeof update === 'function' ? update(prev) : update;
      
      // Sync topics & companies
      setSelectedTopics(next.topics.map(normalizeCategory));
      setSelectedCompanies(next.companies || []);
      
      // Sync difficulties
      const capitalizedDiffs = next.difficulty.map((d: string) => {
        const lower = d.toLowerCase();
        if (lower === 'easy') return 'Easy';
        if (lower === 'medium') return 'Medium';
        if (lower === 'hard') return 'Hard';
        return d;
      });
      setSelectedDifficulties(capitalizedDiffs);

      return next;
    });
  }, []);

  // Sync sidebar/pills updates to popupFilters
  useEffect(() => {
    setPopupFilters(prev => {
      const nextTopics = selectedTopics;
      const nextCompanies = selectedCompanies;
      const nextDiffs = selectedDifficulties.map(d => d.toLowerCase());
      
      const topicsMatch = JSON.stringify(prev.topics) === JSON.stringify(nextTopics);
      const companiesMatch = JSON.stringify(prev.companies) === JSON.stringify(nextCompanies);
      const diffsMatch = JSON.stringify(prev.difficulty) === JSON.stringify(nextDiffs);
      
      if (!topicsMatch || !companiesMatch || !diffsMatch) {
        return {
          ...prev,
          topics: nextTopics,
          companies: nextCompanies,
          difficulty: nextDiffs
        };
      }
      return prev;
    });
  }, [selectedTopics, selectedCompanies, selectedDifficulties]);

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dsa_category_wise');
      if (saved !== null) {
        setIsCategoryWise(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      localStorage.setItem('dsa_category_wise', JSON.stringify(isCategoryWise));
    }
  }, [isCategoryWise, mounted]);

  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [hasInitializedExpand, setHasInitializedExpand] = useState(false);

  // Sync global list context if listType is provided
  useEffect(() => {
    if (listType && activeListType !== listType) {
      setActiveListType(listType as any);
    }
  }, [listType, activeListType, setActiveListType]);

  // Sync internal filter state with URL-driven props
  useEffect(() => {
    setSelectedTopics(initialSelectedTopics.map(normalizeCategory));
  }, [initialSelectedTopics]);

  useEffect(() => {
    setSelectedCompanies(initialSelectedCompanies);
  }, [initialSelectedCompanies]);


  const filteredAndSortedAlgorithms = useMemo(() => {
    let result = algorithms.map(algo => ({
      ...algo,
      mappedDifficulty: DIFFICULTY_MAP[algo.difficulty?.toLowerCase()] || 'Medium',
      displayTitle: algo.title || algo.name || ''
    }));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(algo => {
        const titleMatch = algo.displayTitle.toLowerCase().includes(q);
        const descMatch = (algo.description || '').toLowerCase().includes(q);
        
        // Topic (category) match
        let topicMatch = false;
        if (algo.category) {
          const rawCats = algo.category.split(',').map((c: string) => c.trim().toLowerCase());
          const cats = resolveAlgoCategories(rawCats).map(c => c.toLowerCase());
          topicMatch = rawCats.some(cat => cat.includes(q)) || cats.some(cat => cat.includes(q));
        }
        
        return titleMatch || descMatch || topicMatch;
      });
    }

    if (selectedTopics.length > 0) {
      result = result.filter(algo => {
        if (!algo.category) return false;
        const rawCats = algo.category.split(',').map((c: string) => c.trim());
        const cats = resolveAlgoCategories(rawCats);
        const lowerSelectedTopics = selectedTopics.map(t => t.toLowerCase());
        return cats.some(cat => selectedTopics.includes(cat)) || 
               rawCats.some(raw => lowerSelectedTopics.includes(raw.toLowerCase()) || selectedTopics.includes(normalizeCategory(raw)));
      });
    }

    if (selectedCompanies.length > 0) {
      const lowerSelected = selectedCompanies.map(c => c.toLowerCase());
      result = result.filter(algo => {
        const c = algo.metadata?.companies;
        if (!Array.isArray(c)) return false;
        return c.some((comp: string) => lowerSelected.includes(comp.toLowerCase()));
      });
    }

    if (selectedDifficulties.length > 0) {
      result = result.filter(algo => selectedDifficulties.includes(algo.mappedDifficulty));
    }

    // Filter by status (solved / attempted / none / all)
    if (popupFilters.status !== 'all') {
      result = result.filter(algo => {
        const status = progressMap?.[algo.id] || 'none';
        return status === popupFilters.status;
      });
    }

    // Filter by language
    if (popupFilters.language !== 'all') {
      result = result.filter(algo => {
        const langs = algo.metadata?.languages || [];
        return langs.some((l: string) => l.toLowerCase() === popupFilters.language.toLowerCase());
      });
    }

    const rank: any = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    if (sortBy === 'name-asc') result.sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
    else if (sortBy === 'name-desc') result.sort((a, b) => b.displayTitle.localeCompare(a.displayTitle));
    else if (sortBy === 'difficulty-asc') result.sort((a, b) => rank[a.mappedDifficulty] - rank[b.mappedDifficulty]);
    else if (sortBy === 'difficulty-desc') result.sort((a, b) => rank[b.mappedDifficulty] - rank[a.mappedDifficulty]);
    else if (sortBy === 'serial-asc') result.sort((a, b) => (a.serial_no || 999999) - (b.serial_no || 999999));
    else if (sortBy === 'serial-desc') result.sort((a, b) => (b.serial_no || 0) - (a.serial_no || 0));

    return result;
  }, [algorithms, searchQuery, sortBy, selectedTopics, selectedCompanies, selectedDifficulties, popupFilters, progressMap]);

  const currentGroupedAlgos = useMemo(() => {
    if (!isCategoryWise) return [];
    return getGroupedByCategory(filteredAndSortedAlgorithms, searchQuery);
  }, [filteredAndSortedAlgorithms, searchQuery, isCategoryWise]);

  // Auto-expand all categories when searching or filtering
  useEffect(() => {
    if (searchQuery || selectedTopics.length > 0 || selectedCompanies.length > 0 || selectedDifficulties.length > 0) {
      setOpenCategories(currentGroupedAlgos.map(([cat]) => cat));
    }
  }, [searchQuery, selectedTopics, selectedCompanies, selectedDifficulties, currentGroupedAlgos]);

  // Handle initial expansion for specific pages like /dsa/query
  useEffect(() => {
    if (initialExpandAll && !hasInitializedExpand && currentGroupedAlgos.length > 0) {
      setOpenCategories(currentGroupedAlgos.map(([cat]) => cat));
      setHasInitializedExpand(true);
    }
  }, [initialExpandAll, currentGroupedAlgos, hasInitializedExpand]);

  const statsByCategory = useMemo(() => {
    const stats: Record<string, { solved: number, total: number }> = {};
    currentGroupedAlgos.forEach(([category, algos]) => {
      const solved = algos.filter(a => progressMap?.[a.id] === 'solved').length;
      stats[category] = { solved, total: algos.length };
    });
    return stats;
  }, [currentGroupedAlgos, progressMap]);

  const overallStats = useMemo(() => {
    let easySolved = 0, easyTotal = 0;
    let mediumSolved = 0, mediumTotal = 0;
    let hardSolved = 0, hardTotal = 0;

    filteredAndSortedAlgorithms.forEach(algo => {
      const rawDiff = algo.difficulty?.toLowerCase() || "";
      const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();
      const isSolved = progressMap?.[algo.id] === 'solved';

      if (diff === "easy") {
        easyTotal++;
        if (isSolved) easySolved++;
      } else if (diff === "hard") {
        hardTotal++;
        if (isSolved) hardSolved++;
      } else {
        mediumTotal++;
        if (isSolved) mediumSolved++;
      }
    });

    return {
      totalSolved: easySolved + mediumSolved + hardSolved,
      totalQuestions: filteredAndSortedAlgorithms.length,
      easySolved, easyTotal,
      mediumSolved, mediumTotal,
      hardSolved, hardTotal
    };
  }, [filteredAndSortedAlgorithms, progressMap]);

  const continueLearningAlgo = useMemo(() => {
    if (!userProgressData || userProgressData.length === 0) return null;
    
    // Sort progress data by last_viewed_at or updated_at (descending)
    const sorted = [...userProgressData].sort((a, b) => {
      const timeA = new Date(a.last_viewed_at || a.updated_at).getTime();
      const timeB = new Date(b.last_viewed_at || b.updated_at).getTime();
      return timeB - timeA;
    });

    // Find the most recent incomplete algorithm first
    const incomplete = sorted.find(p => !p.completed);
    const target = incomplete || sorted[0];
    
    if (!target) return null;
    
    // Find the actual algorithm object
    const algo = algorithms.find(a => a.id === target.algorithm_id);
    if (!algo) return null;
    
    return {
      algorithm: algo,
      progress: target
    };
  }, [userProgressData, algorithms]);

  const getProgressBarColor = (percentage: number) => {
    if (percentage === 0) return 'bg-transparent';
    if (percentage < 33) return 'bg-gradient-to-r from-red-500 to-red-400';
    if (percentage < 66) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-green-500 to-green-400';
  };

  const handleTopicToggle = (topic: string) => {
    if (topic === 'CLEAR_ALL') {
      setSelectedTopics([]);
      return;
    }
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const handleCategoryClick = (cat: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/dsa/query?topic=${slugifyCategory(cat)}`);
  };

  const handleCompanyToggle = (company: string) => {
    if (company === 'CLEAR_ALL') {
      setSelectedCompanies([]);
      return;
    }
    setSelectedCompanies(prev => prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]);
  };

  const handleDifficultyToggle = (difficulty: string) => {
    if (difficulty === 'CLEAR_ALL') {
      setSelectedDifficulties([]);
      return;
    }
    setSelectedDifficulties(prev => prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]);
  };

  const allTopics = useMemo(() => {
    const categories = algorithms.flatMap(algo => {
      if (!algo.category) return [];
      const rawCats = algo.category.split(',').map((c: string) => c.trim());
      return resolveAlgoCategories(rawCats);
    }).filter(Boolean);
    return Array.from(new Set(categories)).sort();
  }, [algorithms]);

  const allCompanies = useMemo(() => {
    const comps = new Set<string>();
    algorithms.forEach(algo => {
      const c = algo.metadata?.companies;
      if (Array.isArray(c)) {
        c.forEach(comp => comps.add(comp));
      }
    });
    return Array.from(comps).sort();
  }, [algorithms]);

  const totalHours = useMemo(() => {
    const mins = filteredAndSortedAlgorithms.reduce((acc, algo) => {
      const diff = algo.mappedDifficulty.toLowerCase();
      if (diff === 'easy') return acc + 45;
      if (diff === 'medium') return acc + 60;
      if (diff === 'hard') return acc + 90;
      return acc + 60;
    }, 0);
    return Math.round(mins / 60);
  }, [filteredAndSortedAlgorithms]);

  const showCompanyLock = !hasPremiumAccess && selectedCompanies.length > 0;
  const showSkeleton = !mounted || (isLoading && algorithms.length === 0) || (lastFetched === null && !reduxError);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.length > 0 ||
      selectedTopics.length > 0 ||
      selectedCompanies.length > 0 ||
      selectedDifficulties.length > 0 ||
      sortBy !== 'serial-asc' ||
      popupFilters.status !== 'all' ||
      popupFilters.language !== 'all' ||
      popupFilters.difficulty.length > 0 ||
      popupFilters.topics.length > 0
    );
  }, [searchQuery, selectedTopics, selectedCompanies, selectedDifficulties, sortBy, popupFilters]);

  const showPOTD = useMemo(() => {
    return !!(potd?.problem && !hasActiveFilters && (!listType || listType === 'all'));
  }, [potd, hasActiveFilters, listType]);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setSortBy('serial-asc');
    setSelectedTopics([]);
    setSelectedCompanies([]);
    setSelectedDifficulties([]);
    setPopupFilters({
      status: 'all',
      difficulty: [],
      topics: [],
      companies: [],
      language: 'all'
    });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('topic') || params.has('company')) {
        params.delete('topic');
        params.delete('company');
        router.push(`${pathname}?${params.toString()}`);
      }
    }
  }, [router, pathname]);

  const handleRandomClick = () => {
    const pool = filteredAndSortedAlgorithms.length > 0 ? filteredAndSortedAlgorithms : algorithms;
    const unlockedPool = pool.filter(algo => !(algo.is_premium || algo.is_pro || algo.metadata?.is_pro) || hasPremiumAccess);
    const selectPool = unlockedPool.length > 0 ? unlockedPool : pool;
    if (selectPool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * selectPool.length);
    const randomAlgo = selectPool[randomIndex];
    const targetUrl = randomAlgo.slug ? `/problem/${randomAlgo.slug}` : `/problem/${randomAlgo.id}`;
    router.push(targetUrl);
  };

  return (
    <ListingLayout
      title={title}
      description={description}
      icon={icon}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy={sortBy}
      onSortChange={setSortBy}
      selectedTopics={selectedTopics}
      onTopicToggle={handleTopicToggle}
      topics={allTopics}
      selectedCompanies={selectedCompanies}
      onCompanyToggle={handleCompanyToggle}
      companies={allCompanies}
      selectedDifficulties={selectedDifficulties}
      onDifficultyToggle={handleDifficultyToggle}
      showRecommendation={showRecommendation}
      stats={{ solved: overallStats.totalSolved, total: overallStats.totalQuestions }}
      onRandomClick={handleRandomClick}
      showCategoryToggle={showCategoryToggle}
      isCategoryWise={isCategoryWise}
      onCategoryWiseChange={setIsCategoryWise}
      stickyHeaderSlot={stickyHeaderSlot}
      hasActiveFilters={hasActiveFilters}
      onReset={handleReset}

      filterButtonSlot={
        <ProblemFilterPopup
          filters={popupFilters}
          setFilters={handleSetPopupFilters}
          topics={allTopics}
          companies={allCompanies}
          trigger={
            <Button
              variant="outline"
              size="icon"
              className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl border-border/60 bg-background shadow-sm hover:border-primary/40 hover:bg-accent/10 active:scale-95 transition-all shrink-0 relative"
              aria-label="Filter problems"
            >
              <ListFilter className="w-5 h-5 text-muted-foreground" />
              {(popupFilters.status !== 'all' || popupFilters.language !== 'all' || popupFilters.difficulty.length > 0 || popupFilters.topics.length > 0 || (popupFilters.companies && popupFilters.companies.length > 0)) && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#84cc16] ring-2 ring-background animate-pulse" />
              )}
            </Button>
          }
        />
      }
      progressWidget={
        !isLoading && overallStats.totalQuestions > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 w-full mt-[-10px] items-stretch max-w-[820px] mx-auto">
            {/* Progress Stats */}
            <div className="min-w-0 flex flex-col h-full">
              <Card className="bg-card border-border/40 shadow-sm overflow-hidden flex flex-col h-full rounded-xl">
                <div className="px-4 py-3 border-b border-border/40 shrink-0 bg-muted/20">
                  <h3 className="font-normal text-[13px] text-foreground/80">{progressTitle}</h3>
                </div>
                <div className="flex-1 flex flex-col justify-center py-2">
                  <SolvedProgressCard
                    {...overallStats}
                    compact
                  />
                </div>
                {/* Streaks */}
                <div className="border-t border-border/30 px-4 py-3.5 bg-muted/5 flex items-center justify-around divide-x divide-border/30 gap-2 shrink-0">
                    {/* Current Streak */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
                        <span className="text-[11px] sm:text-[12px] text-muted-foreground font-normal mb-1 truncate">Current Streak</span>
                        <div className="flex items-center justify-center gap-1.5">
                            <Flame className="w-4.5 h-4.5 text-foreground shrink-0" />
                            <span className="text-md sm:text-lg font-normal text-foreground tracking-tight truncate">{currentStreak}</span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground/80 font-normal pb-0.5">days</span>
                        </div>
                    </div>
                    {/* Best Streak */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
                        <span className="text-[11px] sm:text-[12px] text-muted-foreground font-normal mb-1 truncate">Best Streak</span>
                        <div className="flex items-center justify-center gap-1.5">
                            <Trophy className="w-4.5 h-4.5 text-foreground shrink-0" />
                            <span className="text-md sm:text-lg font-normal text-foreground tracking-tight truncate">{maxStreak}</span>
                            <span className="text-[10px] sm:text-xs text-muted-foreground/80 font-normal pb-0.5">days</span>
                        </div>
                    </div>
                </div>
              </Card>
            </div>

            {/* Calendar */}
            <div className="w-full max-w-[320px] mx-auto lg:mx-0 flex-none shrink-0 h-full">
              <StreakCalendar 
                submissions={submissionsData} 
              />
            </div>
          </div>
        ) : undefined
      }
      recommendedWidget={
        showRecommendation && !isLoading ? (
          <div className="space-y-4 w-full">
            {continueLearningAlgo && (
              <ContinueLearningCard
                algorithm={continueLearningAlgo.algorithm}
                progress={continueLearningAlgo.progress}
              />
            )}
            <RecommendedProblems algorithms={algorithms} />
          </div>
        ) : null
      }
    >
      {/* Anchor for scroll-to-top */}
      <div ref={listTopRef} className="w-full h-0 pointer-events-none" aria-hidden="true" />

      {headerSlot}

      {showSkeleton ? (
        <div className="w-full max-w-[820px] mx-auto">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-3 sm:gap-6 p-4 sm:p-6",
                "bg-card border-x border-t border-border/40",
                i === 0 && "rounded-t-xl",
                i === 4 && "rounded-b-xl border-b",
                "animate-pulse"
              )}
            >
              {/* Status Indicator Skeleton */}
              <div className="shrink-0 scale-90 sm:scale-100">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Content Skeleton */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Title skeleton */}
                  <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/3 min-w-[120px]" />
                </div>

                {/* Description skeleton */}
                <div className="h-4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-md w-3/4 max-w-[500px]" />

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  {/* Difficulty Badge skeleton */}
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16" />
                  {/* Category Badge skeleton */}
                  <div className="h-6 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-full w-20" />
                </div>
              </div>

              {/* Action Indicator Skeleton */}
              <div className="shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
              </div>
            </div>
          ))}
        </div>
      ) : showCompanyLock && filteredAndSortedAlgorithms.length > 0 ? (
        <div className="w-full max-w-[820px] mx-auto">
          <PremiumProblemCard
            key={filteredAndSortedAlgorithms[0].id}
            algorithm={filteredAndSortedAlgorithms[0]}
            status={(progressMap?.[filteredAndSortedAlgorithms[0].id] || 'none') as any}
            isPremium={filteredAndSortedAlgorithms[0].is_premium}
            index={0}
            isFirst={true}
            isLast={false}
            onCategoryClick={handleCategoryClick}
          />
          <div className="relative w-full mt-2 pb-16">
            <div className="filter blur-[6px] select-none pointer-events-none opacity-20 space-y-2">
              {filteredAndSortedAlgorithms.slice(1, 4).map((algo, index) => {
                const maskedAlgo = {
                  ...algo,
                  title: "Premium locked question",
                  name: "Premium locked question",
                  slug: "locked",
                  id: "locked",
                  description: "Unlock this question and all premium features by purchasing a subscription.",
                  category: "Locked",
                  metadata: { ...algo.metadata, companies: [] }
                };
                return (
                  <PremiumProblemCard
                    key={index}
                    algorithm={maskedAlgo}
                    status="none"
                    index={index + 1}
                    isPremium={true}
                    isFirst={false}
                    isLast={index === 2 || index === filteredAndSortedAlgorithms.length - 2}
                    onCategoryClick={() => {}}
                  />
                );
              })}
              {filteredAndSortedAlgorithms.length <= 1 && (
                <>
                  <div className="p-6 border border-border/10 rounded-xl bg-card/40 flex justify-between items-center h-24" />
                  <div className="p-6 border border-border/5 rounded-xl bg-card/20 flex justify-between items-center h-24" />
                </>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-b from-transparent via-background/80 to-background pt-16 pb-12">
              <ProOverlay
                variant="transparent"
                title="Premium company tags"
                description="Purchase premium to unlock company tags and all the best materials we have to offer."
              />
            </div>
          </div>
        </div>
      ) : !isCategoryWise ? (
        <div className="w-full max-w-[820px] mx-auto">
          {showPOTD && (
            <PremiumProblemCard
              algorithm={potd.problem}
              status={(progressMap?.[potd.problem.id] || 'none') as any}
              isPremium={potd.problem.is_premium}
              index={-1}
              isFirst={true}
              isLast={filteredAndSortedAlgorithms.length === 0}
              isPOTD={true}
              potdCountdown={potd.countdown}
              onCategoryClick={handleCategoryClick}
            />
          )}
          {filteredAndSortedAlgorithms.map((algo, index) => (
            <PremiumProblemCard
              key={algo.id}
              algorithm={algo}
              status={(progressMap?.[algo.id] || 'none') as any}
              isPremium={algo.is_premium}
              index={index}
              isFirst={!showPOTD && index === 0}
              isLast={index === filteredAndSortedAlgorithms.length - 1}
              onCategoryClick={handleCategoryClick}
            />
          ))}
          {filteredAndSortedAlgorithms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-border/60 rounded-xl bg-card/20 mx-4 sm:mx-0">
              <div className="w-16 h-16 mb-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <SearchX className="w-8 h-8 text-primary/60" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 tracking-tight">No problems found</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
                {searchQuery ? (
                  <>We couldn't find any problems matching "<span className="text-foreground font-medium">{searchQuery}</span>". Try adjusting your search term or filters.</>
                ) : hasActiveFilters ? (
                  "We couldn't find any problems matching your current filters. Try adjusting them to see more results."
                ) : (
                  "There are no problems available at the moment."
                )}
              </p>
              {hasActiveFilters && (
                <Button onClick={handleReset} variant="outline" className="gap-2 rounded-full h-10 px-6 font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all">
                  <RotateCcw className="w-4 h-4" />
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-[820px] mx-auto">
          {showPOTD && (
            <div className="mb-4">
              <PremiumProblemCard
                algorithm={potd.problem}
                status={(progressMap?.[potd.problem.id] || 'none') as any}
                isPremium={potd.problem.is_premium}
                index={-1}
                isFirst={true}
                isLast={true}
                isPOTD={true}
                potdCountdown={potd.countdown}
                onCategoryClick={handleCategoryClick}
              />
            </div>
          )}
          {currentGroupedAlgos.length > 0 ? (
            <Accordion 
              type="multiple" 
              value={openCategories}
              onValueChange={setOpenCategories}
              className="border border-border/40 rounded-xl bg-card overflow-hidden shadow-sm" 
            >
              {currentGroupedAlgos.map(([category, algos], index) => (
                <AccordionItem
                  key={category}
                  value={category}
                  className={cn(
                    "border-border/40",
                    index === currentGroupedAlgos.length - 1 && "border-b-0"
                  )}
                >
                  <AccordionTrigger className="px-3 sm:px-6 py-4 sm:py-5 hover:no-underline hover:bg-accent hover:text-accent-foreground transition-all duration-300 group data-[state=open]:bg-muted/20 data-[state=open]:border-b border-border/10">
                    <div className="flex items-center justify-between w-full pr-1 sm:pr-4 gap-2 sm:gap-6 min-w-0">
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0">
                          {listType === 'core' ? <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary/60" /> : <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary/60" />}
                        </div>
                        <div className="text-left min-w-0">
                          <h3 className="font-medium text-[14px] sm:text-[16px] leading-tight mb-1 break-words">
                            {category}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-muted-foreground font-normal line-clamp-1">
                            {algos.length} essential problems
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5 sm:gap-2 shrink-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                          <span className="text-foreground/90">{statsByCategory[category].solved}</span>
                          <span className="text-muted-foreground/30">/</span>
                          <span>{statsByCategory[category].total}</span>
                          <span className="ml-0.5 sm:ml-1 text-[9px] opacity-70 hidden min-[400px]:inline">Solved</span>
                        </div>
                        <div className="h-1.5 w-16 xs:w-20 sm:w-32 bg-muted/40 rounded-full overflow-hidden border border-border/10 shadow-inner">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              (statsByCategory[category].solved / statsByCategory[category].total) > 0 && "border-r border-black/10 dark:border-white/10 shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                              getProgressBarColor((statsByCategory[category].solved / statsByCategory[category].total) * 100)
                            )}
                            style={{ width: `${(statsByCategory[category].solved / statsByCategory[category].total) * 100 || 0}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-muted/5">
                    <div className="flex flex-col">
                      {algos.map((algo, index) => (
                        <PremiumProblemCard
                          key={algo.id}
                          algorithm={algo}
                          status={(progressMap?.[algo.id] || 'none') as any}
                          index={index}
                          isPremium={algo.is_premium}
                          isFirst={index === 0}
                          isLast={index === algos.length - 1}
                          disableRounding={true}
                          onCategoryClick={handleCategoryClick}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-border/60 rounded-xl bg-card/20 mx-4 sm:mx-0">
              <div className="w-16 h-16 mb-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <SearchX className="w-8 h-8 text-primary/60" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 tracking-tight">No problems found</h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
                {searchQuery ? (
                  <>We couldn't find any problems matching "<span className="text-foreground font-medium">{searchQuery}</span>". Try adjusting your search term or filters.</>
                ) : hasActiveFilters ? (
                  "We couldn't find any problems matching your current filters. Try adjusting them to see more results."
                ) : (
                  "There are no problems available at the moment."
                )}
              </p>
              {hasActiveFilters && (
                <Button onClick={handleReset} variant="outline" className="gap-2 rounded-full h-10 px-6 font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-all">
                  <RotateCcw className="w-4 h-4" />
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {footerSlot}

      <div className="w-full max-w-[820px] mx-auto sticky bottom-8 flex justify-end pointer-events-none z-40 mt-4 sm:mt-0">
        {showScrollTop && (
          <Button
            className="rounded-full w-12 h-12 shadow-xl p-0 bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:scale-110 active:scale-95 pointer-events-auto sm:mr-4 mr-0"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        )}
      </div>
    </ListingLayout>
  );
};
