import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAlgorithms, useUserProgressMap } from "@/hooks/useAlgorithms";
import { ListType, DIFFICULTY_MAP } from "@/types/algorithm";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";
import { supabase } from "@/integrations/supabase/client";
import { Rocket, Layers, ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ListCard = ({ title, description, icon: Icon, badge, link, color, isFirst, isLast }: any) => (
  <Link to={link} className="group block relative w-full">
    <div className={cn(
      "flex items-center gap-4 sm:gap-6 p-5 transition-all duration-300",
      "bg-card hover:bg-muted/15",
      "border-x border-t border-border/40",
      isFirst && "rounded-t-xl",
      isLast && "rounded-b-xl border-b",
      !isFirst && !isLast && "rounded-none",
      "shadow-sm hover:shadow-md relative overflow-hidden"
    )}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110", color)}>
        {Icon ? <Icon className="w-6 h-6" /> : <span className="text-xl font-bold">{badge}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[16px] mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-[13px] text-muted-foreground leading-snug line-clamp-1">{description}</p>
      </div>
      <div className="shrink-0 flex items-center justify-center w-8 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all">
        <ChevronRight className="w-5 h-5" strokeWidth={2} />
      </div>
    </div>
  </Link>
);

import { CATEGORY_ORDER, CATEGORY_MAP, getGroupedByCategory } from "@/constants/categories";

const GetStarted = () => {
  const { data, isLoading } = useAlgorithms();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: progressMap } = useUserProgressMap(userId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id);
    });
  }, []);

  const allAlgorithms = data?.algorithms ?? [];

  const coreAlgorithms = useMemo(() => 
    allAlgorithms.filter(algo => !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const onTopicToggle = (topic: string) => {
    if (topic === 'CLEAR_ALL') {
      setSelectedTopics([]);
      return;
    }
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const availableTopics = useMemo(() => {
    const topics = new Set<string>();
    coreAlgorithms.forEach(algo => {
      let cat = algo.category || 'Other';
      if (CATEGORY_MAP[cat]) cat = CATEGORY_MAP[cat];
      topics.add(cat);
    });
    return Array.from(topics).sort();
  }, [coreAlgorithms]);

  const groupedByCategory = useMemo(() => {
    let filtered = coreAlgorithms;
    
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(algo => {
        let cat = algo.category || 'Other';
        if (CATEGORY_MAP[cat]) cat = CATEGORY_MAP[cat];
        return selectedTopics.includes(cat);
      });
    }

    const baseList = filtered.map(algo => ({
      ...algo,
      mappedDifficulty: DIFFICULTY_MAP[algo.difficulty?.toLowerCase()] || 'Medium',
      displayTitle: algo.title || algo.name || ''
    }));

    return getGroupedByCategory(baseList, searchQuery);
  }, [coreAlgorithms, searchQuery, selectedTopics]);

  const statsByCategory = useMemo(() => {
    const stats: Record<string, { solved: number, total: number }> = {};
    groupedByCategory.forEach(([category, algos]) => {
      const solved = algos.filter(a => progressMap?.[a.id] === 'solved').length;
      stats[category] = { solved, total: algos.length };
    });
    return stats;
  }, [groupedByCategory, progressMap]);

  return (
    <ListingLayout
      title="DSA Roadmap"
      description="Master the fundamentals with curated core patterns and problems."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy="serial-asc"
      onSortChange={() => {}}
      selectedTopics={selectedTopics}
      onTopicToggle={onTopicToggle}
      topics={availableTopics}
      selectedCompanies={[]}
      onCompanyToggle={() => {}}
      showRecommendation={true}
    >
      <Helmet>
        <title>DSA Roadmap - RulCode | Master Patterns</title>
        <meta name="description" content="Master essential recurring algorithm patterns with our curated DSA roadmap." />
      </Helmet>

      <div className="space-y-12 pb-12">
        {/* Navigation Cards */}
        {/* Navigation Cards */}
        <div className="w-full max-w-[700px] mx-auto flex flex-col">
          <ListCard
            title="All Practice"
            description="Browse the complete bank of 150+ problems."
            icon={Layers}
            link="/dsa/problems"
            color="bg-blue-500/10 text-blue-500"
            isFirst={true}
          />
          <ListCard
            title="Core Patterns"
            description="Learn essential recurring logic patterns."
            icon={Rocket}
            link="/dsa/core"
            color="bg-purple-500/10 text-purple-500"
          />
          <ListCard
            title="Blind 75"
            description="The curated list of must-do FAANG questions."
            badge="75"
            link="/dsa/blind-75"
            color="bg-amber-500/10 text-amber-500"
            isLast={true}
          />
        </div>

        {isLoading ? (
          <div className="space-y-4 max-w-[700px] mx-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-[700px] mx-auto space-y-6">
            {groupedByCategory.length > 0 ? (
              <Accordion type="multiple" className="space-y-6">
                {groupedByCategory.map(([category, algos]) => (
                  <AccordionItem
                    key={category}
                    value={category}
                    className="border border-border/40 rounded-xl bg-card overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/5 group">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                            <Rocket className="w-5 h-5 text-primary/60" />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-[16px] leading-tight">
                              {category} ({statsByCategory[category].solved} / {statsByCategory[category].total})
                            </h3>
                            <p className="text-[12px] text-muted-foreground font-normal">
                              {algos.length} essential problems
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0 border-t border-border/20 bg-muted/5">
                      <div className="flex flex-col">
                        {algos.map((algo, index) => (
                          <PremiumProblemCard
                            key={algo.id}
                            algorithm={algo}
                            status={(progressMap?.[algo.id] || 'none') as any}
                            index={index}
                            isPremium={algo.is_premium}
                            isFirst={index === 0}
                            isLast={index === algos.length - 1}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                No problems found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </ListingLayout>
  );
};

export default GetStarted;
