import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  grid: number[][];
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

  const code = `function uniquePaths(m, n) {
  const dp = Array(m).fill(0)
    .map(() => Array(n).fill(0));
  
  // Initialize first row and column
  for (let i = 0; i < m; i++) dp[i][0] = 1;
  for (let j = 0; j < n; j++) dp[0][j] = 1;
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i-1][j] + dp[i][j-1];
    }
  }
  
  return dp[m-1][n-1];
}`;

  const generateSteps = () => {
    const m = 3;
    const n = 4;
    const grid = Array(m).fill(0).map(() => Array(n).fill(0));
    const dp = Array(m).fill(0).map(() => Array(n).fill(0));
    const newSteps: Step[] = [];

    // Initialize
    for (let i = 0; i < m; i++) dp[i][0] = 1;
    for (let j = 0; j < n; j++) dp[0][j] = 1;

    newSteps.push({
      grid: grid.map(row => [...row]),
      dp: dp.map(row => [...row]),
      i: 0,
      j: 0,
      message: 'Initialize: First row and column have 1 path each',
      lineNumber: 6
    });

    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        dp[i][j] = dp[i-1][j] + dp[i][j-1];
        
        newSteps.push({
          grid: grid.map(row => [...row]),
          dp: dp.map(row => [...row]),
          i,
          j,
          message: `dp[${i}][${j}] = dp[${i-1}][${j}] + dp[${i}][${j-1}] = ${dp[i-1][j]} + ${dp[i][j-1]} = ${dp[i][j]}`,
          lineNumber: 11
        });
      }
    }

    newSteps.push({
      grid: grid.map(row => [...row]),
      dp: dp.map(row => [...row]),
      i: m - 1,
      j: n - 1,
      message: `Total unique paths: ${dp[m-1][n-1]}`,
      lineNumber: 15
    });

    setSteps(newSteps);
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Unique Paths in Matrix</h3>
        
        <div className="inline-block">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${currentStep.dp[0].length}, minmax(0, 1fr))` }}>
            {currentStep.dp.map((row, i) => (
              <React.Fragment key={i}>
                {row.map((val, j) => (
                  <div
                    key={`${i}-${j}`}
                    className={`w-16 h-16 border-2 flex items-center justify-center font-bold text-lg transition-all ${
                      i === currentStep.i && j === currentStep.j
                        ? 'bg-primary/20 border-primary text-primary scale-110'
                        : val > 0
                        ? 'bg-green-500/20 border-green-500 text-green-500'
                        : 'bg-card border-border'
                    }`}
                  >
                    {val}
                  </div>
                ))}
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
      </div>

      <VariablePanel
        variables={{
          row: currentStep.i,
          col: currentStep.j,
          paths: currentStep.dp[currentStep.i][currentStep.j],
          totalPaths: currentStep.dp[currentStep.dp.length - 1][currentStep.dp[0].length - 1]
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
