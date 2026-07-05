import { useRecommendedProblems } from '@/hooks/useRecommendedProblems';
import { AlgorithmListItem } from '@/types/algorithm';
import { useApp } from '@/contexts/AppContext';
import { PremiumProblemCard } from '@/components/listing/PremiumProblemCard';
import { Compass } from 'lucide-react';

interface RecommendedProblemsProps {
  algorithms: AlgorithmListItem[];
}

export const RecommendedProblems = ({ algorithms }: RecommendedProblemsProps) => {
  const recommendations = useRecommendedProblems(algorithms);
  const { progressMap } = useApp();

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-8 w-full max-w-[820px] mx-auto bg-gradient-to-br from-card to-card/95 border border-border/40 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-5 py-3.5 bg-muted/10">
        <div className="flex items-center gap-2">
          <Compass className="w-4.5 h-4.5 text-primary" />
          <span className="text-sm font-semibold tracking-wide text-foreground/90">Recommended for You</span>
        </div>
      </div>
      
      {/* Cards */}
      <div className="flex flex-col divide-y divide-border/30">
        {recommendations.map((rec, index) => {
          const algo = rec.algorithm;
          const status = progressMap?.[algo.id] || 'none';
          
          const reasonBadge = (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-muted/50 text-muted-foreground border border-border/50">
                {rec.reason}
              </div>
              {rec.confidence && (
                <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-muted/50 text-muted-foreground border border-border/50">
                  {rec.confidence}
                </div>
              )}
            </div>
          );

          let ctaText = 'Start Learning';
          if (status === 'attempted') ctaText = 'Resume';
          else if (status === 'solved') ctaText = 'Review';

          return (
            <PremiumProblemCard
              key={algo.id}
              algorithm={algo}
              status={status as any}
              isPremium={algo.is_premium}
              index={index}
              isFirst={index === 0}
              isLast={index === recommendations.length - 1}
              reasonBadge={reasonBadge}
              showEstimatedTime={true}
              ctaText={ctaText}
              noBorder={true}
            />
          );
        })}
      </div>
    </div>
  );
};
