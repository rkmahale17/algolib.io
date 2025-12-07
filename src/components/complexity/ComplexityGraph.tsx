
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ComplexityGraphProps {
  data: { n: number; steps: number }[];
  color: string;
}

const ComplexityGraph: React.FC<ComplexityGraphProps> = ({ data, color }) => {
  return (
    <div className="h-48 w-full mt-4 bg-background/50 rounded-lg p-2 border">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis 
            dataKey="n" 
            tick={{ fontSize: 10 }} 
            interval="preserveStartEnd"
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
            itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          />
          <Line 
            type="monotone" 
            dataKey="steps" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComplexityGraph;
