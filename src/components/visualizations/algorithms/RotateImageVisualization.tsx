import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { RotateCw } from 'lucide-react';

interface Step {
  matrix: number[][];
  currentRow: number;
  currentCol: number;
  swapWith: [number, number][];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  phase: string;
}

export const RotateImageVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
      matrix: [[1,2,3],[4,5,6],[7,8,9]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { matrix: '3x3', rotate: '90° clockwise' },
      explanation: "Rotate 3x3 matrix 90 degrees clockwise in-place. Use transpose + reverse approach.",
      highlightedLines: [1],
      lineExecution: "function rotate(matrix: number[][]): void",
      phase: "init"
    },
    {
      matrix: [[1,2,3],[4,5,6],[7,8,9]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { n: 3 },
      explanation: "Get matrix size n = 3. Process will be: transpose then reverse each row.",
      highlightedLines: [2],
      lineExecution: "const n = matrix.length;",
      phase: "init"
    },
    {
      matrix: [[1,2,3],[4,5,6],[7,8,9]],
      currentRow: 0,
      currentCol: 1,
      swapWith: [],
      variables: { phase: 'transpose', i: 0, j: 1 },
      explanation: "Phase 1: Transpose matrix. Swap matrix[i][j] with matrix[j][i]. Start i=0, j=1.",
      highlightedLines: [5],
      lineExecution: "for (let i = 0; i < n; i++) // transpose",
      phase: "transpose"
    },
    {
      matrix: [[1,2,3],[4,5,6],[7,8,9]],
      currentRow: 0,
      currentCol: 1,
      swapWith: [[1,0]],
      variables: { swap: '[0][1] ↔ [1][0]', values: '2 ↔ 4' },
      explanation: "Swap matrix[0][1] (value 2) with matrix[1][0] (value 4).",
      highlightedLines: [7],
      lineExecution: "[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];",
      phase: "transpose"
    },
    {
      matrix: [[1,4,3],[2,5,6],[7,8,9]],
      currentRow: 0,
      currentCol: 1,
      swapWith: [],
      variables: { swapped: 'matrix[0][1]=4, matrix[1][0]=2' },
      explanation: "After swap: matrix[0][1]=4, matrix[1][0]=2.",
      highlightedLines: [7],
      lineExecution: "// swapped",
      phase: "transpose"
    },
    {
      matrix: [[1,4,3],[2,5,6],[7,8,9]],
      currentRow: 0,
      currentCol: 2,
      swapWith: [[2,0]],
      variables: { swap: '[0][2] ↔ [2][0]', values: '3 ↔ 7' },
      explanation: "Swap matrix[0][2] (value 3) with matrix[2][0] (value 7).",
      highlightedLines: [7],
      lineExecution: "[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];",
      phase: "transpose"
    },
    {
      matrix: [[1,4,7],[2,5,6],[3,8,9]],
      currentRow: 0,
      currentCol: 2,
      swapWith: [],
      variables: { swapped: 'matrix[0][2]=7, matrix[2][0]=3' },
      explanation: "After swap: matrix[0][2]=7, matrix[2][0]=3.",
      highlightedLines: [7],
      lineExecution: "// swapped",
      phase: "transpose"
    },
    {
      matrix: [[1,4,7],[2,5,6],[3,8,9]],
      currentRow: 1,
      currentCol: 2,
      swapWith: [[2,1]],
      variables: { swap: '[1][2] ↔ [2][1]', values: '6 ↔ 8' },
      explanation: "Continue row 1. Swap matrix[1][2] (value 6) with matrix[2][1] (value 8).",
      highlightedLines: [7],
      lineExecution: "[matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];",
      phase: "transpose"
    },
    {
      matrix: [[1,4,7],[2,5,8],[3,6,9]],
      currentRow: 1,
      currentCol: 2,
      swapWith: [],
      variables: { swapped: 'matrix[1][2]=8, matrix[2][1]=6' },
      explanation: "After swap: matrix[1][2]=8, matrix[2][1]=6. Transpose complete!",
      highlightedLines: [7],
      lineExecution: "// transposed",
      phase: "transpose"
    },
    {
      matrix: [[1,4,7],[2,5,8],[3,6,9]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { transposed: '[[1,4,7],[2,5,8],[3,6,9]]' },
      explanation: "Matrix after transpose. Notice rows became columns.",
      highlightedLines: [10],
      lineExecution: "// transpose done",
      phase: "transpose-done"
    },
    {
      matrix: [[1,4,7],[2,5,8],[3,6,9]],
      currentRow: 0,
      currentCol: -1,
      swapWith: [],
      variables: { phase: 'reverse rows', i: 0 },
      explanation: "Phase 2: Reverse each row. Start with row 0: [1,4,7].",
      highlightedLines: [13],
      lineExecution: "for (let i = 0; i < n; i++) // reverse rows",
      phase: "reverse"
    },
    {
      matrix: [[1,4,7],[2,5,8],[3,6,9]],
      currentRow: 0,
      currentCol: 0,
      swapWith: [[0,2]],
      variables: { swap: '[0][0] ↔ [0][2]', values: '1 ↔ 7' },
      explanation: "Reverse row 0. Swap matrix[0][0] (value 1) with matrix[0][2] (value 7).",
      highlightedLines: [14],
      lineExecution: "matrix[i].reverse();",
      phase: "reverse"
    },
    {
      matrix: [[7,4,1],[2,5,8],[3,6,9]],
      currentRow: 0,
      currentCol: -1,
      swapWith: [],
      variables: { reversed: 'row 0: [7,4,1]' },
      explanation: "Row 0 reversed: [7,4,1].",
      highlightedLines: [14],
      lineExecution: "// row 0 reversed",
      phase: "reverse"
    },
    {
      matrix: [[7,4,1],[2,5,8],[3,6,9]],
      currentRow: 1,
      currentCol: 0,
      swapWith: [[1,2]],
      variables: { swap: '[1][0] ↔ [1][2]', values: '2 ↔ 8' },
      explanation: "Reverse row 1. Swap matrix[1][0] (value 2) with matrix[1][2] (value 8).",
      highlightedLines: [14],
      lineExecution: "matrix[i].reverse();",
      phase: "reverse"
    },
    {
      matrix: [[7,4,1],[8,5,2],[3,6,9]],
      currentRow: 1,
      currentCol: -1,
      swapWith: [],
      variables: { reversed: 'row 1: [8,5,2]' },
      explanation: "Row 1 reversed: [8,5,2].",
      highlightedLines: [14],
      lineExecution: "// row 1 reversed",
      phase: "reverse"
    },
    {
      matrix: [[7,4,1],[8,5,2],[3,6,9]],
      currentRow: 2,
      currentCol: 0,
      swapWith: [[2,2]],
      variables: { swap: '[2][0] ↔ [2][2]', values: '3 ↔ 9' },
      explanation: "Reverse row 2. Swap matrix[2][0] (value 3) with matrix[2][2] (value 9).",
      highlightedLines: [14],
      lineExecution: "matrix[i].reverse();",
      phase: "reverse"
    },
    {
      matrix: [[7,4,1],[8,5,2],[9,6,3]],
      currentRow: 2,
      currentCol: -1,
      swapWith: [],
      variables: { reversed: 'row 2: [9,6,3]' },
      explanation: "Row 2 reversed: [9,6,3]. All rows reversed!",
      highlightedLines: [14],
      lineExecution: "// all rows reversed",
      phase: "reverse"
    },
    {
      matrix: [[7,4,1],[8,5,2],[9,6,3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { result: '[[7,4,1],[8,5,2],[9,6,3]]' },
      explanation: "Rotation complete! Matrix rotated 90° clockwise in-place.",
      highlightedLines: [16],
      lineExecution: "// done",
      phase: "complete"
    },
    {
      matrix: [[7,4,1],[8,5,2],[9,6,3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { original: '[[1,2,3],[4,5,6],[7,8,9]]', rotated: '[[7,4,1],[8,5,2],[9,6,3]]' },
      explanation: "Visualize: Original left column [1,4,7] became top row [7,4,1] reversed.",
      highlightedLines: [16],
      lineExecution: "// rotation verified",
      phase: "complete"
    },
    {
      matrix: [[7,4,1],[8,5,2],[9,6,3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { time: 'O(n²)', space: 'O(1)' },
      explanation: "Algorithm complete! Time: O(n²) touch each cell once. Space: O(1) in-place rotation.",
      highlightedLines: [16],
      lineExecution: "// Done",
      phase: "complete"
    }
  ];

  const code = `function rotate(matrix: number[][]): void {
  const n = matrix.length;
  
  // Step 1: Transpose matrix
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  
  // Step 2: Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
}`;

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const getCellColor = (row: number, col: number) => {
    if (!currentStep?.swapWith) return 'bg-muted text-foreground border-border';
    if (currentStep.swapWith.some(([r, c]) => r === row && c === col)) {
      return 'bg-destructive/80 text-destructive-foreground border-destructive shadow-lg';
    }
    if (row === currentStep.currentRow && col === currentStep.currentCol) {
      return 'bg-primary text-primary-foreground border-primary shadow-lg scale-110';
    }
    return 'bg-muted text-foreground border-border';
  };

  if (!currentStep?.matrix) {
    return <div className="p-4 text-center">Loading visualization...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RotateCw className="w-5 h-5 text-primary" />
            Rotate Image 90°
          </h3>
          <div className="space-y-4">
            <motion.div 
              key={`matrix-${currentStepIndex}`}
              initial={{ opacity: 0, rotate: -5 }}
              animate={{ opacity: 1, rotate: 0 }}
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
                        animate={{ 
                          scale: (rowIdx === currentStep.currentRow && colIdx === currentStep.currentCol) || 
                                 currentStep.swapWith.some(([r, c]) => r === rowIdx && c === colIdx) ? 1.1 : 1 
                        }}
                        className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded border-2 transition-all ${getCellColor(rowIdx, colIdx)}`}
                      >
                        {cell}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>

            {currentStep.swapWith.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-destructive/10 rounded border-2 border-destructive/30"
              >
                <div className="text-sm font-medium text-destructive">
                  Swapping: [{currentStep.currentRow}][{currentStep.currentCol}] ↔ [{currentStep.swapWith[0][0]}][{currentStep.swapWith[0][1]}]
                </div>
              </motion.div>
            )}

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
              highlightedLines={currentStep.highlightedLines}
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