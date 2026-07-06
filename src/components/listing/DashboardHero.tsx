'use client';

import { useMemo } from 'react';
import { Flame, CheckCircle2, Circle, Star, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useAppSelector } from '@/store/hooks';
import { format } from 'date-fns';
import { XPWidget } from '@/components/xp/XPWidget';
import { XP_VALUES } from '@/constants/xpConfig';

interface DashboardHeroProps {
  currentStreak: number;
  nextMilestone: number;
  totalSolved: number;
  submissionsData: { date: string; count: number; activities?: any[] }[];
}

/* ── Level system ── */
const LEVELS = [
  { min: 0,   max: 9,   label: 'Beginner',      color: 'text-zinc-400' },
  { min: 10,  max: 24,  label: 'Explorer',       color: 'text-sky-400' },
  { min: 25,  max: 49,  label: 'Practitioner',   color: 'text-violet-400' },
  { min: 50,  max: 99,  label: 'Problem Solver',  color: 'text-amber-400' },
  { min: 100, max: 149, label: 'Algorithm Ace',   color: 'text-orange-400' },
  { min: 150, max: 199, label: 'DSA Master',      color: 'text-rose-400' },
  { min: 200, max: Infinity, label: 'Legend',     color: 'text-primary' },
] as const;

function getLevel(solved: number) {
  return LEVELS.findLast((l) => solved >= l.min) ?? LEVELS[0];
}

function getLevelNumber(solved: number) {
  return LEVELS.findIndex((l) => solved >= l.min && solved <= l.max) + 1 || LEVELS.length;
}

/* ── Delight message (computed from recent activity) ── */
function getDelightMessage(
  submissionsData: { date: string; count: number; activities?: any[] }[],
  currentStreak: number,
  progressData: any[],
) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

  const lastSolved = [...progressData]
    .filter((p) => p.completed && p.completed_at)
    .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0];

  const solvedToday = submissionsData.find((s) => s.date === today && s.count > 0);

  if (currentStreak >= 7) {
    return { emoji: '🏆', text: `${currentStreak}-day streak! You're on fire. Don't stop now.` };
  }
  if (currentStreak >= 5) {
    return { emoji: '🔥', text: `${currentStreak} days in a row — only ${7 - currentStreak} more for a weekly badge!` };
  }
  if (solvedToday) {
    return { emoji: '⚡', text: `Nice work today! Keep that momentum going.` };
  }
  if (lastSolved) {
    const title = lastSolved.algorithm_id; // we'll display the streak/milestone message instead
    return { emoji: '🎯', text: `You were on a roll yesterday. Ready to keep going?` };
  }
  return null;
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

  const level = useMemo(() => getLevel(totalSolved), [totalSolved]);
  const levelNumber = useMemo(() => getLevelNumber(totalSolved), [totalSolved]);


  const delight = useMemo(
    () => getDelightMessage(submissionsData, currentStreak, progressData),
    [submissionsData, currentStreak, progressData],
  );


  const left = nextMilestone - totalSolved;
  const milestonePct = Math.min(Math.round((totalSolved / nextMilestone) * 100), 100);

  return (
    <div className="w-full max-w-[820px] mx-auto mb-5 px-2 sm:px-0 space-y-3">

      {/* ── Delight banner ── */}
      {delight && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/15 text-sm text-foreground/80 font-medium animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-base shrink-0">{delight.emoji}</span>
          <span>{delight.text}</span>
        </div>
      )}

      {/* ── Main hero card ── */}
      <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden">
        {/* Top row: greeting + badges */}
        <div className="px-5 pt-5 pb-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            {/* Left: greeting */}
            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                👋 Welcome back,{' '}
                <span className="text-primary">{firstName}</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                {left <= 0
                  ? "You've crushed your current milestone! Keep going 🚀"
                  : left === 1
                  ? `You're 1 problem away from your next milestone.`
                  : `${left} problems away from your next milestone.`}
              </p>
            </div>

            {/* Right: streak badge */}
            {currentStreak > 0 && (
              <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 px-3 py-1.5 rounded-full text-sm font-bold shrink-0 self-start">
                <Flame className="w-4 h-4" />
                <span>{currentStreak} Day Streak</span>
              </div>
            )}
          </div>

          {/* Stats row: Level + Solved + Daily Goal */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Level badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/30">
              <Star className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="leading-none">
                <div className={cn('text-xs font-bold', level.color)}>
                  Level {levelNumber} · {level.label}
                </div>
              </div>
            </div>

            {/* Problems solved */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/30">
              <TrendingUp className="w-4 h-4 text-primary shrink-0" />
              <div className="leading-none">
                <span className="text-xs font-bold text-foreground">{totalSolved} Problems Solved</span>
              </div>
            </div>

            {/* XP Widget */}
            <XPWidget />


          </div>

          {/* Next milestone progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground/70">Next Milestone</span>
              <span className="tabular-nums text-muted-foreground font-medium">
                <strong className="text-foreground">{totalSolved}</strong>/{nextMilestone} problems
                {left > 0 && <span className="text-muted-foreground/60"> · {left} to go</span>}
              </span>
            </div>
            <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${milestonePct}%` }}
              />
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};
