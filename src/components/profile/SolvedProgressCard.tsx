import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Flame, Trophy, Medal } from "lucide-react";

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
  currentStreak?: number;
  maxStreak?: number;
}

const DifficultyBar = ({
  label,
  solved,
  total,
  textColor,
  barColor,
  compact,
}: {
  label: string;
  solved: number;
  total: number;
  textColor: string;
  barColor: string;
  compact?: boolean;
}) => {
  const pct = total > 0 ? (solved / total) * 100 : 0;
  // Build block string: filled blocks + empty blocks (GitHub-style)
  const BLOCKS = compact ? 8 : 10;
  const filled = Math.round((pct / 100) * BLOCKS);
  const empty = BLOCKS - filled;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-[11px] font-semibold", textColor)}>{label}</span>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          <span className="font-bold text-foreground">{solved}</span>
          <span className="text-muted-foreground/50">/{total}</span>
        </span>
      </div>
      <div className={cn("h-1.5 rounded-full overflow-hidden", barColor + "/15")}>
        <div
          className={cn("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const getNextMilestone = (solved: number) => {
  if (solved < 5) return 5;
  if (solved < 10) return 10;
  if (solved < 25) return 25;
  if (solved < 50) return 50;
  if (solved < 100) return 100;
  return Math.ceil((solved + 1) / 50) * 50;
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
  currentStreak = 0,
  maxStreak = 0,
}: SolvedProgressCardProps) => {
  const size = compact ? 110 : 180;
  const outerR = compact ? 50 : 82;
  const innerR = compact ? 42 : 70;

  // 2-color ring: solved (primary/green) + remaining (muted)
  const chartData = [
    { value: totalSolved, color: "hsl(var(--primary))" },
    { value: Math.max(0, totalQuestions - totalSolved), color: "hsl(var(--muted))" },
  ].filter((s) => s.value > 0);

  const nextMilestone = getNextMilestone(totalSolved);
  const left = nextMilestone - totalSolved;
  const milestonePct = Math.min(Math.round((totalSolved / nextMilestone) * 100), 100);

  return (
    <div className="flex flex-col h-full w-full justify-between">
      <div
        className={cn(
          "flex items-center gap-4 sm:gap-6 flex-col sm:flex-row flex-1",
          compact ? "px-4 pt-4 pb-2" : "p-6",
        )}
      >
        {/* ── 2-color Donut Ring ── */}
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={innerR}
                outerRadius={outerR}
                paddingAngle={2}
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

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span
              className="font-bold leading-none text-foreground tabular-nums"
              style={{ fontSize: compact ? "1.5rem" : "2.2rem" }}
            >
              {totalSolved}
            </span>
            <span
              className={cn(
                "text-muted-foreground leading-snug mt-0.5",
                compact ? "text-[10px]" : "text-xs",
              )}
            >
              /{totalQuestions}
            </span>
            <span
              className={cn(
                "text-primary font-semibold leading-snug mt-1",
                compact ? "text-[9px]" : "text-[11px]",
              )}
            >
              Solved
            </span>
          </div>
        </div>

        {/* ── Difficulty Bars (GitHub-style) ── */}
        <div className="flex-1 w-full flex flex-col justify-center gap-3.5">
          <DifficultyBar
            label="Easy"
            solved={easySolved}
            total={easyTotal}
            textColor="text-green-500"
            barColor="bg-green-500"
            compact={compact}
          />
          <DifficultyBar
            label="Medium"
            solved={mediumSolved}
            total={mediumTotal}
            textColor="text-yellow-500"
            barColor="bg-yellow-500"
            compact={compact}
          />
          <DifficultyBar
            label="Hard"
            solved={hardSolved}
            total={hardTotal}
            textColor="text-red-500"
            barColor="bg-red-500"
            compact={compact}
          />
        </div>
      </div>

      {/* ── Streak row ── */}
      <div className="border-t border-border/30 px-4 py-2.5 bg-muted/5 flex items-center justify-around divide-x divide-border/30 gap-2 shrink-0">
        <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
          <span className="text-[10px] text-muted-foreground font-normal mb-0.5">
            Current Streak
          </span>
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {currentStreak}
            </span>
            <span className="text-[10px] text-muted-foreground/70">days</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center min-w-0">
          <span className="text-[10px] text-muted-foreground font-normal mb-0.5">
            Best Streak
          </span>
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {maxStreak}
            </span>
            <span className="text-[10px] text-muted-foreground/70">days</span>
          </div>
        </div>
      </div>

      {/* ── Next Milestone ── */}
      <div className="border-t border-border/30 px-4 py-3 bg-muted/5 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Medal className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-semibold text-foreground/80">
              Next Milestone
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            <span className="font-bold text-foreground">{nextMilestone}</span> problems
            {left > 0 && (
              <span className="text-muted-foreground/60"> · {left} left</span>
            )}
          </span>
        </div>
        <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700"
            style={{ width: `${milestonePct}%` }}
          />
        </div>
      </div>
    </div>
  );
};
