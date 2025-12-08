import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays, eachDayOfInterval, endOfDay, isSameDay } from 'date-fns';
import { cn } from "@/lib/utils";

interface SubmissionHeatmapProps {
  submissions: { date: string; count: number }[];
}

export const SubmissionHeatmap = ({ submissions }: SubmissionHeatmapProps) => {
  // Generate last 365 days
  const today = new Date();
  const days = useMemo(() => {
    const end = endOfDay(today);
    const start = subDays(end, 364); // Updated to 365 days roughly
    return eachDayOfInterval({ start, end });
  }, []);

  // Map submissions to a dictionary for O(1) lookup
  const submissionMap = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach(s => {
      const dateKey = format(new Date(s.date), 'yyyy-MM-dd');
      map.set(dateKey, (map.get(dateKey) || 0) + s.count);
    });
    return map;
  }, [submissions]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-green-500/30";
    if (count <= 3) return "bg-green-500/50";
    if (count <= 5) return "bg-green-500/70";
    return "bg-green-500";
  };

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center justify-between">
            <span>Submission Activity</span>
            <span className="text-sm font-normal text-muted-foreground">
                {submissions.reduce((acc, curr) => acc + curr.count, 0)} submissions in the last year
            </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
            <div className="flex flex-wrap gap-1">
                {days.map((day, i) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const count = submissionMap.get(dateKey) || 0;
                    return (
                        <Tooltip key={i}>
                            <TooltipTrigger asChild>
                                <div 
                                    className={cn(
                                        "w-[10px] h-[10px] rounded-[2px] transition-colors hover:ring-1 hover:ring-ring hover:ring-offset-1 ring-offset-background", 
                                        getColor(count)
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="text-xs">
                                    <span className="font-semibold">{count} submissions</span> on {format(day, 'MMM d, yyyy')}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-end">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-muted/30" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-green-500/30" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-green-500/50" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-green-500/70" />
                <div className="w-[10px] h-[10px] rounded-[2px] bg-green-500" />
                <span>More</span>
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};
