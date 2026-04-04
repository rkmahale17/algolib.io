import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAlgorithms, useUserProgressMap } from "@/hooks/useAlgorithms";
import { ListType, DIFFICULTY_MAP } from "@/types/algorithm";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/contexts/AppContext";

const Problems = () => {
  const { data, isLoading } = useAlgorithms();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: progressMap } = useUserProgressMap(userId);
  const { activeListType, setActiveListType } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('serial-asc');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

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
  }, [allAlgorithms, searchQuery, sortBy, selectedTopics]);

  const handleTopicToggle = (topic: string) => {
    if (topic === 'CLEAR_ALL') {
      setSelectedTopics([]);
      return;
    }
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const allTopics = useMemo(() => {
    const categories = allAlgorithms.map(algo => algo.category).filter(Boolean);
    return Array.from(new Set(categories)).sort();
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

  return (
    <ListingLayout
      title="All Practice Questions"
      description="The largest question bank of 150+ DSA interview practice questions"
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy={sortBy}
      onSortChange={setSortBy}
      selectedTopics={selectedTopics}
      onTopicToggle={handleTopicToggle}
      topics={allTopics}
      showRecommendation={true}
      stats={{ count: filteredAndSortedAlgorithms.length, hours: totalHours }}
    >
      <Helmet>
        <title>All Problems - RulCode | Master Patterns</title>
        <meta name="description" content="Browse our complete list of technical interview problems and algorithms. Filter by difficulty, category, and more." />
      </Helmet>

      {isLoading ? (
        <div className="p-8 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div>
          {filteredAndSortedAlgorithms.map((algo, index) => (
            <PremiumProblemCard
              key={algo.id}
              algorithm={algo}
              status={(progressMap?.[algo.id] || 'none') as any}
              index={index}
              isPremium={algo.is_premium || (algo.listType !== ListType.Core && algo.listType !== ListType.CoreAndBlind75)}
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
      )}
    </ListingLayout>
  );
};

export default Problems;
