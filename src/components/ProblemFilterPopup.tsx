import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
    Check, RotateCcw, ChevronDown, 
    Building2, Layers, Compass, Zap, Target, Share2, Network, ArrowDownToDot, Map, Box, Calculator, Binary, Folder
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CompanyIcon } from '@/components/CompanyIcon';
import { slugifyCompany } from '@/constants/companies';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterState {
    status: string;
    difficulty: string[];
    topics: string[];
    companies: string[];
    language: string;
}

interface ProblemFilterPopupProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    trigger: React.ReactNode;
    topics?: string[];
    companies?: string[];
    topicCounts?: Record<string, number>;
    companyCounts?: Record<string, number>;
    difficultyCounts?: Record<string, number>;
}

export const TOPIC_ICONS: Record<string, React.ElementType> = {
    "Arrays & Hashing": Box,
    "Two Pointers": Compass,
    "Sliding Window": Zap,
    "Stack": Layers,
    "Binary Search": Target,
    "Linked List": Share2,
    "Trees": Network,
    "Tries": ArrowDownToDot,
    "Backtracking": Map,
    "Heap / Priority Queue": Box,
    "Graphs": Network,
    "1-D DP": Calculator,
    "Intervals": Map,
    "Greedy": Target,
    "Advanced Graphs": Network,
    "2-D DP": Calculator,
    "Bit Manipulation": Binary,
    "Math & Geometry": Calculator,
};

