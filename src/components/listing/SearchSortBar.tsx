import { ReactNode } from "react";
import { Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SearchSortBarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    sortBy: string;
    onSortChange: (value: string) => void;
    filterTrigger?: ReactNode;
    showCategoryToggle?: boolean;
    isCategoryWise?: boolean;
    onCategoryWiseChange?: (value: boolean) => void;
}

export const SearchSortBar = ({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    filterTrigger,
    showCategoryToggle,
    isCategoryWise,
    onCategoryWiseChange
}: SearchSortBarProps) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center py-4 md:py-6">
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
                    <SelectTrigger className="flex-1 sm:w-[160px] h-11 sm:h-12 rounded-xl bg-background border-border/60 shadow-sm font-medium hover:border-primary/40 transition-all">
                        <div className="flex items-center gap-2">
                            <ListFilter className="w-4 h-4 text-muted-foreground" />
                            <SelectValue placeholder="Sort by" />
                        </div>
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

                {showCategoryToggle && (
                    <div className="flex items-center gap-2 bg-background border border-border/60 rounded-xl px-3 h-11 sm:h-12 shadow-sm transition-all hover:border-primary/40">
                         <div className="flex items-center space-x-2">
                            <label htmlFor="category-mode" className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap cursor-pointer select-none">
                                Category-wise
                            </label>
                            <Switch
                                id="category-mode"
                                checked={isCategoryWise}
                                onCheckedChange={onCategoryWiseChange}
                            />
                        </div>
                    </div>
                )}

                {filterTrigger}
            </div>
        </div>
    );
};
