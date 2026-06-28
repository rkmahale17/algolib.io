import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  matrix: number[][];
  result: number[];
  visited: boolean[][];
  currentRow: number;
  currentCol: number;
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
  direction: string;
}

const languages: VisualizationLanguageMap = {
  python: `def spiralOrder(matrix):
    res = []
    left, right = 0, len(matrix[0])
    top, bottom = 0, len(matrix)
    while left < right and top < bottom:
        for i in range(left, right):
            res.append(matrix[top][i])
        top += 1
        for i in range(top, bottom):
            res.append(matrix[i][right - 1])
        right -= 1
        if not (left < right and top < bottom):
            break
        for i in range(right - 1, left - 1, -1):
            res.append(matrix[bottom - 1][i])
        bottom -= 1
        for i in range(bottom - 1, top - 1, -1):
            res.append(matrix[i][left])
        left += 1
    return res`,

  typescript: `function spiralOrder(matrix: number[][]): number[] {
  const res: number[] = [];
  if (matrix.length === 0) return res;
  let left = 0;
  let right = matrix[0].length;
  let top = 0;
  let bottom = matrix.length;
  while (left < right && top < bottom) {
    for (let i = left; i < right; i++) {
      res.push(matrix[top][i]);
    }
    top += 1;
    for (let i = top; i < bottom; i++) {
      res.push(matrix[i][right - 1]);
    }
    right -= 1;
    if (!(left < right && top < bottom)) {
      break;
    }
    for (let i = right - 1; i >= left; i--) {
      res.push(matrix[bottom - 1][i]);
    }
    bottom -= 1;
    for (let i = bottom - 1; i >= top; i--) {
      res.push(matrix[i][left]);
    }
    left += 1;
  }
  return res;
}`,

  java: `public class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        int left = 0;
        int right = matrix[0].length;
        int top = 0;
        int bottom = matrix.length;
        while (left < right && top < bottom) {
            for (int i = left; i < right; i++) {
                res.add(matrix[top][i]);
            }
            top += 1;
            for (int i = top; i < bottom; i++) {
                res.add(matrix[i][right - 1]);
            }
            right -= 1;
            if (!(left < right && top < bottom)) {
                break;
            }
            for (int i = right - 1; i >= left; i--) {
                res.add(matrix[bottom - 1][i]);
            }
            bottom -= 1;
            for (int i = bottom - 1; i >= top; i--) {
                res.add(matrix[i][left]);
            }
            left += 1;
        }
        return res;
    }
}`,

  cpp: `class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        int left = 0;
        int right = matrix[0].size();
        int top = 0;
        int bottom = matrix.size();
        while (left < right && top < bottom) {
            for (int i = left; i < right; i++) {
                res.push_back(matrix[top][i]);
            }
            top += 1;
            for (int i = top; i < bottom; i++) {
                res.push_back(matrix[i][right - 1]);
            }
            right -= 1;
            if (!(left < right && top < bottom)) {
                break;
            }
            for (int i = right - 1; i >= left; i--) {
                res.push_back(matrix[bottom - 1][i]);
            }
            bottom -= 1;
            for (int i = bottom - 1; i >= top; i--) {
                res.push_back(matrix[i][left]);
            }
            left += 1;
        }
        return res;
    }
};`
};

