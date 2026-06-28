import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  matrix: number[][];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  phase: string;
  currentRow?: number;
  currentCol?: number;
}

const languages: VisualizationLanguageMap = {
  python: `def setZeroes(matrix):
    ROWS = len(matrix)
    COLS = len(matrix[0])
    rowZero = False
    for r in range(ROWS):
        for c in range(COLS):
            if matrix[r][c] == 0:
                matrix[0][c] = 0
                if r > 0:
                    matrix[r][0] = 0
                else:
                    rowZero = True
    for r in range(1, ROWS):
        for c in range(1, COLS):
            if matrix[0][c] == 0 or matrix[r][0] == 0:
                matrix[r][c] = 0
    if matrix[0][0] == 0:
        for r in range(ROWS):
            matrix[r][0] = 0
    if rowZero:
        for c in range(COLS):
            matrix[0][c] = 0
    return matrix`,

  typescript: `function setZeroes(matrix: number[][]): number[][] {
  const ROWS = matrix.length;
  const COLS = matrix[0].length;
  let rowZero = false;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (matrix[r][c] === 0) {
        matrix[0][c] = 0;
        if (r > 0) {
          matrix[r][0] = 0;
        } else {
          rowZero = true;
        }
      }
    }
  }
  for (let r = 1; r < ROWS; r++) {
    for (let c = 1; c < COLS; c++) {
      if (matrix[0][c] === 0 || matrix[r][0] === 0) {
        matrix[r][c] = 0;
      }
    }
  }
  if (matrix[0][0] === 0) {
    for (let r = 0; r < ROWS; r++) {
      matrix[r][0] = 0;
    }
  }
  if (rowZero) {
    for (let c = 0; c < COLS; c++) {
      matrix[0][c] = 0;
    }
  }
  return matrix;
}`,

  java: `public class Solution {
    public int[][] setZeroes(int[][] matrix) {
        int ROWS = matrix.length;
        int COLS = matrix[0].length;
        boolean rowZero = false;
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (matrix[r][c] == 0) {
                    matrix[0][c] = 0;
                    if (r > 0) {
                        matrix[r][0] = 0;
                    } else {
                        rowZero = true;
                    }
                }
            }
        }
        for (int r = 1; r < ROWS; r++) {
            for (int c = 1; c < COLS; c++) {
                if (matrix[0][c] == 0 || matrix[r][0] == 0) {
                    matrix[r][c] = 0;
                }
            }
        }
        if (matrix[0][0] == 0) {
            for (int r = 0; r < ROWS; r++) {
                matrix[r][0] = 0;
            }
        }
        if (rowZero) {
            for (int c = 0; c < COLS; c++) {
                matrix[0][c] = 0;
            }
        }
        return matrix;
    }
}`,

  cpp: `class Solution {
public:
    vector<vector<int>> setZeroes(vector<vector<int>>& matrix) {
        int ROWS = matrix.size();
        int COLS = matrix[0].size();
        bool rowZero = false;
        for (int r = 0; r < ROWS; r++) {
            for (int c = 0; c < COLS; c++) {
                if (matrix[r][c] == 0) {
                    matrix[0][c] = 0;
                    if (r > 0) {
                        matrix[r][0] = 0;
                    } else {
                        rowZero = true;
                    }
                }
            }
        }
        for (int r = 1; r < ROWS; r++) {
            for (int c = 1; c < COLS; c++) {
                if (matrix[0][c] == 0 || matrix[r][0] == 0) {
                    matrix[r][c] = 0;
                }
            }
        }
        if (matrix[0][0] == 0) {
            for (int r = 0; r < ROWS; r++) {
                matrix[r][0] = 0;
            }
        }
        if (rowZero) {
            for (int c = 0; c < COLS; c++) {
                matrix[0][c] = 0;
            }
        }
        return matrix;
    }
};`
};

