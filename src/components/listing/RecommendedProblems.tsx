import { useRecommendedProblems } from '@/hooks/useRecommendedProblems';
import { AlgorithmListItem, DIFFICULTY_MAP } from '@/types/algorithm';
import { useApp } from '@/contexts/AppContext';
import { ArrowRight, Clock, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import { PremiumProblemCard } from '@/components/listing/PremiumProblemCard';

interface RecommendedProblemsProps {
  algorithms: AlgorithmListItem[];
}

const difficultyColors: Record<string, { text: string; bg: string; border: string }> = {
  Easy:   { text: 'text-green-500',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
  Medium: { text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  Med:    { text: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  Hard:   { text: 'text-red-500',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
};

const getEstimatedTime = (difficulty: string) => {
  const norm = difficulty?.toLowerCase() || '';
  if (['easy', 'beginner', 'beginners', 'begineers'].includes(norm)) return '15 min';
  if (['hard', 'advance', 'advanced', 'advacned', 'expert'].includes(norm)) return '40 min';
  return '25 min';
};

export const RecommendedProblems = ({ algorithms }: RecommendedProblemsProps) => {
  const recommendations = useRecommendedProblems(algorithms);
  const { progressMap } = useApp();
  const progressData = useAppSelector((s) => s.userProgress.data);

  // Compute the most recently practiced category for the personalized header
  const recentCategory = useMemo(() => {
    const catCounts: Record<string, number> = {};
    const solvedIds = Object.entries(progressMap ?? {})
      .filter(([, s]) => s === 'solved')
      .map(([id]) => id);
    solvedIds.forEach((id) => {
      const algo = algorithms.find((a) => a.id === id);
      if (!algo?.category) return;
      algo.category.split(',').forEach((c) => {
        const cat = c.trim();
        catCounts[cat] = (catCounts[cat] ?? 0) + 1;
      });
    });
    const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || null;
  }, [algorithms, progressMap]);

  if (recommendations.length === 0) return null;

  const headerText = recentCategory
    ? `Based on your ${recentCategory} practice`
    : 'Next Best Problems';

  return (
    <div className="w-full flex flex-col mb-4">
      <div className="px-4 py-2.5 border-x border-t border-border/40 shrink-0 bg-card rounded-t-xl flex flex-col gap-0.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/20 pointer-events-none" />
        <h3 className="font-semibold text-[13px] text-foreground tracking-tight flex items-center gap-1.5 relative z-10">
          <Sparkles className="w-4 h-4 text-foreground" /> {headerText}
        </h3>
        <p className="text-[11px] text-muted-foreground ml-5 relative z-10">
          Curated from what you've already solved.
        </p>
      </div>

      {/* Recommendation cards */}
      <div className="flex flex-col">
        {recommendations.slice(0, 2).map((rec, idx) => {
          const algo = rec.algorithm;
          const status = (progressMap?.[algo.id] || 'none') as any;

          let ctaText = 'Start';
          if (status === 'attempted') ctaText = 'Resume';
          else if (status === 'solved') ctaText = 'Review';

          return (
            <PremiumProblemCard
              key={algo.id}
              algorithm={algo}
              status={status}
              index={idx}
              isFirst={false}
              isLast={idx === 1 || idx === recommendations.length - 1}
              disableRounding={false}
              reasonBadge={
                <span className="text-[11px] text-muted-foreground italic mb-1 inline-block bg-muted/30 px-2 py-0.5 rounded-md border border-border/40">
                  {rec.reason}
                </span>
              }
              ctaText={ctaText}
              showEstimatedTime={true}
            />
          );
        })}
      </div>
    </div>
  );
};
