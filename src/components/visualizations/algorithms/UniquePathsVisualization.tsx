import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VisualizationLayout } from '../shared/VisualizationLayout';

export const UniquePathsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const m = 3, n = 3;
  
  const steps = [
    {
      grid: [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0]
      ],
      current: [0, 0],
      explanation: "3×3 grid. Robot at (0,0), target (2,2). Can only move right or down. Count unique paths.",
      highlightedLine: 2
    },
    {
      grid: [
        [1, 1, 1],
        [1, 2, 0],
        [1, 0, 0]
      ],
      current: [1, 1],
      explanation: "dp[1][1] = dp[0][1] + dp[1][0] = 1+1 = 2. Two paths to reach (1,1).",
      highlightedLine: 7
    },
    {
      grid: [
        [1, 1, 1],
        [1, 2, 3],
        [1, 0, 0]
      ],
      current: [1, 2],
      explanation: "dp[1][2] = dp[0][2] + dp[1][1] = 1+2 = 3. Three paths to reach (1,2).",
      highlightedLine: 7
    },
    {
      grid: [
        [1, 1, 1],
        [1, 2, 3],
        [1, 3, 0]
      ],
      current: [2, 1],
      explanation: "dp[2][1] = dp[1][1] + dp[2][0] = 2+1 = 3. Three paths to reach (2,1).",
      highlightedLine: 7
    },
    {
      grid: [
        [1, 1, 1],
        [1, 2, 3],
        [1, 3, 6]
      ],
      current: [2, 2],
      explanation: "dp[2][2] = dp[1][2] + dp[2][1] = 3+3 = 6. Six unique paths! Time: O(m×n), Space: O(m×n).",
      highlightedLine: 10
    }
  ];

  const code = `function uniquePaths(m: number, n: number): number {
  // Create DP table
  const dp: number[][] = Array(m).fill(0).map(() => Array(n).fill(1));
  
  // Fill DP table
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      // Paths from top + paths from left
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
    }
  }
  
  return dp[m-1][n-1];
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <>
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Unique Paths</h3>
              
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-2">
                  {step.grid.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((cell, j) => (
                        <div key={j} className={`w-16 h-16 rounded flex items-center justify-center font-bold text-lg ${
                          i === step.current[0] && j === step.current[1]
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                            : i === 0 && j === 0
                              ? 'bg-green-500/20 text-green-700'
                              : i === m-1 && j === n-1
                                ? 'bg-red-500/20 text-red-700'
                                : cell === 0
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-secondary/20'
                        }`}>
                          {cell || ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500/20 rounded"></div>
                    <span>Start</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-500/20 rounded"></div>
                    <span>End</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Current</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-center p-4 bg-muted/50 rounded">
                {step.explanation}
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded">
                <strong>Pattern:</strong> paths(i,j) = paths(i-1,j) + paths(i,j-1). Can only come from top or left.
              </div>
            </div>
          </Card>
          <VariablePanel variables={{ row: step.current[0], col: step.current[1], paths: step.grid[step.current[0]][step.current[1]] }} />
        </>
      }
      rightContent={
        <CodeHighlighter
          code={code}
          highlightedLine={step.highlightedLine}
          language="TypeScript"
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