const generateVisualizationData = () => {
  const initialMatrix = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
  ];
  const m = initialMatrix.length;
  const n = initialMatrix[0].length;
  const matrix = initialMatrix.map(row => [...row]);
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

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, phase: string, extra: Partial<Step> = {}) => {
    steps.push({
      matrix: matrix.map(row => [...row]),
      explanation: msg,
      pseudoStep: pseudo,
      phase,
      variables: {
        m,
        n,
        ...extra.variables
      },
      currentRow: extra.currentRow,
      currentCol: extra.currentCol
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Init
  addStep(
    "Initialize dimensions and set rowZero flag to false.",
    "CALL setZeroes(matrix)",
    1, 1, 2, 3,
    "Initialization",
    { variables: { rowZero: false } }
  );

  let rowZero = false;

  // 2. Scan and mark
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      addStep(
        `Scanning cell matrix[${r}][${c}]. Check if it is zero.`,
        `IF matrix[${r}][${c}] == 0`,
        7, 7, 8, 9,
        "Determine zeros",
        { currentRow: r, currentCol: c, variables: { rowZero, r, c } }
      );
      if (matrix[r][c] === 0) {
        matrix[0][c] = 0;
        addStep(
          `Found 0 at [${r}][${c}]. Mark column header matrix[0][${c}] as 0.`,
          `SET matrix[0][${c}] = 0`,
          8, 8, 9, 10,
          "Determine zeros",
          { currentRow: r, currentCol: c, variables: { rowZero, r, c } }
        );

        if (r > 0) {
          matrix[r][0] = 0;
          addStep(
            `Since row ${r} > 0, mark row header matrix[${r}][0] as 0.`,
            `SET matrix[${r}][0] = 0`,
            10, 10, 11, 12,
            "Determine zeros",
            { currentRow: r, currentCol: c, variables: { rowZero, r, c } }
          );
        } else {
          rowZero = true;
          addStep(
            "Since this is the first row, set rowZero flag to true.",
            "SET rowZero = true",
            12, 12, 13, 14,
            "Determine zeros",
            { currentRow: r, currentCol: c, variables: { rowZero, r, c } }
          );
        }
      }
    }
  }

  // 3. Zero inner cells
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      addStep(
        `Checking markers for inner cell [${r}][${c}]. Row marker matrix[${r}][0]: ${matrix[r][0]}, Column marker matrix[0][${c}]: ${matrix[0][c]}.`,
        `IF matrix[0][${c}] == 0 OR matrix[${r}][0] == 0`,
        19, 15, 20, 21,
        "Zeroing Inner",
        { currentRow: r, currentCol: c, variables: { rowZero, r, c } }
      );
      if (matrix[0][c] === 0 || matrix[r][0] === 0) {
        matrix[r][c] = 0;
        addStep(
          `Marker found. Set matrix[${r}][${c}] to 0.`,
          `SET matrix[${r}][${c}] = 0`,
          20, 16, 21, 22,
          "Zeroing Inner",
          { currentRow: r, currentCol: c, variables: { rowZero, r, c } }
        );
      }
    }
  }

  // 4. Handle first column
  addStep(
    "Check if the top-left cell matrix[0][0] is marked as 0, which dictates if the first column should be zeroed.",
    "IF matrix[0][0] == 0",
    24, 17, 25, 26,
    "Handle first column",
    { variables: { rowZero } }
  );
  if (matrix[0][0] === 0) {
    for (let r = 0; r < m; r++) {
      matrix[r][0] = 0;
      addStep(
        `Zeroing first column: setting matrix[${r}][0] = 0.`,
        `SET matrix[${r}][0] = 0`,
        26, 19, 28, 29,
        "Handle first column",
        { currentRow: r, currentCol: 0, variables: { rowZero, r } }
      );
    }
  }

  // 5. Handle first row
  addStep(
    "Check if rowZero flag is true to determine if the first row should be zeroed.",
    "IF rowZero",
    29, 20, 30, 31,
    "Handle first row",
    { variables: { rowZero } }
  );
  if (rowZero) {
    for (let c = 0; c < n; c++) {
      matrix[0][c] = 0;
      addStep(
        `Zeroing first row: setting matrix[0][${c}] = 0.`,
        `SET matrix[0][${c}] = 0`,
        31, 22, 32, 33,
        "Handle first row",
        { currentRow: 0, currentCol: c, variables: { rowZero, c } }
      );
    }
  }

  // 6. Complete
  addStep(
    "In-place Set Matrix Zeroes is now complete.",
    "RETURN",
    34, 23, 35, 36,
    "Complete",
    { variables: { rowZero } }
  );

  return { steps, stepLineNumbers };
};

export const SetMatrixZeroesVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getCellColor = (row: number, col: number) => {
    const isCurrent = row === currentStep.currentRow && col === currentStep.currentCol;
    const value = currentStep.matrix[row][col];

    if (isCurrent) return 'bg-yellow-400 border-yellow-600 text-black z-10 scale-110 shadow-md';
    if (value === 0) return 'bg-red-100 dark:bg-red-950/20 border-red-300 dark:border-red-900/50 text-foreground';
    if (row === 0 || col === 0) return 'bg-blue-50 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/30 text-foreground';
    return 'bg-card border-border text-foreground';
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="mb-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Phase: <span className="text-primary font-bold">{currentStep.phase}</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900/30 p-6 rounded-xl border border-border shadow-inner w-full max-w-sm">
              <div 
                className="grid gap-2"
                style={{ 
                  gridTemplateColumns: `repeat(${currentStep.matrix[0].length}, minmax(0, 1fr))` 
                }}
              >
                {currentStep.matrix.map((row, rowIdx) => (
                  row.map((cell, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`aspect-square flex items-center justify-center text-sm sm:text-lg font-bold rounded-lg border transition-all duration-200 shadow-sm ${getCellColor(rowIdx, colIdx)}`}
                    >
                      {cell}
                    </div>
                  ))
                ))}
              </div>
            </div>
          </div>

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.explanation}
          </div>

          {/* Variable Panel (below the commentary box) */}
          <div className="pt-2">
            <VariablePanel variables={currentStep.variables} />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};