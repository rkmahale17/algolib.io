import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  dp: number[][];
  i: number;
  w: number;
  value: number;
  message: string;
  lineNumber: number;
}

export const KnapsackVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(0)
    .map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(
          values[i-1] + dp[i-1][w - weights[i-1]],
          dp[i-1][w]
        );
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`;

  const generateSteps = () => {
    const weights = [2, 3, 4];
    const values = [3, 4, 5];
    const capacity = 5;
    const n = weights.length;
    
    const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
    const newSteps: Step[] = [];

    newSteps.push({
      dp: dp.map(row => [...row]),
      i: 0,
      w: 0,
      value: 0,
      message: 'Initialize DP table with zeros',
      lineNumber: 3
    });

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        if (weights[i-1] <= w) {
          const include = values[i-1] + dp[i-1][w - weights[i-1]];
          const exclude = dp[i-1][w];
          dp[i][w] = Math.max(include, exclude);
          
          newSteps.push({
            dp: dp.map(row => [...row]),
            i,
            w,
            value: dp[i][w],
            message: `Item ${i-1} (wt=${weights[i-1]}, val=${values[i-1]}): Include(${include}) vs Exclude(${exclude}) = ${dp[i][w]}`,
            lineNumber: 9
          });
        } else {
          dp[i][w] = dp[i-1][w];
          newSteps.push({
            dp: dp.map(row => [...row]),
            i,
            w,
            value: dp[i][w],
            message: `Item ${i-1} too heavy for capacity ${w}, skip`,
            lineNumber: 14
          });
        }
      }
    }

    newSteps.push({
      dp: dp.map(row => [...row]),
      i: n,
      w: capacity,
      value: dp[n][capacity],
      message: `Maximum value: ${dp[n][capacity]}`,
      lineNumber: 19
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">DP Table</h3>
          <div className="inline-block min-w-full">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted">i/w</th>
                  {currentStep.dp[0].map((_, w) => (
                    <th key={w} className="border border-border p-2 bg-muted">{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStep.dp.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-border p-2 bg-muted font-semibold">{i}</td>
                    {row.map((val, w) => (
                      <td
                        key={w}
                        className={`border border-border p-2 text-center transition-all ${
                          i === currentStep.i && w === currentStep.w
                            ? 'bg-primary/20 font-bold'
                            : val > 0
                            ? 'bg-green-500/10'
                            : ''
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          item: currentStep.i - 1,
          capacity: currentStep.w,
          maxValue: currentStep.value
        }}
      />
    </div>
  );
};