export const ProblemFilterPopup = ({ 
    filters, setFilters, trigger, topics = [], companies = [],
    topicCounts = {}, companyCounts = {}, difficultyCounts = {}
}: ProblemFilterPopupProps) => {
    const [matchMode, setMatchMode] = React.useState<'all' | 'any'>('all');

    const handleReset = () => {
        setFilters({
            status: 'all',
            difficulty: [],
            topics: [],
            companies: [],
            language: 'all'
        });
    };

    const topicOptions = React.useMemo(() => {
        return topics.map(topic => {
            const Icon = TOPIC_ICONS[topic] || Folder;
            return {
                label: topic,
                value: topic,
                count: topicCounts[topic] || 0,
                icon: <Icon className="w-3.5 h-3.5 opacity-70" />
            };
        });
    }, [topics, topicCounts]);

    const companyOptions = React.useMemo(() => {
        return companies.map(company => ({
            label: company,
            value: company,
            count: companyCounts[company] || 0,
            icon: <CompanyIcon company={slugifyCompany(company)} className="w-3.5 h-3.5 opacity-70 grayscale group-hover:grayscale-0" forceLoad={true} />
        }));
    }, [companies, companyCounts]);

    const difficultyOptions = [
        { label: 'Easy', value: 'easy', count: difficultyCounts['easy'] || 0 },
        { label: 'Medium', value: 'medium', count: difficultyCounts['medium'] || 0 },
        { label: 'Hard', value: 'hard', count: difficultyCounts['hard'] || 0 },
    ];

    const toggleArrayItem = (arr: string[], item: string) => {
        return arr.includes(item) ? arr.filter(v => v !== item) : [...arr, item];
    };

    const getMultiLabel = (selected: string[], options: { label: string; value: string }[]) => {
        if (selected.length === 0) return 'All';
        const first = options.find(o => o.value === selected[0]);
        const firstName = first?.label || selected[0];
        if (selected.length === 1) return firstName;
        return `${firstName} +${selected.length - 1}`;
    };

    // Single-select filter row (for Status, Language)
    const FilterRow = ({ icon, label, id, value, onValueChange, options }: any) => (
        <div className="flex items-center gap-4 py-2 group">
            <div className="flex items-center gap-2 w-28">
                <Checkbox
                    id={id}
                    checked={value !== 'all'}
                    className="h-3.5 w-3.5 rounded-none border border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                />
                <div className="text-muted-foreground/60 group-hover:text-foreground transition-colors">
                    {icon}
                </div>
                <label htmlFor={id} className="text-[11px] font-normal text-muted-foreground/80 group-hover:text-foreground cursor-pointer whitespace-nowrap uppercase tracking-wider">
                    {label}
                </label>
            </div>

            <div className="flex items-center gap-2 flex-1">
                <Select value="is" disabled>
                    <SelectTrigger className="h-8 w-20 bg-muted/20 border-border text-[11px] font-medium">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="is">is</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={value} onValueChange={onValueChange}>
                    <SelectTrigger className="h-8 flex-1 bg-muted/10 border-border text-[11px] font-medium">
                        <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((opt: any) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    // Multi-select filter row (for Difficulty, Topics)
    const MultiFilterRow = ({ icon, label, id, selected, onToggle, options }: {
        icon: React.ReactNode;
        label: string;
        id: string;
        selected: string[];
        onToggle: (value: string) => void;
        options: { label: string; value: string; count?: number; icon?: React.ReactNode }[];
    }) => {
        const displayLabel = getMultiLabel(selected, options);
        const hasSelection = selected.length > 0;

        return (
            <div className="flex items-center gap-4 py-2 group">
                <div className="flex items-center gap-2 w-28">
                    <Checkbox
                        id={`popup-filter-${id}`}
                        checked={hasSelection}
                        onCheckedChange={() => {
                            if (hasSelection) {
                                // Clear all
                                selected.forEach(v => onToggle(v));
                            }
                        }}
                        className="h-3.5 w-3.5 rounded-none border border-muted-foreground/30 data-[state=checked]:bg-foreground data-[state=checked]:text-background"
                    />
                    <div className="text-muted-foreground/60 group-hover:text-foreground transition-colors">
                        {icon}
                    </div>
                    <label htmlFor={`popup-filter-${id}`} className="text-[11px] font-normal text-muted-foreground/80 group-hover:text-foreground cursor-pointer whitespace-nowrap uppercase tracking-wider">
                        {label}
                    </label>
                </div>

                <div className="flex items-center gap-2 flex-1">
                    <Select value="is" disabled>
                        <SelectTrigger className="h-8 w-20 bg-muted/20 border-border text-[11px] font-medium">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="is">is</SelectItem>
                        </SelectContent>
                    </Select>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="h-8 flex-1 flex items-center justify-between px-3 bg-muted/10 border border-border rounded-md text-[11px] font-medium hover:bg-muted/20 transition-colors cursor-pointer min-w-0">
                                <span className={cn(
                                    "truncate",
                                    hasSelection ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {displayLabel}
                                </span>
                                {hasSelection && selected.length > 1 && (
                                    <span className="ml-1 shrink-0 text-[9px] font-bold bg-foreground text-background rounded px-1 py-0.5 leading-none">
                                        {selected.length}
                                    </span>
                                )}
                                <ChevronDown className="w-3 h-3 ml-1 shrink-0 opacity-50" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px] max-h-[240px] overflow-y-auto rounded-xl border-border/60 p-1.5">
                            {options.map((opt) => (
                                <DropdownMenuCheckboxItem
                                    key={opt.value}
                                    checked={selected.includes(opt.value)}
                                    onCheckedChange={() => onToggle(opt.value)}
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-[11px] font-medium cursor-pointer rounded-lg py-1.5 pl-8 pr-2 group"
                                >
                                    <div className="flex items-center gap-2">
                                        {opt.icon && <div className="shrink-0">{opt.icon}</div>}
                                        <span className="flex-1">{opt.label}</span>
                                        {opt.count !== undefined && (
                                            <span className="text-[10px] text-muted-foreground/70 tabular-nums">({opt.count})</span>
                                        )}
                                    </div>
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-4 bg-background border-border shadow-2xl rounded-xl" align="end">
                <div className="space-y-4">
                    {/* Match Toggle */}
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
                        <span>Match</span>
                        <Select value={matchMode} onValueChange={(val: any) => setMatchMode(val)}>
                            <SelectTrigger className="h-8 w-20 bg-muted/20 border-border text-[11px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="any">Any</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-muted-foreground/80">of the following filters:</span>
                    </div>

                    {/* Filters */}
                    <div className="space-y-1">
                        <FilterRow
                            label="Status"
                            id="filter-status"
                            icon={<Check className="w-4 h-4" />}
                            value={filters.status}
                            onValueChange={(val: string) => setFilters(prev => ({ ...prev, status: val }))}
                            options={[
                                { label: 'All', value: 'all' },
                                { label: 'Todo', value: 'none' },
                                { label: 'Solved', value: 'solved' },
                                { label: 'Attempted', value: 'attempted' }
                            ]}
                        />
                        <MultiFilterRow
                            label="Difficulty"
                            id="filter-difficulty"
                            icon={<div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center text-[8px]">D</div>}
                            selected={filters.difficulty}
                            onToggle={(val: string) => setFilters(prev => ({ ...prev, difficulty: toggleArrayItem(prev.difficulty, val) }))}
                            options={difficultyOptions}
                        />
                        <MultiFilterRow
                            label="Topics"
                            id="filter-topics"
                            icon={<div className="w-4 h-4 border-2 border-current rounded rounded-tr-none flex items-center justify-center text-[8px]">T</div>}
                            selected={filters.topics}
                            onToggle={(val: string) => setFilters(prev => ({ ...prev, topics: toggleArrayItem(prev.topics, val) }))}
                            options={topicOptions}
                        />
                        <MultiFilterRow
                            label="Company"
                            id="filter-companies"
                            icon={<Building2 className="w-4 h-4" />}
                            selected={filters.companies || []}
                            onToggle={(val: string) => setFilters(prev => ({ ...prev, companies: toggleArrayItem(prev.companies || [], val) }))}
                            options={companyOptions}
                        />
                        <FilterRow
                            label="Language"
                            id="filter-language"
                            icon={<div className="w-4 h-4 font-mono text-[10px]">{"</>"}</div>}
                            value={filters.language}
                            onValueChange={(val: string) => setFilters(prev => ({ ...prev, language: val }))}
                            options={[
                                { label: 'All', value: 'all' },
                                { label: 'JavaScript', value: 'javascript' },
                                { label: 'Python', value: 'python' },
                                { label: 'Java', value: 'java' }
                            ]}
                        />
                    </div>

                    {/* Selected Filters Summary */}
                    {(filters.status !== 'all' || filters.language !== 'all' || filters.difficulty.length > 0 || filters.topics.length > 0 || (filters.companies && filters.companies.length > 0)) && (
                        <div className="pt-3 pb-1 border-t border-border/50">
                            <div className="flex flex-wrap gap-1.5">
                                {filters.status !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                                        Status: {filters.status}
                                    </span>
                                )}
                                {filters.language !== 'all' && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                                        Lang: {filters.language}
                                    </span>
                                )}
                                {filters.difficulty.map(d => (
                                    <span key={`diff-${d}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                                        {difficultyOptions.find(o => o.value === d)?.label || d}
                                    </span>
                                ))}
                                {filters.topics.map(t => (
                                    <span key={`topic-${t}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                                        {t}
                                    </span>
                                ))}
                                {(filters.companies || []).map(c => (
                                    <span key={`comp-${c}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                                        {c}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-border flex justify-center">
                        <Button
                            variant="ghost"
                            className="w-full text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-2"
                            onClick={handleReset}
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
