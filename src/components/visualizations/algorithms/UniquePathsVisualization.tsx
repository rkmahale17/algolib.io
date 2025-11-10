import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion } from 'framer-motion';

interface Step {
  grid: number[][];
  row: number;
  col: number;
  m: number;
  n: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
}

export const UniquePathsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const m = 3;
  const n = 3;

  const steps: Step[] = [
    {
      grid: [],
      row: -1,
      col: -1,
      m,
      n,
      variables: { m: 3, n: 3 },
      explanation: "3×3 grid. Find unique paths from top-left (0,0) to bottom-right (2,2). Can only move right or down.",
      highlightedLines: [1],
      lineExecution: "function uniquePaths(m: number, n: number): number"
    },
    {
      grid: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      row: -1,
      col: -1,
      m,
      n,
      variables: { gridSize: '3×3' },
      explanation: "Create m×n DP grid initialized with 0. dp[i][j] = number of paths to reach cell (i,j).",
      highlightedLines: [2],
      lineExecution: "const dp: number[][] = Array(m).fill(0).map(() => Array(n).fill(0));"
    },
    {
      grid: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      row: 0,
      col: 0,
      m,
      n,
      variables: { i: 0 },
      explanation: "Start first row loop: i = 0. Check: 0 < 3? Yes.",
      highlightedLines: [4],
      lineExecution: "for (let i = 0; i < m; i++) // i=0"
    },
    {
      grid: [[1, 0, 0], [0, 0, 0], [0, 0, 0]],
      row: 0,
      col: 0,
      m,
      n,
      variables: { 'dp[0][0]': 1 },
      explanation: "First column: dp[0][0] = 1. Only 1 way to reach any cell in first column (move down).",
      highlightedLines: [4],
      lineExecution: "dp[i][0] = 1; // dp[0][0] = 1"
    },
    {
      grid: [[1, 0, 0], [1, 0, 0], [0, 0, 0]],
      row: 1,
      col: 0,
      m,
      n,
      variables: { i: 1 },
      explanation: "i=1: dp[1][0] = 1. Continue filling first column.",
      highlightedLines: [4],
      lineExecution: "dp[1][0] = 1;"
    },
    {
      grid: [[1, 0, 0], [1, 0, 0], [1, 0, 0]],
      row: 2,
      col: 0,
      m,
      n,
      variables: { i: 2 },
      explanation: "i=2: dp[2][0] = 1. First column complete.",
      highlightedLines: [4],
      lineExecution: "dp[2][0] = 1;"
    },
    {
      grid: [[1, 0, 0], [1, 0, 0], [1, 0, 0]],
      row: 0,
      col: 0,
      m,
      n,
      variables: { j: 0 },
      explanation: "Start first row loop: j = 0. Check: 0 < 3? Yes.",
      highlightedLines: [5],
      lineExecution: "for (let j = 0; j < n; j++) // j=0"
    },
    {
      grid: [[1, 1, 0], [1, 0, 0], [1, 0, 0]],
      row: 0,
      col: 1,
      m,
      n,
      variables: { 'dp[0][1]': 1 },
      explanation: "First row: dp[0][1] = 1. Only 1 way to reach any cell in first row (move right).",
      highlightedLines: [5],
      lineExecution: "dp[0][j] = 1; // dp[0][1] = 1"
    },
    {
      grid: [[1, 1, 1], [1, 0, 0], [1, 0, 0]],
      row: 0,
      col: 2,
      m,
      n,
      variables: { j: 2 },
      explanation: "j=2: dp[0][2] = 1. First row complete.",
      highlightedLines: [5],
      lineExecution: "dp[0][2] = 1;"
    },
    {
      grid: [[1, 1, 1], [1, 0, 0], [1, 0, 0]],
      row: 1,
      col: 1,
      m,
      n,
      variables: { i: 1, j: 1 },
      explanation: "Now fill inner cells. Start at (1,1). Paths = from_top + from_left.",
      highlightedLines: [7, 8],
      lineExecution: "for (let i = 1; i < m; i++) for (let j = 1; j < n; j++)"
    },
    {
      grid: [[1, 1, 1], [1, 2, 0], [1, 0, 0]],
      row: 1,
      col: 1,
      m,
      n,
      variables: { 'dp[1][1]': 2, calc: '1+1=2' },
      explanation: "dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2. Two paths to reach (1,1).",
      highlightedLines: [9],
      lineExecution: "dp[i][j] = dp[i-1][j] + dp[i][j-1]; // 1+1 = 2"
    },
    {
      grid: [[1, 1, 1], [1, 2, 3], [1, 0, 0]],
      row: 1,
      col: 2,
      m,
      n,
      variables: { 'dp[1][2]': 3, calc: '1+2=3' },
      explanation: "dp[1][2] = dp[0][2] + dp[1][1] = 1 + 2 = 3. Three paths to reach (1,2).",
      highlightedLines: [9],
      lineExecution: "dp[i][j] = dp[i-1][j] + dp[i][j-1]; // 1+2 = 3"
    },
    {
      grid: [[1, 1, 1], [1, 2, 3], [1, 3, 0]],
      row: 2,
      col: 1,
      m,
      n,
      variables: { 'dp[2][1]': 3, calc: '2+1=3' },
      explanation: "dp[2][1] = dp[1][1] + dp[2][0] = 2 + 1 = 3. Three paths to reach (2,1).",
      highlightedLines: [9],
      lineExecution: "dp[i][j] = dp[i-1][j] + dp[i][j-1]; // 2+1 = 3"
    },
    {
      grid: [[1, 1, 1], [1, 2, 3], [1, 3, 6]],
      row: 2,
      col: 2,
      m,
      n,
      variables: { 'dp[2][2]': 6, calc: '3+3=6' },
      explanation: "dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6. Six paths to reach bottom-right!",
      highlightedLines: [9],
      lineExecution: "dp[i][j] = dp[i-1][j] + dp[i][j-1]; // 3+3 = 6"
    },
    {
      grid: [[1, 1, 1], [1, 2, 3], [1, 3, 6]],
      row: 3,
      col: 0,
      m,
      n,
      variables: { i: 3, m: 3 },
      explanation: "Check outer loop: i = 3 < 3? No, exit loop.",
      highlightedLines: [7],
      lineExecution: "for (let i = 3; i < m; i++) // 3 < 3 -> false"
    },
    {
      grid: [[1, 1, 1], [1, 2, 3], [1, 3, 6]],
      row: 2,
      col: 2,
      m,
      n,
      variables: { result: 6, 'dp[m-1][n-1]': 6 },
      explanation: "Return dp[m-1][n-1] = dp[2][2] = 6. Six unique paths from top-left to bottom-right.",
      highlightedLines: [12],
      lineExecution: "return dp[m-1][n-1]; // dp[2][2] = 6"
    },
    {
      grid: [[1, 1, 1], [1, 2, 3], [1, 3, 6]],
      row: 2,
      col: 2,
      m,
      n,
      variables: { uniquePaths: 6, complexity: 'O(m×n)' },
      explanation: "Algorithm complete! 6 unique paths. Each cell's value = sum of top + left neighbors. Time: O(m×n), Space: O(m×n).",
      highlightedLines: [12],
      lineExecution: "Result: 6 unique paths"
    }
  ];

  const code = `function uniquePaths(m: number, n: number): number {
  const dp: number[][] = Array(m).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
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
          <motion.div
            key={`grid-${currentStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Grid (paths to reach each cell)</h3>
              {step.grid.length > 0 && (
                <>
                  <div className="inline-block border-2 border-border rounded">
                    {step.grid.map((row, i) => (
                      <div key={i} className="flex">
                        {row.map((val, j) => (
                          <div
                            key={j}
                            className={`w-20 h-20 border border-border flex items-center justify-center text-2xl font-bold ${
                              i === 0 && j === 0
                                ? 'bg-green-500/30'
                                : i === step.grid.length - 1 && j === step.grid[0].length - 1
                                ? 'bg-red-500/30'
                                : i === step.row && j === step.col
                                ? 'bg-primary text-primary-foreground'
                                : val > 0
                                ? 'bg-secondary'
                                : 'bg-muted'
                            }`}
                          >
                            {val > 0 ? val : ''}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-green-500/30 border border-border"></div> Start
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-red-500/30 border border-border"></div> End
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>

          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="p-4 bg-muted/50">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-primary">Current Execution:</div>
                <div className="text-sm font-mono bg-background/50 p-2 rounded">
                  {step.lineExecution}
                </div>
                <div className="text-sm text-muted-foreground pt-2">
                  {step.explanation}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`pattern-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="p-4 bg-blue-500/10">
              <h3 className="font-semibold mb-2 text-sm">Pattern:</h3>
              <div className="text-xs text-muted-foreground">
                Each cell's path count = paths from top + paths from left.<br />
                First row and first column always have 1 path (straight line).
              </div>
            </Card>
          </motion.div>

          <motion.div
            key={`variables-${currentStep}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <VariablePanel variables={step.variables} />
          </motion.div>
        </>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
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
