import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { StepControls } from '../shared/StepControls';

interface Step {
  matrix: number[][];
  variables: Record<string, any>;
  explanation: string;
  highlightedLines: number[];
  phase: string;
  currentRow?: number;
  currentCol?: number;
}

export const SetMatrixZeroesVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function setZeroes(matrix: number[][]): void {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = false, firstColZero = false;

  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
    }
  }

  for (let j = 0; j < n; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
    }
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  if (firstColZero) {
    for (let i = 0; i < m; i++) {
      matrix[i][0] = 0;
    }
  }

  if (firstRowZero) {
    for (let j = 0; j < n; j++) {
      matrix[0][j] = 0;
    }
  }
}`;

  const generateSteps = () => {
    const initialMatrix = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1]
    ];
    const m = initialMatrix.length;
    const n = initialMatrix[0].length;
    const matrix = initialMatrix.map(row => [...row]);
    const newSteps: Step[] = [];

    const addStep = (msg: string, lines: number[], phase: string, extra: Partial<Step> = {}) => {
      newSteps.push({
        matrix: matrix.map(row => [...row]),
        explanation: msg,
        highlightedLines: lines,
        phase,
        variables: {
          m,
          n,
          ...extra.variables
        },
        currentRow: extra.currentRow,
        currentCol: extra.currentCol
      });
    };

    // 1. Init
    addStep("Initialize dimensions and track if the first row/column should be zeroed.", [1, 2, 3], "Initialization", {
      variables: { firstRowZero: false, firstColZero: false }
    });

    let firstRowZero = false;
    let firstColZero = false;

    // 2. Check first column
    for (let i = 0; i < m; i++) {
      addStep(`Checking matrix[${i}][0] in the first column.`, [5, 6], "Check First Column", {
        currentRow: i,
        currentCol: 0,
        variables: { firstRowZero, firstColZero, i }
      });
      if (matrix[i][0] === 0) {
        firstColZero = true;
        addStep("Found a 0 in the first column. Set firstColZero to true.", [7], "Check First Column", {
          currentRow: i,
          currentCol: 0,
          variables: { firstRowZero, firstColZero, i }
        });
      }
    }

    // 3. Check first row
    for (let j = 0; j < n; j++) {
      addStep(`Checking matrix[0][${j}] in the first row.`, [11, 12], "Check First Row", {
        currentRow: 0,
        currentCol: j,
        variables: { firstRowZero, firstColZero, j }
      });
      if (matrix[0][j] === 0) {
        firstRowZero = true;
        addStep("Found a 0 in the first row. Set firstRowZero to true.", [13], "Check First Row", {
          currentRow: 0,
          currentCol: j,
          variables: { firstRowZero, firstColZero, j }
        });
      }
    }

    // 4. Mark cells
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        addStep(`Scanning inner cell matrix[${i}][${j}].`, [17, 18], "Marking Markers", {
          currentRow: i,
          currentCol: j,
          variables: { firstRowZero, firstColZero, i, j }
        });
        if (matrix[i][j] === 0) {
          matrix[i][0] = 0;
          matrix[0][j] = 0;
          addStep(`Found 0 at [${i}][${j}]. Use first row/column to mark this row and column.`, [19, 20, 21], "Marking Markers", {
            currentRow: i,
            currentCol: j,
            variables: { firstRowZero, firstColZero, i, j }
          });
        }
      }
    }

    // 5. Zero out using markers
    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        addStep(`Checking markers for matrix[${i}][${j}].`, [25, 26], "Zeroing Inner", {
          currentRow: i,
          currentCol: j,
          variables: { firstRowZero, firstColZero, i, j, 'matrix[i][0]': matrix[i][0], 'matrix[0][j]': matrix[0][j] }
        });
        if (matrix[i][0] === 0 || matrix[0][j] === 0) {
          matrix[i][j] = 0;
          addStep(`Marker found in either row ${i} or column ${j}. Setting matrix[${i}][${j}] to 0.`, [27], "Zeroing Inner", {
            currentRow: i,
            currentCol: j,
            variables: { firstRowZero, firstColZero, i, j }
          });
        }
      }
    }

    // 6. Finalize Column
    addStep("Finally, check if the first column itself needs to be zeroed.", [31], "Finalize Column", {
      variables: { firstRowZero, firstColZero }
    });
    if (firstColZero) {
      for (let i = 0; i < m; i++) {
        matrix[i][0] = 0;
        addStep(`Zeroing first column: matrix[${i}][0] = 0.`, [33], "Finalize Column", {
          currentRow: i,
          currentCol: 0,
          variables: { firstRowZero, firstColZero, i }
        });
      }
    }

    // 7. Finalize Row
    addStep("Check if the first row itself needs to be zeroed.", [36], "Finalize Row", {
      variables: { firstRowZero, firstColZero }
    });
    if (firstRowZero) {
      for (let j = 0; j < n; j++) {
        matrix[0][j] = 0;
        addStep(`Zeroing first row: matrix[0][${j}] = 0.`, [38], "Finalize Row", {
          currentRow: 0,
          currentCol: j,
          variables: { firstRowZero, firstColZero, j }
        });
      }
    }

    addStep("Matrix updated successfully in-place with O(1) extra space.", [], "Complete", {
      variables: { firstRowZero, firstColZero }
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  const getCellColor = (row: number, col: number) => {
    const isCurrent = row === currentStep.currentRow && col === currentStep.currentCol;
    const value = currentStep.matrix[row][col];

    if (isCurrent) return 'bg-yellow-400 border-yellow-600 text-black z-10 scale-110';
    if (value === 0) return 'bg-red-100 border-red-300 text-black';
    if (row === 0 || col === 0) return 'bg-blue-50 border-blue-200 text-black';
    return 'bg-white border-slate-200 text-black';
  };

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-muted/30 rounded-xl border border-border/50 p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div className="mb-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Phase: <span className="text-primary font-bold">{currentStep.phase}</span>
            </div>
            <div className="grid gap-2 bg-slate-100 p-6 rounded-xl border-4 border-slate-200 shadow-inner">
              {currentStep.matrix.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-2">
                  {row.map((cell, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-sm sm:text-lg font-bold rounded-lg border-2 transition-all duration-200 shadow-sm ${getCellColor(rowIdx, colIdx)}`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 rounded-lg border border-primary/20 p-4 flex gap-3 shadow-sm"
          >
            <Info className="text-primary shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-foreground leading-relaxed">{currentStep.explanation}</p>
          </motion.div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-border shadow-md">
            <AnimatedCodeEditor
              code={code}
              highlightedLines={currentStep.highlightedLines}
              language="typescript"
            />
          </div>

          <Card className="p-4 bg-muted/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Algorithm Strategy</h4>
            <ul className="text-xs space-y-2 text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>To achieve <strong>O(1) space</strong>, we use the first row and first column of the matrix itself as markers.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>We handle the first row and column separately using flags to avoid data loss.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>First, overlap flags are determined for row 0 and column 0.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Then, scan the inner matrix and mark <code>matrix[i][0]</code> and <code>matrix[0][j]</code> if <code>matrix[i][j]</code> is 0.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Finally, zero out the cells based on those markers and the initial flags.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};