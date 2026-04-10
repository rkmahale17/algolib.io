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
}

export const RotateImageVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
      matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 0, r: 2 },
      explanation: "We start by defining the boundaries of our current layer. Column 0 is our left (l) boundary, and column 2 is our right (r) boundary.",
      highlightedLines: [2, 3],
      lineExecution: "let l = 0; let r = matrix.length - 1;",
    },
    {
      matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 0, r: 2 },
      explanation: "Rotation happens layer by layer. We continue as long as the left boundary is less than the right (l < r), meaning there's still a layer to process.",
      highlightedLines: [5],
      lineExecution: "while (l < r)",
    },
    {
      matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 0, r: 2, i: 0 },
      explanation: "In each layer, we rotate elements in groups of four. The index 'i' tracks our current position relative to the corners. We start at i = 0.",
      highlightedLines: [6],
      lineExecution: "for (let i = 0; i < r - l; i++)",
    },
    {
      matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 0, r: 2, i: 0, top: 0, bottom: 2 },
      explanation: "For a square matrix, the top row index is 'l' and the bottom row index is 'r'. We'll use these to pinpoint the four elements to swap.",
      highlightedLines: [7, 8],
      lineExecution: "let top = l; let bottom = r;",
    },
    {
      matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      currentRow: 0,
      currentCol: 0,
      swapWith: [],
      variables: { l: 0, r: 2, i: 0, top: 0, bottom: 2, topLeft: 1 },
      explanation: "1. SAVE TOP-LEFT: We store matrix[0][0] (value 1) in 'topLeft'. We do this because it's about to be overwritten in the rotation cycle.",
      highlightedLines: [10],
      lineExecution: "let topLeft = matrix[top][l + i];",
    },
    {
      matrix: [[7, 2, 3], [4, 5, 6], [7, 8, 9]],
      currentRow: 0,
      currentCol: 0,
      swapWith: [[2, 0]],
      variables: { l: 0, r: 2, i: 0, top: 0, bottom: 2, topLeft: 1 },
      explanation: "2. BOTTOM-LEFT TO TOP-LEFT: We move matrix[2][0] (7) up to the top-left position. Notice how the left wall moves up to the top wall.",
      highlightedLines: [11],
      lineExecution: "matrix[top][l + i] = matrix[bottom - i][l];",
    },
    {
      matrix: [[7, 2, 3], [4, 5, 6], [9, 8, 9]],
      currentRow: 2,
      currentCol: 0,
      swapWith: [[2, 2]],
      variables: { l: 0, r: 2, i: 0, top: 0, bottom: 2, topLeft: 1 },
      explanation: "3. BOTTOM-RIGHT TO BOTTOM-LEFT: We shift matrix[2][2] (9) over to the bottom-left corner. The bottom wall is moving leftward.",
      highlightedLines: [12],
      lineExecution: "matrix[bottom - i][l] = matrix[bottom][r - i];",
    },
    {
      matrix: [[7, 2, 3], [4, 5, 6], [9, 8, 3]],
      currentRow: 2,
      currentCol: 2,
      swapWith: [[0, 2]],
      variables: { l: 0, r: 2, i: 0, top: 0, bottom: 2, topLeft: 1 },
      explanation: "4. TOP-RIGHT TO BOTTOM-RIGHT: We bring matrix[0][2] (3) down to the bottom-right. The right wall is moving downward.",
      highlightedLines: [13],
      lineExecution: "matrix[bottom][r - i] = matrix[top + i][r];",
    },
    {
      matrix: [[7, 2, 1], [4, 5, 6], [9, 8, 3]],
      currentRow: 0,
      currentCol: 2,
      swapWith: [],
      variables: { l: 0, r: 2, i: 0, top: 0, bottom: 2, topLeft: 1 },
      explanation: "5. TOP-LEFT TO TOP-RIGHT: Finally, we place our saved 'topLeft' value (1) into the top-right position. The 4-way rotation for the corners is now complete!",
      highlightedLines: [14],
      lineExecution: "matrix[top + i][r] = topLeft;",
    },
    {
      matrix: [[7, 2, 1], [4, 5, 6], [9, 8, 3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 0, r: 2, i: 1 },
      explanation: "Now we increment 'i' to 1. This offset allows us to rotate the middle elements of the walls (the elements between the corners).",
      highlightedLines: [6],
      lineExecution: "for (let i = 0; i < r - l; i++)",
    },
    {
      matrix: [[7, 2, 1], [4, 5, 6], [9, 8, 3]],
      currentRow: 0,
      currentCol: 1,
      swapWith: [],
      variables: { l: 0, r: 2, i: 1, top: 0, bottom: 2, topLeft: 2 },
      explanation: "1. SAVE TOP: We save matrix[0][1] (value 2). With i=1, are targeting the second element in each 'wall'.",
      highlightedLines: [10],
      lineExecution: "let topLeft = matrix[top][l + i];",
    },
    {
      matrix: [[7, 4, 1], [4, 5, 6], [9, 8, 3]],
      currentRow: 0,
      currentCol: 1,
      swapWith: [[1, 0]],
      variables: { l: 0, r: 2, i: 1, top: 0, bottom: 2, topLeft: 2 },
      explanation: "2. LEFT TO TOP: matrix[1][0] (4) moves to the top wall at matrix[0][1]. The index 'bottom - i' correctly picks the 'middle' left element.",
      highlightedLines: [11],
      lineExecution: "matrix[top][l + i] = matrix[bottom - i][l];",
    },
    {
      matrix: [[7, 4, 1], [8, 5, 6], [9, 8, 3]],
      currentRow: 1,
      currentCol: 0,
      swapWith: [[2, 1]],
      variables: { l: 0, r: 2, i: 1, top: 0, bottom: 2, topLeft: 2 },
      explanation: "3. BOTTOM TO LEFT: matrix[2][1] (8) moves to matrix[1][0]. All elements on the bottom shift leftward toward the left wall.",
      highlightedLines: [12],
      lineExecution: "matrix[bottom - i][l] = matrix[bottom][r - i];",
    },
    {
      matrix: [[7, 4, 1], [8, 5, 6], [9, 6, 3]],
      currentRow: 2,
      currentCol: 1,
      swapWith: [[1, 2]],
      variables: { l: 0, r: 2, i: 1, top: 0, bottom: 2, topLeft: 2 },
      explanation: "4. RIGHT TO BOTTOM: matrix[1][2] (6) moves to matrix[2][1]. All elements on the right shift downward toward the bottom wall.",
      highlightedLines: [13],
      lineExecution: "matrix[bottom][r - i] = matrix[top + i][r];",
    },
    {
      matrix: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
      currentRow: 1,
      currentCol: 2,
      swapWith: [],
      variables: { l: 0, r: 2, i: 1, top: 0, bottom: 2, topLeft: 2 },
      explanation: "5. TOP TO RIGHT: The saved value (2) is placed at matrix[1][2]. The middle elements have now finished their clockwise rotation.",
      highlightedLines: [14],
      lineExecution: "matrix[top + i][r] = topLeft;",
    },
    {
      matrix: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 0, r: 2, i: 2 },
      explanation: "We've reached the end of the inner loop (i = 2, which equals r - l). The outermost layer is now fully rotated.",
      highlightedLines: [6],
      lineExecution: "for (let i = 0; i < r - l; i++)",
    },
    {
      matrix: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 1, r: 1 },
      explanation: "Outer layer done! We move inward by incrementing l (to 1) and decrementing r (to 1). We are now targeting the inner core of the matrix.",
      highlightedLines: [16, 17],
      lineExecution: "r--; l++;",
    },
    {
      matrix: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: { l: 1, r: 1 },
      explanation: "Condition l < r (1 < 1) is now false. In a 3x3 matrix, the center element doesn't need to be rotated as it remains in the same spot.",
      highlightedLines: [5],
      lineExecution: "while (l < r)",
    },
    {
      matrix: [[7, 4, 1], [8, 5, 2], [9, 6, 3]],
      currentRow: -1,
      currentCol: -1,
      swapWith: [],
      variables: {},
      explanation: "SUCCESS: The matrix has been rotated 90° clockwise in-place using O(1) extra space. Every wall has shifted exactly one position clockwise.",
      highlightedLines: [1],
      lineExecution: "// rotation complete",
    }
  ];

  const code = `function rotate(matrix: number[][]): void {
  let l = 0;
  let r = matrix.length - 1;

  while (l < r) {
    for (let i = 0; i < r - l; i++) {
        let top = l;
        let bottom = r;

        let topLeft = matrix[top][l + i];
        matrix[top][l + i] = matrix[bottom - i][l];
        matrix[bottom - i][l] = matrix[bottom][r - i];
        matrix[bottom][r - i] = matrix[top + i][r];
        matrix[top + i][r] = topLeft;
    }
    r--;
    l++;
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
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-primary" />
              Matrix State
            </h3>
            
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block bg-muted/30 p-4 rounded-xl border-2 border-border/50">
                {currentStep.matrix.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1.5 mb-1.5 last:mb-0">
                    {row.map((cell, colIdx) => (
                      <motion.div
                        key={`${rowIdx}-${colIdx}`}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                          scale: (rowIdx === currentStep.currentRow && colIdx === currentStep.currentCol) ||
                            currentStep.swapWith.some(([r, c]) => r === rowIdx && c === colIdx) ? 1.1 : 1,
                          opacity: 1
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className={`w-12 h-12 flex items-center justify-center font-mono text-lg font-bold rounded-lg border-2 transition-colors ${getCellColor(rowIdx, colIdx)}`}
                      >
                        {cell}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="w-full space-y-3">
                <motion.div
                  key={`explanation-${currentStepIndex}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-primary/5 rounded-lg border border-primary/10"
                >
                  <p className="text-sm text-foreground/90 leading-snug font-medium">
                    {currentStep.explanation}
                  </p>
                </motion.div>

                <VariablePanel variables={currentStep.variables} />
              </div>
            </div>
          </Card>
        </div>

        <Card className="relative overflow-hidden border-2">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={(currentStep.highlightedLines || []).filter((n) => n >= 1 && n <= code.split('\n').length)}
          />
        </Card>
      </div>
    </div>
  );
};