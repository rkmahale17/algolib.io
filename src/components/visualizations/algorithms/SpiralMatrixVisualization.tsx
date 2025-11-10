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

  const initialMatrix = [[1,2,3],[4,5,6],[7,8,9]];
  
  const steps: Step[] = [
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false,false,false],[false,false,false],[false,false,false]],
      currentRow: -1,
      currentCol: -1,
      variables: { matrix: '3x3' },
      explanation: "Traverse 3x3 matrix in spiral order: right → down → left → up.",
      highlightedLines: [1],
      lineExecution: "function spiralOrder(matrix: number[][])",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false,false,false],[false,false,false],[false,false,false]],
      currentRow: -1,
      currentCol: -1,
      variables: { m: 3, n: 3 },
      explanation: "Get dimensions: 3 rows, 3 columns.",
      highlightedLines: [2],
      lineExecution: "const m = matrix.length, n = matrix[0].length;",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false,false,false],[false,false,false],[false,false,false]],
      currentRow: -1,
      currentCol: -1,
      variables: { top: 0, bottom: 2, left: 0, right: 2 },
      explanation: "Initialize boundaries: top=0, bottom=2, left=0, right=2.",
      highlightedLines: [3],
      lineExecution: "let top = 0, bottom = m - 1, left = 0, right = n - 1;",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false,false,false],[false,false,false],[false,false,false]],
      currentRow: -1,
      currentCol: -1,
      variables: { result: '[]' },
      explanation: "Initialize empty result array to store spiral traversal.",
      highlightedLines: [4],
      lineExecution: "const result: number[] = [];",
      direction: "init"
    },
    {
      matrix: initialMatrix,
      result: [],
      visited: [[false,false,false],[false,false,false],[false,false,false]],
      currentRow: 0,
      currentCol: 0,
      variables: { direction: 'RIGHT', col: 0, row: 0 },
      explanation: "Start traversal. Move RIGHT along top row from left to right.",
      highlightedLines: [8],
      lineExecution: "for (let col = left; col <= right; col++)",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1],
      visited: [[true,false,false],[false,false,false],[false,false,false]],
      currentRow: 0,
      currentCol: 0,
      variables: { add: 1, result: '[1]' },
      explanation: "Add matrix[0][0] = 1 to result.",
      highlightedLines: [9],
      lineExecution: "result.push(matrix[top][col]); // push 1",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1,2],
      visited: [[true,true,false],[false,false,false],[false,false,false]],
      currentRow: 0,
      currentCol: 1,
      variables: { add: 2, result: '[1,2]' },
      explanation: "Add matrix[0][1] = 2 to result.",
      highlightedLines: [9],
      lineExecution: "result.push(matrix[top][col]); // push 2",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3],
      visited: [[true,true,true],[false,false,false],[false,false,false]],
      currentRow: 0,
      currentCol: 2,
      variables: { add: 3, result: '[1,2,3]' },
      explanation: "Add matrix[0][2] = 3 to result. Finished top row.",
      highlightedLines: [9],
      lineExecution: "result.push(matrix[top][col]); // push 3",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3],
      visited: [[true,true,true],[false,false,false],[false,false,false]],
      currentRow: 0,
      currentCol: 2,
      variables: { top: 1, action: 'increment top' },
      explanation: "Finished top row. Move top boundary down: top = 1.",
      highlightedLines: [11],
      lineExecution: "top++;",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3],
      visited: [[true,true,true],[false,false,false],[false,false,false]],
      currentRow: 1,
      currentCol: 2,
      variables: { direction: 'DOWN', row: 1 },
      explanation: "Now move DOWN along right column from top to bottom.",
      highlightedLines: [14],
      lineExecution: "for (let row = top; row <= bottom; row++)",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6],
      visited: [[true,true,true],[false,false,true],[false,false,false]],
      currentRow: 1,
      currentCol: 2,
      variables: { add: 6, result: '[1,2,3,6]' },
      explanation: "Add matrix[1][2] = 6 to result.",
      highlightedLines: [15],
      lineExecution: "result.push(matrix[row][right]); // push 6",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9],
      visited: [[true,true,true],[false,false,true],[false,false,true]],
      currentRow: 2,
      currentCol: 2,
      variables: { add: 9, result: '[1,2,3,6,9]' },
      explanation: "Add matrix[2][2] = 9 to result. Finished right column.",
      highlightedLines: [15],
      lineExecution: "result.push(matrix[row][right]); // push 9",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9],
      visited: [[true,true,true],[false,false,true],[false,false,true]],
      currentRow: 2,
      currentCol: 2,
      variables: { right: 1, action: 'decrement right' },
      explanation: "Finished right column. Move right boundary left: right = 1.",
      highlightedLines: [17],
      lineExecution: "right--;",
      direction: "down"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9],
      visited: [[true,true,true],[false,false,true],[false,false,true]],
      currentRow: 2,
      currentCol: 1,
      variables: { direction: 'LEFT', col: 1 },
      explanation: "Now move LEFT along bottom row from right to left.",
      highlightedLines: [20],
      lineExecution: "for (let col = right; col >= left; col--)",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8],
      visited: [[true,true,true],[false,false,true],[false,true,true]],
      currentRow: 2,
      currentCol: 1,
      variables: { add: 8, result: '[1,2,3,6,9,8]' },
      explanation: "Add matrix[2][1] = 8 to result.",
      highlightedLines: [21],
      lineExecution: "result.push(matrix[bottom][col]); // push 8",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7],
      visited: [[true,true,true],[false,false,true],[true,true,true]],
      currentRow: 2,
      currentCol: 0,
      variables: { add: 7, result: '[1,2,3,6,9,8,7]' },
      explanation: "Add matrix[2][0] = 7 to result. Finished bottom row.",
      highlightedLines: [21],
      lineExecution: "result.push(matrix[bottom][col]); // push 7",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7],
      visited: [[true,true,true],[false,false,true],[true,true,true]],
      currentRow: 2,
      currentCol: 0,
      variables: { bottom: 1, action: 'decrement bottom' },
      explanation: "Finished bottom row. Move bottom boundary up: bottom = 1.",
      highlightedLines: [23],
      lineExecution: "bottom--;",
      direction: "left"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7],
      visited: [[true,true,true],[false,false,true],[true,true,true]],
      currentRow: 1,
      currentCol: 0,
      variables: { direction: 'UP', row: 1 },
      explanation: "Now move UP along left column from bottom to top.",
      highlightedLines: [26],
      lineExecution: "for (let row = bottom; row >= top; row--)",
      direction: "up"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4],
      visited: [[true,true,true],[true,false,true],[true,true,true]],
      currentRow: 1,
      currentCol: 0,
      variables: { add: 4, result: '[1,2,3,6,9,8,7,4]' },
      explanation: "Add matrix[1][0] = 4 to result. Finished left column.",
      highlightedLines: [27],
      lineExecution: "result.push(matrix[row][left]); // push 4",
      direction: "up"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4],
      visited: [[true,true,true],[true,false,true],[true,true,true]],
      currentRow: 1,
      currentCol: 0,
      variables: { left: 1, action: 'increment left' },
      explanation: "Finished left column. Move left boundary right: left = 1.",
      highlightedLines: [29],
      lineExecution: "left++;",
      direction: "up"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4],
      visited: [[true,true,true],[true,false,true],[true,true,true]],
      currentRow: 1,
      currentCol: 1,
      variables: { check: 'top=1, bottom=1', continue: true },
      explanation: "Check boundaries: top=1, bottom=1. Still valid, continue spiral.",
      highlightedLines: [6],
      lineExecution: "while (top <= bottom && left <= right) // true",
      direction: "check"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4],
      visited: [[true,true,true],[true,false,true],[true,true,true]],
      currentRow: 1,
      currentCol: 1,
      variables: { direction: 'RIGHT', col: 1 },
      explanation: "Move RIGHT again along row 1.",
      highlightedLines: [8],
      lineExecution: "for (let col = left; col <= right; col++)",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4,5],
      visited: [[true,true,true],[true,true,true],[true,true,true]],
      currentRow: 1,
      currentCol: 1,
      variables: { add: 5, result: '[1,2,3,6,9,8,7,4,5]' },
      explanation: "Add matrix[1][1] = 5 to result. All cells visited!",
      highlightedLines: [9],
      lineExecution: "result.push(matrix[top][col]); // push 5",
      direction: "right"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4,5],
      visited: [[true,true,true],[true,true,true],[true,true,true]],
      currentRow: -1,
      currentCol: -1,
      variables: { check: 'top=2, bottom=1', stop: true },
      explanation: "Check boundaries: top > bottom. Exit loop.",
      highlightedLines: [6],
      lineExecution: "while (top <= bottom && left <= right) // false",
      direction: "complete"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4,5],
      visited: [[true,true,true],[true,true,true],[true,true,true]],
      currentRow: -1,
      currentCol: -1,
      variables: { result: '[1,2,3,6,9,8,7,4,5]' },
      explanation: "Return spiral order: [1,2,3,6,9,8,7,4,5].",
      highlightedLines: [32],
      lineExecution: "return result;",
      direction: "complete"
    },
    {
      matrix: initialMatrix,
      result: [1,2,3,6,9,8,7,4,5],
      visited: [[true,true,true],[true,true,true],[true,true,true]],
      currentRow: -1,
      currentCol: -1,
      variables: { time: 'O(m*n)', space: 'O(1)' },
      explanation: "Algorithm complete! Time: O(m×n) visit each cell once. Space: O(1) excluding result.",
      highlightedLines: [32],
      lineExecution: "// Done",
      direction: "complete"
    }
  ];

  const code = `function spiralOrder(matrix: number[][]): number[] {
  const m = matrix.length, n = matrix[0].length;
  let top = 0, bottom = m - 1, left = 0, right = n - 1;
  const result: number[] = [];
  
  while (top <= bottom && left <= right) {
    // Move right along top row
    for (let col = left; col <= right; col++) {
      result.push(matrix[top][col]);
    }
    top++;
    
    // Move down along right column
    for (let row = top; row <= bottom; row++) {
      result.push(matrix[row][right]);
    }
    right--;
    
    // Move left along bottom row
    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        result.push(matrix[bottom][col]);
      }
      bottom--;
    }
    
    // Move up along left column
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
      return 'bg-primary text-primary-foreground border-primary shadow-lg scale-110';
    }
    if (currentStep.visited[row][col]) {
      return 'bg-secondary/60 text-secondary-foreground border-secondary';
    }
    return 'bg-muted text-muted-foreground border-border';
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spiral Matrix</h3>
          <div className="space-y-4">
            <motion.div 
              key={`matrix-${currentStepIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
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
                      <motion.div
                        key={`${rowIdx}-${colIdx}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: rowIdx === currentStep.currentRow && colIdx === currentStep.currentCol ? 1.1 : 1 }}
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
              key={`result-${currentStepIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-primary/10 rounded-lg border-2 border-primary"
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">Spiral Order Result:</div>
              <div className="flex flex-wrap gap-1">
                {currentStep.result.map((num, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-10 h-10 flex items-center justify-center font-mono font-bold bg-primary text-primary-foreground rounded"
                  >
                    {num}
                  </motion.div>
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