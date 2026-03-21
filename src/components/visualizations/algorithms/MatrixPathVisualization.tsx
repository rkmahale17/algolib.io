import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  dp: number[][];
  i: number;
  j: number;
  message: string;
  lineNumber: number;
}

export const MatrixPathVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function uniquePaths(m: number, n: number): number {
  let row: number[] = new Array(n).fill(1);
  for (let i = 0; i < m - 1; i++) {
    const newRow: number[] = new Array(n).fill(1);
    for (let j = n - 2; j >= 0; j--) {
      newRow[j] = newRow[j + 1] + row[j];
    }
    row = newRow;
  }
  return row[0];
}`;

  const generateSteps = () => {
    const m = 3;
    const n = 4;
    const displayGrid = Array(m).fill(0).map(() => Array(n).fill(0));
    const newSteps: Step[] = [];

    let row = new Array(n).fill(1);
    for (let c = 0; c < n; c++) displayGrid[m - 1][c] = 1;

    newSteps.push({
      dp: displayGrid.map(r => [...r]),
      i: m - 1,
      j: -1,
      message: "Initialize 'row' with 1s. Representing the paths across the bottommost conceptual row.",
      lineNumber: 2,
    });

    for (let i = 0; i < m - 1; i++) {
      const visualRowIdx = m - 2 - i;
      const newRow = new Array(n).fill(1);
      displayGrid[visualRowIdx][n - 1] = 1;

      newSteps.push({
        dp: displayGrid.map(r => [...r]),
        i: visualRowIdx,
        j: n - 1,
        message: `Row iteration ${i + 1}: Initialize 'newRow' with 1s. Rightmost column always has 1 conceptual path.`,
        lineNumber: 4,
      });

      for (let j = n - 2; j >= 0; j--) {
        newRow[j] = newRow[j + 1] + row[j];
        displayGrid[visualRowIdx][j] = newRow[j];

        newSteps.push({
          dp: displayGrid.map(r => [...r]),
          i: visualRowIdx,
          j,
          message: `newRow[${j}] = newRow[${j + 1}] (${newRow[j + 1]}) + row[${j}] (${row[j]}) = ${newRow[j]}`,
          lineNumber: 6,
        });
      }

      row = [...newRow];
      newSteps.push({
        dp: displayGrid.map(r => [...r]),
        i: visualRowIdx,
        j: -1,
        message: "Update 'row' to be 'newRow' for the next upwards iteration.",
        lineNumber: 8,
      });
    }

    newSteps.push({
      dp: displayGrid.map(r => [...r]),
      i: 0,
      j: 0,
      message: `Total unique paths: ${row[0]}`,
      lineNumber: 10,
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Unique Paths in Matrix</h3>

          <div className="inline-block">
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${currentStep.dp[0].length}, minmax(0, 1fr))`,
              }}
            >
              {currentStep.dp.map((row, i) => (
                <React.Fragment key={i}>
                  {row.map((val, j) => {
                    const isCurrent = i === currentStep.i && j === currentStep.j;
                    let isDependency = false;
                    if (currentStep.j !== -1 && !isCurrent) {
                      if ((i === currentStep.i && j === currentStep.j + 1) ||
                        (i === currentStep.i + 1 && j === currentStep.j)) {
                        isDependency = true;
                      }
                    }

                    return (
                      <div
                        key={`${i}-${j}`}
                        className={`w-16 h-16 border-2 flex items-center justify-center font-bold text-lg transition-all ${isCurrent
                            ? "bg-primary text-primary-foreground scale-110 border-primary"
                            : isDependency
                              ? "bg-secondary border-primary/50 text-secondary-foreground"
                              : val > 0
                                ? "bg-green-500/20 border-green-500 text-green-500"
                                : "bg-card border-border"
                          }`}
                      >
                        {val > 0 ? val : ""}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 border-2 border-primary"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
                <span>Computed</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>

          <div className="rounded-lg mt-4">
            <VariablePanel
              variables={{
                row: "array tracking the row below",
                newRow: "array tracking the current computed row",
                j: currentStep.j !== -1 ? currentStep.j : "completed iteration",
                currentCellValue: currentStep.j !== -1 ? currentStep.dp[currentStep.i][currentStep.j] : "N/A"
              }}
            />
          </div>
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};
