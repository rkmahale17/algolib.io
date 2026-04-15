import { useState, useMemo, useEffect, ReactNode } from 'react';
import { DIFFICULTY_MAP } from "@/types/algorithm";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";
import { useApp } from '@/contexts/AppContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getGroupedByCategory, normalizeCategory } from "@/constants/categories";
import { Code, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressStats } from "@/components/profile/ProgressStats";
import { cn } from "@/lib/utils";

interface ProblemsListProps {
  algorithms: any[];
  title: string;
  description: string;
  listType?: string;
  showRecommendation?: boolean;
  showCategoryToggle?: boolean;
  initialCategoryWise?: boolean;
  headerSlot?: ReactNode;
  footerSlot?: ReactNode;
  progressTitle?: string;
  isLoading?: boolean;
  icon?: any;
}

export const ProblemsList = ({
  algorithms,
  title,
  description,
  listType,
  showRecommendation = false,
  showCategoryToggle = true,
  initialCategoryWise = false,
  headerSlot,
  footerSlot,
  progressTitle = "Progress",
  isLoading = false,
  icon
}: ProblemsListProps) => {
  const { activeListType, setActiveListType, progressMap } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('serial-asc');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isCategoryWise, setIsCategoryWise] = useState(initialCategoryWise);

  // Sync global list context if listType is provided
  useEffect(() => {
    if (listType && activeListType !== listType) {
      setActiveListType(listType as any);
    }
  }, [listType, activeListType, setActiveListType]);

  const filteredAndSortedAlgorithms = useMemo(() => {
    let result = algorithms.map(algo => ({
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
      result = result.filter(algo => selectedTopics.includes(normalizeCategory(algo.category)));
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
  }, [algorithms, searchQuery, sortBy, selectedTopics, selectedCompanies]);

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

  const overallStats = useMemo(() => {
    let easySolved = 0, easyTotal = 0;
    let mediumSolved = 0, mediumTotal = 0;
    let hardSolved = 0, hardTotal = 0;

    filteredAndSortedAlgorithms.forEach(algo => {
      const rawDiff = algo.difficulty?.toLowerCase() || "";
      const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();
      const isSolved = progressMap?.[algo.id] === 'solved';

      if (diff === "easy") {
        easyTotal++;
        if (isSolved) easySolved++;
      } else if (diff === "hard") {
        hardTotal++;
        if (isSolved) hardSolved++;
      } else {
        mediumTotal++;
        if (isSolved) mediumSolved++;
      }
    });

    return {
      totalSolved: easySolved + mediumSolved + hardSolved,
      totalQuestions: filteredAndSortedAlgorithms.length,
      easySolved, easyTotal,
      mediumSolved, mediumTotal,
      hardSolved, hardTotal
    };
  }, [filteredAndSortedAlgorithms, progressMap]);

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 33) return 'bg-red-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
    const categories = algorithms.map(algo => normalizeCategory(algo.category)).filter(Boolean);
    return Array.from(new Set(categories)).sort();
  }, [algorithms]);

  const allCompanies = useMemo(() => {
    const comps = new Set<string>();
    algorithms.forEach(algo => {
      const c = algo.metadata?.companies;
      if (Array.isArray(c)) {
        c.forEach(comp => comps.add(comp));
      }
    });
    return Array.from(comps).sort();
  }, [algorithms]);

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
      title={title}
      description={description}
      icon={icon}
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
      showRecommendation={showRecommendation}
      stats={{ count: filteredAndSortedAlgorithms.length, hours: totalHours }}
      showCategoryToggle={showCategoryToggle}
      isCategoryWise={isCategoryWise}
      onCategoryWiseChange={setIsCategoryWise}
      progressWidget={
        !isLoading && overallStats.totalQuestions > 0 ? (
          <Card className="bg-card border-border/40 shadow-sm overflow-hidden h-full flex flex-col mt-[-10px]">
            <div className="px-4 py-3 border-b border-border/40 shrink-0 bg-muted/20">
              <h3 className="font-medium text-[13px] text-foreground/80">{progressTitle}</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <ProgressStats {...overallStats} />
            </div>
          </Card>
        ) : undefined
      }
    >
      {headerSlot}

      {isLoading ? (
        <div className="p-8 space-y-4 max-w-[700px] mx-auto">
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
              isPremium={algo.is_premium}
              index={index}
              isFirst={index === 0}
              isLast={index === filteredAndSortedAlgorithms.length - 1}
            />
          ))}
          {filteredAndSortedAlgorithms.length === 0 && (
            <div className="p-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
              No problems found matching your search.
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-[700px] mx-auto space-y-6">
          {currentGroupedAlgos.length > 0 ? (
            <Accordion type="multiple" className="space-y-6" defaultValue={currentGroupedAlgos.map(([cat]) => cat)}>
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
                          {listType === 'core' ? <Rocket className="w-5 h-5 text-primary/60" /> : <Code className="w-5 h-5 text-primary/60" />}
                        </div>
                        <div className="text-left flex-1">
                          <h3 className="font-medium text-[16px] leading-tight mb-2">
                            {category} ({statsByCategory[category].solved} / {statsByCategory[category].total})
                          </h3>
                          <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden mb-1">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                getProgressBarColor((statsByCategory[category].solved / statsByCategory[category].total) * 100)
                              )}
                              style={{ width: `${(statsByCategory[category].solved / statsByCategory[category].total) * 100 || 0}%` }} 
                            />
                          </div>
                          <p className="text-[11px] text-muted-foreground font-normal">
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

      {footerSlot}
    </ListingLayout>
  );
};
