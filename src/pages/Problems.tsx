import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAlgorithms, useUserProgressMap } from "@/hooks/useAlgorithms";
import { ListType, DIFFICULTY_MAP } from "@/types/algorithm";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";
import { Rocket, Layers, Code, CheckCircle2, ChevronRight, Clock, Trophy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ListCard = ({ title, description, icon: Icon, badge, link, color }: any) => (
  <Link to={link} className="group flex-1 min-w-[200px]">
    <Card className="h-full p-5 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card flex flex-col gap-4 relative overflow-hidden group">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", color)}>
        {Icon ? <Icon className="w-6 h-6" /> : <span className="text-xl font-bold">{badge}</span>}
      </div>
      <div>
        <h4 className="font-medium text-[15px] mb-1 group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-[12px] text-muted-foreground leading-tight line-clamp-2">{description}</p>
      </div>
      <ChevronRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Card>
  </Link>
);

import { CATEGORY_ORDER, CATEGORY_MAP, getGroupedByCategory } from "@/constants/categories";

const Problems = () => {
  const { data, isLoading } = useAlgorithms();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: progressMap } = useUserProgressMap(userId);
  const { activeListType, setActiveListType } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('serial-asc');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isCategoryWise, setIsCategoryWise] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const listMode = searchParams.get('mode') || 'all';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id);
    });
  }, []);

  // Sync global list context
  useEffect(() => {
    if (activeListType !== 'all') {
      setActiveListType('all');
    }
  }, [activeListType, setActiveListType]);

  const allAlgorithms = data?.algorithms ?? [];

  const coreAlgorithms = useMemo(() => 
    allAlgorithms.filter(algo => !algo.listType || algo.listType === ListType.Core || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const blindAlgorithms = useMemo(() => 
    allAlgorithms.filter(algo => algo.listType === ListType.Blind75 || algo.listType === ListType.CoreAndBlind75),
    [allAlgorithms]
  );

  const filteredAndSortedAlgorithms = useMemo(() => {
    let result = allAlgorithms.map(algo => ({
      ...algo,
      mappedDifficulty: DIFFICULTY_MAP[algo.difficulty?.toLowerCase()] || 'Medium',
      displayTitle: algo.title || algo.name || ''
    }));

    // Search Filter
    if (searchQuery) {
      result = result.filter(algo =>
        algo.displayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        algo.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Topic Filter
    if (selectedTopics.length > 0) {
      result = result.filter(algo => selectedTopics.includes(algo.category));
    }

    // Company Filter
    if (selectedCompanies.length > 0) {
      result = result.filter(algo => {
        const c = algo.metadata?.companies;
        if (!Array.isArray(c)) return false;
        return c.some((comp: string) => selectedCompanies.includes(comp));
      });
    }

    // Sort
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.displayTitle.localeCompare(b.displayTitle));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.displayTitle.localeCompare(a.displayTitle));
    } else if (sortBy === 'difficulty-asc') {
      const rank: any = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      result.sort((a, b) => rank[a.mappedDifficulty] - rank[b.mappedDifficulty]);
    } else if (sortBy === 'difficulty-desc') {
      const rank: any = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      result.sort((a, b) => rank[b.mappedDifficulty] - rank[a.mappedDifficulty]);
    } else if (sortBy === 'serial-asc') {
      result.sort((a, b) => (a.serial_no || 999999) - (b.serial_no || 999999));
    } else if (sortBy === 'serial-desc') {
      result.sort((a, b) => (b.serial_no || 0) - (a.serial_no || 0));
    }

    return result;
  }, [allAlgorithms, searchQuery, sortBy, selectedTopics, selectedCompanies]);


  const currentGroupedAlgos = useMemo(() => {
    if (listMode === 'core') return getGroupedByCategory(coreAlgorithms);
    if (listMode === 'blind') return getGroupedByCategory(blindAlgorithms);
    if (listMode === 'all' && isCategoryWise) return getGroupedByCategory(filteredAndSortedAlgorithms);
    return [];
  }, [listMode, coreAlgorithms, blindAlgorithms, filteredAndSortedAlgorithms, searchQuery, isCategoryWise]);

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
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleCompanyToggle = (company: string) => {
    if (company === 'CLEAR_ALL') {
      setSelectedCompanies([]);
      return;
    }
    setSelectedCompanies(prev =>
      prev.includes(company) ? prev.filter(c => c !== company) : [...prev, company]
    );
  };

  const allTopics = useMemo(() => {
    const categories = allAlgorithms.map(algo => algo.category).filter(Boolean);
    return Array.from(new Set(categories)).sort();
  }, [allAlgorithms]);

  const allCompanies = useMemo(() => {
    const comps = new Set<string>();
    allAlgorithms.forEach(algo => {
      const c = algo.metadata?.companies;
      if (Array.isArray(c)) {
        c.forEach(comp => comps.add(comp));
      }
    });
    return Array.from(comps).sort();
  }, [allAlgorithms]);

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

  const getTitle = () => {
    if (listMode === 'core') return "Core Patterns";
    if (listMode === 'blind') return "Blind 75";
    return "All Practice Questions";
  };

  const getDescription = () => {
    if (listMode === 'core') return "Master the fundamentals with curated core patterns and problems.";
    if (listMode === 'blind') return "The curated list of must-do FAANG questions.";
    return "The largest question bank of 150+ DSA interview practice questions";
  };

  return (
    <ListingLayout
      title={getTitle()}
      description={getDescription()}
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
      showRecommendation={listMode === 'all'}
      stats={{ 
        count: listMode === 'all' ? filteredAndSortedAlgorithms.length : (listMode === 'core' ? coreAlgorithms.length : blindAlgorithms.length), 
        hours: totalHours 
      }}
      showCategoryToggle={true}
      isCategoryWise={isCategoryWise}
      onCategoryWiseChange={setIsCategoryWise}
    >
      <Helmet>
        <title>{getTitle()} - RulCode | Master Patterns</title>
        <meta name="description" content={getDescription()} />
      </Helmet>

      <div className="space-y-8 pb-12">
        {/* Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Button
            variant={listMode === 'all' ? 'default' : 'outline'}
            onClick={() => setSearchParams({ mode: 'all' })}
            className="rounded-xl h-10 font-medium transition-all"
          >
            All Questions
          </Button>
          <Button
            variant={listMode === 'core' ? 'default' : 'outline'}
            onClick={() => setSearchParams({ mode: 'core' })}
            className="rounded-xl h-10 font-medium transition-all"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Core
          </Button>
          <Button
            variant={listMode === 'blind' ? 'default' : 'outline'}
            onClick={() => setSearchParams({ mode: 'blind' })}
            className="rounded-xl h-10 font-medium transition-all"
          >
            <Code className="w-4 h-4 mr-2" />
            Blind
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (listMode === 'all' && !isCategoryWise) ? (
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
            {filteredAndSortedAlgorithms.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No problems found matching your criteria.
              </div>
            )}
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
                            {listMode === 'core' ? <Rocket className="w-5 h-5 text-primary/60" /> : <Code className="w-5 h-5 text-primary/60" />}
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

export default Problems;
