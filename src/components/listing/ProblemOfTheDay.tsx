import Link from 'next/link';
import { Check, Circle, Zap, ArrowRight, Flame } from 'lucide-react';
import { AlgorithmListItem, DIFFICULTY_MAP } from '@/types/algorithm';
import { cn } from '@/lib/utils';

interface ProblemOfTheDayProps {
  potd: {
    problem: AlgorithmListItem | null;
    countdown: { hours: number; minutes: number; seconds: number };
    dayIndex: number;
  };
  progressMap: Record<string, string>;
}

const difficultyColors: Record<string, string> = {
    'Easy': 'text-green-500 bg-green-500/10 border-green-500/20',
    'Medium': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Med': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'Hard': 'text-red-500 bg-red-500/10 border-red-500/20',
};

export const ProblemOfTheDay = ({ potd, progressMap }: ProblemOfTheDayProps) => {
  const { problem, countdown } = potd;

  if (!problem) return null;

  const rawDifficulty = problem.mappedDifficulty || DIFFICULTY_MAP[problem.difficulty?.toLowerCase()] || 'Medium';
  const displayDifficulty = rawDifficulty === 'Medium' ? 'Med' : rawDifficulty;
  const status = progressMap?.[problem.id] || 'none';
  const isSolved = status === 'solved';

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="w-full max-w-[820px] mx-auto flex flex-col mb-4">
      {/* Header */}
      <div className="px-4 py-2.5 border border-border/40 shrink-0 bg-card rounded-t-xl flex flex-col gap-0.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/20 pointer-events-none" />
        <h3 className="font-semibold text-[13px] text-foreground tracking-tight flex items-center gap-1.5 relative z-10">
          <Flame className="w-4 h-4 text-foreground" /> Daily Challenge
        </h3>
        <p className="text-[11px] text-muted-foreground ml-5 relative z-10">
          New problem every 24 hours to keep your skills sharp.
        </p>
      </div>

      <Link
          href={problem.slug ? `/problem/${problem.slug}` : `/problem/${problem.id}`}
          className="group block relative w-full bg-card rounded-b-xl border-x border-b border-border/40 shadow-sm overflow-hidden transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
      >
        <div className="flex items-center gap-4 justify-between px-6 py-4 md:px-8 md:py-5 md:gap-6">
            {/* Status Icon */}
            <div className="shrink-0 pt-1">
                {isSolved ? (
                    <div className="rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20 w-8 h-8">
                        <Check className="stroke-[3] w-5 h-5" />
                    </div>
                ) : status === 'attempted' ? (
                    <div className="rounded-full border-2 border-orange-400 flex items-center justify-center text-orange-400 w-8 h-8">
                        <Circle className="fill-orange-400 w-5 h-5" />
                    </div>
                ) : (
                    <div className="rounded-full border-2 border-border/60 flex items-center justify-center text-muted-foreground/10 transition-colors w-8 h-8">
                        <Check className="stroke-[3] w-5 h-5" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5 md:space-y-2">
                <h3 className="text-md font-medium tracking-tight transition-colors truncate">
                    {problem.title || problem.name}
                </h3>

                {/* Meta Info */}
                <div className="meta-info-row flex flex-wrap items-center gap-x-5 gap-y-1.5 w-full">
                    {/* Daily Challenge Badge */}
                    <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary font-semibold tracking-wider h-6 select-none cursor-default shrink-0 text-[10px] sm:text-[11px]">
                        <Flame className="w-3 h-3 animate-pulse" />
                        Daily Challenge
                    </div>

                    {/* Difficulty */}
                    <div className="difficulty-badge flex items-center gap-1.5 shrink-0">
                        <div className={cn(
                            "flex items-center justify-center gap-1 px-3 py-0.5 rounded-full border font-semibold tracking-wider h-6 select-none cursor-default shrink-0",
                            difficultyColors[displayDifficulty] || difficultyColors['Medium'],
                            "text-[10px] sm:text-[11px] min-w-[50px] px-2"
                        )}>
                            {displayDifficulty}
                        </div>
                    </div>

                    {/* Remaining Time */}
                    <div className="flex items-center gap-2 text-muted-foreground ml-auto">
                        <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Remaining Time</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider sm:hidden">Left</span>
                        <div className="font-mono text-xs font-bold text-foreground bg-background/50 px-2 py-1 rounded border border-border/50 shadow-inner">
                            {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrow */}
            <div className="shrink-0 self-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-muted-foreground/30 group-hover:text-primary group-hover:bg-primary/5 group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] dark:group-hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] transition-all duration-300 transform group-hover:translate-x-1 border border-transparent group-hover:border-primary/10">
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </div>
            </div>
        </div>
    </Link>
    </div>
  );
};
