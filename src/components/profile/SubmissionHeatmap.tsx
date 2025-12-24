import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, subDays, eachDayOfInterval, endOfDay, isSameDay, startOfYear, endOfYear, getYear, parseISO, isLeapYear } from 'date-fns';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from 'lucide-react';

interface SubmissionHeatmapProps {
  submissions: { date: string; count: number }[];
}

export const SubmissionHeatmap = ({ submissions }: SubmissionHeatmapProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("Current");

  // available years from data + current year
  const years = useMemo(() => {
    const dataYears = new Set(submissions.map(s => getYear(parseISO(s.date))));
    dataYears.add(getYear(new Date()));
    return ["Current", ...Array.from(dataYears).sort((a, b) => b - a).map(String)];
  }, [submissions]);

  // Map submissions to a dictionary for O(1) lookup
  const submissionMap = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach(s => {
      // Ensure date is consistent
      const d = parseISO(s.date);
      const dateKey = format(d, 'yyyy-MM-dd');
      map.set(dateKey, (map.get(dateKey) || 0) + s.count);
    });
    return map;
  }, [submissions]);

  const { days, totalSubmissionsInPeriod, activeDays, maxStreak } = useMemo(() => {
    let start, end;
    const now = new Date();

    if (selectedYear === "Current") {
      end = endOfDay(now);
      start = subDays(end, 364); // Last 365 days
    } else {
      const y = parseInt(selectedYear);
      start = startOfYear(new Date(y, 0, 1));
      end = endOfYear(new Date(y, 0, 1));
      // If selected year is future (unlikely but safe check), cap at today? 
      // Actually standard heatmap shows full year grid usually.
      // But let's stick to full year grid for specific years.
    }

    const intervalDays = eachDayOfInterval({ start, end });
    
    let total = 0;
    let active = 0;
    let currentStreak = 0;
    let maxS = 0;

    // Calculate stats efficiently
    // We need to iterate chronologically for streak
    // intervalDays is already chronological
    
    intervalDays.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        const count = submissionMap.get(dateKey) || 0;
        
        if (count > 0) {
            total += count;
            active++;
            currentStreak++;
        } else {
            // Streak broken
            maxS = Math.max(maxS, currentStreak);
            currentStreak = 0;
        }
    });

    // Final streak check
    maxS = Math.max(maxS, currentStreak);

    return {
        days: intervalDays,
        totalSubmissionsInPeriod: total,
        activeDays: active,
        maxStreak: maxS
    };
  }, [selectedYear, submissionMap]);


  const getColor = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-green-500/30";
    if (count <= 3) return "bg-green-500/50";
    if (count <= 5) return "bg-green-500/70";
    return "bg-green-500";
  };

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                 <CardTitle className="text-sm font-bold flex items-center gap-2">
                    {totalSubmissionsInPeriod}
                    <span className="text-base font-normal text-muted-foreground mr-1">submissions in</span>
                    {selectedYear === "Current" ? "the past one year" : selectedYear} 
                 </CardTitle>
                 <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger><Info className="w-4 h-4 text-muted-foreground/50" /></TooltipTrigger>
                        <TooltipContent>
                            <p>Total submissions for the selected period</p>
                        </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[100px] h-8 text-xs bg-muted/50 border-input/50">
                        <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {years.map(y => (
                            <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        {/* Mobile stats visible below */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground md:hidden mt-2">
                <span>Active days: <span className="text-foreground font-medium">{activeDays}</span></span>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider delayDuration={0}>
            {/* 
               Group days by month for visual separation.
            */}
            <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                {(() => {
                    const months: { key: string; label: string; days: Date[] }[] = [];
                    days.forEach(day => {
                        const key = format(day, 'yyyy-MM');
                        const label = format(day, 'MMM');
                        let group = months.find(m => m.key === key);
                        if (!group) {
                            group = { key, label, days: [] };
                            months.push(group);
                        }
                        group.days.push(day);
                    });

                    return months.map((month) => (
                        <div key={month.key} className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-muted-foreground">{month.label}</span>
                            {/* 7 columns for approximately weekly rows */}
                            <div className="grid grid-cols-7 gap-1">
                                {month.days.map((day, i) => {
                                    const dateKey = format(day, 'yyyy-MM-dd');
                                    const count = submissionMap.get(dateKey) || 0;
                                    return (
                                        <Tooltip key={dateKey}>
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
                        </div>
                    ));
                })()}
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
