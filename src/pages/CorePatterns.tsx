import { useState, useMemo, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ListType, DIFFICULTY_MAP } from "@/types/algorithm";
import { useAlgorithms, useUserProgressMap } from "@/hooks/useAlgorithms";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from '@/contexts/AppContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getGroupedByCategory } from "@/constants/categories";
import { Rocket } from "lucide-react";

const CorePatterns = () => {
  const { data, isLoading } = useAlgorithms();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: progressMap } = useUserProgressMap(userId);
  const { activeListType, setActiveListType } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('serial-asc');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isCategoryWise, setIsCategoryWise] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id);
    });
  }, []);

  // Sync global list context
  useEffect(() => {
    if (activeListType !== 'core') {
      setActiveListType('core');
    }
  }, [activeListType, setActiveListType]);

  const allAlgorithms = data?.algorithms ?? [];
  const coreAlgorithms = useMemo(() =>
    allAlgorithms.filter(algo => !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const filteredAndSortedAlgorithms = useMemo(() => {
    let result = coreAlgorithms.map(algo => ({
      ...algo,
      mappedDifficulty: DIFFICULTY_MAP[algo.difficulty?.toLowerCase()] || 'Medium',
      displayTitle: algo.title || algo.name || ''
    }));

    if (searchQuery) {
      result = result.filter(algo =>
        algo.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTopics.length > 0) {
      result = result.filter(algo => selectedTopics.includes(algo.category));
    }

    if (selectedCompanies.length > 0) {
      result = result.filter(algo => {
        const c = algo.metadata?.companies;
        if (!Array.isArray(c)) return false;
        return c.some((comp: string) => selectedCompanies.includes(comp));
      });
    }

    const rank: any = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
    if (sortBy === 'name-asc') result.sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
    else if (sortBy === 'name-desc') result.sort((a, b) => b.displayTitle.localeCompare(a.displayTitle));
    else if (sortBy === 'difficulty-asc') result.sort((a, b) => rank[a.mappedDifficulty] - rank[b.mappedDifficulty]);
    else if (sortBy === 'difficulty-desc') result.sort((a, b) => rank[b.mappedDifficulty] - rank[a.mappedDifficulty]);
    else if (sortBy === 'serial-asc') result.sort((a, b) => (a.serial_no || 999999) - (b.serial_no || 999999));
    else if (sortBy === 'serial-desc') result.sort((a, b) => (b.serial_no || 0) - (a.serial_no || 0));

    return result;
  }, [coreAlgorithms, searchQuery, sortBy, selectedTopics, selectedCompanies]);

  const currentGroupedAlgos = useMemo(() => {
    if (!isCategoryWise) return [];
    return getGroupedByCategory(filteredAndSortedAlgorithms, searchQuery);
  }, [filteredAndSortedAlgorithms, searchQuery, isCategoryWise]);

  const statsByCategory = useMemo(() => {
    const stats: Record<string, { solved: number, total: number }> = {};
    currentGroupedAlgos.forEach(([category, algos]) => {
      const solved = algos.filter(a => progressMap?.[a.id] === 'solved').length;
      stats[category] = { solved, total: algos.length };
    });
    return stats;
  }, [currentGroupedAlgos, progressMap]);

  const handleTopicToggle = (topic: string) => {
    if (topic === 'CLEAR_ALL') {
      setSelectedTopics([]);
      return;
    }
    setSelectedTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const handleCompanyToggle = (company: string) => {
    if (company === 'CLEAR_ALL') {
      setSelectedCompanies([]);
      return;
    }
    setSelectedCompanies(prev => prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]);
  };

  const allTopics = useMemo(() => {
    const categories = coreAlgorithms.map(algo => algo.category).filter(Boolean);
    return Array.from(new Set(categories)).sort();
  }, [coreAlgorithms]);

  const allCompanies = useMemo(() => {
    const comps = new Set<string>();
    coreAlgorithms.forEach(algo => {
      const c = algo.metadata?.companies;
      if (Array.isArray(c)) {
        c.forEach(comp => comps.add(comp));
      }
    });
    return Array.from(comps).sort();
  }, [coreAlgorithms]);

  const totalHours = useMemo(() => {
    const mins = filteredAndSortedAlgorithms.reduce((acc, algo) => {
      const diff = algo.mappedDifficulty.toLowerCase();
      if (diff === 'easy') return acc + 45;
      if (diff === 'medium') return acc + 60;
      if (diff === 'hard') return acc + 90;
      return acc + 60;
    }, 0);
    return Math.round(mins / 60);
  }, [filteredAndSortedAlgorithms]);

  return (
    <ListingLayout
      title="Core Patterns Library"
      description="Step-by-step visualizations of essential patterns. Build a rock-solid foundation for interviews and software engineering."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy={sortBy}
      onSortChange={setSortBy}
      selectedTopics={selectedTopics}
      onTopicToggle={handleTopicToggle}
      topics={allTopics}
      selectedCompanies={selectedCompanies}
      onCompanyToggle={handleCompanyToggle}
      companies={allCompanies}
      showRecommendation={true}
      stats={{ count: filteredAndSortedAlgorithms.length, hours: totalHours }}
      showCategoryToggle={true}
      isCategoryWise={isCategoryWise}
      onCategoryWiseChange={setIsCategoryWise}
    >
      <Helmet>
        <title>Core Patterns - Master the Fundamentals | Rulcode.com</title>
      </Helmet>

      {isLoading ? (
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : !isCategoryWise ? (
        <div className="w-full max-w-[700px] mx-auto">
          {filteredAndSortedAlgorithms.map((algo, index) => (
            <PremiumProblemCard
              key={algo.id}
              algorithm={algo}
              status={(progressMap?.[algo.id] || 'none') as any}
              index={index}
              isPremium={algo.is_premium}
              isFirst={index === 0}
              isLast={index === filteredAndSortedAlgorithms.length - 1}
            />
          ))}
        </div>
      ) : (
        <div className="w-full max-w-[700px] mx-auto space-y-6">
          {currentGroupedAlgos.length > 0 ? (
            <Accordion type="multiple" className="space-y-6">
              {currentGroupedAlgos.map(([category, algos]) => (
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
    </ListingLayout>
  );
};

export default CorePatterns;
