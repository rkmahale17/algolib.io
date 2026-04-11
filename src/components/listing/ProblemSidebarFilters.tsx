import { ChevronDown, Info, Layout, Code2, Network, HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TOP_COMPANIES } from "@/constants/companies";
import { CompanyIcon } from "@/components/CompanyIcon";

const TOPICS = [
    "OOP", "Accessibility", "React Hooks", "Networking", "Array", "Async",
    "Breadth-first search", "Binary", "Binary search", "Binary search tree",
    "Binary tree", "Closure", "Depth-first search", "Dynamic programming",
    "Graph", "Greedy", "Heap", "Intervals", "Linked list", "Matrix",
    "Queue", "Recursion", "Sorting", "Stack", "String", "Topological sort",
    "Tree", "Trie", "Web APIs"
];

interface FilterSectionProps {
    title: string;
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    columns?: number;
    hasInfo?: boolean;
}

const FilterSection = ({ title, items, selectedItems, onToggle, columns = 2, hasInfo = false }: FilterSectionProps) => (
    <AccordionItem value={title.toLowerCase()} className="border-none">
        <AccordionTrigger className="hover:no-underline py-4 group [&>svg]:hidden">
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                    {title}
                </span>
                {hasInfo && <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40" />}
            </div>
        </AccordionTrigger>
        <AccordionContent>
            <div className={cn(
                "grid gap-x-6 gap-y-4 pt-1 pb-4",
                columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            )}>
                {items.map((item) => (
                    <div key={item} className="flex items-center space-x-3 group cursor-pointer group/item">
                        <Checkbox
                            id={item}
                            checked={selectedItems.includes(item)}
                            onCheckedChange={() => onToggle(item)}
                            className="w-5 h-5 rounded-md border-foreground/30 border-2 bg-background shadow-none data-[state=checked]:bg-[#dfff5e] data-[state=checked]:border-[#dfff5e] data-[state=checked]:text-black"
                        />
                        <div className="flex items-center gap-2.5 flex-1 cursor-pointer">
                            {title === "Companies" && (
                                <CompanyIcon 
                                    company={item}
                                    className="w-3.5 h-3.5 opacity-80"
                                />
                            )}
                            <Label
                                htmlFor={item}
                                className="text-[14px] font-medium leading-none text-muted-foreground/90 group-hover/item:text-foreground transition-colors cursor-pointer"
                            >
                                {item}
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
}

export const ProblemSidebarFilters = ({
    selectedTopics,
    onTopicToggle,
    topics,
    selectedCompanies,
    onCompanyToggle,
    companies
}: ProblemSidebarFiltersProps) => {
    const displayTopics = topics && topics.length > 0 ? topics : TOPICS;
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
                />

                {displayCompanies.length > 0 && (
                    <FilterSection
                        title="Companies"
                        items={displayCompanies}
                        selectedItems={selectedCompanies}
                        onToggle={onCompanyToggle}
                        columns={2}
                    />
                )}

                <AccordionItem value="difficulty" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-4 group [&>svg]:hidden">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                                Difficulty
                            </span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pt-1 pb-4">
                            {['Easy', 'Medium', 'Hard'].map((diff) => (
                                <div key={diff} className="flex items-center space-x-3 group cursor-pointer group/item">
                                    <Checkbox
                                        id={diff}
                                        className="w-5 h-5 rounded-md border-foreground/30 border-2 bg-background shadow-none data-[state=checked]:bg-[#dfff5e] data-[state=checked]:border-[#dfff5e] data-[state=checked]:text-black"
                                    />
                                    <Label
                                        htmlFor={diff}
                                        className="text-[14px] font-medium leading-none text-muted-foreground/90 group-hover/item:text-foreground transition-colors cursor-pointer"
                                    >
                                        {diff}
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

