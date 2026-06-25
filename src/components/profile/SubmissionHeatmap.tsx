import { useMemo, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  subDays,
  eachDayOfInterval,
  endOfDay,
  startOfYear,
  endOfYear,
  getYear,
  parseISO,
  startOfWeek,
  addDays,
  getDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface SubmissionHeatmapProps {
  submissions: { date: string; count: number }[];
  totalActiveDays?: number;
  maxStreak?: number;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export const SubmissionHeatmap = ({
  submissions,
  totalActiveDays = 0,
  maxStreak = 0,
}: SubmissionHeatmapProps) => {
  const [selectedYear, setSelectedYear] = useState<string>("Current");

  const years = useMemo(() => {
    const dataYears = new Set(submissions.map((s) => getYear(parseISO(s.date))));
    dataYears.add(getYear(new Date()));
    return [
      "Current",
      ...Array.from(dataYears)
        .sort((a, b) => b - a)
        .map(String),
    ];
  }, [submissions]);

  const submissionMap = useMemo(() => {
    const map = new Map<string, number>();
    submissions.forEach((s) => {
      const d = parseISO(s.date);
      const dateKey = format(d, "yyyy-MM-dd");
      map.set(dateKey, (map.get(dateKey) || 0) + s.count);
    });
    return map;
  }, [submissions]);

  const { weeks, monthLabels, totalInPeriod } = useMemo(() => {
    let start: Date, end: Date;
    const now = new Date();

    if (selectedYear === "Current") {
      end = endOfDay(now);
      start = subDays(end, 364);
    } else {
      const y = parseInt(selectedYear);
      start = startOfYear(new Date(y, 0, 1));
      end = endOfYear(new Date(y, 0, 1));
    }

    // Pad start to Sunday
    const paddedStart = startOfWeek(start, { weekStartsOn: 0 });
    const allDays = eachDayOfInterval({ start: paddedStart, end });

    // Group into weeks
    const weekGroups: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    allDays.forEach((day) => {
      const dayOfWeek = getDay(day);
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
      // Only push days within our actual range
      if (day >= start) {
        currentWeek.push(day);
      } else {
        currentWeek.push(null); // padding
      }
    });
    if (currentWeek.length > 0) {
      // pad to 7
      while (currentWeek.length < 7) currentWeek.push(null);
      weekGroups.push(currentWeek);
    }

    // Month labels: find which week each month starts
    const monthMap: { month: number; weekIndex: number }[] = [];
    let lastMonth = -1;
    weekGroups.forEach((week, wi) => {
      week.forEach((day) => {
        if (day) {
          const m = day.getMonth();
          if (m !== lastMonth) {
            monthMap.push({ month: m, weekIndex: wi });
            lastMonth = m;
          }
        }
      });
    });

    // Total submissions
    let total = 0;
    submissionMap.forEach((v) => (total += v));

    return {
      weeks: weekGroups,
      monthLabels: monthMap,
      totalInPeriod: total,
    };
  }, [selectedYear, submissionMap]);

  const getColor = (count: number) => {
    if (count === 0) return "bg-zinc-800/80 dark:bg-zinc-800 hover:bg-zinc-700";
    if (count === 1) return "bg-green-500/30 hover:bg-green-500/50";
    if (count <= 3) return "bg-green-500/50 hover:bg-green-500/70";
    if (count <= 5) return "bg-green-500/75 hover:bg-green-500/90";
    return "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)] hover:bg-green-400";
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground tabular-nums">
              {totalInPeriod}
            </span>
            <span className="text-sm text-muted-foreground">
              submissions in {selectedYear === "Current" ? "the past year" : selectedYear}
            </span>
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Total code submissions in the selected period</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Total active days:{" "}
              <span className="text-foreground font-semibold">{totalActiveDays}</span>
            </span>
            <span className="text-border">·</span>
            <span>
              Max streak:{" "}
              <span className="text-foreground font-semibold">{maxStreak}</span>
            </span>
          </div>
        </div>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[100px] h-7 text-xs bg-muted/40 border-border/50 shrink-0">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y} className="text-xs">
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile stats */}
      <div className="flex sm:hidden items-center gap-4 text-xs text-muted-foreground mb-3">
        <span>
          Active days: <span className="text-foreground font-semibold">{totalActiveDays}</span>
        </span>
        <span>
          Max streak: <span className="text-foreground font-semibold">{maxStreak}</span>
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-1.5 ml-6">
            {weeks.map((_, wi) => {
              const monthEntry = monthLabels.find((m) => m.weekIndex === wi);
              const isMonthStart = !!monthEntry;
              return (
                <div
                  key={wi}
                  className="shrink-0"
                  style={{ width: 13, marginRight: isMonthStart && wi !== 0 ? 7 : 3 }}
                >
                  {monthEntry && (
                    <span className="text-[10px] text-muted-foreground/70 font-semibold">
                      {MONTH_LABELS[monthEntry.month]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid rows (days of week) */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1.5 mt-0">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                <div
                  key={dayIdx}
                  className="h-[13px] flex items-center justify-end pr-1"
                >
                  {dayIdx % 2 === 1 && (
                    <span className="text-[8px] text-muted-foreground/50 leading-none">
                      {DAY_LABELS[dayIdx]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <TooltipProvider delayDuration={0}>
              <div className="flex">
                {weeks.map((week, wi) => {
                  const isMonthStart = !!monthLabels.find((m) => m.weekIndex === wi);
                  return (
                    <div
                      key={wi}
                      className="flex flex-col gap-[3px]"
                      style={{ marginRight: isMonthStart && wi !== 0 ? 7 : 3 }}
                    >
                      {week.map((day, di) => {
                        if (!day) {
                          return (
                            <div
                              key={di}
                              className="w-[13px] h-[13px] rounded-[2px] opacity-0"
                            />
                          );
                        }
                        const dateKey = format(day, "yyyy-MM-dd");
                        const count = submissionMap.get(dateKey) || 0;
                        return (
                          <Tooltip key={dateKey}>
                            <TooltipTrigger asChild>
                              <div
                                className={cn(
                                  "w-[13px] h-[13px] rounded-[2px] transition-colors duration-150 cursor-default",
                                  getColor(count)
                                )}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              <span className="font-semibold">{count} submission{count !== 1 ? "s" : ""}</span>
                              {" "}on {format(day, "MMM d, yyyy")}
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </TooltipProvider>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground/50 justify-end">
            <span>Less</span>
            {["bg-zinc-800/80", "bg-green-500/30", "bg-green-500/50", "bg-green-500/75", "bg-green-500"].map(
              (cls, i) => (
                <div key={i} className={cn("w-[10px] h-[10px] rounded-[2px]", cls)} />
              )
            )}
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};
