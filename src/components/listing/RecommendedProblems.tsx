import { useRecommendedProblems } from '@/hooks/useRecommendedProblems';
import { AlgorithmListItem, DIFFICULTY_MAP } from '@/types/algorithm';
import { useApp } from '@/contexts/AppContext';
import { ArrowRight, Clock, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

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
    <div className="w-full max-w-[820px] mx-auto bg-card border border-border/40 rounded-xl shadow-sm overflow-hidden flex flex-col mb-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-5 py-3 bg-muted/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold tracking-wide text-foreground/90">
            {headerText}
          </span>
        </div>
        {recommendations[0]?.confidence && (
          <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
            ⭐ {recommendations[0].confidence}
          </span>
        )}
      </div>

      {/* Recommendation cards */}
      <div className="flex flex-col divide-y divide-border/20">
        {recommendations.slice(0, 2).map((rec, idx) => {
          const algo = rec.algorithm;
          const status = progressMap?.[algo.id] || 'none';
          const rawDiff =
            algo.mappedDifficulty ||
            DIFFICULTY_MAP[algo.difficulty?.toLowerCase()] ||
            'Medium';
          const displayDiff = rawDiff === 'Medium' ? 'Med' : rawDiff;
          const diffStyle = difficultyColors[displayDiff] || difficultyColors['Med'];
          const estimatedTime = getEstimatedTime(algo.difficulty);
          const targetUrl = algo.slug ? `/problem/${algo.slug}` : `/problem/${algo.id}`;

          let ctaText = 'Start';
          if (status === 'attempted') ctaText = 'Resume';
          else if (status === 'solved') ctaText = 'Review';

          return (
            <div key={algo.id} className="px-5 py-4 flex flex-col gap-2.5">
              {/* Personalized reason */}
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                {rec.reason}
              </p>

              {/* Problem row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1.5">
                  {idx === 0 && (
                    <div className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      Next Best Problem
                    </div>
                  )}
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {algo.title || algo.name}
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Difficulty */}
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                        diffStyle.text, diffStyle.bg, diffStyle.border,
                      )}
                    >
                      {displayDiff}
                    </span>
                    {/* Time */}
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {estimatedTime}
                    </span>
                    {/* Premium */}
                    {algo.is_premium && (
                      <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
                        <Lock className="w-3.5 h-3.5" />
                        Pro
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={targetUrl}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-muted/50 hover:bg-primary hover:text-primary-foreground border border-border/40 hover:border-primary text-foreground/80 font-semibold text-xs transition-all duration-200 active:scale-95"
                >
                  {ctaText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
