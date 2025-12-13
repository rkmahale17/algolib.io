import { useEffect, useRef, useState } from 'react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  highlights: number[];
  minIndex: number;
  currentIndex: number;
  variables: Record<string, any>;
  explanation: string;
  lineNumber: number;
}

export const BestTimeToBuyAndSellStockVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function maxProfit(prices: number[]): number  {
  let l = 0;
  let r = 1;
  let maxProfit = 0;
  
  while(r < prices.length){
    if(prices[l] < prices[r]){
      maxProfit = Math.max(maxProfit, prices[r] - prices[l]);
    } else {
      l = r;
    }
    r = r + 1; 
  }
  return maxProfit;
}`;

  const generateSteps = () => {
    const prices = [7, 1, 5, 3, 6, 4];
    const newSteps: Step[] = [];
    
    let l = 0;
    let r = 1;
    let maxProfit = 0;

    // Initialization step
    newSteps.push({
      array: [...prices],
      highlights: [l, r],
      minIndex: l, // reusing minIndex for l for rendering convenience if needed, but we'll use specific l/r checks
      currentIndex: r,
      variables: { l, r, maxProfit },
      explanation: 'Initialize pointers: l = 0, r = 1, maxProfit = 0',
      lineNumber: 2
    });

    while (r < prices.length) {
      newSteps.push({
        array: [...prices],
        highlights: [l, r],
        minIndex: l,
        currentIndex: r,
        variables: { l, r, maxProfit, 'prices[l]': prices[l], 'prices[r]': prices[r] },
        explanation: `Check if prices[l] (${prices[l]}) < prices[r] (${prices[r]})`,
        lineNumber: 6
      });

      if (prices[l] < prices[r]) {
        const profit = prices[r] - prices[l];
        const oldMaxProfit = maxProfit;
        maxProfit = Math.max(maxProfit, profit);
        
        newSteps.push({
          array: [...prices],
          highlights: [l, r],
          minIndex: l,
          currentIndex: r,
          variables: { l, r, maxProfit, profit },
          explanation: `prices[l] < prices[r], so calculate profit: ${prices[r]} - ${prices[l]} = ${profit}. Update maxProfit = max(${oldMaxProfit}, ${profit}) = ${maxProfit}`,
          lineNumber: 8
        });
      } else {
        l = r;
        newSteps.push({
          array: [...prices],
          highlights: [l, r],
          minIndex: l,
          currentIndex: r,
          variables: { l, r, maxProfit },
          explanation: `prices[l] >= prices[r], so move left pointer l to r (${r})`,
          lineNumber: 11
        });
      }

      r = r + 1;
      if (r < prices.length) {
         newSteps.push({
          array: [...prices],
          highlights: [l, r],
          minIndex: l,
          currentIndex: r,
          variables: { l, r, maxProfit },
          explanation: `Increment r to ${r}`,
          lineNumber: 14
        });
      }
    }

    newSteps.push({
      array: [...prices],
      highlights: [],
      minIndex: -1,
      currentIndex: -1,
      variables: { maxProfit },
      explanation: `Loop finished. Return maxProfit = ${maxProfit}`,
      lineNumber: 17
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const maxPrice = Math.max(...currentStep.array);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="flex items-end justify-center gap-2 h-48">
              {currentStep.array.map((value, idx) => {
                // In our generated steps variables: 
                // l is stored in variables.l
                // r is stored in variables.r
                const l = currentStep.variables.l;
                const r = currentStep.variables.r;
                
                const isL = idx === l;
                const isR = idx === r;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[50px] relative">
                    {isL && <div className="absolute -top-6 text-xs font-bold text-green-500">L</div>}
                    {isR && <div className="absolute -top-6 text-xs font-bold text-blue-500">R</div>}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                         isL || isR
                          ? 'bg-primary shadow-lg shadow-primary/50'
                          : 'bg-muted/60'
                      }`}
                      style={{ height: `${(value / maxPrice) * 100}%`, minHeight: '20px' }}
                    />
                    <span className="text-xs font-mono">${value}</span>
                    <span className="text-xs text-muted-foreground">{idx}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm">Strategy: Sliding Window / Two Pointers</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Initialize Left (buy) at 0 and Right (sell) at 1</p>
              <p>• Determine if strictly profitable (prices[l] &lt; prices[r])</p>
              <p>• If profitable, update maxProfit (prices[r] - prices[l])</p>
              <p>• If not profitable, move Left pointer to Right</p>
              <p>• Always increment Right pointer</p>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>
    </div>
  );
};
