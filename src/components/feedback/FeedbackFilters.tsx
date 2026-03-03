import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flame, Star, Clock } from "lucide-react";

interface FeedbackFiltersProps {
    activeTab: 'all' | 'suggestions' | 'bugs';
    setActiveTab: (tab: 'all' | 'suggestions' | 'bugs') => void;
    activeSort: 'hot' | 'top' | 'new';
    setActiveSort: (sort: 'hot' | 'top' | 'new') => void;
    counts: {
        all: number;
        suggestions: number;
        bugs: number;
    };
}

export const FeedbackFilters = ({
    activeTab,
    setActiveTab,
    activeSort,
    setActiveSort,
    counts,
}: FeedbackFiltersProps) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center p-1 bg-muted/50 rounded-lg border">
                <button
                    onClick={() => setActiveTab('all')}
                    className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                        activeTab === 'all' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    All <span className="text-[10px] opacity-60 bg-muted px-1.5 rounded-full">{counts.all}</span>
                </button>
                <button
                    onClick={() => setActiveTab('suggestions')}
                    className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                        activeTab === 'suggestions' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Suggestions <span className="text-[10px] opacity-60 bg-muted px-1.5 rounded-full">{counts.suggestions}</span>
                </button>
                <button
                    onClick={() => setActiveTab('bugs')}
                    className={cn(
                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2",
                        activeTab === 'bugs' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Bugs <span className="text-[10px] opacity-60 bg-muted px-1.5 rounded-full">{counts.bugs}</span>
                </button>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant={activeSort === 'hot' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSort('hot')}
                    className={cn(
                        "gap-2 h-9 px-3",
                        activeSort === 'hot' ? "bg-green-600 hover:bg-green-700 text-white" : ""
                    )}
                >
                    <Flame className="w-4 h-4" />
                    Hot
                </Button>
                <Button
                    variant={activeSort === 'top' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSort('top')}
                    className={cn(
                        "gap-2 h-9 px-3",
                        activeSort === 'top' ? "bg-green-600 hover:bg-green-700 text-white text-primary-foreground" : ""
                    )}
                >
                    <Star className="w-4 h-4" />
                    Top
                </Button>
                <Button
                    variant={activeSort === 'new' ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveSort('new')}
                    className={cn(
                        "gap-2 h-9 px-3",
                        activeSort === 'new' ? "bg-green-600 hover:bg-green-700 text-white" : ""
                    )}
                >
                    <Clock className="w-4 h-4" />
                    New
                </Button>
            </div>
        </div>
    );
};
