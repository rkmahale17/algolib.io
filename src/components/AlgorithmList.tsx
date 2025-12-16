import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListType, LIST_TYPE_LABELS, DIFFICULTY_MAP, AlgorithmListItem } from '@/types/algorithm';

interface AlgorithmListProps {
  algorithms: AlgorithmListItem[];
  emptyMessage?: string;
  defaultListType?: string;
  availableListTypes?: string[];
  hideListSelection?: boolean;
  isLoading?: boolean;
}

const AlgorithmListSkeleton = () => (
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

export const AlgorithmList = ({ 
    algorithms, 
    emptyMessage = "No algorithms found.",
    defaultListType = "all",
    availableListTypes = ["all", ListType.Core, ListType.Blind75, ListType.CoreAndBlind75],
    hideListSelection = false,
    isLoading = false
}: AlgorithmListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedListType, setSelectedListType] = useState<string | null>(defaultListType === 'all' ? null : defaultListType);
  const [sortBy, setSortBy] = useState<string>('serial-asc');

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

      {/* Grid */}
      {isLoading ? (
        <AlgorithmListSkeleton />
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedAlgorithms.map((algo, index) => (
          <Link 
            key={algo.id} 
            to={algo.slug ? `/algorithm/${algo.slug}` : `/algorithm/${algo.id}`}
            rel="noopener noreferrer"
          >
            <Card 
              className="p-6 hover-lift cursor-pointer glass-card group h-full"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                      <span className="mr-2 text-muted-foreground font-mono text-base text-x opacity-70">
                        {index + 1}.
                      </span>
                      {algo.displayTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {algo.category}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${difficultyColors[algo.mappedDifficulty]} shrink-0`}
                  >
                    {algo.mappedDifficulty}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {algo.description}
                </p>

                <div className="flex items-center gap-4 text-xs">
                  {algo.timeComplexity && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-muted-foreground">Time: {algo.timeComplexity}</span>
                    </div>
                  )}
                  {algo.spaceComplexity && (
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span className="text-muted-foreground">Space: {algo.spaceComplexity}</span>
                    </div>
                  )}
                </div>

                 {algo.companies && algo.companies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {algo.companies.slice(0, 3).map((company: string) => (
                      <Badge key={company} variant="secondary" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredAndSortedAlgorithms.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
      </>
      )}
    </div>
  );
};
