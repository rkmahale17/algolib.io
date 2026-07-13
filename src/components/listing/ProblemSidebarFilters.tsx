import { ChevronDown, Info, Layout, Code2, Network, HelpCircle, Lock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";
import { TOP_COMPANIES } from "@/constants/companies";
import { CompanyIcon } from "@/components/CompanyIcon";

interface FilterSectionProps {
    title: string;
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    columns?: number;
    hasInfo?: boolean;
    isPremium?: boolean;
    isLocked?: boolean;
    counts?: Record<string, number>;
}

const FilterSection = ({ title, items, selectedItems, onToggle, columns = 2, hasInfo = false, isPremium = false, isLocked = false, counts = {} }: FilterSectionProps) => (
    <AccordionItem value={title.toLowerCase()} className="border-none">
        <AccordionTrigger className={cn("hover:no-underline py-4 group [&>svg]:hidden", isLocked && "opacity-70 pointer-events-none")}>
            <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                        {title}
                    </span>
                    {hasInfo && <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
                </div>
                {isPremium && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-medium px-2 py-0.5 uppercase tracking-wide flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Pro
                    </Badge>
                )}
            </div>
        </AccordionTrigger>
        <AccordionContent>
            <div className={cn(
                "grid gap-x-6 gap-y-4 pt-1 pb-4",
                columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            )}>
                {items.map((item) => (
                    <div 
                        key={item} 
                        className={cn(
                            "flex items-center space-x-3 group min-w-0 transition-opacity", 
                            isLocked ? "opacity-50 cursor-not-allowed pro-filter-locked" : "cursor-pointer group/item",
                            isLocked && "pointer-events-none"
                        )}
                        data-pro-filter={isLocked ? "true" : "false"}
                    >
                        <Checkbox
                            id={`sidebar-filter-${title}-${item}`}
                            checked={selectedItems.includes(item)}
                            onCheckedChange={() => !isLocked && onToggle(item)}
                            className="w-3.5 h-3.5 rounded-none border-foreground/30 border bg-background shadow-none data-[state=checked]:bg-[#dfff5e] data-[state=checked]:border-[#dfff5e] data-[state=checked]:text-black"
                        />
                        <div className="flex items-center gap-2.5 flex-1 cursor-pointer">
                            {title === "Companies" && (
                                <CompanyIcon 
                                    company={item}
                                    className="w-3.5 h-3.5 opacity-80"
                                />
                            )}
                            <Label
                                htmlFor={`sidebar-filter-${title}-${item}`}
                                className="flex-1 text-xs font-normal leading-none text-muted-foreground/90 group-hover/item:text-foreground transition-colors cursor-pointer flex items-center gap-1.5 min-w-0"
                            >
                                <span className="truncate">{item}</span>
                                {counts[item] !== undefined && (
                                    <span className="text-[10px] text-muted-foreground/70 tabular-nums shrink-0">({counts[item]})</span>
                                )}
                            </Label>
                        </div>
                    </div>
                ))}
            </div>
        </AccordionContent>
    </AccordionItem>
);

interface ProblemSidebarFiltersProps {
    selectedTopics: string[];
    onTopicToggle: (topic: string) => void;
    topics?: string[];
    selectedCompanies: string[];
    onCompanyToggle: (company: string) => void;
    companies?: string[];
    selectedDifficulties: string[];
    onDifficultyToggle: (difficulty: string) => void;
    topicCounts?: Record<string, number>;
    companyCounts?: Record<string, number>;
    difficultyCounts?: Record<string, number>;
}

export const ProblemSidebarFilters = ({
    selectedTopics,
    onTopicToggle,
    topics,
    selectedCompanies,
    onCompanyToggle,
    companies,
    selectedDifficulties,
    onDifficultyToggle,
    topicCounts = {},
    companyCounts = {},
    difficultyCounts = {}
}: ProblemSidebarFiltersProps) => {
    const { hasPremiumAccess } = useApp();
    const displayTopics = topics || [];
    const displayCompanies = companies && companies.length > 0 ? companies : [];

    return (
        <div className="w-full space-y-2">
            <Accordion type="multiple" defaultValue={["topics", "companies", "difficulty"]} className="divide-y divide-border/40">
                <FilterSection
                    title="Topics"
                    items={displayTopics}
                    selectedItems={selectedTopics}
                    onToggle={onTopicToggle}
                    columns={2}
                    counts={topicCounts}
                />

                {displayCompanies.length > 0 && (
                    <FilterSection
                        title="Companies"
                        items={displayCompanies}
                        selectedItems={selectedCompanies}
                        onToggle={onCompanyToggle}
                        columns={2}
                        isPremium={true}
                        isLocked={false}
                        counts={companyCounts}
                    />
                )}

                <AccordionItem value="difficulty" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-4 group [&>svg]:hidden">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                                Difficulty
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-1 pb-4">
                            {['Easy', 'Medium', 'Hard'].map((diff) => (
                                <div key={diff} className="flex items-center space-x-3 group cursor-pointer group/item">
                                    <Checkbox
                                        id={`sidebar-filter-difficulty-${diff}`}
                                        checked={selectedDifficulties.includes(diff)}
                                        onCheckedChange={() => onDifficultyToggle(diff)}
                                        className="w-3.5 h-3.5 rounded-none border-foreground/30 border bg-background shadow-none data-[state=checked]:bg-[#dfff5e] data-[state=checked]:border-[#dfff5e] data-[state=checked]:text-black"
                                    />
                                    <Label
                                        htmlFor={`sidebar-filter-difficulty-${diff}`}
                                        className="text-xs font-normal leading-none text-muted-foreground/90 group-hover/item:text-foreground transition-colors cursor-pointer flex items-center gap-1.5"
                                    >
                                        <span>{diff}</span>
                                        {difficultyCounts[diff.toLowerCase()] !== undefined && (
                                            <span className="text-[10px] text-muted-foreground/70 tabular-nums shrink-0">({difficultyCounts[diff.toLowerCase()]})</span>
                                        )}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

