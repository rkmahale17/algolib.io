'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format, parseISO, subWeeks, eachDayOfInterval, startOfWeek, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Trophy, TrendingUp } from 'lucide-react';

interface ContributionGraphProps {
  submissions: { date: string; count: number; activities?: any[] }[];
  /** Number of weeks to show. Default: 12 */
  weeks?: number;
  currentStreak?: number;
  maxStreak?: number;
}

const getColor = (count: number): string => {
  if (count === 0) return 'bg-muted/40 dark:bg-zinc-800/60';
  if (count === 1) return 'bg-primary/50';
  if (count === 2) return 'bg-primary/75';
  return 'bg-primary';
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ContributionGraph = ({
  submissions,
  weeks = 12,
  currentStreak = 0,
  maxStreak = 0,
}: ContributionGraphProps) => {
  const { grid, submissionMap, weekCount } = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach((s) => {
      const key = format(parseISO(s.date), 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + s.count);
    });

    const today = new Date();
    const endSunday = addDays(startOfWeek(today, { weekStartsOn: 1 }), 6);
    const startMonday = subWeeks(startOfWeek(today, { weekStartsOn: 1 }), weeks - 1);

    const allDays = eachDayOfInterval({ start: startMonday, end: endSunday });

    const columns: { date: Date; key: string }[][] = [];
    let currentCol: { date: Date; key: string }[] = [];
    allDays.forEach((day, i) => {
      currentCol.push({ date: day, key: format(day, 'yyyy-MM-dd') });
      if ((i + 1) % 7 === 0) { columns.push(currentCol); currentCol = []; }
    });
    if (currentCol.length) columns.push(currentCol);

    return { grid: columns, submissionMap: map, weekCount: columns.length };
  }, [submissions, weeks]);

  // Solved this week
  const solvedThisWeek = useMemo(() => {
    const today = new Date();
    const weekStart = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const weekEnd = format(today, 'yyyy-MM-dd');
    let count = 0;
    submissionMap.forEach((val, key) => {
      if (key >= weekStart && key <= weekEnd) count += val;
    });
    return count;
  }, [submissionMap]);

  return (
    <Card className="border-border/40 bg-card shadow-sm flex flex-col w-full overflow-hidden rounded-xl h-full">
      <div className="px-4 py-2.5 border-b border-border/40 shrink-0 bg-muted/20">
        <h3 className="font-semibold text-[13px] text-foreground tracking-tight flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-foreground" /> Consistency Tracker
        </h3>
      </div>
      <CardContent className="p-4 flex-1 flex flex-col gap-2">
        {/* Day labels + grid */}
        <div className="flex gap-1">
          <div className="flex flex-col gap-[3px] justify-between pr-1 shrink-0">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[9px] font-medium text-muted-foreground/50 h-3 flex items-center"
              >
                {i % 2 === 0 ? label : ''}
              </div>
            ))}
          </div>
          <div className="flex gap-[3px] flex-1 overflow-hidden">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map(({ date, key }) => {
                  const count = submissionMap.get(key) ?? 0;
                  const isFuture = date > new Date();
                  const label = format(date, 'MMM d');
                  return (
                    <div
                      key={key}
                      title={
                        isFuture
                          ? ''
                          : count > 0
                          ? `${count} submission${count > 1 ? 's' : ''} on ${label}`
                          : `No submissions on ${label}`
                      }
                      className={cn(
                        'w-3 h-3 rounded-[2px] transition-colors',
                        isFuture ? 'bg-transparent' : getColor(count),
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-muted-foreground/50">Less</span>
          {[0, 1, 2, 3].map((level) => (
            <div key={level} className={cn('w-3 h-3 rounded-[2px]', getColor(level))} />
          ))}
          <span className="text-[9px] text-muted-foreground/50">More</span>
        </div>

        <div className="mt-auto pt-3 border-t border-border/20 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-foreground font-semibold text-[10px] px-2 h-6 bg-muted/30 border border-border/80 rounded-full whitespace-nowrap shrink-0">
            <Flame className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="flex items-center gap-1">
              Streak
              <div className="w-px h-2.5 bg-border/50 mx-0.5" />
              <span className="font-mono text-[13px] font-bold text-orange-500 leading-none tracking-tight">
                {currentStreak}
              </span> 
            </span>
          </div>
          <div className="flex items-center gap-1 text-foreground font-semibold text-[10px] px-2 h-6 bg-muted/30 border border-border/80 rounded-full whitespace-nowrap shrink-0">
            <Trophy className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="flex items-center gap-1">
              Best 
              <div className="w-px h-2.5 bg-border/50 mx-0.5" />
              <span className="font-mono text-[13px] font-bold text-primary leading-none tracking-tight">
                {maxStreak}
              </span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
