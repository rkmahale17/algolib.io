import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  dp: number[][];
  i: number;
  j: number;
  word1: string;
  word2: string;
  operation: string;
  message: string;
  lineNumber: number;
}

export const EditDistanceVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array(m + 1).fill(0)
    .map(() => Array(n + 1).fill(0));
  
  // Initialize base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i-1] === word2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i-1][j],    // delete
          dp[i][j-1],    // insert
          dp[i-1][j-1]   // replace
        );
      }
    }
  }
  
  return dp[m][n];
}`;

  const generateSteps = () => {
    const word1 = "horse";
    const word2 = "ros";
    const m = word1.length;
    const n = word2.length;
    
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    const newSteps: Step[] = [];

    // Initialize
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    newSteps.push({
      dp: dp.map(row => [...row]),
      i: 0,
      j: 0,
      word1,
      word2,
      operation: 'init',
      message: 'Initialize base cases: empty string transformations',
      lineNumber: 8
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (word1[i-1] === word2[j-1]) {
          dp[i][j] = dp[i-1][j-1];
          newSteps.push({
            dp: dp.map(row => [...row]),
            i,
            j,
            word1,
            word2,
            operation: 'match',
            message: `Match! '${word1[i-1]}' === '${word2[j-1]}': No operation needed`,
            lineNumber: 14
          });
        } else {
          const deleteOp = dp[i-1][j];
          const insertOp = dp[i][j-1];
          const replaceOp = dp[i-1][j-1];
          dp[i][j] = 1 + Math.min(deleteOp, insertOp, replaceOp);
          
          const minOp = Math.min(deleteOp, insertOp, replaceOp);
          const operation = minOp === deleteOp ? 'delete' : minOp === insertOp ? 'insert' : 'replace';
          
          newSteps.push({
            dp: dp.map(row => [...row]),
            i,
            j,
            word1,
            word2,
            operation,
            message: `'${word1[i-1]}' ≠ '${word2[j-1]}': ${operation} (del=${deleteOp}, ins=${insertOp}, rep=${replaceOp}) → ${dp[i][j]}`,
            lineNumber: 16
          });
        }
      }
    }

    newSteps.push({
      dp: dp.map(row => [...row]),
      i: m,
      j: n,
      word1,
      word2,
      operation: 'complete',
      message: `Minimum edit distance: ${dp[m][n]}`,
      lineNumber: 25
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-4">
          <h3 className="text-lg font-semibold">Edit Distance DP Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted"></th>
                  <th className="border border-border p-2 bg-muted">∅</th>
                  {currentStep.word2.split('').map((char, idx) => (
                    <th key={idx} className="border border-border p-2 bg-muted">{char}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStep.dp.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-border p-2 bg-muted font-semibold">
                      {i === 0 ? '∅' : currentStep.word1[i-1]}
                    </td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`border border-border p-2 text-center transition-all ${
                          i === currentStep.i && j === currentStep.j
                            ? 'bg-primary/20 font-bold'
                            : val > 0
                            ? 'bg-green-500/10'
                            : ''
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

      <VariablePanel
        variables={{
          i: currentStep.i,
          j: currentStep.j,
          operation: currentStep.operation,
          minDistance: currentStep.dp[currentStep.dp.length - 1][currentStep.dp[0].length - 1]
        }}
      />
    </div>
  );
};
