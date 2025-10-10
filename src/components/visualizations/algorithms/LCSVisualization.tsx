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
}

export const LCSVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill(0)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(
          dp[i-1][j],
          dp[i][j-1]
        );
      }
    }
  }
  
  return dp[m][n];
}`;

  const generateSteps = () => {
    const text1 = "ABCD";
    const text2 = "AEBD";
    const m = text1.length;
    const n = text2.length;

    const dp = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));
    const newSteps: Step[] = [];

    newSteps.push({
      dp: dp.map((row) => [...row]),
      i: 0,
      j: 0,
      text1,
      text2,
      lcs: "",
      message: "Initialize DP table with zeros",
      lineNumber: 4,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          newSteps.push({
            dp: dp.map((row) => [...row]),
            i,
            j,
            text1,
            text2,
            lcs: "",
            message: `Match! ${text1[i - 1]} === ${
              text2[j - 1]
            }: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
            lineNumber: 10,
          });
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          newSteps.push({
            dp: dp.map((row) => [...row]),
            i,
            j,
            text1,
            text2,
            lcs: "",
            message: `No match: dp[${i}][${j}] = max(${dp[i - 1][j]}, ${
              dp[i][j - 1]
            }) = ${dp[i][j]}`,
            lineNumber: 12,
          });
        }
      }
    }

    // Build LCS string
    let i = m,
      j = n;
    let lcs = "";
    while (i > 0 && j > 0) {
      if (text1[i - 1] === text2[j - 1]) {
        lcs = text1[i - 1] + lcs;
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    newSteps.push({
      dp: dp.map((row) => [...row]),
      i: m,
      j: n,
      text1,
      text2,
      lcs,
      message: `LCS length: ${dp[m][n]}, LCS: "${lcs}"`,
      lineNumber: 19,
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
            LCS: "{currentStep.text1}" vs "{currentStep.text2}"
          </h3>
          <div className="inline-block min-w-full">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="border border-border p-2 bg-muted"></th>
                  <th className="border border-border p-2 bg-muted">∅</th>
                  {currentStep.text2.split("").map((char, idx) => (
                    <th key={idx} className="border border-border p-2 bg-muted">
                      {char}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentStep.dp.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-border p-2 bg-muted font-semibold">
                      {i === 0 ? "∅" : currentStep.text1[i - 1]}
                    </td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`border border-border p-2 text-center transition-all ${
                          i === currentStep.i && j === currentStep.j
                            ? "bg-primary/20 font-bold"
                            : val > 0
                            ? "bg-green-500/10"
                            : ""
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

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                i: currentStep.i,
                j: currentStep.j,
                lcsLength:
                  currentStep.dp[currentStep.dp.length - 1][
                    currentStep.dp[0].length - 1
                  ],
                lcs: currentStep.lcs || "Building...",
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
