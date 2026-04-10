import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  matrix: number[][];
  result: number[];
  visited: boolean[][];
  currentRow: number;
  currentCol: number;
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  lineExecution: string;
  direction: string;
}

export const SpiralMatrixVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const initialMatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

  const steps: Step[] = [
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false, false, false], [false, false, false], [false, false, false]],
      currentRow: -1,
      currentCol: -1,
      variables: { matrix: '3x3' },
      explanation: "Traverse a 3x3 matrix in spiral order: right → down → left → up.",
      highlightedLines: [1],
      lineExecution: "function spiralOrder(matrix: number[][])",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false, false, false], [false, false, false], [false, false, false]],
      currentRow: -1,
      currentCol: -1,
      variables: { m: 3, n: 3 },
      explanation: "Initialize dimensions: 3 rows (m) and 3 columns (n).",
      highlightedLines: [2],
      lineExecution: "const m = matrix.length, n = matrix[0].length;",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false, false, false], [false, false, false], [false, false, false]],
      currentRow: -1,
      currentCol: -1,
      variables: { top: 0, bottom: 2, left: 0, right: 2 },
      explanation: "Define boundaries: top = 0, bottom = 2, left = 0, right = 2.",
      highlightedLines: [3],
      lineExecution: "let top = 0, bottom = m - 1, left = 0, right = n - 1;",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false, false, false], [false, false, false], [false, false, false]],
      currentRow: -1,
      currentCol: -1,
      variables: { result: '[]' },
      explanation: "Initialize an empty list to store the elements in spiral order.",
      highlightedLines: [4],
      lineExecution: "const result: number[] = [];",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false, false, false], [false, false, false], [false, false, false]],
      currentRow: 0,
      currentCol: 0,
      variables: { direction: 'RIGHT', col: 0, row: 0 },
      explanation: "Move right along the top row from the 'left' boundary to the 'right' boundary.",
      highlightedLines: [7],
      lineExecution: "for (let col = left; col <= right; col++)",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1],
      visited: [[true, false, false], [false, false, false], [false, false, false]],
      currentRow: 0,
      currentCol: 0,
      variables: { add: 1, result: '[1]' },
      explanation: "Collect the element at matrix[top][0], which is 1.",
      highlightedLines: [8],
      lineExecution: "result.push(matrix[top][col]);",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1, 2],
      visited: [[true, true, false], [false, false, false], [false, false, false]],
      currentRow: 0,
      currentCol: 1,
      variables: { add: 2, result: '[1, 2]' },
      explanation: "Collect the next element in the top row: 2.",
      highlightedLines: [8],
      lineExecution: "result.push(matrix[top][col]);",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3],
      visited: [[true, true, true], [false, false, false], [false, false, false]],
      currentRow: 0,
      currentCol: 2,
      variables: { add: 3, result: '[1, 2, 3]' },
      explanation: "Collect 3. The top row traversal is complete.",
      highlightedLines: [8],
      lineExecution: "result.push(matrix[top][col]);",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3],
      visited: [[true, true, true], [false, false, false], [false, false, false]],
      currentRow: 0,
      currentCol: 2,
      variables: { top: 1, action: 'increment top' },
      explanation: "Shrink the top boundary: top = 1. We won't visit the first row again.",
      highlightedLines: [10],
      lineExecution: "top++;",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3],
      visited: [[true, true, true], [false, false, false], [false, false, false]],
      currentRow: 1,
      currentCol: 2,
      variables: { direction: 'DOWN', row: 1 },
      explanation: "Move down along the right column from 'top' to 'bottom'.",
      highlightedLines: [12],
      lineExecution: "for (let row = top; row <= bottom; row++)",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6],
      visited: [[true, true, true], [false, false, true], [false, false, false]],
      currentRow: 1,
      currentCol: 2,
      variables: { add: 6, result: '[1, 2, 3, 6]' },
      explanation: "Collect the element matrix[1][right], which is 6.",
      highlightedLines: [13],
      lineExecution: "result.push(matrix[row][right]);",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9],
      visited: [[true, true, true], [false, false, true], [false, false, true]],
      currentRow: 2,
      currentCol: 2,
      variables: { add: 9, result: '[1, 2, 3, 6, 9]' },
      explanation: "Collect 9. The right column traversal is complete.",
      highlightedLines: [13],
      lineExecution: "result.push(matrix[row][right]);",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9],
      visited: [[true, true, true], [false, false, true], [false, false, true]],
      currentRow: 2,
      currentCol: 2,
      variables: { right: 1, action: 'decrement right' },
      explanation: "Shrink the right boundary: right = 1.",
      highlightedLines: [15],
      lineExecution: "right--;",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9],
      visited: [[true, true, true], [false, false, true], [false, false, true]],
      currentRow: 2,
      currentCol: 1,
      variables: { direction: 'LEFT', col: 1 },
      explanation: "Since top <= bottom, move left along the bottom row from 'right' to 'left'.",
      highlightedLines: [18],
      lineExecution: "for (let col = right; col >= left; col--)",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8],
      visited: [[true, true, true], [false, false, true], [false, true, true]],
      currentRow: 2,
      currentCol: 1,
      variables: { add: 8, result: '[1, 2, 3, 6, 9, 8]' },
      explanation: "Collect matrix[bottom][1], which is 8.",
      highlightedLines: [19],
      lineExecution: "result.push(matrix[bottom][col]);",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7],
      visited: [[true, true, true], [false, false, true], [true, true, true]],
      currentRow: 2,
      currentCol: 0,
      variables: { add: 7, result: '[1, 2, 3, 6, 9, 8, 7]' },
      explanation: "Collect 7. The bottom row traversal is complete.",
      highlightedLines: [19],
      lineExecution: "result.push(matrix[bottom][col]);",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7],
      visited: [[true, true, true], [false, false, true], [true, true, true]],
      currentRow: 2,
      currentCol: 0,
      variables: { bottom: 1, action: 'decrement bottom' },
      explanation: "Shrink the bottom boundary: bottom = 1.",
      highlightedLines: [21],
      lineExecution: "bottom--;",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7],
      visited: [[true, true, true], [false, false, true], [true, true, true]],
      currentRow: 1,
      currentCol: 0,
      variables: { direction: 'UP', row: 1 },
      explanation: "Since left <= right, move up along the left column from 'bottom' to 'top'.",
      highlightedLines: [25],
      lineExecution: "for (let row = bottom; row >= top; row--)",
      direction: "up"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4],
      visited: [[true, true, true], [true, false, true], [true, true, true]],
      currentRow: 1,
      currentCol: 0,
      variables: { add: 4, result: '[1, 2, 3, 6, 9, 8, 7, 4]' },
      explanation: "Collect matrix[1][left], which is 4.",
      highlightedLines: [26],
      lineExecution: "result.push(matrix[row][left]);",
      direction: "up"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4],
      visited: [[true, true, true], [true, false, true], [true, true, true]],
      currentRow: 1,
      currentCol: 0,
      variables: { left: 1, action: 'increment left' },
      explanation: "Shrink the left boundary: left = 1.",
      highlightedLines: [28],
      lineExecution: "left++;",
      direction: "up"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4],
      visited: [[true, true, true], [true, false, true], [true, true, true]],
      currentRow: 1,
      currentCol: 1,
      variables: { check: 'top=1, bottom=1, left=1, right=1', continue: true },
      explanation: "All boundaries are 1. The loop continue condition is still met.",
      highlightedLines: [6],
      lineExecution: "while (top <= bottom && left <= right)",
      direction: "check"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4],
      visited: [[true, true, true], [true, false, true], [true, true, true]],
      currentRow: 1,
      currentCol: 1,
      variables: { direction: 'RIGHT', col: 1 },
      explanation: "Traverse the remaining cells in the inner matrix starting with RIGHT.",
      highlightedLines: [7],
      lineExecution: "for (let col = left; col <= right; col++)",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      visited: [[true, true, true], [true, true, true], [true, true, true]],
      currentRow: 1,
      currentCol: 1,
      variables: { add: 5, result: '[1, ..., 5]' },
      explanation: "Collect the central element: 5.",
      highlightedLines: [8],
      lineExecution: "result.push(matrix[top][col]);",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      visited: [[true, true, true], [true, true, true], [true, true, true]],
      currentRow: -1,
      currentCol: -1,
      variables: { check: 'top=2, bottom=1', stop: true },
      explanation: "The boundaries have crossed (top > bottom). The spiral traversal is finished.",
      highlightedLines: [6],
      lineExecution: "while (top <= bottom && left <= right)",
      direction: "complete"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      visited: [[true, true, true], [true, true, true], [true, true, true]],
      currentRow: -1,
      currentCol: -1,
      variables: { result: '[1, 2, 3, 6, 9, 8, 7, 4, 5]' },
      explanation: "Return the final sequence of elements.",
      highlightedLines: [31],
      lineExecution: "return result;",
      direction: "complete"
    },
    {
      matrix: initialMatrix,
      result: [1, 2, 3, 6, 9, 8, 7, 4, 5],
      visited: [[true, true, true], [true, true, true], [true, true, true]],
      currentRow: -1,
      currentCol: -1,
      variables: { time: 'O(m*n)', space: 'O(1)' },
      explanation: "Complexity: O(m×n) time to visit each cell once, and O(1) extra space excluding the output.",
      highlightedLines: [31],
      lineExecution: "return result;",
      direction: "complete"
    }
  ];

  const code = `function spiralOrder(matrix: number[][]): number[] {
  const m = matrix.length, n = matrix[0].length;
  let top = 0, bottom = m - 1, left = 0, right = n - 1;
  const result: number[] = [];
  
  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) {
      result.push(matrix[top][col]);
    }
    top++;
    
    for (let row = top; row <= bottom; row++) {
      result.push(matrix[row][right]);
    }
    right--;
    
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        result.push(matrix[bottom][col]);
      }
      bottom--;
    }
    
    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        result.push(matrix[row][left]);
      }
      left++;
    }
  }
  return result;
}`;

  const currentStep = steps[Math.min(currentStepIndex, steps.length - 1)];

  const getCellColor = (row: number, col: number) => {
    if (!currentStep?.matrix || !currentStep?.visited?.[row]) return 'bg-muted text-muted-foreground border-border';
    if (row === currentStep.currentRow && col === currentStep.currentCol) {
      return 'bg-primary text-black border-primary shadow-lg';
    }
    if (currentStep.visited[row][col]) {
      return 'bg-secondary/60 text-black border-secondary';
    }
    return 'bg-muted text-black border-border';
  };

  const getDirectionArrow = (direction: string) => {
    switch (direction) {
      case 'right': return '→';
      case 'down': return '↓';
      case 'left': return '←';
      case 'up': return '↑';
      default: return '';
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spiral Matrix</h3>
          <div className="space-y-4">
            <motion.div
              key={`matrix-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
              className="space-y-2"
            >
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                Direction:
                <span className="text-primary font-mono text-lg">
                  {getDirectionArrow(currentStep.direction)} {currentStep.direction.toUpperCase()}
                </span>
              </div>
              <div className="inline-block bg-card p-4 rounded-lg border">
                {currentStep.matrix.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1">
                    {row.map((cell, colIdx) => (
                      <div
                        key={`${rowIdx}-${colIdx}`}
                        className={`w-12 h-12 flex items-center justify-center font-mono text-lg rounded border-2 ${getCellColor(rowIdx, colIdx)}`}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              key={`result-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
              className="p-4 bg-primary/10 rounded-lg border-2 border-primary"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">Spiral Order Result:</div>
              <div className="flex flex-wrap gap-1">
                {currentStep.result.map((num, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-10 flex items-center justify-center font-mono bg-primary text-black rounded"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              key={`execution-${currentStepIndex}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0 }}
              className="p-3 bg-secondary/30 rounded border-l-4 border-secondary"
            >
              <div className="text-xs font-semibold text-secondary-foreground mb-1">Executing:</div>
              <code className="text-xs text-foreground font-mono">{currentStep.lineExecution}</code>
            </motion.div>

            <motion.div
              key={`explanation-${currentStepIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0 }}
              className="p-4 bg-muted/50 rounded text-sm leading-relaxed"
            >
              {currentStep.explanation}
            </motion.div>

            <motion.div
              key={`variables-${currentStepIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0 }}
            >
              <VariablePanel variables={currentStep.variables} />
            </motion.div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden">
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