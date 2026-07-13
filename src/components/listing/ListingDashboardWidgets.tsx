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
import { RecommendedProblems } from '@/components/listing/RecommendedProblems';
import { cn } from '@/lib/utils';

import { DIFFICULTY_MAP } from '@/types/algorithm';
import { useAppSelector } from '@/store/hooks';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { usePostHog } from '@posthog/react';

interface ListingDashboardWidgetsProps {
  /** The filtered set of algorithms for this listing page */
  algorithms: any[];
  /** Label shown in the card header (e.g. "Blind 75 Progress") */
  progressTitle?: string;
  hideHero?: boolean;
  hideHeroPracticeButton?: boolean;
  showRecommendation?: boolean;
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
  progressTitle = 'Learning Progress',
  hideHero = false,
  hideHeroPracticeButton = false,
  showRecommendation = false,
}: ListingDashboardWidgetsProps) => {
  const { user } = useApp();
  const userProgressData = useAppSelector((state) => state.userProgress.data);
  const progressMap = useAppSelector((state) => state.userProgress.progressMap);
  const { items: allAlgorithms } = useAppSelector((state) => state.algorithms);
  const posthog = usePostHog();

  const continueLearningAlgo = useMemo(() => {
    if (!userProgressData || userProgressData.length === 0) return null;
    const sorted = [...userProgressData].sort((a, b) => {
      const timeA = new Date(a.last_viewed_at || a.updated_at).getTime();
      const timeB = new Date(b.last_viewed_at || b.updated_at).getTime();
      return timeB - timeA;
    });
    const incomplete = sorted.find((p) => !p.completed);
    const target = incomplete || sorted[0];
    if (!target) return null;
    return allAlgorithms.find((a) => a.id === target.algorithm_id) || null;
  }, [userProgressData, allAlgorithms]);

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
    <div className="w-full mb-4">
      {/* ⓪ Continue Learning Minimal Box (Full width on top) */}
      {user && continueLearningAlgo && (
        <div className="mb-4">
          <Link
            href={continueLearningAlgo.slug ? `/problem/${continueLearningAlgo.slug}` : `/problem/${continueLearningAlgo.id}`}
            onClick={() =>
              trackEvent(posthog, "home_cta_clicked", {
                cta_label: "Continue Learning Box",
                destination: continueLearningAlgo.slug || continueLearningAlgo.id,
                section: "listing_dashboard",
              })
            }
            className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] group max-w-[280px]"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-primary tracking-wider mb-0.5">
                Continue
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {continueLearningAlgo.title || continueLearningAlgo.name}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all shrink-0">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      )}

      {/* Dynamic Layout */}
      {showRecommendation ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Left Column (Hero & Progress) */}
          <div className="space-y-4 min-w-0 w-full">
            {/* ① Personalized Hero */}
            {!hideHero && (
              <DashboardHero
                currentStreak={currentStreak}
                nextMilestone={nextMilestone}
                totalSolved={overallStats.totalSolved}
                submissionsData={submissionsData}
                hidePracticeButton={hideHeroPracticeButton}
              />
            )}

            {/* ② Progress Card */}
            <Card className="bg-card border-border/40 shadow-sm overflow-hidden flex flex-col rounded-xl h-full">
              <div className="px-4 py-2.5 border-b border-border/40 shrink-0 bg-muted/20">
                <h3 className="font-semibold text-[13px] text-foreground tracking-tight flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-foreground" /> {progressTitle}
                </h3>
              </div>
              <div className="flex-1 flex flex-col justify-center p-4">
                <SolvedProgressCard
                  {...overallStats}
                  compact
                  currentStreak={currentStreak}
                  maxStreak={maxStreak}
                  userId={user?.id}
                />
              </div>
            </Card>
          </div>

          {/* Right Column (Recommendations & Consistency) */}
          <div className="space-y-4 min-w-0 w-full">
            {/* Recommended Problems */}
            <RecommendedProblems algorithms={algorithms} />

            {/* Consistency Tracker */}
            <div className="w-full max-w-[260px] mx-auto xl:mx-0">
              <ContributionGraph submissions={submissionsData} weeks={12} currentStreak={currentStreak} maxStreak={maxStreak} />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 min-w-0 w-full">
          {/* ① Personalized Hero */}
          {!hideHero && (
            <DashboardHero
              currentStreak={currentStreak}
              nextMilestone={nextMilestone}
              totalSolved={overallStats.totalSolved}
              submissionsData={submissionsData}
              hidePracticeButton={hideHeroPracticeButton}
            />
          )}

          {/* ② Progress + Contribution Graph */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-4 w-full items-stretch">
            {/* Progress card */}
            <div className="min-w-0 flex flex-col h-full">
              <Card className="bg-card border-border/40 shadow-sm overflow-hidden flex flex-col h-full rounded-xl">
                <div className="px-4 py-2.5 border-b border-border/40 shrink-0 bg-muted/20">
                  <h3 className="font-semibold text-[13px] text-foreground tracking-tight flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-foreground" /> {progressTitle}
                  </h3>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <SolvedProgressCard
                    {...overallStats}
                    compact
                    currentStreak={currentStreak}
                    maxStreak={maxStreak}
                    userId={user?.id}
                  />
                </div>
              </Card>
            </div>

            {/* Contribution graph */}
            <div className="w-full xl:w-[260px] flex-none shrink-0 h-full max-w-[260px] mx-auto xl:max-w-none xl:mx-0">
              <ContributionGraph submissions={submissionsData} weeks={12} currentStreak={currentStreak} maxStreak={maxStreak} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
