'use client';

import { useMemo } from 'react';
import { Flame, Target, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useAppSelector } from '@/store/hooks';
import { eachDayOfInterval, format, parseISO } from 'date-fns';

interface DashboardHeroProps {
  currentStreak: number;
  nextMilestone: number;
  totalSolved: number;
  submissionsData: { date: string; count: number; activities?: any[] }[];
}

function computeDailyGoals(
  submissionsData: { date: string; count: number; activities?: any[] }[],
  progressData: any[],
  currentStreak: number,
) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayEntry = submissionsData.find((s) => s.date === today);
  const solvedToday = (todayEntry?.count ?? 0) > 0;

  // Check if any step was completed today
  const stepCompletedToday = progressData.some((p) => {
    const updated = p.last_viewed_at || p.updated_at;
    if (!updated) return false;
    return format(new Date(updated), 'yyyy-MM-dd') === today;
  });

  const streakAlive = currentStreak > 0;

  const goals = [
    { label: 'Solve 1 problem', done: solvedToday },
    { label: 'Complete a learning step', done: stepCompletedToday },
    { label: 'Keep your streak alive', done: streakAlive },
  ];

  return goals;
}

export const DashboardHero = ({
  currentStreak,
  nextMilestone,
  totalSolved,
  submissionsData,
}: DashboardHeroProps) => {
  const { user, profile } = useApp();
  const { data: progressData } = useAppSelector((state) => state.userProgress);

  const firstName = useMemo(() => {
    const fullName = profile?.full_name || user?.email || '';
    return fullName.split(' ')[0] || 'there';
  }, [profile, user]);

  const dailyGoals = useMemo(
    () => computeDailyGoals(submissionsData, progressData, currentStreak),
    [submissionsData, progressData, currentStreak],
  );

  const goalsCompleted = dailyGoals.filter((g) => g.done).length;
  const left = nextMilestone - totalSolved;

  return (
    <div className="w-full max-w-[820px] mx-auto mb-5 px-2 sm:px-0">
      {/* Greeting row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Left: greeting + sub-text */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
            👋 Welcome back,{' '}
            <span className="text-primary">{firstName}</span>
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            {left <= 0
              ? "You've crushed your current milestone! Keep going 🚀"
              : left === 1
              ? `You're only 1 problem away from your next milestone.`
              : `You're ${left} problems away from your next milestone.`}
          </p>
        </div>

        {/* Right: Streak + Daily Goal badges */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Streak badge */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1.5 rounded-full text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>{currentStreak} Day Streak</span>
            </div>
          )}

          {/* Daily Goal badge */}
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
              goalsCompleted === dailyGoals.length
                ? 'bg-primary/10 border-primary/20 text-primary'
                : 'bg-muted/40 border-border/40 text-muted-foreground',
            )}
          >
            <Target className="w-3.5 h-3.5" />
            <span>
              Daily Goal {goalsCompleted}/{dailyGoals.length}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Goals mini-list */}
      <div className="mt-3 flex flex-wrap gap-2">
        {dailyGoals.map((goal, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors',
              goal.done
                ? 'bg-primary/5 border-primary/20 text-primary/80'
                : 'bg-muted/20 border-border/30 text-muted-foreground/70',
            )}
          >
            {goal.done ? (
              <CheckCircle2 className="w-3 h-3 shrink-0 text-primary" />
            ) : (
              <Circle className="w-3 h-3 shrink-0" />
            )}
            <span>{goal.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
