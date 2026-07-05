'use client';

import { useMemo } from 'react';
import { TrendingUp, Clock, Crosshair, Zap } from 'lucide-react';
import { format, parseISO, startOfWeek, isWithinInterval, addDays } from 'date-fns';
import { useAppSelector } from '@/store/hooks';
import { DIFFICULTY_MAP } from '@/types/algorithm';

interface WeeklyInsightsProps {
  submissionsData: { date: string; count: number; activities?: any[] }[];
}

const getTimeEstimate = (difficulty: string): number => {
  const norm = difficulty?.toLowerCase() || '';
  if (['easy', 'beginner', 'beginners', 'begineers'].includes(norm)) return 15;
  if (['hard', 'advance', 'advanced', 'advacned', 'expert'].includes(norm)) return 40;
  return 25;
};

export const WeeklyInsights = ({ submissionsData }: WeeklyInsightsProps) => {
  const { items: algorithms } = useAppSelector((state) => state.algorithms);

  const stats = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);

    const thisWeekEntries = submissionsData.filter((s) => {
      const d = parseISO(s.date);
      return isWithinInterval(d, { start: weekStart, end: weekEnd });
    });

    const totalProblems = thisWeekEntries.reduce((acc, s) => acc + s.count, 0);

    // Compute time & accuracy from activities
    let totalTime = 0;
    let totalActs = 0;
    let passed = 0;
    const categoryCounts: Record<string, number> = {};

    thisWeekEntries.forEach((entry) => {
      (entry.activities || []).forEach((act: any) => {
        totalActs++;
        if (act.status === 'passed') passed++;

        // time estimate from difficulty
        const diff = act.difficulty || 'Medium';
        totalTime += getTimeEstimate(diff);

        // category
        const algo = algorithms.find((a) => a.id === act.algorithm_id);
        if (algo?.category) {
          algo.category.split(',').forEach((cat) => {
            const c = cat.trim();
            categoryCounts[c] = (categoryCounts[c] ?? 0) + 1;
          });
        }
      });
    });

    const hours = Math.floor(totalTime / 60);
    const minutes = totalTime % 60;
    const timeStr =
      totalTime === 0
        ? '—'
        : hours > 0
        ? `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`
        : `${minutes}m`;

    const accuracy =
      totalActs > 0 ? Math.round((passed / totalActs) * 100) : null;

    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return { totalProblems, timeStr, accuracy, topCategory };
  }, [submissionsData, algorithms]);

  if (stats.totalProblems === 0) return null;

  const items = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: 'This Week',
      value: `${stats.totalProblems} Problem${stats.totalProblems > 1 ? 's' : ''}`,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: 'Time',
      value: stats.timeStr,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    ...(stats.accuracy !== null
      ? [
          {
            icon: <Zap className="w-4 h-4" />,
            label: 'Accuracy',
            value: `${stats.accuracy}%`,
            color: stats.accuracy >= 70 ? 'text-green-500' : 'text-yellow-500',
            bg: stats.accuracy >= 70 ? 'bg-green-500/10' : 'bg-yellow-500/10',
          },
        ]
      : []),
    ...(stats.topCategory
      ? [
          {
            icon: <Crosshair className="w-4 h-4" />,
            label: 'Top Topic',
            value: stats.topCategory,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
          },
        ]
      : []),
  ];

  return (
    <div className="w-full max-w-[820px] mx-auto bg-card border border-border/40 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-border/30 bg-muted/10 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-foreground/90 tracking-wide">
          Weekly Insights
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/30">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-1 py-4 px-3 text-center"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color} mb-1`}>
              {item.icon}
            </div>
            <span className={`text-base font-bold tabular-nums ${item.color}`}>
              {item.value}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
