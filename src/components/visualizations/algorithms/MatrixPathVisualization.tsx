import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  dp: number[][];
  i: number | null;
  j: number | null;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function uniquePaths(m: number, n: number): number {
  let row: number[] = new Array(n).fill(1);
  for (let i = 0; i < m - 1; i++) {
    const newRow: number[] = new Array(n).fill(1);
    for (let j = n - 2; j >= 0; j--) {
      newRow[j] = newRow[j + 1] + row[j];
    }
    row = newRow;
  }
  return row[0];
}`,

  python: `def uniquePaths(m: int, n: int) -> int:
  row = [1] * n
  for i in range(m - 1):
    newRow = [1] * n
    for j in range(n - 2, -1, -1):
      newRow[j] = newRow[j + 1] + row[j]
    row = newRow
  return row[0]`,

  java: `public static class Solution {
    public int uniquePaths(int m, int n) {
        int[] row = new int[n];
        java.util.Arrays.fill(row, 1);
        for (int i = 0; i < m - 1; i++) {
            int[] newRow = new int[n];
            java.util.Arrays.fill(newRow, 1);
            for (int j = n - 2; j >= 0; j--) {
                newRow[j] = newRow[j + 1] + row[j];
            }
            row = newRow;
        }
        return row[0];
    }
}`,

  cpp: `class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> row(n, 1);
        for (int i = 0; i < m - 1; i++) {
            vector<int> newRow(n, 1);
            for (int j = n - 2; j >= 0; j--) {
                newRow[j] = newRow[j + 1] + row[j];
            }
            row = newRow;
        }
        return row[0];
    }
};`
};

function generateVisualizationData() {
  const m = 3;
  const n = 5;
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  let rowValues = new Array(n).fill(1);
  const displayGrid = Array.from({ length: m }, () => Array(n).fill(0));
  for (let c = 0; c < n; c++) displayGrid[m - 1][c] = 1;

  steps.push({
    dp: displayGrid.map((r) => [...r]),
    i: null,
    j: null,
    variables: { m, n },
    explanation: `Find unique paths from (0,0) to (${m - 1},${n - 1}). Start calculations.`,
    pseudoStep: `START uniquePaths(m=${m}, n=${n})`,
  });
  addLines(1, 1, 2, 3);

  steps.push({
    dp: displayGrid.map((r) => [...r]),
    i: m - 1,
    j: null,
    variables: { 'row.length': n, values: 'all 1s' },
    explanation: 'Initialize the base row (bottom-most) with 1s. There is 1 unique path to target from any cell in the target row.',
    pseudoStep: 'SET row = [1] * n',
  });
  addLines(2, 2, 3, 4);

  for (let i = 0; i < m - 1; i++) {
    const currentRowIdx = m - 2 - i;
    const newRowValues = new Array(n).fill(1);
    displayGrid[currentRowIdx][n - 1] = 1;

    steps.push({
      dp: displayGrid.map((r) => [...r]),
      i: currentRowIdx,
      j: n - 1,
      variables: { i, currentRowIdx, 'newRow[last]': 1 },
      explanation: `Move to row ${currentRowIdx}. Initialize newRow with 1s. The rightmost column cell always has only 1 path (going straight down).`,
      pseudoStep: `FOR i = ${i} (Row ${currentRowIdx}) → SET newRow[${n - 1}] = 1`,
    });
    addLines(4, 4, 6, 6);

    for (let j = n - 2; j >= 0; j--) {
      const fromRight = newRowValues[j + 1];
      const fromBottom = rowValues[j];
      newRowValues[j] = fromRight + fromBottom;
      displayGrid[currentRowIdx][j] = newRowValues[j];

      steps.push({
        dp: displayGrid.map((r) => [...r]),
        i: currentRowIdx,
        j,
        variables: { j, fromRight, fromBottom, result: newRowValues[j] },
        explanation: `Compute cell newRow[${j}] by adding paths from right (${fromRight}) and bottom (${fromBottom}) -> ${newRowValues[j]}.`,
        pseudoStep: `SET newRow[${j}] = newRow[${j + 1}] + row[${j}] → ${fromRight} + ${fromBottom} = ${newRowValues[j]}`,
      });
      addLines(6, 6, 9, 8);
    }

    rowValues = [...newRowValues];
    steps.push({
      dp: displayGrid.map((r) => [...r]),
      i: currentRowIdx,
      j: null,
      variables: { updated_row: `[${rowValues.join(', ')}]` },
      explanation: `Finished row ${currentRowIdx}. Replace row values with the newly computed newRow.`,
      pseudoStep: 'SET row = newRow',
    });
    addLines(8, 7, 11, 10);
  }

  steps.push({
    dp: displayGrid.map((r) => [...r]),
    i: 0,
    j: 0,
    variables: { result: rowValues[0] },
    explanation: `Target path computation complete. The cell row[0] stores the total unique paths: ${rowValues[0]}.`,
    pseudoStep: `RETURN row[0] → ${rowValues[0]}`,
  });
  addLines(10, 8, 13, 12);

  return { steps, stepLineNumbers };
}

export const MatrixPathVisualization: React.FC = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map((s) => s.pseudoStep);

  const m = 3;
  const n = 5;

  return (
    <div className="w-full space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual State */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-xl p-8 border border-border/50 shadow-sm overflow-hidden relative">
            <h3 className="text-sm font-semibold mb-4 text-center text-foreground font-sans">
              Unique Paths (Bottom-Up DP Grid)
            </h3>
            <div
              className="grid gap-2 mx-auto justify-center"
              style={{
                gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                width: 'fit-content'
              }}
            >
              {currentStep.dp.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isProcessing = rIdx === currentStep.i && cIdx === currentStep.j;
                  const isComputed = val > 0 && !isProcessing;
                  const isCurrentRow = rIdx === currentStep.i && currentStep.j === null;
                  const isDependency =
                    currentStep.i !== null &&
                    currentStep.j !== null &&
                    ((rIdx === currentStep.i && cIdx === currentStep.j + 1) ||
                      (rIdx === currentStep.i + 1 && cIdx === currentStep.j));

                  let cellClass = 'border-border bg-muted/20 text-muted-foreground/30';
                  if (isProcessing) {
                    cellClass = 'border-orange-500 bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold scale-110 z-10';
                  } else if (isDependency) {
                    cellClass = 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400';
                  } else if (isCurrentRow) {
                    cellClass = 'border-orange-500/20 bg-orange-500/5 text-foreground/70';
                  } else if (isComputed) {
                    cellClass = 'border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400';
                  }

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-12 h-14 flex flex-col items-center justify-center rounded-lg border-2 font-mono text-sm transition-all duration-300 shadow-sm relative ${cellClass}`}
                    >
                      {rIdx === 0 && cIdx === 0 && (
                        <span className="absolute -top-4 text-[8px] font-bold text-primary uppercase whitespace-nowrap">
                          Start
                        </span>
                      )}
                      {rIdx === m - 1 && cIdx === n - 1 && (
                        <span className="absolute -bottom-4 text-[8px] font-bold text-red-500 uppercase whitespace-nowrap">
                          Target
                        </span>
                      )}
                      <span className="text-base">{val > 0 ? val : ''}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-8 flex gap-6 text-[10px] font-semibold tracking-wider uppercase justify-center border-t border-border/40 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-orange-500 bg-orange-500/20"></div>
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-blue-500/40 bg-blue-500/10"></div>
                <span className="text-muted-foreground">Dependencies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-green-500/40 bg-green-500/10"></div>
                <span className="text-muted-foreground">Computed</span>
              </div>
            </div>
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <div className="text-sm font-medium leading-relaxed text-foreground/90 select-none">
                    {currentStep.explanation}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        {/* Right Column: Code Display */}
        <div className="lg:col-span-5">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

export default MatrixPathVisualization;
