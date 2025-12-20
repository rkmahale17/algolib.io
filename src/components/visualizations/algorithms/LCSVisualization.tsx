import React, { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  dp: number[][];
  i: number;
  j: number;
  text1: string;
  text2: string;
  lcs: string;
  message: string;
  lineNumber: number;
  // For highlighting specific comparison cells
  highlightI?: number;
  highlightJ?: number;
}

export const LCSVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function longestCommonSubsequence(text1: string, text2: string): number {
  const m = text1.length;
  const n = text2.length;

  // dp[i][j] = LCS length of text1[i:] and text2[j:]
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  // Fill table from bottom-right to top-left
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      if (text1[i] === text2[j]) {
        dp[i][j] = 1 + dp[i + 1][j + 1];
      } else {
        dp[i][j] = Math.max(dp[i][j + 1], dp[i + 1][j]);
      }
    }
  }

  return dp[0][0];
}`;

  const generateSteps = () => {
    // Example strings
    const text1 = "abcde";
    const text2 = "ace"; 
    const m = text1.length;
    const n = text2.length;

    // Initialize DP table (m+1) x (n+1) filled with 0
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const newSteps: Step[] = [];

    // Step 1: Initialization
    newSteps.push({
      dp: dp.map((row) => [...row]),
      i: -1,
      j: -1,
      text1,
      text2,
      lcs: "",
      message: "Initialize DP table with 0s. dp[i][j] represents LCS of text1[i:] and text2[j:]",
      lineNumber: 6,
    });

    // Step 2: Loops
    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        // Highlighting step before calculation
        newSteps.push({
            dp: dp.map((row) => [...row]),
            i,
            j,
            text1,
            text2,
            lcs: "",
            message: `Comparing text1[${i}] ('${text1[i]}') with text2[${j}] ('${text2[j]}')`,
            lineNumber: 13, // if check
            highlightI: i,
            highlightJ: j
        });

        if (text1[i] === text2[j]) {
          dp[i][j] = 1 + dp[i + 1][j + 1];
          newSteps.push({
            dp: dp.map((row) => [...row]),
            i,
            j,
            text1,
            text2,
            lcs: "",
            message: `Match! '${text1[i]}' == '${text2[j]}'. dp[${i}][${j}] = 1 + dp[${i + 1}][${j + 1}] = ${dp[i][j]}`,
            lineNumber: 14,
          });
        } else {
          dp[i][j] = Math.max(dp[i][j + 1], dp[i + 1][j]);
          newSteps.push({
            dp: dp.map((row) => [...row]),
            i,
            j,
            text1,
            text2,
            lcs: "",
            message: `No match. dp[${i}][${j}] = max(dp[${i}][${j + 1}], dp[${i + 1}][${j}]) = ${dp[i][j]}`,
            lineNumber: 16,
          });
        }
      }
    }

    // Step 3: Result
    newSteps.push({
      dp: dp.map((row) => [...row]),
      i: 0,
      j: 0,
      text1,
      text2,
      lcs: "", // We could trace back to find the actual strings if needed, keeping simple for now
      message: `Finished! The Longest Common Subsequence length is dp[0][0] = ${dp[0][0]}`,
      lineNumber: 21,
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
        <div className="bg-card rounded-lg p-6 border overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">
            LCS Table (Bottom-Up)
          </h3>
          <div className="inline-block min-w-full">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                    {/* Corner Cell */}
                  <th className="border border-border p-2 bg-muted/50 w-10"></th>
                    
                    {/* Columns: text2 chars + empty suffix */}
                  {currentStep.text2.split("").map((char, idx) => (
                    <th key={idx} className="border border-border p-2 bg-muted w-10 text-center font-mono">
                      {char}
                      <div className="text-[10px] text-muted-foreground font-normal">{idx}</div>
                    </th>
                  ))}
                  <th className="border border-border p-2 bg-muted w-10 text-center text-muted-foreground">
                    ∅
                    <div className="text-[10px] font-normal">{currentStep.text2.length}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentStep.dp.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {/* Row Header: text1 char or empty suffix */}
                    <td className="border border-border p-2 bg-muted font-semibold text-center w-10 font-mono">
                      {rowIdx < currentStep.text1.length ? (
                          <>
                           {currentStep.text1[rowIdx]}
                           <div className="text-[10px] text-muted-foreground font-normal">{rowIdx}</div>
                          </>
                      ) : "∅"}
                    </td>
                    
                    {/* DP Values */}
                    {row.map((val, colIdx) => {
                        const isCurrent = rowIdx === currentStep.i && colIdx === currentStep.j;
                        // Determine if this cell is part of the calculation dependencies
                        // current check is at (i, j). 
                        // Dependencies are (i+1, j+1), (i, j+1), (i+1, j)
                        const isDependency = currentStep.i !== -1 && (
                            (rowIdx === currentStep.i + 1 && colIdx === currentStep.j + 1) || 
                            (rowIdx === currentStep.i && colIdx === currentStep.j + 1) ||
                            (rowIdx === currentStep.i + 1 && colIdx === currentStep.j)
                        );

                        return (
                          <td
                            key={colIdx}
                            className={`border border-border p-2 text-center transition-all duration-300 w-10 h-10 ${
                              isCurrent
                                ? "bg-primary/20 ring-2 ring-primary ring-inset font-bold text-primary scale-105"
                                : isDependency
                                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                : val > 0
                                ? "bg-green-500/5 text-green-600 dark:text-green-400"
                                : ""
                            }`}
                          >
                            {val}
                          </td>
                        );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg mt-4">
            <VariablePanel
              variables={{
                i: currentStep.i !== -1 ? currentStep.i : "done",
                j: currentStep.j !== -1 ? currentStep.j : "done",
                "text1[i]": currentStep.i >= 0 && currentStep.i < currentStep.text1.length ? currentStep.text1[currentStep.i] : "-",
                "text2[j]": currentStep.j >= 0 && currentStep.j < currentStep.text2.length ? currentStep.text2[currentStep.j] : "-",
                "dp[i][j]": currentStep.i !== -1 ? currentStep.dp[currentStep.i][currentStep.j] : currentStep.dp[0][0],
              }}
            />
          </div>
        </div>

        <CodeHighlighter
          code={code}
          highlightedLine={currentStep.lineNumber}
          language="typescript"
        />
      </div>
    </div>
  );
};
