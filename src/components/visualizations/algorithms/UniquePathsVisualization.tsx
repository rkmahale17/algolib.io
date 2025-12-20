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
      grid: [[0, 0, 0], [0, 0, 0], [1, 1, 1]],
      row: 2,
      col: -1,
      m,
      n,
      variables: { m: 3, n: 3, row: '[1,1,1]' },
      explanation: "Initialize 'row' with 1s (representing the bottom row). There is only 1 way to reach the destination from any cell in the last row (move right).",
      highlightedLines: [3],
      lineExecution: "let row: number[] = new Array(n).fill(1);"
    },
    {
      grid: [[0, 0, 0], [1, 1, 1], [1, 1, 1]],
      row: 1,
      col: -1,
      m,
      n,
      variables: { i: 0, newRow: '[1,1,1]' },
      explanation: "Start building upwards (i=0). Initialize 'newRow' with 1s (representing row m-2). The last column always has 1 path (move down).",
      highlightedLines: [7],
      lineExecution: "const newRow: number[] = new Array(n).fill(1);"
    },
    {
      grid: [[0, 0, 0], [1, 2, 1], [1, 1, 1]],
      row: 1,
      col: 1,
      m,
      n,
      variables: { j: 1, i: 0, 'newRow[1]': 2, calc: '1 (right) + 1 (down)' },
      explanation: "Calculate paths for cell (1,1). Sum of right neighbor (newRow[2]) and down neighbor (row[1]). 1 + 1 = 2.",
      highlightedLines: [11],
      lineExecution: "newRow[j] = newRow[j + 1] + row[j]; // 1 + 1 = 2"
    },
    {
      grid: [[0, 0, 0], [3, 2, 1], [1, 1, 1]],
      row: 1,
      col: 0,
      m,
      n,
      variables: { j: 0, i: 0, 'newRow[0]': 3, calc: '2 (right) + 1 (down)' },
      explanation: "Calculate paths for cell (1,0). Sum of right neighbor (newRow[1]) and down neighbor (row[0]). 2 + 1 = 3.",
      highlightedLines: [11],
      lineExecution: "newRow[j] = newRow[j + 1] + row[j]; // 2 + 1 = 3"
    },
    {
      grid: [[0, 0, 0], [3, 2, 1], [1, 1, 1]],
      row: 1,
      col: -1,
      m,
      n,
      variables: { row: '[3,2,1]' },
      explanation: "Row complete. Update 'row' to be the newly calculated 'newRow'. We now move one step up.",
      highlightedLines: [14],
      lineExecution: "row = newRow; // [3, 2, 1]"
    },
    {
      grid: [[1, 1, 1], [3, 2, 1], [1, 1, 1]],
      row: 0,
      col: -1,
      m,
      n,
      variables: { i: 1, newRow: '[1,1,1]' },
      explanation: "Next iteration (i=1). Initialize 'newRow' with 1s (representing row 0).",
      highlightedLines: [7],
      lineExecution: "const newRow: number[] = new Array(n).fill(1);"
    },
    {
      grid: [[1, 2, 1], [3, 2, 1], [1, 1, 1]],
      row: 0,
      col: 1,
      m,
      n,
      variables: { j: 1, i: 1, 'newRow[1]': 3, calc: '1 (right) + 2 (down)' },
      explanation: "Calculate paths for cell (0,1). Right (newRow[2]=1) + Down (row[1]=2). 1 + 2 = 3.",
      highlightedLines: [11],
      lineExecution: "newRow[j] = newRow[j + 1] + row[j]; // 1 + 2 = 3"
    },
    {
      grid: [[6, 2, 1], [3, 2, 1], [1, 1, 1]],
      row: 0,
      col: 0,
      m,
      n,
      variables: { j: 0, i: 1, 'newRow[0]': 6, calc: '3 (right) + 3 (down)' },
      explanation: "Calculate paths for cell (0,0). Right (newRow[1]=3) + Down (row[0]=3). 3 + 3 = 6.",
      highlightedLines: [11],
      lineExecution: "newRow[j] = newRow[j + 1] + row[j]; // 3 + 3 = 6"
    },
    {
      grid: [[6, 2, 1], [3, 2, 1], [1, 1, 1]],
      row: 0,
      col: 0,
      m,
      n,
      variables: { result: 6 },
      explanation: "All rows processed. The first element of the current 'row' contains the total unique paths starting from (0,0).",
      highlightedLines: [17],
      lineExecution: "return row[0]; // 6"
    }
  ];

  const code = `function uniquePaths(m: number, n: number): number {
    // Last row has only one way to reach destination
    let row: number[] = new Array(n).fill(1);

    // Build rows upward
    for (let i = 0; i < m - 1; i++) {
        const newRow: number[] = new Array(n).fill(1);

        // Fill from right to left
        for (let j = n - 2; j >= 0; j--) {
            newRow[j] = newRow[j + 1] + row[j];
        }

        row = newRow;
    }

    return row[0];
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
              <h3 className="text-sm font-semibold mb-3">Grid (Values propagate Up & Left)</h3>
              {step.grid.length > 0 && (
                <>
                  <div className="inline-block border-2 border-border rounded">
                    {step.grid.map((row, i) => (
                      <div key={i} className="flex">
                        {row.map((val, j) => (
                          <div
                            key={j}
                            className={`w-20 h-20 border border-border flex items-center justify-center text-2xl font-bold ${
                              // Highlight logic
                              i === step.row && j === step.col
                                ? 'bg-primary text-primary-foreground scale-105 transition-transform' // Current target
                                : (i === step.row && j === step.col + 1) || (i === step.row + 1 && j === step.col)
                                ? 'bg-secondary border-primary/50' // Dependencies
                                : val > 0 && i >= step.row // Filled/Active rows
                                ? 'bg-muted'
                                : 'opacity-40' // Unvisited/Irrelevant
                            }`}
                          >
                            {val > 0 ? val : ''}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                     <p>We only store 'row' (bottom) and 'newRow' (current) in implementation.</p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>

          {/* Execution & Variables Panels */}
          <motion.div
            key={`execution-${currentStep}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4"
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
             key={`variables-${currentStep}`}
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.3, delay: 0.4 }}
             className="mt-4"
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
