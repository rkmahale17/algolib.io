import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Search, TrendingUp, BookOpen, Check, Circle, MoreVertical, Timer, Database, ExternalLink, Lock, LayoutGrid, List, ArrowUp } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListType, LIST_TYPE_LABELS, DIFFICULTY_MAP, AlgorithmListItem } from '@/types/algorithm';
import { useApp } from '@/contexts/AppContext';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';
import { cn } from '@/lib/utils';
import { AlgorithmCard } from './AlgorithmCard';
import { usePostHog } from '@posthog/react';
import { trackEvent } from '@/lib/analytics';

interface ProblemListProps {
  algorithms: AlgorithmListItem[];
  emptyMessage?: string;
  defaultListType?: string;
  availableListTypes?: string[];
  hideListSelection?: boolean;
  isLoading?: boolean;
  variant?: 'default' | 'sidebar';
  initialViewMode?: 'list' | 'grid';
}

const ProblemListSkeleton = () => (
  <div className="space-y-3">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-8 py-4 bg-muted/5 rounded-xl border border-border/20">
        <Skeleton className="w-12 h-4 rounded" />
        <Skeleton className="flex-1 h-5 rounded max-w-md" />
        <Skeleton className="w-32 h-4 rounded hidden md:block" />
        <Skeleton className="w-24 h-6 rounded" />
        <Skeleton className="w-24 h-4 rounded" />
      </div>
    ))}
  </div>
);

const difficultyRank: Record<string, number> = {
  'Easy': 1,
  'Medium': 2,
  'Hard': 3
};

const difficultyColors: Record<string, string> = {
  'Easy': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Medium': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'Hard': 'bg-red-500/10 text-red-500 border-red-500/20',
};

