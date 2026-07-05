'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format, parseISO, subWeeks, eachDayOfInterval, startOfWeek, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContributionGraphProps {
  submissions: { date: string; count: number; activities?: any[] }[];
  /** Number of weeks to show. Default: 12 */
  weeks?: number;
}

const getColor = (count: number): string => {
  if (count === 0) return 'bg-muted/40 dark:bg-zinc-800/60';
  if (count === 1) return 'bg-primary/50';
  if (count === 2) return 'bg-primary/75';
  return 'bg-primary';
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const ContributionGraph = ({ submissions, weeks = 12 }: ContributionGraphProps) => {
  const { grid, submissionMap } = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach((s) => {
      const key = format(parseISO(s.date), 'yyyy-MM-dd');
      map.set(key, (map.get(key) ?? 0) + s.count);
    });

    // Build a grid: rows = days of week (Mon=0 … Sun=6), cols = weeks
    // We want `weeks` columns, ending today
    const today = new Date();
    // end of the current week's Sunday
    const endSunday = addDays(startOfWeek(today, { weekStartsOn: 1 }), 6);
    // Start Monday `weeks` weeks ago
    const startMonday = subWeeks(startOfWeek(today, { weekStartsOn: 1 }), weeks - 1);

    const allDays = eachDayOfInterval({ start: startMonday, end: endSunday });

    // group into columns (weeks)
    const columns: { date: Date; key: string }[][] = [];
    let currentCol: { date: Date; key: string }[] = [];

    allDays.forEach((day, i) => {
      currentCol.push({ date: day, key: format(day, 'yyyy-MM-dd') });
      if ((i + 1) % 7 === 0) {
        columns.push(currentCol);
        currentCol = [];
      }
    });
    if (currentCol.length) columns.push(currentCol);

    return { grid: columns, submissionMap: map };
  }, [submissions, weeks]);

  return (
    <Card className="border-border/40 bg-card shadow-sm flex flex-col w-full overflow-hidden rounded-xl">
      <CardHeader className="p-3 pb-1 shrink-0">
        <CardTitle className="text-[13px] font-semibold text-foreground/80 tracking-tight">
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1 flex-1 flex flex-col gap-2">
        {/* Day labels (Mon-Sun) — vertical axis */}
        <div className="flex gap-1">
          {/* Day labels column */}
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

          {/* Graph grid */}
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
                        isFuture
                          ? 'bg-transparent'
                          : getColor(count),
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[9px] text-muted-foreground/50">Less</span>
          {[0, 1, 2, 3].map((level) => (
            <div
              key={level}
              className={cn('w-3 h-3 rounded-[2px]', getColor(level))}
            />
          ))}
          <span className="text-[9px] text-muted-foreground/50">More</span>
        </div>
      </CardContent>
    </Card>
  );
};
