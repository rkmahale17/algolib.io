import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProgressStatsProps {
  totalSolved: number;
  totalQuestions: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
}

export const ProgressStats = ({
  totalSolved,
  totalQuestions,
  easySolved,
  easyTotal,
  mediumSolved,
  mediumTotal,
  hardSolved,
  hardTotal
}: ProgressStatsProps) => {

    const data = [
        { name: 'Solved', value: totalSolved },
        { name: 'Remaining', value: totalQuestions - totalSolved }
    ];

    const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

  return (
    <div className="p-5">
        <div className="flex flex-col gap-6">
            {/* Circular Chart */}
            <div className="h-40 w-full relative flex justify-center">
                <ResponsiveContainer width={160} height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <Label 
                                value={`${totalSolved}`} 
                                position="center" 
                                className="fill-foreground text-2xl font-bold"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-8">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Solved</span>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-green-600 dark:text-green-500">Easy</span>
                        <span className="text-muted-foreground">{easySolved} / {easyTotal}</span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${(easySolved/easyTotal)*100 || 0}%` }} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-yellow-600 dark:text-yellow-500">Medium</span>
                        <span className="text-muted-foreground">{mediumSolved} / {mediumTotal}</span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full transition-all duration-1000" style={{ width: `${(mediumSolved/mediumTotal)*100 || 0}%` }} />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-red-600 dark:text-red-500">Hard</span>
                        <span className="text-muted-foreground">{hardSolved} / {hardTotal}</span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${(hardSolved/hardTotal)*100 || 0}%` }} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