export const ProblemList = ({
  algorithms,
  emptyMessage = "No algorithms found.",
  defaultListType = "all",
  availableListTypes = ["all", ListType.Core, ListType.Blind75],
  hideListSelection = false,
  isLoading = false,
  variant = 'default',
  initialViewMode
}: ProblemListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedListType, setSelectedListType] = useState<string | null>(defaultListType === 'all' ? null : defaultListType);
  const [sortBy, setSortBy] = useState<string>('serial-asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(initialViewMode || 'grid');
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Hide button when topRef is near the top of the screen (or within 300px above it)
        setShowScrollTop(!entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: '300px 0px 0px 0px' }
    );
    
    observer.observe(topRef.current);
    
    return () => observer.disconnect();
  }, [mounted]);

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const { hasPremiumAccess, activeListType, setActiveListType, progressMap, user } = useApp();
  const isPaywallEnabled = useFeatureFlag('paywall_enabled');
  const posthog = usePostHog();
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // userId state and effect no longer needed, using user.id from AppContext
  const userId = user?.id;

  // Persist view mode to localStorage
  useEffect(() => {
    setMounted(true);
    if (!initialViewMode) {
      const savedMode = localStorage.getItem('problem-list-view-mode');
      if (savedMode === 'list' || savedMode === 'grid') {
        setViewMode(savedMode);
      }
    }
  }, [initialViewMode]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('problem-list-view-mode', viewMode);
      trackEvent(posthog, 'problem_view_mode_changed', { mode: viewMode });
    }
  }, [viewMode, mounted, posthog]);

  // Sync global list context when this component is the primary list for a page
  useEffect(() => {
    const listTypeToSet = defaultListType === 'all' ? 'all' : defaultListType;
    if (activeListType !== listTypeToSet && !hideListSelection) {
      setActiveListType(listTypeToSet);
    }
  }, [defaultListType, activeListType, setActiveListType, hideListSelection]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(algorithms.flatMap(a => 
      a.category ? a.category.split(',').map((c: string) => c.trim()) : []
    ).filter(Boolean));
    return Array.from(cats).sort();
  }, [algorithms]);

  const filteredAndSortedAlgorithms = useMemo(() => {
    let result = algorithms.map(algo => ({
      ...algo,
      mappedDifficulty: DIFFICULTY_MAP[algo.difficulty?.toLowerCase()] || 'Medium', // Default to Medium if unknown
      displayTitle: algo.title || algo.name || ''
    }));

    // Filter
    result = result.filter(algo => {
      const matchesSearch =
        algo.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || (algo.category && algo.category.split(',').map((c: string) => c.trim()).includes(selectedCategory));
      const matchesDifficulty = !selectedDifficulty || algo.mappedDifficulty === selectedDifficulty;


      // Normalize selection and matching
      const selectedType = selectedListType?.toLowerCase();
      let matchesListType = true;
      if (selectedType) {
        const listTypes = algo.listTypes || (algo.list_type ? [algo.list_type] : ['core']);
        matchesListType = listTypes.some((t: string) => t.toLowerCase() === selectedType);
      }

      return matchesSearch && matchesCategory && matchesDifficulty && matchesListType;
    });

    // Sort
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.displayTitle.localeCompare(a.displayTitle));
    } else if (sortBy === 'difficulty-asc') {
      result.sort((a, b) => difficultyRank[a.mappedDifficulty] - difficultyRank[b.mappedDifficulty]);
    } else if (sortBy === 'difficulty-desc') {
      result.sort((a, b) => difficultyRank[b.mappedDifficulty] - difficultyRank[a.mappedDifficulty]);
    } else if (sortBy === 'serial-asc') {
      result.sort((a, b) => (a.serial_no || 999999) - (b.serial_no || 999999));
    } else if (sortBy === 'serial-desc') {
      result.sort((a, b) => (b.serial_no || 0) - (a.serial_no || 0));
    }

    return result;
  }, [algorithms, searchQuery, selectedCategory, selectedDifficulty, selectedListType, sortBy]);

  const listRef = useRef<HTMLDivElement>(null);

  const virtualizer = useWindowVirtualizer({
    count: filteredAndSortedAlgorithms.length,
    estimateSize: () => 90, // Approximate height of AlgorithmCard
    overscan: 5,
  });

  // Debounced search tracking
  const trackSearch = useCallback((query: string, resultCount: number) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      if (query.trim().length > 1) {
        trackEvent(posthog, 'problem_list_searched', {
          query: query.trim(),
          result_count: resultCount,
          category_filter: selectedCategory,
          difficulty_filter: selectedDifficulty,
          list_type_filter: selectedListType,
        });
      }
    }, 600);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posthog, selectedCategory, selectedDifficulty, selectedListType]);

  useEffect(() => {
    trackSearch(searchQuery, filteredAndSortedAlgorithms.length);
  }, [searchQuery, filteredAndSortedAlgorithms.length, trackSearch]);

  // Filter tracking
  const handleCategoryChange = useCallback((val: string | null) => {
    setSelectedCategory(val);
    trackEvent(posthog, 'problem_filter_applied', {
      filter_type: 'category',
      filter_value: val ?? 'all',
      result_count: filteredAndSortedAlgorithms.length,
    });
  }, [posthog, filteredAndSortedAlgorithms.length]);

  const handleCategoryClick = useCallback((cat: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleCategoryChange(selectedCategory === cat ? null : cat);
  }, [selectedCategory, handleCategoryChange]);

  const handleDifficultyChange = useCallback((val: string | null) => {
    setSelectedDifficulty(val);
    trackEvent(posthog, 'problem_filter_applied', {
      filter_type: 'difficulty',
      filter_value: val ?? 'all',
      result_count: filteredAndSortedAlgorithms.length,
    });
  }, [posthog, filteredAndSortedAlgorithms.length]);

  const handleListTypeChange = useCallback((val: string | null) => {
    setSelectedListType(val);
    trackEvent(posthog, 'problem_filter_applied', {
      filter_type: 'list_type',
      filter_value: val ?? 'all',
      result_count: filteredAndSortedAlgorithms.length,
    });
  }, [posthog, filteredAndSortedAlgorithms.length]);

  const handleSortChange = useCallback((val: string) => {
    setSortBy(val);
    trackEvent(posthog, 'problem_filter_applied', {
      filter_type: 'sort',
      filter_value: val,
      result_count: filteredAndSortedAlgorithms.length,
    });
  }, [posthog, filteredAndSortedAlgorithms.length]);

  const isSidebar = variant === 'sidebar';

  return (
    <div className={isSidebar ? "space-y-4" : "space-y-6"}>
      {/* Anchor for scroll-to-top */}
      <div ref={topRef} className="w-full h-0 pointer-events-none" aria-hidden="true" />

      {/* Single Container Table */}
      {!mounted || isLoading || !algorithms ? (
        <ProblemListSkeleton />
      ) : (
        <div className="space-y-4">
          <div className={isSidebar ? "" : "rounded-2xl border-border/40 overflow-hidden glass-card bg-card/30 backdrop-blur-xl border"}>
            {/* Integrated Header & Filters */}
            <div className={`${isSidebar ? "p-0 pb-4" : "p-4 md:p-6"} space-y-4 ${isSidebar ? "" : "border-b border-border/40 bg-muted/5"}`}>
              <div className={cn(
                "flex gap-4 justify-between items-stretch",
                isSidebar ? "flex-col" : "flex-col lg:flex-row lg:items-center"
              )}>
                <div className={cn("relative flex-1 group", isSidebar ? "w-full" : "")}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="text"
                    placeholder="Filter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-sm bg-background/50 border-border/50 focus-visible:ring-primary/20"
                  />
                </div>

                <div className={cn("flex flex-wrap gap-2", isSidebar ? "w-full" : "")}>
                  {!hideListSelection && (
                    <Select value={selectedListType || "all"} onValueChange={(val) => handleListTypeChange(val === "all" ? null : val)}>
                      <SelectTrigger className={cn("h-10 rounded-lg bg-background/50 border-border/50", isSidebar ? "flex-1" : "w-[140px]")}>
                        <SelectValue placeholder="List Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableListTypes.includes("all") && <SelectItem value="all">All Lists</SelectItem>}
                        {availableListTypes.includes(ListType.Core) && <SelectItem value={ListType.Core}>{LIST_TYPE_LABELS[ListType.Core]}</SelectItem>}
                        {availableListTypes.includes(ListType.Blind75) && <SelectItem value={ListType.Blind75}>{LIST_TYPE_LABELS[ListType.Blind75]}</SelectItem>}
                      </SelectContent>
                    </Select>
                  )}

                  <Select value={selectedDifficulty || "all"} onValueChange={(val) => handleDifficultyChange(val === "all" ? null : val)}>
                    <SelectTrigger className={cn("h-10 rounded-lg bg-background/50 border-border/50", isSidebar ? "flex-1" : "w-[130px]")}>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className={cn("h-10 rounded-lg bg-background/50 border-border/50", isSidebar ? "flex-1" : "w-[130px]")}>
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serial-asc">Serial No ↑</SelectItem>
                      <SelectItem value="serial-desc">Serial No ↓</SelectItem>
                      <SelectItem value="name-asc">Name A-Z</SelectItem>
                      <SelectItem value="name-desc">Name Z-A</SelectItem>
                      <SelectItem value="difficulty-asc">Easy → Hard</SelectItem>
                      <SelectItem value="difficulty-desc">Hard → Easy</SelectItem>
                    </SelectContent>
                  </Select>

                  {!isSidebar && (
                    <div className="bg-background/50 border border-border/50 rounded-lg p-1 flex gap-1 h-10 items-center">
                      <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {!isSidebar && (
                /* Category Filter Pills (Integrated) */
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${selectedCategory === null
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${selectedCategory === category
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List View */}
            {viewMode === 'list' && (
              <div ref={listRef} style={{ position: 'relative', height: `${virtualizer.getTotalSize()}px` }}>
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const algo = filteredAndSortedAlgorithms[virtualItem.index];
                  const status = progressMap?.[algo.id] || 'none';
                  const isPremium = algo.is_premium || algo.is_pro || (algo.metadata as any)?.is_pro;

                  return (
                    <div
                      key={virtualItem.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                      ref={virtualizer.measureElement}
                      data-index={virtualItem.index}
                    >
                      <AlgorithmCard
                        algorithm={algo}
                        status={status as any}
                        isPremium={isPremium}
                        index={virtualItem.index}
                        isSidebar={isSidebar}
                        hasPremiumAccess={hasPremiumAccess}
                        isPaywallEnabled={isPaywallEnabled}
                        onCategoryClick={handleCategoryClick}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedAlgorithms.map((algo, index) => {
                  const status = progressMap?.[algo.id] || 'none';
                  return (
                    <Link
                      key={algo.id}
                      href={algo.slug ? `/problem/${algo.slug}` : `/problem/${algo.id}`}
                      className="group relative flex flex-col h-full"
                      style={{ contentVisibility: 'auto' }}
                    >
                      <div className={`
                        h-full p-5 rounded-xl border transition-all duration-300
                        bg-background/40 hover:bg-primary/5 hover:border-primary/20
                        flex flex-col gap-4
                        ${status === 'solved' ? 'border-green-500/20 shadow-[0_0_0_1px_rgba(34,197,94,0.1)]' : 'border-border/50'}
                      `}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">
                              <span>ALGO-{(algo.serial_no || index + 1).toString().padStart(2, '0')}</span>
                              {(algo.is_premium || algo.is_pro || (algo.metadata as any)?.is_pro) && (
                                <div className="flex items-center gap-0.5 bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded text-[9px] font-bold">
                                  {isPaywallEnabled && !hasPremiumAccess && <Lock className="w-2.5 h-2.5" />}
                                  PRO
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                              {algo.displayTitle}
                            </h3>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${difficultyColors[algo.mappedDifficulty]} shrink-0 text-[10px] font- px-2 py-0.5 h-auto border-none`}
                          >
                            {algo.mappedDifficulty}
                          </Badge>
                        </div>

                        <div className="mt-auto pt-2 flex items-center justify-between gap-4 border-t border-border/10">
                          <span className="text-xs text-muted-foreground truncate">{algo.category}</span>

                          {status === 'solved' ? (
                            <div className="flex items-center gap-1.5 text-green-500">
                              <Check className="w-3.5 h-3.5" />
                              <span className="text-[10px] font- uppercase tracking-wider">Solved</span>
                            </div>
                          ) : status === 'attempted' ? (
                            <div className="flex items-center gap-1.5 text-orange-400">
                              <Circle className="w-3.5 h-3.5" />
                              <span className="text-[10px] font- uppercase tracking-wider">Attempted</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary/60">
                              <span className="text-[10px] font- uppercase tracking-wider">Solve</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {filteredAndSortedAlgorithms.length === 0 && (
              <div className="text-center py-24">
                <p className="text-muted-foreground text-sm">{emptyMessage}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setSelectedDifficulty(null);
                  }}
                  className="mt-4 text-primary hover:text-primary/80"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {showScrollTop && (
        <Button
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-xl p-0 z-50 bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 hover:scale-110 active:scale-95"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};
