interface SimpleArrayVisualizationProps {
  array: (number | string)[];
  highlights: number[];
  label: string;
}

export const SimpleArrayVisualization = ({ array, highlights, label }: SimpleArrayVisualizationProps) => {
  const maxValue = Math.max(...array.map(v => typeof v === 'number' ? v : 0));
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-center">{label}</div>
      <div className="flex items-end justify-center gap-2 h-48 px-4">
        {array.map((value, index) => {
          const isHighlighted = highlights.includes(index);
          const height = typeof value === 'number' ? (value / maxValue) * 100 : 50;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[80px] flex-wrap">
              <div
                className={`w-full rounded-t transition-all duration-300 flex items-end justify-center pb-2 ${
                  isHighlighted ? 'bg-primary' : 'bg-muted'
                }`}
                style={{ height: `${height}%`, minHeight: '40px' }}
              >
                <span className={`text-sm font-bold ${isHighlighted ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {value}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">[{index}]</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
