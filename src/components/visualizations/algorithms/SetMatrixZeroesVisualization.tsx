import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  matrix: number[][];
  firstRowZero: boolean;
  firstColZero: boolean;
  currentRow: number;
  currentCol: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  phase: string;
}

export const SetMatrixZeroesVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: -1,
      currentCol: -1,
      variables: { matrix: '3x3', rows: 3, cols: 3 },
      explanation: "Given matrix with some zeros. Set entire row and column to zero for each zero element.",
      highlightedLines: [1],
      lineExecution: "function setZeroes(matrix: number[][])",
      phase: "init"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: -1,
      currentCol: -1,
      variables: { m: 3, n: 3 },
      explanation: "Get matrix dimensions. m = 3 rows, n = 3 columns.",
      highlightedLines: [2],
      lineExecution: "const m = matrix.length, n = matrix[0].length;",
      phase: "init"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: -1,
      currentCol: -1,
      variables: { firstRowZero: false, firstColZero: false },
      explanation: "Initialize flags to track if first row or first column should be zeroed.",
      highlightedLines: [3],
      lineExecution: "let firstRowZero = false, firstColZero = false;",
      phase: "init"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 0,
      currentCol: 0,
      variables: { checking: 'first column', i: 0 },
      explanation: "Check first column for zeros. Start at row 0.",
      highlightedLines: [6],
      lineExecution: "for (let i = 0; i < m; i++) // check first col",
      phase: "check-first-col"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 0,
      currentCol: 0,
      variables: { check: 'matrix[0][0] = 1', result: 'not zero' },
      explanation: "matrix[0][0] = 1, not zero. Continue checking.",
      highlightedLines: [7],
      lineExecution: "if (matrix[i][0] === 0) // 1 === 0? false",
      phase: "check-first-col"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 0,
      variables: { checking: 'first column', i: 1 },
      explanation: "Move to row 1. Check matrix[1][0].",
      highlightedLines: [6],
      lineExecution: "for (let i = 0; i < m; i++) // i=1",
      phase: "check-first-col"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 0,
      variables: { check: 'matrix[1][0] = 1', result: 'not zero' },
      explanation: "matrix[1][0] = 1, not zero. Continue.",
      highlightedLines: [7],
      lineExecution: "if (matrix[i][0] === 0) // 1 === 0? false",
      phase: "check-first-col"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 2,
      currentCol: 0,
      variables: { check: 'matrix[2][0] = 1', result: 'not zero' },
      explanation: "matrix[2][0] = 1, not zero. First column has no zeros.",
      highlightedLines: [7],
      lineExecution: "if (matrix[i][0] === 0) // 1 === 0? false",
      phase: "check-first-col"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 0,
      currentCol: 0,
      variables: { checking: 'first row', j: 0 },
      explanation: "Now check first row for zeros. Start at column 0.",
      highlightedLines: [11],
      lineExecution: "for (let j = 0; j < n; j++) // check first row",
      phase: "check-first-row"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 0,
      currentCol: 1,
      variables: { check: 'matrix[0][1] = 1', result: 'not zero' },
      explanation: "matrix[0][1] = 1, not zero. Continue.",
      highlightedLines: [12],
      lineExecution: "if (matrix[0][j] === 0) // 1 === 0? false",
      phase: "check-first-row"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 0,
      currentCol: 2,
      variables: { check: 'matrix[0][2] = 1', result: 'not zero' },
      explanation: "matrix[0][2] = 1, not zero. First row has no zeros.",
      highlightedLines: [12],
      lineExecution: "if (matrix[0][j] === 0) // 1 === 0? false",
      phase: "check-first-row"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 1,
      variables: { scanning: 'inner cells', i: 1, j: 1 },
      explanation: "Scan remaining cells starting from [1][1]. Use first row and column as markers.",
      highlightedLines: [17],
      lineExecution: "for (let i = 1; i < m; i++) // scan inner",
      phase: "mark"
    },
    {
      matrix: [[1,1,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 1,
      variables: { check: 'matrix[1][1] = 0', found: 'ZERO!' },
      explanation: "Found zero at [1][1]! Mark its row and column in first row and column.",
      highlightedLines: [19],
      lineExecution: "if (matrix[i][j] === 0) // 0 === 0? true",
      phase: "mark"
    },
    {
      matrix: [[1,0,1],[1,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 1,
      variables: { action: 'mark row', set: 'matrix[1][0] = 0' },
      explanation: "Mark row 1 by setting matrix[1][0] = 0.",
      highlightedLines: [20],
      lineExecution: "matrix[i][0] = 0;",
      phase: "mark"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 1,
      variables: { action: 'mark column', set: 'matrix[0][1] = 0' },
      explanation: "Mark column 1 by setting matrix[0][1] = 0.",
      highlightedLines: [21],
      lineExecution: "matrix[0][j] = 0;",
      phase: "mark"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 2,
      variables: { scanning: 'continue', i: 1, j: 2 },
      explanation: "Continue scanning. Check matrix[1][2].",
      highlightedLines: [18],
      lineExecution: "for (let j = 1; j < n; j++) // j=2",
      phase: "mark"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 2,
      variables: { check: 'matrix[1][2] = 1', result: 'not zero' },
      explanation: "matrix[1][2] = 1, not zero. Continue.",
      highlightedLines: [19],
      lineExecution: "if (matrix[i][j] === 0) // 1 === 0? false",
      phase: "mark"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 2,
      currentCol: 1,
      variables: { scanning: 'row 2', i: 2, j: 1 },
      explanation: "Move to row 2. Scan remaining cells.",
      highlightedLines: [17],
      lineExecution: "for (let i = 1; i < m; i++) // i=2",
      phase: "mark"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 2,
      currentCol: 2,
      variables: { check: 'matrix[2][2] = 1', result: 'not zero' },
      explanation: "Scanned all inner cells. Marking phase complete.",
      highlightedLines: [19],
      lineExecution: "if (matrix[i][j] === 0) // done scanning",
      phase: "mark"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 1,
      variables: { phase: 'zeroing', i: 1, j: 1 },
      explanation: "Now zero out cells based on markers. Start from [1][1].",
      highlightedLines: [26],
      lineExecution: "for (let i = 1; i < m; i++) // zero phase",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 1,
      variables: { check: 'row marked?', row0: 0, col0: 0 },
      explanation: "Check if row 1 or column 1 is marked. matrix[1][0]=0 OR matrix[0][1]=0.",
      highlightedLines: [28],
      lineExecution: "if (matrix[i][0] === 0 || matrix[0][j] === 0)",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 1,
      variables: { action: 'SET ZERO', cell: '[1][1]' },
      explanation: "Row 1 is marked! Set matrix[1][1] = 0.",
      highlightedLines: [29],
      lineExecution: "matrix[i][j] = 0;",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,1],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 2,
      variables: { check: 'row marked?', row0: 0, col0: 1 },
      explanation: "Check [1][2]. Row 1 is marked, set to zero.",
      highlightedLines: [28],
      lineExecution: "if (matrix[i][0] === 0 || matrix[0][j] === 0)",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,0],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 1,
      currentCol: 2,
      variables: { action: 'SET ZERO', cell: '[1][2]' },
      explanation: "Set matrix[1][2] = 0.",
      highlightedLines: [29],
      lineExecution: "matrix[i][j] = 0;",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,0],[1,1,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 2,
      currentCol: 1,
      variables: { check: 'column marked?', row0: 1, col0: 0 },
      explanation: "Check [2][1]. Column 1 is marked, set to zero.",
      highlightedLines: [28],
      lineExecution: "if (matrix[i][0] === 0 || matrix[0][j] === 0)",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,0],[1,0,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 2,
      currentCol: 1,
      variables: { action: 'SET ZERO', cell: '[2][1]' },
      explanation: "Set matrix[2][1] = 0.",
      highlightedLines: [29],
      lineExecution: "matrix[i][j] = 0;",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,0],[1,0,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 2,
      currentCol: 2,
      variables: { check: 'not marked', row0: 1, col0: 1 },
      explanation: "Check [2][2]. Neither row 2 nor column 2 marked. Keep as is.",
      highlightedLines: [28],
      lineExecution: "if (matrix[i][0] === 0 || matrix[0][j] === 0) // false",
      phase: "zero"
    },
    {
      matrix: [[1,0,1],[0,0,0],[1,0,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: 0,
      currentCol: -1,
      variables: { check: 'firstColZero?', value: false },
      explanation: "Check if first column should be zeroed. firstColZero = false.",
      highlightedLines: [33],
      lineExecution: "if (firstColZero) // false",
      phase: "finalize"
    },
    {
      matrix: [[1,0,1],[0,0,0],[1,0,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: -1,
      currentCol: 0,
      variables: { check: 'firstRowZero?', value: false },
      explanation: "Check if first row should be zeroed. firstRowZero = false.",
      highlightedLines: [38],
      lineExecution: "if (firstRowZero) // false",
      phase: "finalize"
    },
    {
      matrix: [[1,0,1],[0,0,0],[1,0,1]],
      firstRowZero: false,
      firstColZero: false,
      currentRow: -1,
      currentCol: -1,
      variables: { result: 'complete', time: 'O(m*n)', space: 'O(1)' },
      explanation: "Algorithm complete! Modified matrix in-place. Time: O(m×n), Space: O(1).",
      highlightedLines: [43],
      lineExecution: "// Done",
      phase: "complete"
    }
  ];

  const code = `function setZeroes(matrix: number[][]): void {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = false, firstColZero = false;
  
  // Check if first column has zero
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
    }
  }
  // Check if first row has zero
  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
    }
  }
  // Use first row and column as markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }
  // Zero out cells based on markers
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }
  // Zero first column if needed
  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }
  // Zero first row if needed
  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }
}`;

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const getCellColor = (row: number, col: number) => {
    if (!currentStep?.matrix?.[row] || currentStep.matrix[row][col] === undefined) {
      return 'bg-muted text-muted-foreground border-border';
    }
    const value = currentStep.matrix[row][col];
    
    if (row === currentStep.currentRow && col === currentStep.currentCol) {
      return 'bg-primary text-primary-foreground border-primary';
    }
    if (value === 0) {
      return 'bg-destructive/80 text-destructive-foreground border-destructive';
    }
    if (row === 0 || col === 0) {
      return 'bg-secondary/50 text-secondary-foreground border-secondary';
    }
    return 'bg-muted text-foreground border-border';
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Set Matrix Zeroes</h3>
          <div className="space-y-4">
            <motion.div 
              key={`matrix-${currentStepIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-muted-foreground">
                Phase: <span className="text-primary font-mono">{currentStep.phase}</span>
              </div>
              <div className="inline-block bg-card p-4 rounded-lg border">
                {currentStep.matrix.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map((cell, colIdx) => (
                      <motion.div
                        key={`${rowIdx}-${colIdx}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded border-2 transition-all ${getCellColor(rowIdx, colIdx)}`}
                      >
                        {cell}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              key={`execution-${currentStepIndex}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 bg-secondary/30 rounded border-l-4 border-secondary"
            >
              <div className="text-xs font-semibold text-secondary-foreground mb-1">Executing:</div>
              <code className="text-xs text-foreground font-mono">{currentStep.lineExecution}</code>
            </motion.div>

            <motion.div
              key={`explanation-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-muted/50 rounded text-sm leading-relaxed"
            >
              {currentStep.explanation}
            </motion.div>

            <motion.div
              key={`variables-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <VariablePanel variables={currentStep.variables} />
            </motion.div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Implementation</h3>
          <div className="flex-1 overflow-auto">
            <AnimatedCodeEditor 
              code={code} 
              language="typescript" 
              highlightedLines={(currentStep.highlightedLines || []).filter((n) => n >= 1 && n <= code.split('\n').length)}
            />
          </div>
        </Card>
      </div>

      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />
    </div>
  );
};