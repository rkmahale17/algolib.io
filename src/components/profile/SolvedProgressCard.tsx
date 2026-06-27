import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SolvedProgressCardProps {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  compact?: boolean;
}

const DifficultyBar = ({
  label,
  solved,
  total,
  barColor,
  trackColor,
  textColor,
  compact,
}: {
  label: string;
  solved: number;
  total: number;
  barColor: string;
  trackColor: string;
  textColor: string;
  compact?: boolean;
}) => {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={cn(compact ? "text-xs" : "text-sm", "font-semibold", textColor)}>
          {label}
        </span>
        <span className={cn(compact ? "text-xs" : "text-sm", "tabular-nums")}>
          <span className="font-bold text-foreground">{solved}</span>
          <span className="text-muted-foreground/50">/{total}</span>
        </span>
      </div>
      <div className={cn(compact ? "h-2" : "h-2.5", "rounded-full overflow-hidden", trackColor)}>
        <div
          className={cn("h-full rounded-full transition-all duration-1000", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const SolvedProgressCard = ({
  totalSolved,
  totalQuestions,
  easySolved,
  easyTotal,
  mediumSolved,
  mediumTotal,
  hardSolved,
  hardTotal,
  compact = false,
}: SolvedProgressCardProps) => {
  // Larger sizes so the card feels full
  const size   = compact ? 120 : 180;
  const outerR = compact ? 55  : 82;
  const innerR = compact ? 46  : 70; // ~12px stroke

  const chartData = [
    { value: easySolved,                              color: "rgb(34 197 94)"         },
    { value: Math.max(0, easyTotal - easySolved),     color: "rgba(34,197,94,0.1)"    },
    { value: mediumSolved,                            color: "rgb(234 179 8)"         },
    { value: Math.max(0, mediumTotal - mediumSolved), color: "rgba(234,179,8,0.1)"    },
    { value: hardSolved,                              color: "rgb(239 68 68)"         },
    { value: Math.max(0, hardTotal - hardSolved),     color: "rgba(239,68,68,0.1)"    },
  ].filter((s) => s.value > 0);

  const getNextMilestone = (solved: number) => {
    if (solved < 5) return 5;
    if (solved < 10) return 10;
    if (solved < 25) return 25;
    if (solved < 50) return 50;
    if (solved < 100) return 100;
    return Math.ceil((solved + 1) / 50) * 50;
  };

  const nextMilestone = getNextMilestone(totalSolved);
  const left = nextMilestone - totalSolved;
  const remaining = totalQuestions - totalSolved;

  return (
    <div className="flex flex-col h-full w-full justify-between">
      <div className={cn(
        "flex items-center gap-6 sm:gap-10 flex-col sm:flex-row flex-1",
        compact ? "px-4 pt-4 pb-2" : "p-6"
      )}>
        {/* ── Donut Ring ── */}
        <div
          className="relative shrink-0"
          style={{ width: size, height: size }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={innerR}
                outerRadius={outerR}
                paddingAngle={1.5}
                dataKey="value"
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={chartData[i].color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* HTML center overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span
              className="font-bold leading-none text-foreground tabular-nums"
              style={{ fontSize: compact ? "1.6rem" : "2.2rem" }}
            >
              {totalSolved}
            </span>
            <span className={cn(
              "text-muted-foreground leading-snug mt-1",
              compact ? "text-[10px]" : "text-xs"
            )}>
              /{totalQuestions}
            </span>
            <span
              className={cn(
                "flex items-center gap-0.5 text-green-500 font-semibold leading-snug mt-1",
                compact ? "text-[9px]" : "text-[11px]"
              )}
            >
              <Check className={cn("stroke-[3]", compact ? "w-2.5 h-2.5" : "w-3 h-3")} />
              Solved
            </span>
          </div>
        </div>

        {/* ── Difficulty Bars — stretch full height ── */}
        <div className="flex-1 w-full flex flex-col justify-center gap-5">
          <DifficultyBar
            label="Easy"   solved={easySolved}   total={easyTotal}
            barColor="bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
            trackColor="bg-green-500/10" textColor="text-green-500"
            compact={compact}
          />
          <DifficultyBar
            label="Medium" solved={mediumSolved} total={mediumTotal}
            barColor="bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
            trackColor="bg-yellow-500/10" textColor="text-yellow-500"
            compact={compact}
          />
          <DifficultyBar
            label="Hard"   solved={hardSolved}   total={hardTotal}
            barColor="bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            trackColor="bg-red-500/10" textColor="text-red-500"
            compact={compact}
          />
        </div>
      </div>

      {compact && (
        <div className="w-full px-4 pb-3 pt-2 text-[11px] sm:text-xs text-muted-foreground border-t border-border/30 flex flex-wrap items-center justify-center gap-1.5 font-normal bg-muted/5">
          <span>{totalSolved} Solved</span>
          <span className="text-muted-foreground/30">•</span>
          <span>{remaining} Remaining</span>
          <span className="text-muted-foreground/30">•</span>
          <span>Next milestone: <strong className="font-semibold text-foreground">{nextMilestone} Problems</strong> ({left} left)</span>
        </div>
      )}
    </div>
  );
};
