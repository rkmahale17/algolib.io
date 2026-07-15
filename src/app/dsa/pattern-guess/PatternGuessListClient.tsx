"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle2, Lightbulb, Target, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";
import { DIFFICULTY_MAP } from "@/types/algorithm";

export default function PatternGuessListClient() {
  const router = useRouter();
  const { data, isLoading } = useAlgorithms();
  const { hasPremiumAccess, profile } = useApp();
  const userProgressData = useAppSelector(state => state.userProgress?.data || []);
  const isUserAdmin = profile?.role === "admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const patternAlgorithms = useMemo(() => {
    return (data?.algorithms ?? [])
        .filter(algo => algo.controls?.has_pattern_guess)
        .filter(algo => algo.published !== false || isUserAdmin)
        .sort((a, b) => (a.serial_no || 0) - (b.serial_no || 0));
  }, [data, isUserAdmin]);

  const filteredAlgorithms = useMemo(() => {
    let result = patternAlgorithms.map(algo => ({
      ...algo,
      mappedDifficulty: DIFFICULTY_MAP[algo.difficulty?.toLowerCase()] || 'Medium'
    }));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        (a.title || a.name || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    }

    if (selectedDifficulties.length > 0) {
      result = result.filter(a => selectedDifficulties.includes(a.mappedDifficulty));
    }

    return result;
  }, [patternAlgorithms, searchQuery, selectedDifficulties]);

  const solvedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    userProgressData.forEach(p => {
       if (p.pattern_assessment_completed) {
         map.set(p.algorithm_id, true);
       }
    });
    return map;
  }, [userProgressData]);

  const handleDifficultyToggle = (diff: string) => {
    if (diff === 'CLEAR_ALL') {
      setSelectedDifficulties([]);
      return;
    }
    setSelectedDifficulties(prev => 
      prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
    );
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center w-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <ListingLayout
      title="Guess the Pattern"
      description="Test your algorithmic intuition by guessing the underlying patterns of various problems. This helps you build a strong mental map of when to apply specific techniques."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy=""
      onSortChange={() => {}}
      selectedTopics={[]}
      onTopicToggle={() => {}}
      selectedCompanies={[]}
      onCompanyToggle={() => {}}
      selectedDifficulties={selectedDifficulties}
      onDifficultyToggle={handleDifficultyToggle}
      icon={Brain}
      progressWidget={
        <div className="bg-muted/30 border border-border/50 rounded-xl p-5 sm:p-6 mb-2">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            Why Guess the Pattern?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Build Intuition</h3>
                <p className="text-sm text-muted-foreground mt-1">Train your brain to quickly identify the right approach without getting bogged down in code.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <Lightbulb className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground">Save Time in Interviews</h3>
                <p className="text-sm text-muted-foreground mt-1">Recognizing the pattern is 80% of the battle. Master this step to solve problems faster.</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6 max-w-4xl mx-auto pb-24">
        {filteredAlgorithms.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card mt-8">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="font-semibold text-lg text-foreground">No problems found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="flex flex-col [&_.meta-info-row]:hidden [&_.time-badge]:hidden">
             {filteredAlgorithms.map((algo, index) => {
               const isSolved = solvedMap.get(algo.id) || false;
               const reasonBadge = isSolved ? (
                 <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[11px] font-semibold">
                   <CheckCircle2 className="w-3.5 h-3.5" />
                   <span>Guessed Pattern</span>
                 </div>
               ) : undefined;
               
               return (
                 <PremiumProblemCard 
                   key={algo.id} 
                   algorithm={algo} 
                   status={isSolved ? 'solved' : 'none'}
                   index={index}
                   isFirst={index === 0}
                   isLast={index === filteredAlgorithms.length - 1}
                   hideCategoryTags={true}
                   reasonBadge={reasonBadge}
                   ctaText="Assess Pattern"
                   onClick={() => router.push(`/pattern-guess/${algo.id}`)}
                 />
               );
             })}
          </div>
        )}
      </div>
    </ListingLayout>
  );
}
