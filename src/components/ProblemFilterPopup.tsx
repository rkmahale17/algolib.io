import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Check, RotateCcw, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
    status: string;
    difficulty: string;
    topics: string[];
    language: string;
}

interface ProblemFilterPopupProps {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    trigger: React.ReactNode;
    topics?: string[];
}

export const ProblemFilterPopup = ({ filters, setFilters, trigger, topics = [] }: ProblemFilterPopupProps) => {
    const [matchMode, setMatchMode] = React.useState<'all' | 'any'>('all');

    const handleReset = () => {
        setFilters({
            status: 'all',
            difficulty: 'all',
            topics: [],
            language: 'all'
        });
    };

    const topicOptions = React.useMemo(() => {
        const opts = topics.map(topic => ({
            label: topic,
            value: topic.toLowerCase()
        }));
        return [{ label: 'All', value: 'all' }, ...opts];
    }, [topics]);

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

                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/40 hover:text-foreground">
                    <Minus className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                {trigger}
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-4 bg-background border-border shadow-2xl rounded-xl" align="end">
                <div className="space-y-4">
                    {/* Match Toggle */}
                    <div className="flex items-center gap-2 text-[11px] font- uppercase tracking-wider">
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
                        <FilterRow
                            label="Difficulty"
                            id="filter-difficulty"
                            icon={<div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center text-[8px] font-">D</div>}
                            value={filters.difficulty}
                            onValueChange={(val: string) => setFilters(prev => ({ ...prev, difficulty: val }))}
                            options={[
                                { label: 'All', value: 'all' },
                                { label: 'Easy', value: 'easy' },
                                { label: 'Medium', value: 'medium' },
                                { label: 'Hard', value: 'hard' }
                            ]}
                        />
                        <FilterRow
                            label="Topics"
                            id="filter-topics"
                            icon={<div className="w-4 h-4 border-2 border-current rounded rounded-tr-none flex items-center justify-center text-[8px] font-">T</div>}
                            value={filters.topics[0] || 'all'}
                            onValueChange={(val: string) => setFilters(prev => ({ ...prev, topics: [val] }))}
                            options={topicOptions}
                        />
                        <FilterRow
                            label="Language"
                            id="filter-language"
                            icon={<div className="w-4 h-4 font-mono text-[10px] font-">{"</>"}</div>}
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

                    {/* Footer */}
                    <div className="flex items-center gap-2 pt-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground/40 hover:text-foreground">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-center">
                        <Button
                            variant="ghost"
                            className="w-full text-[11px] font- uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 gap-2"
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
