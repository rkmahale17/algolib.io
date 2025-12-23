import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListType, LIST_TYPE_LABELS, DIFFICULTY_MAP, AlgorithmListItem } from '@/types/algorithm';
import { useUserProgressMap } from '@/hooks/useAlgorithms';
import { supabase } from '@/integrations/supabase/client';

interface ProblemListProps {
  algorithms: AlgorithmListItem[];
  emptyMessage?: string;
  defaultListType?: string;
  availableListTypes?: string[];
  hideListSelection?: boolean;
  isLoading?: boolean;
}

const ProblemListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-[200px] rounded-xl bg-muted/20 animate-pulse" />
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
      {/* Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-card border-border/50"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {!hideListSelection && (
              <Select value={selectedListType || "all"} onValueChange={(val) => setSelectedListType(val === "all" ? null : val)}>
                <SelectTrigger className="w-[160px] rounded-full">
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
              <SelectTrigger className="w-[140px] rounded-full">
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
              <SelectTrigger className="w-[140px] rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="serial-asc">Serial No (Asc)</SelectItem>
                <SelectItem value="serial-desc">Serial No (Desc)</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="difficulty-asc">Difficulty (Easy-Hard)</SelectItem>
                <SelectItem value="difficulty-desc">Difficulty (Hard-Easy)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <ProblemListSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          {filteredAndSortedAlgorithms.map((algo, index) => {
            const status = progressMap?.[algo.id] || 'none';
            
            return (
              <Link 
                key={algo.id} 
                to={algo.slug ? `/problem/${algo.slug}` : `/problem/${algo.id}`}
                className="block group"
              >
                <Card 
                  className={`p-4 hover-lift glass-card border-border/40 transition-all duration-300 relative overflow-hidden h-full flex flex-col md:flex-row items-center gap-4 ${status === 'solved' ? 'border-primary/20 bg-primary/5' : ''}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Serial & Title Section */}
                  <div className="flex items-center gap-4 flex-1 min-w-0 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center shrink-0 font-mono text-sm text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                      {algo.serial_no || index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-base md:text-lg truncate group-hover:text-primary transition-colors">
                          {algo.displayTitle}
                        </h3>
                        {status === 'solved' && (
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 animate-in zoom-in duration-300" />
                        )}
                        {status === 'attempted' && (
                          <Circle className="w-4 h-4 text-orange-400 shrink-0 fill-orange-400/20" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                        <span>{algo.category}</span>
                        {algo.timeComplexity && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {algo.timeComplexity}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Meta Info */}
                  <div className="flex items-center gap-6 justify-center md:justify-end w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-border/30">
                    {/* Status Badge */}
                    <div className="hidden lg:block min-w-[100px] text-center">
                       {status === 'solved' ? (
                          <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors">
                            Solved
                          </Badge>
                       ) : status === 'attempted' ? (
                          <Badge variant="outline" className="text-orange-400 border-orange-400/30 bg-orange-400/5">
                            Attempted
                          </Badge>
                       ) : null}
                    </div>

                    {/* Difficulty */}
                    <Badge 
                      variant="outline" 
                      className={`${difficultyColors[algo.mappedDifficulty]} min-w-[80px] justify-center py-1`}
                    >
                      {algo.mappedDifficulty}
                    </Badge>

                    {/* Companies */}
                    <div className="hidden sm:flex items-center gap-1">
                       {algo.companies && algo.companies.length > 0 ? (
                         <div className="flex -space-x-2 overflow-hidden">
                           {algo.companies.slice(0, 3).map((company, i) => (
                             <div 
                                key={company}
                                className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold uppercase tracking-tighter"
                                title={company}
                             >
                               {company.charAt(0)}
                             </div>
                           ))}
                           {algo.companies.length > 3 && (
                             <div className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] font-bold">
                               +{algo.companies.length - 3}
                             </div>
                           )}
                         </div>
                       ) : (
                         <span className="text-[10px] text-muted-foreground/40 italic">Global</span>
                       )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          {filteredAndSortedAlgorithms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
