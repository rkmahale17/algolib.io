import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Medal, Trophy, TrendingUp } from "lucide-react";
import { useGlobalRank } from "@/hooks/useGlobalRank";
import { Skeleton } from "@/components/ui/skeleton";

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
  userId?: string;
}

const DifficultyBar = ({
  label,
  solved,
  total,
  textColor,
  trackBg,
  fillBg,
  compact,
}: {
  label: string;
  solved: number;
  total: number;
  textColor: string;
  trackBg: string;   // static Tailwind class for the empty track
  fillBg: string;    // static Tailwind class for the filled portion
  compact?: boolean;
}) => {
  const pct = total > 0 ? (solved / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={cn("text-[11px] font-semibold", textColor)}>{label}</span>
        <span className="text-[11px] tabular-nums text-muted-foreground">
          <span className="font-bold text-foreground">{solved}</span>
          <span className="text-muted-foreground/50">/{total}</span>
        </span>
      </div>
      <div className={cn("h-1.5 rounded-full overflow-hidden", trackBg)}>
        <div
          className={cn("h-full rounded-full transition-all duration-700", fillBg)}
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
  userId,
}: SolvedProgressCardProps) => {
  const size = compact ? 110 : 180;
  const outerR = compact ? 50 : 82;
  const innerR = compact ? 42 : 70;

  const { data: rankData, isLoading: rankLoading } = useGlobalRank(userId);

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
      {/* ── User Ranking Section ── */}
      {!compact && (
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border/40 animate-in slide-in-from-top-4 fade-in duration-700 bg-gradient-to-r from-transparent via-primary/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center border shadow-[0_0_15px_rgba(var(--primary),0.2)]",
              rankData ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted text-muted-foreground opacity-50 grayscale"
            )}>
              <Trophy className="w-4 h-4 drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Global Rank</span>
              {rankLoading ? (
                <Skeleton className="h-5 w-24 mt-1" />
              ) : rankData ? (
                <span className="text-base font-bold text-foreground leading-tight tabular-nums">
                  #{rankData.rank.toLocaleString()} <span className="text-xs text-zinc-600 font-medium">/ {rankData.total_users >= 1000 ? (rankData.total_users / 1000).toFixed(1) + 'k' : rankData.total_users}</span>
                </span>
              ) : (
                <span className="text-sm font-bold text-muted-foreground leading-tight">
                  Unranked
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Percentile</span>
            {rankLoading ? (
              <Skeleton className="h-5 w-16 mt-1" />
            ) : rankData ? (
              <span className="text-sm font-bold text-primary flex items-center gap-1 leading-tight">
                <TrendingUp className="w-3.5 h-3.5" />
                Top {rankData.percentile}%
              </span>
            ) : (
              <span className="text-sm font-bold text-muted-foreground flex items-center gap-1 leading-tight">
                <TrendingUp className="w-3.5 h-3.5 opacity-50" />
                --
              </span>
            )}
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex items-center gap-4 sm:gap-6 flex-col sm:flex-row flex-1",
          compact ? "px-4 pt-4 pb-2" : "px-6 py-5",
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

        {/* ── Difficulty Bars ── */}
        <div className="flex-1 w-full flex flex-col justify-center gap-3.5">
          <DifficultyBar
            label="Easy"
            solved={easySolved}
            total={easyTotal}
            textColor="text-green-500"
            trackBg="bg-green-500/15"
            fillBg="bg-green-500"
            compact={compact}
          />
          <DifficultyBar
            label="Medium"
            solved={mediumSolved}
            total={mediumTotal}
            textColor="text-yellow-500"
            trackBg="bg-yellow-500/15"
            fillBg="bg-yellow-500"
            compact={compact}
          />
          <DifficultyBar
            label="Hard"
            solved={hardSolved}
            total={hardTotal}
            textColor="text-red-500"
            trackBg="bg-red-500/15"
            fillBg="bg-red-500"
            compact={compact}
          />
        </div>
      </div>



    </div>
  );
};
