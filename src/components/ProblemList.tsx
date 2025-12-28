import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, BookOpen, CheckCircle2, Circle, MoreVertical, Timer, Database, ExternalLink, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListType, LIST_TYPE_LABELS, DIFFICULTY_MAP, AlgorithmListItem } from '@/types/algorithm';
import { useUserProgressMap } from '@/hooks/useAlgorithms';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useFeatureFlag } from '@/contexts/FeatureFlagContext';

interface ProblemListProps {
  algorithms: AlgorithmListItem[];
  emptyMessage?: string;
  defaultListType?: string;
  availableListTypes?: string[];
  hideListSelection?: boolean;
  isLoading?: boolean;
}

const ProblemListSkeleton = () => (
  <div className="space-y-2">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-8 py-4 bg-muted/5 rounded-xl border border-border/20">
        <div className="w-12 h-4 bg-muted/20 animate-pulse rounded" />
        <div className="flex-1 h-5 bg-muted/20 animate-pulse rounded max-w-md" />
        <div className="w-32 h-4 bg-muted/20 animate-pulse rounded hidden md:block" />
        <div className="w-24 h-6 bg-muted/20 animate-pulse rounded" />
        <div className="w-24 h-4 bg-muted/20 animate-pulse rounded" />
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
    availableListTypes = ["all", ListType.Core, ListType.Blind75, ListType.CoreAndBlind75],
    hideListSelection = false,
    isLoading = false
}: ProblemListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedListType, setSelectedListType] = useState<string | null>(defaultListType === 'all' ? null : defaultListType);
  const [sortBy, setSortBy] = useState<string>('serial-asc');
  const [userId, setUserId] = useState<string | undefined>(undefined);
  
  const { hasPremiumAccess } = useApp();
  const isPaywallEnabled = useFeatureFlag('paywall_enabled');

  // Get current user for progress tracking
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: progressMap } = useUserProgressMap(userId);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(algorithms.map(a => a.category).filter(Boolean));
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
      
      const matchesCategory = !selectedCategory || algo.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || algo.mappedDifficulty === selectedDifficulty;
      
      
      // Normalize algo list type (default to Core if missing) and selection
      const algoListType = (algo.listType || ListType.Core).toLowerCase();
      const selectedType = selectedListType?.toLowerCase();

      let matchesListType = true;
      if (selectedListType === ListType.Core) {
          // "Core" selection shows Core AND overlap
          matchesListType = algoListType === ListType.Core.toLowerCase() || algoListType === ListType.CoreAndBlind75.toLowerCase();
      } else if (selectedListType === ListType.Blind75) {
          // "Blind 75" selection shows Blind75 AND overlap
          matchesListType = algoListType === ListType.Blind75.toLowerCase() || algoListType === ListType.CoreAndBlind75.toLowerCase();
      } else if (selectedListType === ListType.CoreAndBlind75) {
          // "Core + Blind 75" selection shows ONLY overlap
          matchesListType = algoListType === ListType.CoreAndBlind75.toLowerCase();
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

  return (
    <div className="space-y-6">

      {/* Single Container Table */}
      {isLoading || !algorithms ? (
        <ProblemListSkeleton />
      ) : (
        <Card className="rounded-2xl border-border/40 overflow-hidden glass-card bg-card/30 backdrop-blur-xl">
          {/* Integrated Header & Filters */}
          <div className="p-4 md:p-6 space-y-4 border-b border-border/40 bg-muted/5">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Filter algorithms by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 text-sm bg-background/50 border-border/50 focus-visible:ring-primary/20"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {!hideListSelection && (
                  <Select value={selectedListType || "all"} onValueChange={(val) => setSelectedListType(val === "all" ? null : val)}>
                    <SelectTrigger className="h-10 w-[140px] rounded-lg bg-background/50 border-border/50">
                      <SelectValue placeholder="List Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableListTypes.includes("all") && <SelectItem value="all">All Lists</SelectItem>}
                      {availableListTypes.includes(ListType.Core) && <SelectItem value={ListType.Core}>{LIST_TYPE_LABELS[ListType.Core]}</SelectItem>}
                      {availableListTypes.includes(ListType.Blind75) && <SelectItem value={ListType.Blind75}>{LIST_TYPE_LABELS[ListType.Blind75]}</SelectItem>}
                      {availableListTypes.includes(ListType.CoreAndBlind75) && <SelectItem value={ListType.CoreAndBlind75}>{LIST_TYPE_LABELS[ListType.CoreAndBlind75]}</SelectItem>}
                    </SelectContent>
                  </Select>
                )}

                <Select value={selectedDifficulty || "all"} onValueChange={(val) => setSelectedDifficulty(val === "all" ? null : val)}>
                  <SelectTrigger className="h-10 w-[130px] rounded-lg bg-background/50 border-border/50">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-10 w-[130px] rounded-lg bg-background/50 border-border/50">
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
              </div>
            </div>

            {/* Category Filter Pills (Integrated) */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  selectedCategory === null 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    selectedCategory === category 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header (Desktop only) */}
          <div className="hidden md:flex items-center gap-4 px-8 py-3 bg-muted/20 border-b border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <div className="w-12 shrink-0">#</div>
            <div className="flex-1 min-w-0">Title</div>
            <div className="w-32 shrink-0">Category</div>
            <div className="w-24 shrink-0">Difficulty</div>
            <div className="w-24 shrink-0">Done</div>
          </div>

          <div className="divide-y divide-border/20">
            {filteredAndSortedAlgorithms.map((algo, index) => {
              const status = progressMap?.[algo.id] || 'none';
              const firstLetter = (algo.category || 'A').charAt(0).toUpperCase();

              return (
                <Link 
                  key={algo.id} 
                  to={algo.slug ? `/problem/${algo.slug}` : `/problem/${algo.id}`}
                  className={`block transition-all duration-300 hover:bg-primary/5 group relative
                    ${status === 'solved' 
                      ? 'bg-green-500/[0.03] border-l-4 border-green-500/30' 
                      : 'border-l-4 border-transparent'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4 px-6 md:px-8 py-3 md:py-2.5">
                    {/* ID & Title Column */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="hidden md:flex w-12 shrink-0 font-mono text-xs text-muted-foreground/40 group-hover:text-primary/60 transition-colors">
                        {(algo.serial_no || index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-[15px] leading-tight group-hover:text-primary transition-colors truncate">
                          {algo.displayTitle}
                        </h3>
                        {/* Mobile-only category and Premium Tag */}
                        <div className="md:hidden flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-muted-foreground">
                            {algo.category} • ALGO-{(algo.serial_no || index + 1).toString().padStart(2, '0')}
                          </p>
                          {isPaywallEnabled && algo.listType !== 'core' && algo.listType !== 'core+blind75' && !hasPremiumAccess && (
                            <div className="flex items-center gap-0.5 text-[9px] font-bold text-amber-500 uppercase">
                              <Lock className="w-2.5 h-2.5" />
                              Premium
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Category Column (Desktop) */}
                    <div className="hidden md:flex w-32 shrink-0 items-center gap-2">
                       <span className="text-xs font-medium text-muted-foreground truncate">{algo.category}</span>
                       {isPaywallEnabled && algo.listType !== 'core' && algo.listType !== 'core+blind75' && !hasPremiumAccess && (
                         <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase ring-1 ring-amber-500/20">
                           <Lock className="w-2 h-2" />
                         </div>
                       )}
                    </div>

                    {/* Difficulty Column */}
                    <div className="w-24 shrink-0 flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`${difficultyColors[algo.mappedDifficulty]} text-[10px] font-bold px-2 py-0 h-5 border-none bg-transparent md:bg-inherit`}
                      >
                        {algo.mappedDifficulty}
                      </Badge>
                    </div>


                    {/* Status Column */}
                    <div className="w-24 shrink-0 flex items-center">
                      {status === 'solved' ? (
                        <div className="flex items-center gap-1.5 text-green-500">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Solved</span>
                        </div>
                      ) : status === 'attempted' ? (
                        <div className="flex items-center gap-1.5 text-orange-400">
                          <Circle className="w-4 h-4" />
                          <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Attempted</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/30 font-mono">PENDING</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

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
        </Card>
      )}
    </div>
  );
};
