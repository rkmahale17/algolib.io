"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAlgorithms } from "@/hooks/useAlgorithms";
import { useApp } from "@/contexts/AppContext";
import { useAppSelector } from "@/store/hooks";
import { ListingLayout } from "@/components/listing/ListingLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PremiumProblemCard } from "@/components/listing/PremiumProblemCard";

export default function PatternGuessListClient() {
  const router = useRouter();
  const { data, isLoading } = useAlgorithms();
  const { hasPremiumAccess, profile } = useApp();
  const userProgressData = useAppSelector(state => state.userProgress?.data || []);
  const isUserAdmin = profile?.role === "admin";

  const patternAlgorithms = useMemo(() => {
    return (data?.algorithms ?? [])
        .filter(algo => algo.controls?.has_pattern_guess)
        .filter(algo => algo.published !== false || isUserAdmin)
        .sort((a, b) => (a.serial_no || 0) - (b.serial_no || 0));
  }, [data, isUserAdmin]);

  const solvedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    userProgressData.forEach(p => {
       if (p.pattern_assessment_completed) {
         map.set(p.algorithm_id, true);
       }
    });
    return map;
  }, [userProgressData]);

  if (isLoading) {
    return <div className="p-8 flex justify-center w-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <ListingLayout
      title="Guess the Pattern"
      description="Test your algorithmic intuition by guessing the underlying patterns of various problems. This helps you build a strong mental map of when to apply specific techniques."
      searchQuery=""
      onSearchChange={() => {}}
      sortBy=""
      onSortChange={() => {}}
      selectedTopics={[]}
      onTopicToggle={() => {}}
      selectedCompanies={[]}
      onCompanyToggle={() => {}}
      selectedDifficulties={[]}
      onDifficultyToggle={() => {}}
      icon={Brain}
    >
      <div className="space-y-4 max-w-4xl mx-auto pb-24">
        {patternAlgorithms.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card mt-8">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <h3 className="font-semibold text-lg text-foreground">No problems available yet</h3>
            <p>More pattern assessment problems will be added soon.</p>
          </div>
        ) : (
          <div className="flex flex-col [&_.meta-info-row]:hidden [&_.difficulty-badge]:hidden [&_.time-badge]:hidden">
             {patternAlgorithms.map((algo, index) => {
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
                   isLast={index === patternAlgorithms.length - 1}
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
