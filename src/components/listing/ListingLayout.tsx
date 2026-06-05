import { ReactNode, useState } from "react";
import { SidebarLayout } from "@/components/SidebarLayout";
import { ProblemHero } from "./ProblemHero";
import { ProblemSidebarFilters } from "./ProblemSidebarFilters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search, ListFilter, ChevronDown, Shuffle, ArrowUpDown, RotateCcw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ListingLayoutProps {
    title: string;
    description: string;
    searchQuery: string;
    onSearchChange: (val: string) => void;
    sortBy: string;
    onSortChange: (val: string) => void;
    selectedTopics: string[];
    onTopicToggle: (topic: string) => void;
    topics?: string[];
    selectedCompanies: string[];
    onCompanyToggle: (company: string) => void;
    companies?: string[];
    selectedDifficulties: string[];
    onDifficultyToggle: (difficulty: string) => void;
    showRecommendation?: boolean;
    showCategoryToggle?: boolean;
    isCategoryWise?: boolean;
    onCategoryWiseChange?: (value: boolean) => void;
    children: ReactNode;
    stats?: {
        solved: number;
        total: number;
    };
    onRandomClick?: () => void;
    progressWidget?: ReactNode;
    stickyHeaderSlot?: ReactNode;
    icon?: any;
    filterButtonSlot?: ReactNode;
    hasActiveFilters?: boolean;
    onReset?: () => void;
}

interface FilterContentProps {
    selectedTopics: string[];
    onTopicToggle: (topic: string) => void;
    topics?: string[];
    selectedCompanies: string[];
    onCompanyToggle: (company: string) => void;
    companies?: string[];
    selectedDifficulties: string[];
    onDifficultyToggle: (difficulty: string) => void;
}

const FilterContent = ({
    selectedTopics,
    onTopicToggle,
    topics,
    selectedCompanies,
    onCompanyToggle,
    companies,
    selectedDifficulties,
    onDifficultyToggle
}: FilterContentProps) => (
    <div className="space-y-8 h-fit pb-12">
        <div className="space-y-1 xl-listing:block hidden">
            <h2 className="text-lg font-medium">Filters</h2>
            <p className="text-md text-muted-foreground">Narrow down by topic or difficulty</p>
        </div>

        <ProblemSidebarFilters
            selectedTopics={selectedTopics}
            onTopicToggle={onTopicToggle}
            topics={topics}
            selectedCompanies={selectedCompanies}
            onCompanyToggle={onCompanyToggle}
            companies={companies}
            selectedDifficulties={selectedDifficulties}
            onDifficultyToggle={onDifficultyToggle}
        />
    </div>
);

