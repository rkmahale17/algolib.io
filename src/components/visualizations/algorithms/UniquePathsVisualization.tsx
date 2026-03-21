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
}

export const UniquePathsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const m = 3;
  const n = 3;

  const steps: Step[] = [
    {
      grid: [[0, 0, 0], [0, 0, 0], [1, 1, 1]],
      row: 2, col: -1, m, n,
      variables: { m, n, row: '[1,1,1]' },
      explanation: "Initialize the base row with 1s. From any cell in the last row, there is only 1 path to the destination (by moving right).",
      highlightedLines: [2]
    },
    {
      grid: [[0, 0, 0], [0, 0, 0], [1, 1, 1]],
      row: -1, col: -1, m, n,
      variables: { i: 0 },
      explanation: "Start iterating through the rows from bottom to top.",
      highlightedLines: [4]
    },
    {
      grid: [[0, 0, 0], [1, 1, 1], [1, 1, 1]],
      row: 1, col: -1, m, n,
      variables: { i: 0, newRow: '[1,1,1]' },
      explanation: "Initialize the current row (newRow) with 1s. The last cell of every row always has 1 path (by moving down).",
      highlightedLines: [5]
    },
    {
      grid: [[0, 0, 0], [1, 2, 1], [1, 1, 1]],
      row: 1, col: 1, m, n,
      variables: { i: 0, j: 1, 'newRow[1]': 2, 'calc': 'newRow[2] + row[1] = 1 + 1' },
      explanation: "Calculate paths for (1, 1): sum of paths from cell to the right and cell below.",
      highlightedLines: [8]
    },
    {
      grid: [[0, 0, 0], [3, 2, 1], [1, 1, 1]],
      row: 1, col: 0, m, n,
      variables: { i: 0, j: 0, 'newRow[0]': 3, 'calc': 'newRow[1] + row[0] = 2 + 1' },
      explanation: "Calculate paths for (1, 0): sum of paths from cell to the right (2) and cell below (1).",
      highlightedLines: [8]
    },
    {
      grid: [[0, 0, 0], [3, 2, 1], [1, 1, 1]],
      row: 1, col: -1, m, n,
      variables: { row: '[3,2,1]' },
      explanation: "Current row processed. Update 'row' for the next iteration.",
      highlightedLines: [11]
    },
    {
      grid: [[1, 1, 1], [3, 2, 1], [1, 1, 1]],
      row: 0, col: -1, m, n,
      variables: { i: 1, newRow: '[1,1,1]' },
      explanation: "Start next row (i = 1).",
      highlightedLines: [5]
    },
    {
      grid: [[1, 3, 1], [3, 2, 1], [1, 1, 1]],
      row: 0, col: 1, m, n,
      variables: { i: 1, j: 1, 'newRow[1]': 3, 'calc': 'newRow[2] + row[1] = 1 + 2' },
      explanation: "Calculate paths for (0, 1): 1 (right) + 2 (down) = 3.",
      highlightedLines: [8]
    },
    {
      grid: [[6, 3, 1], [3, 2, 1], [1, 1, 1]],
      row: 0, col: 0, m, n,
      variables: { i: 1, j: 0, 'newRow[0]': 6, 'calc': 'newRow[1] + row[0] = 3 + 3' },
      explanation: "Calculate paths for (0, 0): 3 (right) + 3 (down) = 6.",
      highlightedLines: [8]
    },
    {
      grid: [[6, 3, 1], [3, 2, 1], [1, 1, 1]],
      row: 0, col: 0, m, n,
      variables: { result: 6 },
      explanation: "Final result at row[0] is 6.",
      highlightedLines: [14]
    }
  ];

  const code = `function uniquePaths(m: number, n: number): number {
  let row: number[] = new Array(n).fill(1);

  for (let i = 0; i < m - 1; i++) {
    const newRow: number[] = new Array(n).fill(1);

    for (let j = n - 2; j >= 0; j--) {
      newRow[j] = newRow[j + 1] + row[j];
    }

    row = newRow;
  }

  return row[0];
}`;

  const step = steps[currentStep] || steps[0];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden">
            <h3 className="text-sm font-semibold mb-8 text-muted-foreground uppercase tracking-widest text-center">Path Propagation Grid</h3>

            <div className="flex flex-col items-center gap-1">
              {step.grid.map((rowArr, i) => (
                <div key={i} className="flex gap-1">
                  {rowArr.map((val, j) => {
                    const isCurrent = i === step.row && j === step.col;
                    const isDep = (i === step.row && j === step.col + 1) || (i === step.row + 1 && j === step.col);
                    const isFilled = val > 0;
                    const isProcessed = i > step.row || (i === step.row && j > step.col);

                    return (
                      <motion.div
                        key={j}
                        animate={{
                          backgroundColor: isCurrent ? '#84cc16' : isDep ? 'rgba(132,204,22,0.15)' : isFilled ? 'rgba(255,255,255,0.03)' : 'transparent',
                          borderColor: isCurrent ? '#84cc16' : isDep ? 'rgba(132,204,22,0.5)' : '#333',
                          scale: isCurrent ? 1.05 : 1,
                          opacity: isProcessed || isCurrent || isDep ? 1 : 0.4
                        }}
                        className="w-16 h-16 border-2 rounded-xl flex items-center justify-center text-xl font-black transition-all"
                        style={{ color: isCurrent ? '#000' : '#eee' }}
                      >
                        {val > 0 ? val : ''}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#84cc16]" /> Current</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-primary/50 bg-[#84cc1622]" /> Dependent</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-[#444]" /> Processed</span>
            </div>
          </Card>

          <Card className="p-4 bg-primary/5 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Step Explanation</h4>
            <p className="text-sm font-medium leading-relaxed">{step.explanation}</p>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
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
