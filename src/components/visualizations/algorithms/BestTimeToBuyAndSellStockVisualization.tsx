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

  const code = `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;
  
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i];
    } else {
      maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
  }
  
  return maxProfit;
}`;

  const generateSteps = () => {
    const prices = [7, 1, 5, 3, 6, 4];
    const newSteps: Step[] = [];
    let minPrice = Infinity;
    let maxProfit = 0;
    let minIndex = -1;

    newSteps.push({
      array: [...prices],
      highlights: [],
      minIndex: -1,
      currentIndex: -1,
      variables: { minPrice: '∞', maxProfit: 0, i: '-' },
      explanation: 'Initialize: minPrice = ∞, maxProfit = 0',
      lineNumber: 1
    });

    for (let i = 0; i < prices.length; i++) {
      newSteps.push({
        array: [...prices],
        highlights: [i],
        minIndex,
        currentIndex: i,
        variables: { i, 'prices[i]': prices[i], minPrice: minPrice === Infinity ? '∞' : minPrice, maxProfit },
        explanation: `i=${i}: Check prices[${i}]=${prices[i]}`,
        lineNumber: 5
      });

      if (prices[i] < minPrice) {
        minPrice = prices[i];
        minIndex = i;
        newSteps.push({
          array: [...prices],
          highlights: [i],
          minIndex: i,
          currentIndex: i,
          variables: { i, 'prices[i]': prices[i], minPrice, maxProfit, action: 'Update minPrice' },
          explanation: `prices[${i}]=${prices[i]} < minPrice. Update minPrice = ${minPrice}`,
          lineNumber: 6
        });
      } else {
        const profit = prices[i] - minPrice;
        const oldMaxProfit = maxProfit;
        maxProfit = Math.max(maxProfit, profit);
        newSteps.push({
          array: [...prices],
          highlights: [minIndex, i],
          minIndex,
          currentIndex: i,
          variables: { i, profit, oldMaxProfit, newMaxProfit: maxProfit },
          explanation: `Profit = prices[${i}] - minPrice = ${prices[i]} - ${minPrice} = ${profit}. MaxProfit = max(${oldMaxProfit}, ${profit}) = ${maxProfit}`,
          lineNumber: 8
        });
      }
    }

    newSteps.push({
      array: [...prices],
      highlights: [],
      minIndex,
      currentIndex: -1,
      variables: { result: maxProfit },
      explanation: `Complete! Maximum profit = ${maxProfit}`,
      lineNumber: 12
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
                const isMin = idx === currentStep.minIndex;
                const isCurrent = idx === currentStep.currentIndex;
                const isHighlighted = currentStep.highlights.includes(idx);
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[50px] relative">
                    {isMin && <div className="absolute -top-6 text-xs font-bold text-green-500">BUY</div>}
                    {isCurrent && idx !== currentStep.minIndex && <div className="absolute -top-6 text-xs font-bold text-blue-500">SELL</div>}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isHighlighted
                          ? 'bg-primary shadow-lg shadow-primary/50'
                          : 'bg-muted/60'
                      }`}
                      style={{ height: `${(value / maxPrice) * 100}%`, minHeight: '20px' }}
                    />
                    <span className="text-xs font-mono">${value}</span>
                    <span className="text-xs text-muted-foreground">D{idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm">Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Track minimum price seen so far</p>
              <p>• At each day, calculate profit if we sell today</p>
              <p>• Keep track of maximum profit</p>
              <p>• Time: O(n), Space: O(1)</p>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>
    </div>
  );
};