export const ListingLayout = ({
    title,
    description,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    selectedTopics,
    onTopicToggle,
    topics,
    selectedCompanies,
    onCompanyToggle,
    companies,
    selectedDifficulties,
    onDifficultyToggle,
    showRecommendation,
    showCategoryToggle,
    isCategoryWise,
    onCategoryWiseChange,
    children,
    stats,
    onRandomClick,
    progressWidget,
    stickyHeaderSlot,
    icon,
    filterButtonSlot,
    hasActiveFilters,
    onReset
}: ListingLayoutProps) => {
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    const filterProps = {
        selectedTopics,
        onTopicToggle,
        topics,
        selectedCompanies,
        onCompanyToggle,
        companies,
        selectedDifficulties,
        onDifficultyToggle
    };

    return (
        <SidebarLayout>
            <div className="min-h-screen bg-background flex flex-col min-w-0">
                <main className="flex-1 w-full max-w-[1600px] mx-auto px-2 sm:px-4 py-8 md:py-12">
                    <div className="flex flex-col xl-listing:flex-row gap-8 xl-listing:gap-12 justify-center">
                        {/* Main Content */}
                        <div className="w-full min-w-0 max-w-[820px] mx-auto xl-listing:mx-0">
                            <ProblemHero
                                title={title}
                                description={description}
                                showRecommendation={showRecommendation}
                                icon={icon}
                            />

                            <div className="space-y-6">
                                {progressWidget && (
                                    <div className="w-full max-w-[300px]">
                                        {progressWidget}
                                    </div>
                                )}

                                {stickyHeaderSlot && (
                                    <div className="sticky top-[48px] z-30 bg-background/95 backdrop-blur-sm -mx-2 px-2 py-3 mb-2">
                                        {stickyHeaderSlot}
                                    </div>
                                )}

                                <div className="rounded-xl border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5 space-y-4">
                                    {/* Search & Sort Row */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                                        <div className="relative flex-1 group">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                                            <Input
                                                type="text"
                                                placeholder="Search within this list of questions"
                                                value={searchQuery}
                                                onChange={(e) => onSearchChange(e.target.value)}
                                                className="pl-11 h-11 sm:h-12 text-sm sm:text-base bg-background border-border/60 rounded-xl shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 sm:gap-4">
                                            <Select value={sortBy} onValueChange={onSortChange}>
                                                <SelectTrigger className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl bg-background border-border/60 shadow-sm hover:border-primary/40 transition-all justify-center p-0 shrink-0 [&>svg]:hidden [&>span]:hidden" aria-label="Sort options">
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <ArrowUpDown className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent align="end" className="rounded-xl border-border/60">
                                                    <SelectItem value="serial-asc">Serial No ↑</SelectItem>
                                                    <SelectItem value="serial-desc">Serial No ↓</SelectItem>
                                                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                                                    <SelectItem value="name-desc">Name Z-A</SelectItem>
                                                    <SelectItem value="difficulty-asc">Easy → Hard</SelectItem>
                                                    <SelectItem value="difficulty-desc">Hard → Easy</SelectItem>
                                                </SelectContent>
                                            </Select>


                                            {filterButtonSlot}

                                            <div className="xl-listing:hidden flex items-center">
                                                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                                                    <SheetTrigger asChild>
                                                        <Button variant="outline" size="icon" className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl border-border/60 bg-background shadow-sm shrink-0">
                                                            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                                                        </Button>
                                                    </SheetTrigger>
                                                    <SheetContent side="right" className="w-full sm:w-[540px] p-0 flex flex-col h-full border-l border-border/40 shadow-2xl">
                                                        <SheetHeader className="p-6 border-b border-border/50 shrink-0">
                                                            <SheetTitle className="text-xl font-medium tracking-tight">Filters</SheetTitle>
                                                        </SheetHeader>

                                                        <ScrollArea className="flex-1">
                                                            <div className="p-6">
                                                                <FilterContent {...filterProps} />
                                                            </div>
                                                        </ScrollArea>

                                                        <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm flex items-center gap-3 shrink-0">
                                                            <Button
                                                                variant="outline"
                                                                className="flex-1 rounded-xl h-11 font-medium border-border/60 hover:bg-muted/50"
                                                                onClick={() => {
                                                                    onTopicToggle('CLEAR_ALL');
                                                                    onCompanyToggle('CLEAR_ALL');
                                                                    onDifficultyToggle('CLEAR_ALL');
                                                                }}
                                                            >
                                                                Clear all
                                                            </Button>
                                                            <Button
                                                                className="flex-1 rounded-xl h-11 bg-[#dfff5e] hover:bg-[#dfff5e]/90 text-black font-bold shadow-[0_4px_12px_rgba(223,255,94,0.3)] transition-all active:scale-[0.98]"
                                                                onClick={() => setIsFilterSheetOpen(false)}
                                                            >
                                                                Apply
                                                            </Button>
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    {(stats || showCategoryToggle) && (
                                        <div className="h-[1px] bg-border/20 w-full" />
                                    )}

                                    {/* Category-wise Toggle & Stats Row */}
                                    {(stats || showCategoryToggle) && (
                                        <div className="flex flex-wrap items-center justify-start gap-3 w-full">
                                            {/* Left side: Category Switch */}
                                            {showCategoryToggle && (
                                                <div className="flex items-center justify-between gap-4 h-10 px-4 rounded-xl bg-background border border-border/60 shadow-sm transition-all w-fit shrink-0">
                                                    <label htmlFor="category-mode" className="text-xs sm:text-sm font-semibold text-foreground/80 tracking-tight cursor-pointer select-none whitespace-nowrap">
                                                        Category
                                                    </label>
                                                    <Switch
                                                        id="category-mode"
                                                        checked={isCategoryWise}
                                                        onCheckedChange={onCategoryWiseChange}
                                                        className="scale-90 data-[state=checked]:bg-[#84cc16] data-[state=checked]:border-[#84cc16] shrink-0"
                                                    />
                                                </div>
                                            )}
 
                                            {/* Difficulty Filter Button Group (Desktop/Tablet) */}
                                            <div className="hidden sm:flex items-center rounded-xl bg-background dark:bg-muted/10 border border-border/60 h-10 w-fit shrink-0 select-none overflow-hidden">
                                                {['Easy', 'Medium', 'Hard'].map((diff, idx) => {
                                                    const isSelected = selectedDifficulties.includes(diff);
                                                    const label = diff === 'Medium' ? 'Med' : diff;
                                                    
                                                    let activeClass = '';
                                                    let hoverClass = '';
                                                    if (diff === 'Easy') {
                                                        activeClass = 'bg-green-500/10 text-green-600 dark:text-green-400';
                                                        hoverClass = 'hover:text-green-600 dark:hover:text-green-400 hover:bg-green-500/5';
                                                    } else if (diff === 'Medium') {
                                                        activeClass = 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
                                                        hoverClass = 'hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-500/5';
                                                    } else {
                                                        activeClass = 'bg-red-500/10 text-red-600 dark:text-red-400';
                                                        hoverClass = 'hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/5';
                                                    }

                                                    return (
                                                        <div key={diff} className="flex items-center h-full">
                                                            {idx > 0 && (
                                                                <div className="w-px h-5 bg-border/60 shrink-0" />
                                                            )}
                                                            <button
                                                                onClick={() => onDifficultyToggle(diff)}
                                                                className={cn(
                                                                    "px-3 sm:px-4 h-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer",
                                                                    isSelected 
                                                                        ? activeClass
                                                                        : cn("text-muted-foreground/80 hover:text-foreground", hoverClass)
                                                                )}
                                                            >
                                                                <span className={cn(
                                                                    "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shrink-0 transition-transform duration-300",
                                                                    diff === 'Easy' && "bg-green-500",
                                                                    diff === 'Medium' && "bg-yellow-500",
                                                                    diff === 'Hard' && "bg-red-500",
                                                                    isSelected ? "scale-110" : "scale-90 opacity-70"
                                                                )} />
                                                                {label}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Dropdown for Mobile (overflow state) */}
                                            <div className="block sm:hidden w-fit">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="h-10 px-4 rounded-xl bg-background dark:bg-muted/10 border-border/60 shadow-sm flex items-center gap-2 text-xs font-semibold w-fit justify-between active:scale-[0.98] transition-transform">
                                                            <span className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                                {selectedDifficulties.length === 0 || selectedDifficulties.length === 3 
                                                                    ? "Difficulty (All)" 
                                                                    : `Difficulty (${selectedDifficulties.join(", ")})`}
                                                            </span>
                                                            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-[calc(100vw-24px)] max-w-[340px] rounded-xl border-border/60 p-1.5 bg-popover text-popover-foreground shadow-md z-50">
                                                        {['Easy', 'Medium', 'Hard'].map((diff) => {
                                                            const isSelected = selectedDifficulties.includes(diff);
                                                            return (
                                                                <DropdownMenuCheckboxItem
                                                                    key={diff}
                                                                    checked={isSelected}
                                                                    onCheckedChange={() => onDifficultyToggle(diff)}
                                                                    className="text-xs font-medium cursor-pointer rounded-lg py-2 pl-8 pr-2"
                                                                >
                                                                    <span className="flex items-center gap-1.5">
                                                                        <span className={cn(
                                                                            "w-1.5 h-1.5 rounded-full shrink-0",
                                                                            diff === 'Easy' && "bg-green-500",
                                                                            diff === 'Medium' && "bg-yellow-500",
                                                                            diff === 'Hard' && "bg-red-500"
                                                                        )} />
                                                                        {diff}
                                                                    </span>
                                                                </DropdownMenuCheckboxItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Solved stats + Random button capsule */}
                                            {stats && (() => {
                                                const radius = 14;
                                                const circumference = 2 * Math.PI * radius;
                                                const percentage = stats.total > 0 ? stats.solved / stats.total : 0;
                                                const strokeDashoffset = circumference - percentage * circumference;
                                                
                                                return (
                                                    <div className="flex items-center h-10 rounded-xl border border-border/60 bg-muted/40 dark:bg-muted/10 overflow-hidden shadow-sm shrink-0 select-none">
                                                        {/* Left: Stats & Progress Circle */}
                                                        <div className="flex items-center gap-2 px-3 py-1.5 h-full">
                                                                {/* SVG Progress Circle */}
                                                                <svg className="w-4 h-4 transform -rotate-90 shrink-0" viewBox="0 0 36 36">
                                                                    <circle
                                                                        className="stroke-zinc-200 dark:stroke-zinc-800"
                                                                        strokeWidth="3.5"
                                                                        fill="transparent"
                                                                        r={radius}
                                                                        cx="18"
                                                                        cy="18"
                                                                    />
                                                                    <circle
                                                                        className="stroke-green-500 transition-all duration-500"
                                                                        strokeWidth="3.5"
                                                                        strokeDasharray={circumference}
                                                                        strokeDashoffset={strokeDashoffset}
                                                                        strokeLinecap="round"
                                                                        fill="transparent"
                                                                        r={radius}
                                                                        cx="18"
                                                                        cy="18"
                                                                    />
                                                                </svg>
                                                                <span className="text-xs sm:text-sm font-medium tracking-tight">
                                                                    <strong className="text-foreground font-semibold">{stats.solved}</strong>
                                                                    <span className="text-muted-foreground/50 mx-0.5">/</span>
                                                                    <strong className="text-foreground font-semibold">{stats.total}</strong>
                                                                    <span className="text-muted-foreground/80 ml-1 text-xs font-semibold">Solved</span>
                                                                </span>
                                                            </div>

                                                        {/* Right: Clickable Shuffle Icon */}
                                                        {onRandomClick && (
                                                            <TooltipProvider delayDuration={200}>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <button
                                                                                onClick={onRandomClick}
                                                                                className="flex items-center justify-center w-12 h-full bg-[#dfff5e]/15 dark:bg-[#dfff5e]/10 border-l border-border/60 hover:bg-[#dfff5e]/30 dark:hover:bg-[#dfff5e]/20 text-lime-700 dark:text-[#dfff5e] active:scale-95 transition-all cursor-pointer group shrink-0"
                                                                            >
                                                                                <Shuffle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" />
                                                                            </button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent side="top" className="text-[11px] bg-zinc-950 dark:bg-zinc-900 text-white border-zinc-800 py-1.5 px-3 rounded-lg shadow-md z-[100] font-semibold">
                                                                            Pick a random problem
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                        </div>
                                                    );
                                                })()}

                                            {/* Reset all filters button */}
                                            {hasActiveFilters && onReset && (
                                                <TooltipProvider delayDuration={200}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={onReset}
                                                                className="flex items-center justify-center w-10 h-10 rounded-xl border border-red-500/30 bg-red-500/5 shadow-sm hover:bg-red-500/15 hover:border-red-500/50 active:scale-95 transition-all shrink-0 group cursor-pointer"
                                                                aria-label="Reset all filters"
                                                            >
                                                                <RotateCcw className="w-4 h-4 text-red-500 dark:text-red-400 group-hover:rotate-[-45deg] transition-transform duration-300" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" className="text-[11px] bg-zinc-950 dark:bg-zinc-900 text-white border-zinc-800 py-1.5 px-3 rounded-lg shadow-md z-[100] font-semibold">
                                                            Reset all filters
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                            </div>
                                        )}
                                </div>

                                <div className="flex flex-col gap-0 min-w-0">
                                    {children}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Sidebar Filters - Desktop Only */}
                        <aside className="hidden xl-listing:block xl-listing:w-80 shrink-0">
                            <div className="sticky top-[80px]">
                                <ScrollArea className="h-[calc(100vh-120px)] pr-4 -mr-4">
                                    <FilterContent {...filterProps} />
                                </ScrollArea>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </SidebarLayout>
    );
};
