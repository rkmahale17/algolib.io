import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { cn } from "@/lib/utils";

interface ProgressStatsProps {
    totalSolved: number;
    totalQuestions: number;
    easySolved: number;
    easyTotal: number;
    mediumSolved: number;
    mediumTotal: number;
    hardSolved: number;
    hardTotal: number;
    variant?: 'horizontal' | 'vertical';
}

export const ProgressStats = ({
    totalSolved,
    totalQuestions,
    easySolved,
    easyTotal,
    mediumSolved,
    mediumTotal,
    hardSolved,
    hardTotal,
    variant = 'horizontal'
}: ProgressStatsProps) => {

    const safeTotal = Math.max(1, totalQuestions);

    // 6-segment data for the proportional circle
    // Each difficulty is represented by its total count, split into solved/remaining
    const data = [
        { name: 'Easy Solved', value: easySolved, color: 'rgb(34 197 94)' }, // bg-green-500
        { name: 'Easy Remaining', value: Math.max(0, easyTotal - easySolved), color: 'rgba(34, 197, 94, 0.15)' },
        { name: 'Medium Solved', value: mediumSolved, color: 'rgb(245 158 11)' }, // bg-amber-500
        { name: 'Medium Remaining', value: Math.max(0, mediumTotal - mediumSolved), color: 'rgba(245, 158, 11, 0.15)' },
        { name: 'Hard Solved', value: hardSolved, color: 'rgb(239 68 68)' }, // bg-red-500
        { name: 'Hard Remaining', value: Math.max(0, hardTotal - hardSolved), color: 'rgba(239, 68, 68, 0.15)' },
    ].filter(segment => segment.value > 0);

    const isVertical = variant === 'vertical';

    return (
        <div className={cn(isVertical ? "p-6" : "p-3")}>
            <div className={cn("flex gap-6", isVertical ? "flex-col items-center" : "items-center")}>
                {/* Segmented Circular Chart */}
                <div className={cn("shrink-0 relative flex justify-center", isVertical ? "h-36 w-36" : "h-24 w-24")}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={isVertical ? 48 : 32}
                                outerRadius={isVertical ? 62 : 44}
                                fill="#8884d8"
                                paddingAngle={1}
                                dataKey="value"
                                stroke="none"
                                startAngle={90}
                                endAngle={-270}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label
                                    content={({ viewBox }) => {
                                        const { cx, cy } = viewBox as any;
                                        return (
                                            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={cx} dy="-0.15em" className={cn("fill-foreground font-bold tracking-tight", isVertical ? "text-[28px]" : "text-[18px]")}>
                                                    {totalSolved}
                                                </tspan>
                                                <tspan x={cx} dy="1.4em" className={cn("fill-muted-foreground font-medium tracking-widest", isVertical ? "text-[10px]" : "text-[8px]")}>
                                                    SOLVED
                                                </tspan>
                                            </text>
                                        );
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Proportional Breakdown */}
                <div className={cn("flex-1", isVertical ? "w-full mt-2" : "w-full")}>
                    <div className="flex justify-between items-end mb-3">
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-green-500 font-semibold text-[10px] uppercase tracking-wider">Easy</span>
                                <span className="text-[13px] font-bold">{easySolved}<span className="text-muted-foreground/50 font-medium">/{easyTotal}</span></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-amber-500 font-semibold text-[10px] uppercase tracking-wider">Med</span>
                                <span className="text-[13px] font-bold">{mediumSolved}<span className="text-muted-foreground/50 font-medium">/{mediumTotal}</span></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-red-500 font-semibold text-[10px] uppercase tracking-wider">Hard</span>
                                <span className="text-[13px] font-bold">{hardSolved}<span className="text-muted-foreground/50 font-medium">/{hardTotal}</span></span>
                            </div>
                        </div>
                        {isVertical && (
                            <div className="text-right">
                                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Overall</div>
                                <div className="text-xl font-bold leading-none">{Math.round((totalSolved / safeTotal) * 100)}%</div>
                            </div>
                        )}
                    </div>

                    {/* Proportional Stacked Bar */}
                    <div className="h-3 w-full bg-muted/20 rounded-full flex overflow-hidden border border-border/5">
                        <div className="h-full bg-green-500 transition-all duration-1000" style={{ width: `${(easySolved / safeTotal) * 100}%` }} />
                        <div className="h-full bg-green-500/15 transition-all duration-1000" style={{ width: `${((easyTotal - easySolved) / safeTotal) * 100}%` }} />
                        <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(mediumSolved / safeTotal) * 100}%` }} />
                        <div className="h-full bg-amber-500/15 transition-all duration-1000" style={{ width: `${((mediumTotal - mediumSolved) / safeTotal) * 100}%` }} />
                        <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(hardSolved / safeTotal) * 100}%` }} />
                        <div className="h-full bg-red-500/15 transition-all duration-1000" style={{ width: `${((hardTotal - hardSolved) / safeTotal) * 100}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
};


