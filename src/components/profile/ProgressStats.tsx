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
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
            {/* Circular Chart */}
            <div className="h-32 w-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={50}
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
                                className="fill-foreground text-xl font-bold"
                            />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-6">
                    <span className="text-[10px] text-muted-foreground">Solved</span>
                </div>
            </div>

            {/* Breakdown */}
            <div className="flex-1 space-y-3">
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-green-500 font-medium">Easy</span>
                        <span className="text-muted-foreground">{easySolved} / {easyTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${(easySolved/easyTotal)*100}%` }} />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-yellow-500 font-medium">Medium</span>
                        <span className="text-muted-foreground">{mediumSolved} / {mediumTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(mediumSolved/mediumTotal)*100}%` }} />
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-red-500 font-medium">Hard</span>
                        <span className="text-muted-foreground">{hardSolved} / {hardTotal}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${(hardSolved/hardTotal)*100}%` }} />
                    </div>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};