const generateVisualizationData = () => {
  const matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const m = matrix.length;
  const n = matrix[0].length;

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

  const result: number[] = [];
  const visited = [
    [false, false, false],
    [false, false, false],
    [false, false, false]
  ];

  let left = 0;
  let right = n;
  let top = 0;
  let bottom = m;

  let currentRow = -1;
  let currentCol = -1;
  let direction = "init";

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number) => {
    steps.push({
      matrix: matrix.map(row => [...row]),
      result: [...result],
      visited: visited.map(row => [...row]),
      currentRow,
      currentCol,
      variables: {
        left,
        right,
        top,
        bottom,
        currentRow: currentRow >= 0 ? currentRow : "none",
        currentCol: currentCol >= 0 ? currentCol : "none",
        resultSize: result.length
      },
      explanation: msg,
      pseudoStep: pseudo,
      direction
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Traverse a 3x3 matrix in spiral order.", "CALL spiralOrder(matrix)", 1, 1, 2, 3);

  // 2. Initialize boundaries
  addStep("Initialize boundaries: left = 0, right = 3 (exclusive), top = 0, bottom = 3 (exclusive).", "SET left = 0, right = 3, top = 0, bottom = 3", 4, 3, 4, 5);

  while (left < right && top < bottom) {
    direction = "check";
    addStep("Loop condition: is left < right AND top < bottom?", "WHILE left < right AND top < bottom", 8, 5, 8, 9);

    // Left to right
    direction = "right";
    for (let i = left; i < right; i++) {
      currentCol = i;
      currentRow = top;
      result.push(matrix[currentRow][currentCol]);
      visited[currentRow][currentCol] = true;
      addStep(`Traverse right on top row. Collect cell matrix[${currentRow}][${currentCol}] = ${matrix[currentRow][currentCol]}.`, `APPEND matrix[top][${i}]`, 10, 7, 10, 11);
    }
    top += 1;
    currentRow = -1;
    currentCol = -1;
    addStep("Finished top row traversal. Move top boundary inward.", "SET top = top + 1", 12, 8, 12, 13);

    // Top to bottom
    direction = "down";
    for (let i = top; i < bottom; i++) {
      currentCol = right - 1;
      currentRow = i;
      result.push(matrix[currentRow][currentCol]);
      visited[currentRow][currentCol] = true;
      addStep(`Traverse down on right column. Collect cell matrix[${currentRow}][${currentCol}] = ${matrix[currentRow][currentCol]}.`, `APPEND matrix[${i}][right - 1]`, 14, 10, 14, 15);
    }
    right -= 1;
    currentRow = -1;
    currentCol = -1;
    addStep("Finished right column traversal. Move right boundary inward.", "SET right = right - 1", 16, 11, 16, 17);

    // Check crossed
    direction = "check";
    addStep("Check if the submatrix boundaries have crossed to prevent duplicate traversal.", "IF NOT (left < right AND top < bottom) -> BREAK", 17, 12, 17, 18);
    if (!(left < right && top < bottom)) {
      break;
    }

    // Right to left
    direction = "left";
    for (let i = right - 1; i >= left; i--) {
      currentCol = i;
      currentRow = bottom - 1;
      result.push(matrix[currentRow][currentCol]);
      visited[currentRow][currentCol] = true;
      addStep(`Traverse left on bottom row. Collect cell matrix[${currentRow}][${currentCol}] = ${matrix[currentRow][currentCol]}.`, `APPEND matrix[bottom - 1][${i}]`, 21, 15, 21, 22);
    }
    bottom -= 1;
    currentRow = -1;
    currentCol = -1;
    addStep("Finished bottom row traversal. Move bottom boundary inward.", "SET bottom = bottom - 1", 23, 16, 23, 24);

    // Bottom to top
    direction = "up";
    for (let i = bottom - 1; i >= top; i--) {
      currentCol = left;
      currentRow = i;
      result.push(matrix[currentRow][currentCol]);
      visited[currentRow][currentCol] = true;
      addStep(`Traverse up on left column. Collect cell matrix[${currentRow}][${currentCol}] = ${matrix[currentRow][currentCol]}.`, `APPEND matrix[${i}][left]`, 25, 18, 25, 26);
    }
    left += 1;
    currentRow = -1;
    currentCol = -1;
    addStep("Finished left column traversal. Move left boundary inward.", "SET left = left + 1", 27, 19, 27, 28);
  }

  direction = "complete";
  addStep("Traversals complete. Return the elements in spiral order.", "RETURN res", 29, 20, 29, 30);

  return { steps, stepLineNumbers };
};

export const SpiralMatrixVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getCellColor = (row: number, col: number) => {
    if (!currentStep?.matrix || !currentStep?.visited?.[row]) return 'bg-muted text-muted-foreground border-border';
    if (row === currentStep.currentRow && col === currentStep.currentCol) {
      return 'bg-primary text-primary-foreground border-primary shadow-lg scale-105 z-10';
    }
    if (currentStep.visited[row][col]) {
      return 'bg-secondary/60 text-secondary-foreground border-secondary';
    }
    return 'bg-muted text-foreground border-border';
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
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="mb-4 text-xs font-mono text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
              Direction:
              <span className="text-primary font-bold">
                {getDirectionArrow(currentStep.direction)} {currentStep.direction.toUpperCase()}
              </span>
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

            <div className="w-full mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Spiral Order Result:</div>
              <div className="flex flex-wrap gap-1">
                {currentStep.result.map((num, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 flex items-center justify-center font-mono bg-primary text-primary-foreground rounded text-xs font-bold"
                  >
                    {num}
                  </div>
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