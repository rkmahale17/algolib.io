import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { RotateCw } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  matrix: number[][];
  currentRow: number;
  currentCol: number;
  swapWith: [number, number][];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  python: `def rotate(matrix: list[list[int]]) -> None:
    l = 0
    r = len(matrix) - 1
    while l < r:
        for i in range(r - l):
            top = l
            bottom = r
            topLeft = matrix[top][l + i]
            matrix[top][l + i] = matrix[bottom - i][l]
            matrix[bottom - i][l] = matrix[bottom][r - i]
            matrix[bottom][r - i] = matrix[top + i][r]
            matrix[top + i][r] = topLeft
        r -= 1
        l += 1`,

  typescript: `function rotate(matrix: number[][]): void {
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
}`,

  java: `public class Solution {
    public void rotate(int[][] matrix) {
        int n = matrix.length;
        for (int i = 0; i < (n + 1) / 2; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[n - 1 - j][i];
                matrix[n - 1 - j][i] = matrix[n - 1 - i][n - j - 1];
                matrix[n - 1 - i][n - j - 1] = matrix[j][n - 1 - i];
                matrix[j][n - 1 - i] = matrix[i][j];
                matrix[i][j] = temp;
            }
        }
    }
}`,

  cpp: `class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < (n + 1) / 2; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[n - 1 - j][i];
                matrix[n - 1 - j][i] = matrix[n - 1 - i][n - j - 1];
                matrix[n - 1 - i][n - j - 1] = matrix[j][n - 1 - i];
                matrix[j][n - 1 - i] = matrix[i][j];
                matrix[i][j] = temp;
            }
        }
    }
};`
};

const generateVisualizationData = () => {
  const initialMatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const n = initialMatrix.length;
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

  let l = 0;
  let r = n - 1;

  const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
    steps.push({
      matrix: matrix.map(row => [...row]),
      currentRow: extra.currentRow ?? -1,
      currentCol: extra.currentCol ?? -1,
      swapWith: extra.swapWith ?? [],
      variables: {
        l,
        r,
        ...extra.variables
      },
      explanation: msg,
      pseudoStep: pseudo
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  addStep("Initialize left and right pointers to define outer boundary layer.", "CALL rotate(matrix)", 2, 2, 3, 4);

  while (l < r) {
    // 2. Loop check
    addStep(`Outer loop check: is left (${l}) < right (${r})?`, `WHILE l < r → ${l} < ${r}`, 4, 4, 4, 5);

    for (let i = 0; i < r - l; i++) {
      const top = l;
      const bottom = r;
      // 3. Inner loop check
      addStep(`Process cell group. Offset i = ${i}. Boundaries: top = ${top}, bottom = ${bottom}.`, `FOR i = ${i} TO ${r - l - 1}`, 5, 5, 5, 6, {
        variables: { top, bottom, i }
      });

      // 4. Save top-left
      const topLeftVal = matrix[top][l + i];
      addStep(
        `1. Save top-left element matrix[${top}][${l + i}] = ${topLeftVal} in a temporary variable.`,
        `SET temp = matrix[top][l + i] → ${topLeftVal}`,
        8, 8, 6, 7,
        { currentRow: top, currentCol: l + i, variables: { top, bottom, i, temp: topLeftVal } }
      );

      // 5. Bottom-left to top-left
      matrix[top][l + i] = matrix[bottom - i][l];
      addStep(
        `2. Move bottom-left element matrix[${bottom - i}][${l}] = ${matrix[bottom - i][l]} to top-left.`,
        `SET matrix[top][l + i] = matrix[bottom - i][l]`,
        9, 9, 7, 8,
        { currentRow: top, currentCol: l + i, swapWith: [[bottom - i, l]], variables: { top, bottom, i, temp: topLeftVal } }
      );

      // 6. Bottom-right to bottom-left
      matrix[bottom - i][l] = matrix[bottom][r - i];
      addStep(
        `3. Move bottom-right element matrix[${bottom}][${r - i}] = ${matrix[bottom][r - i]} to bottom-left.`,
        `SET matrix[bottom - i][l] = matrix[bottom][r - i]`,
        10, 10, 8, 9,
        { currentRow: bottom - i, currentCol: l, swapWith: [[bottom, r - i]], variables: { top, bottom, i, temp: topLeftVal } }
      );

      // 7. Top-right to bottom-right
      matrix[bottom][r - i] = matrix[top + i][r];
      addStep(
        `4. Move top-right element matrix[${top + i}][${r}] = ${matrix[top + i][r]} to bottom-right.`,
        `SET matrix[bottom][r - i] = matrix[top + i][r]`,
        11, 11, 9, 10,
        { currentRow: bottom, currentCol: r - i, swapWith: [[top + i, r]], variables: { top, bottom, i, temp: topLeftVal } }
      );

      // 8. Temp to top-right
      matrix[top + i][r] = topLeftVal;
      addStep(
        `5. Move saved temp value (${topLeftVal}) to top-right matrix[${top + i}][${r}].`,
        `SET matrix[top + i][r] = temp`,
        12, 12, 10, 11,
        { currentRow: top + i, currentCol: r, variables: { top, bottom, i, temp: topLeftVal } }
      );
    }

    l += 1;
    r -= 1;
    addStep(`Move layer boundaries inward. New left = ${l}, right = ${r}.`, "SET r = r - 1, l = l + 1", 14, 13, 4, 5);
  }

  // Final Complete
  addStep("In-place 90° clockwise rotation is complete.", "RETURN", 17, 14, 13, 13);

  return { steps, stepLineNumbers };
};

export const RotateImageVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getCellColor = (row: number, col: number) => {
    if (!currentStep?.swapWith) return 'bg-muted text-foreground border-border';
    if (currentStep.swapWith.some(([r, c]) => r === row && c === col)) {
      return 'bg-destructive/80 text-destructive-foreground border-destructive shadow-lg';
    }
    if (row === currentStep.currentRow && col === currentStep.currentCol) {
      return 'bg-primary text-primary-foreground border-primary shadow-lg scale-110 z-10';
    }
    return 'bg-muted text-foreground border-border';
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
              <RotateCw className="w-5 h-5 text-primary" />
              Matrix State
            </h3>
            
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block bg-muted/30 p-4 rounded-xl border border-border shadow-inner">
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
                        className={`w-12 h-12 flex items-center justify-center font-mono text-lg font-bold rounded-lg border transition-colors ${getCellColor(rowIdx, colIdx)}`}
                      >
                        {cell}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>

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