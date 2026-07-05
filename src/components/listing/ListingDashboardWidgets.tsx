'use client';

/**
 * ListingDashboardWidgets
 *
 * Shared dashboard strip used on all problem listing pages
 * (get-started, blind-75, core, rulcode-150, SQL, etc.)
 *
 * Shows:
 *   ① DashboardHero — personalized greeting, streak badge, daily goal checklist
 *   ② Progress card (2-color ring + difficulty bars + next milestone)
 *      side-by-side with ContributionGraph (GitHub heatmap)
 *   ③ WeeklyInsights — computed weekly stats
 *
 * No ContinueLearning or Recommendations (those stay only on the home dashboard).
 */

import { useMemo } from 'react';
import { eachDayOfInterval, format, parseISO } from 'date-fns';
import { Card } from '@/components/ui/card';
import { ContributionGraph } from '@/components/listing/ContributionGraph';
import { DashboardHero } from '@/components/listing/DashboardHero';
import { SolvedProgressCard } from '@/components/profile/SolvedProgressCard';
import { WeeklyInsights } from '@/components/listing/WeeklyInsights';
import { DIFFICULTY_MAP } from '@/types/algorithm';
import { useAppSelector } from '@/store/hooks';

interface ListingDashboardWidgetsProps {
  /** The filtered set of algorithms for this listing page */
  algorithms: any[];
  /** Label shown in the card header (e.g. "Blind 75 Progress") */
  progressTitle?: string;
}

function getNextMilestone(solved: number): number {
  if (solved < 5) return 5;
  if (solved < 10) return 10;
  if (solved < 25) return 25;
  if (solved < 50) return 50;
  if (solved < 100) return 100;
  return Math.ceil((solved + 1) / 50) * 50;
}

export const ListingDashboardWidgets = ({
  algorithms,
  progressTitle = 'Progress',
}: ListingDashboardWidgetsProps) => {
  const userProgressData = useAppSelector((state) => state.userProgress.data);
  const progressMap = useAppSelector((state) => state.userProgress.progressMap);

  /* ── Per-list progress stats ── */
  const overallStats = useMemo(() => {
    let easySolved = 0, easyTotal = 0;
    let mediumSolved = 0, mediumTotal = 0;
    let hardSolved = 0, hardTotal = 0;

    algorithms.forEach((algo) => {
      const rawDiff = algo.difficulty?.toLowerCase() || '';
      const diff = (DIFFICULTY_MAP[rawDiff] || rawDiff).toLowerCase();
      const isSolved = progressMap?.[algo.id] === 'solved';

      if (diff === 'easy') { easyTotal++; if (isSolved) easySolved++; }
      else if (diff === 'hard') { hardTotal++; if (isSolved) hardSolved++; }
      else { mediumTotal++; if (isSolved) mediumSolved++; }
    });

    return {
      totalSolved: easySolved + mediumSolved + hardSolved,
      totalQuestions: algorithms.length,
      easySolved, easyTotal,
      mediumSolved, mediumTotal,
      hardSolved, hardTotal,
    };
  }, [algorithms, progressMap]);

  /* ── Submissions data (all-time, cross-list — for streak & heatmap) ── */
  const submissionsData = useMemo(() => {
    const map = new Map<string, any[]>();
    userProgressData.forEach((item) => {
      if (item.submissions && Array.isArray(item.submissions)) {
        item.submissions.forEach((sub: any) => {
          if (sub.timestamp) {
            const date = new Date(sub.timestamp).toISOString().split('T')[0];
            const current = map.get(date) || [];
            const algo = algorithms.find((a) => a.id === item.algorithm_id);
            current.push({
              ...sub,
              algorithm_id: item.algorithm_id,
              algorithm_title: algo?.title || 'Unknown Problem',
              difficulty: algo?.difficulty || 'EASY',
            });
            map.set(date, current);
          }
        });
      }
    });
    return Array.from(map.entries()).map(([date, list]) => ({
      date,
      count: list.length,
      activities: list,
    }));
  }, [userProgressData, algorithms]);

  /* ── Streak computation ── */
  const { currentStreak, maxStreak } = useMemo(() => {
    const sorted = [...submissionsData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    if (sorted.length === 0) return { currentStreak: 0, maxStreak: 0 };
    const subMap = new Map(sorted.map((s) => [s.date, s.count]));
    const days = eachDayOfInterval({ start: parseISO(sorted[0].date), end: new Date() });
    let streak = 0, max = 0;
    days.forEach((day) => {
      const key = format(day, 'yyyy-MM-dd');
      if (subMap.get(key)) { streak++; max = Math.max(max, streak); }
      else streak = 0;
    });
    return { currentStreak: streak, maxStreak: max };
  }, [submissionsData]);

  const nextMilestone = getNextMilestone(overallStats.totalSolved);

  if (algorithms.length === 0) return null;

  return (
    <div className="w-full max-w-[820px] mx-auto space-y-4 mb-4">
      {/* ① Personalized Hero */}
      <DashboardHero
        currentStreak={currentStreak}
        nextMilestone={nextMilestone}
        totalSolved={overallStats.totalSolved}
        submissionsData={submissionsData}
      />

      {/* ② Progress + Contribution Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4 w-full items-stretch">
        {/* Progress card */}
        <div className="min-w-0 flex flex-col h-full">
          <Card className="bg-card border-border/40 shadow-sm overflow-hidden flex flex-col h-full rounded-xl">
            <div className="px-4 py-2.5 border-b border-border/40 shrink-0 bg-muted/20">
              <h3 className="font-semibold text-[13px] text-foreground/80">{progressTitle}</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <SolvedProgressCard
                {...overallStats}
                compact
                currentStreak={currentStreak}
                maxStreak={maxStreak}
              />
            </div>
          </Card>
        </div>

        {/* Contribution graph */}
        <div className="w-full lg:w-[240px] flex-none shrink-0 h-full">
          <ContributionGraph submissions={submissionsData} weeks={10} />
        </div>
      </div>

      {/* ③ Weekly Insights */}
      <WeeklyInsights submissionsData={submissionsData} />
    </div>
  );
};
