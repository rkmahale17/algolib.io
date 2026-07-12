'use client';

import { useMemo } from 'react';
import { Flame, CheckCircle2, Circle, Star, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
  hidePracticeButton?: boolean;
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
  hidePracticeButton,
}: DashboardHeroProps) => {
  const { user, profile, hasPremiumAccess } = useApp();
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Welcome back, <span className="text-primary">{firstName}</span> 👋
              </h2>
              {hasPremiumAccess && (
                <span className="text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase tracking-wider translate-y-0.5">
                  PRO
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground/80 leading-relaxed mt-1">
              {left <= 0 ? (
                "You've crushed your current milestone! Keep going 🚀"
              ) : (
                <>
                  <span className="text-foreground font-bold mr-1">
                    {left === 1 ? '1 problem' : `${left} problems`}
                  </span>
                  away from your next milestone.
                </>
              )}
              <br />
              Keep solving consistently to unlock new achievements.
            </p>
          </div>

          {/* Stats row: Level + Solved + Daily Goal */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Level badge */}
            <div className="flex items-center gap-2 px-4 h-8 rounded-full bg-muted/30 border border-border/80 text-foreground shrink-0">
              <Star className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-bold">Level <span className="text-indigo-400">{levelNumber}</span> · {level.label}</span>
            </div>

            {/* Problems solved */}
            <div className="flex items-center gap-2 px-4 h-8 rounded-full bg-muted/30 border border-border/80 text-foreground shrink-0">
              <TrendingUp className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-bold"><span className="text-emerald-400">{totalSolved}</span> Problems Solved</span>
            </div>

            {/* XP Widget */}
            <XPWidget />
            
            {/* Right: streak badge */}
            {currentStreak > 0 && (
              <div className="flex items-center gap-2 px-4 h-8 rounded-full bg-muted/30 border border-border/80 text-foreground shrink-0">
                <Flame className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0">
                  Day Streak
                  <div className="w-px h-3 bg-border/50 mx-0.5" />
                  <span className="font-mono text-[14px] font-bold text-orange-500 leading-none tracking-tight">
                    {currentStreak}
                  </span> 
                </span>
              </div>
            )}
          </div>

          {/* Bottom row: Next milestone progress bar + CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4">
            {/* Progress Bar Area */}
            <div className="space-y-3 flex-1 w-full max-w-[400px]">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span className="text-foreground font-semibold">Next Milestone</span>
                <span className="text-muted-foreground/40 text-xs">•</span>
                <span>
                  <strong className="text-foreground">{totalSolved}/{nextMilestone}</strong> problems
                  {left > 0 && <span className="text-muted-foreground/60"> · {left} to go</span>}
                </span>
              </div>
              <div className="h-2.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${milestonePct}%` }}
                />
              </div>
            </div>

            {/* Big Practice CTA */}
            {!hidePracticeButton && (
              <Link
                href="/problems"
                className="group flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-base bg-zinc-950 dark:bg-white hover:bg-zinc-900 dark:hover:bg-zinc-100 text-white dark:text-black font-medium tracking-tight transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-xl shrink-0"
              >
                Practice
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};
