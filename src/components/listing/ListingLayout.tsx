import { ReactNode, useState } from "react";
import { SidebarLayout } from "@/components/SidebarLayout";
import { ProblemHero } from "./ProblemHero";
import { SearchSortBar } from "./SearchSortBar";
import { ProblemSidebarFilters } from "./ProblemSidebarFilters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

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
    showRecommendation?: boolean;
    children: ReactNode;
    stats?: {
        count: number;
        hours?: number;
    };
}

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
    showRecommendation,
    children,
    stats
}: ListingLayoutProps) => {
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    const FilterContent = () => (
        <div className="space-y-8 h-fit pb-12">
            <div className="space-y-1 xl-listing:block hidden">
                <h2 className="text-lg font-bold">Filters</h2>
                <p className="text-xs text-muted-foreground">Narrow down by topic or difficulty</p>
            </div>

            <ProblemSidebarFilters
                selectedTopics={selectedTopics}
                onTopicToggle={onTopicToggle}
                topics={topics}
                selectedCompanies={selectedCompanies}
                onCompanyToggle={onCompanyToggle}
                companies={companies}
            />
        </div>
    );

    return (
        <SidebarLayout>
            <div className="min-h-screen bg-background flex flex-col">
                <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-8 md:py-12">
                    <div className="flex flex-col xl-listing:flex-row gap-8 xl-listing:gap-12">
                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            <ProblemHero
                                title={title}
                                description={description}
                                showRecommendation={showRecommendation}
                            />

                            <div className="space-y-6">
                                <SearchSortBar
                                    searchQuery={searchQuery}
                                    onSearchChange={onSearchChange}
                                    sortBy={sortBy}
                                    onSortChange={onSortChange}
                                    filterTrigger={
                                        <div className="xl-listing:hidden flex items-center">
                                            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                                                <SheetTrigger asChild>
                                                    <Button variant="outline" size="icon" className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl border-border/60 bg-background shadow-sm shrink-0">
                                                        <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent side="right" className="w-full sm:w-[540px] p-0 flex flex-col h-full border-l border-border/40 shadow-2xl">
                                                    <SheetHeader className="p-6 border-b border-border/50 shrink-0">
                                                        <SheetTitle className="text-2xl font-bold tracking-tight">Filters</SheetTitle>
                                                    </SheetHeader>

                                                    <ScrollArea className="flex-1">
                                                        <div className="p-6">
                                                            <FilterContent />
                                                        </div>
                                                    </ScrollArea>

                                                    <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm flex items-center gap-3 shrink-0">
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1 rounded-xl h-11 font-medium border-border/60 hover:bg-muted/50"
                                                            onClick={() => {
                                                                onTopicToggle('CLEAR_ALL');
                                                                onCompanyToggle('CLEAR_ALL');
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
                                    }
                                />

                                {stats && (
                                    <div className="flex items-center gap-4 sm:gap-6 text-[13px] sm:text-sm text-muted-foreground/60 font-medium pb-2 border-b border-border/20">
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-foreground">{stats.count}</span> questions
                                        </div>
                                        {stats.hours && (
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-foreground">{stats.hours}</span> hours total
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col gap-0">
                                    {children}
                                </div>
                            </div>
                        </div>

                        {/* Sticky Sidebar Filters - Desktop Only */}
                        <aside className="hidden xl-listing:block xl-listing:w-80 shrink-0">
                            <div className="sticky top-[80px]">
                                <ScrollArea className="h-[calc(100vh-120px)] pr-4 -mr-4">
                                    <FilterContent />
                                </ScrollArea>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </SidebarLayout>
    );
};

