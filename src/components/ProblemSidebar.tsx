import { useState, useMemo } from 'react';
import { Search, ListFilter, ArrowUpDown, Check, Lock, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlgorithmListItem } from '@/types/algorithm';
import { Link, useParams } from 'react-router-dom';
import { ProblemFilterPopup } from './ProblemFilterPopup';

interface ProblemSidebarProps {
    algorithms: AlgorithmListItem[];
    progressMap: Record<string, string>;
    isPaywallEnabled: boolean;
    hasPremiumAccess: boolean;
    className?: string;
    onItemClick?: () => void;
}

export const ProblemSidebar = ({
    algorithms,
    progressMap,
    isPaywallEnabled,
    hasPremiumAccess,
    className,
    onItemClick
}: ProblemSidebarProps) => {
    const { id, slug } = useParams<{ id?: string; slug?: string }>();
    const currentIdOrSlug = id || slug;

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState({
        status: 'all',
        difficulty: 'all',
        topics: [] as string[],
        language: 'all'
    });

    const categories = useMemo(() => {
        const cats = new Set(algorithms.map(a => a.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [algorithms]);

    const filteredAlgorithms = useMemo(() => {
        let result = algorithms.filter(algo => {
            const matchesSearch =
                algo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                algo.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const status = progressMap[algo.id] || 'none';
            const matchesStatus = filters.status === 'all' || status === filters.status;

            const algoDifficulty = algo.difficulty?.toLowerCase();
            const filterDifficulty = filters.difficulty.toLowerCase();
            const matchesDifficulty = filterDifficulty === 'all' || algoDifficulty === filterDifficulty;

            const matchesTopic = filters.topics.length === 0 || filters.topics.includes('all') || filters.topics.includes(algo.category?.toLowerCase());

            return matchesSearch && matchesStatus && matchesDifficulty && matchesTopic;
        });

        result.sort((a, b) => {
            const valA = a.serial_no || 0;
            const valB = b.serial_no || 0;
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        });

        return result;
    }, [algorithms, searchQuery, filters, progressMap, sortOrder]);

    return (
        <div className={cn("flex flex-col h-full bg-background text-foreground", className)}>
            {/* Header with Search, Sort, Filter */}
            <div className="p-4 border-b border-border flex items-center gap-2">
                <div className="relative w-[40%]">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 h-9 text-xs bg-muted/20 border-border focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border border-border rounded-full hover:bg-muted/50"
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                >
                    <ArrowUpDown className="w-4 h-4" />
                </Button>

                <ProblemFilterPopup
                    filters={filters}
                    setFilters={setFilters}
                    topics={categories}
                    trigger={
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 border border-border rounded-full hover:bg-muted/50 relative"
                        >
                            <ListFilter className="w-4 h-4" />
                        </Button>
                    }
                />
            </div>

            {/* Problem List */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                {filteredAlgorithms.map((algo, index) => {
                    const status = progressMap[algo.id] || 'none';
                    const isSolved = status === 'solved';
                    const isActive = algo.id === currentIdOrSlug || algo.slug === currentIdOrSlug;
                    const isPremium = isPaywallEnabled && algo.listType !== 'core' && algo.listType !== 'core+blind75' && !hasPremiumAccess;

                    // Properly format difficulty for display
                    const difficulty = algo.difficulty || 'Medium';
                    const displayDifficulty =
                        difficulty.toLowerCase() === 'easy' ? 'Easy' :
                            difficulty.toLowerCase() === 'hard' ? 'Hard' : 'Med.';

                    return (
                        <Link
                            key={algo.id}
                            to={algo.slug ? `/problem/${algo.slug}` : `/problem/${algo.id}`}
                            onClick={onItemClick}
                            className={cn(
                                "group flex items-center gap-3 px-4 py-3 transition-colors",
                                isActive
                                    ? "bg-primary/80 dark:bg-primary/80 text-background"
                                    : (index % 2 !== 0 ? "bg-muted/5 hover:bg-muted/20 border-foreground/10" : "bg-transparent hover:bg-muted/10")
                            )}
                        >
                            {/* Solve Status Icon (Tick) */}
                            <div className={cn(
                                "flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full border",
                                isSolved
                                    ? (isActive ? "border-background text-background   " : "border-primary text-primary")
                                    : (isActive ? "border-background/30 text-background/30 " : "border-border text-transparent")
                            )}>
                                <Check className="w-3.5 h-3.5 stroke-[3] " />
                            </div>

                            {/* Problem Info */}
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <span className="text-xs font-mono opacity-50 flex-shrink-0">
                                    {algo.serial_no || index + 1}.
                                </span>
                                <span className="text-sm font-medium truncate">
                                    {algo.title || algo.name}
                                </span>
                            </div>

                            {/* Right Side Info - Aligned Right, Full Text */}
                            <div className="flex items-center justify-end gap-2 px-1 min-w-[60px]">
                                {isPremium && (
                                    <Lock className={cn("w-3 h-3", isActive ? "text-background/50" : "text-muted-foreground")} />
                                )}
                                <span className={cn(
                                    "text-[10px] font- uppercase tracking-wider w-[35px] text-left",
                                    isActive ? "text-background/70" : (
                                        difficulty.toLowerCase() === 'easy' ? "text-green-500" :
                                            difficulty.toLowerCase() === 'hard' ? "text-red-500" :
                                                "text-yellow-500"
                                    )
                                )}>
                                    {displayDifficulty}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
