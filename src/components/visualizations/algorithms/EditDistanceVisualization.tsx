import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

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

  const code = `function minDistance(word1: string, word2: string): number {
    const m = word1.length;
    const n = word2.length;

    const cache: number[][] = Array.from({ length: m + 1 }, () =>
        new Array(n + 1).fill(Infinity)
    );

    for (let j = 0; j <= n; j++) {
        cache[m][j] = n - j;
    }

    for (let i = 0; i <= m; i++) {
        cache[i][n] = m - i;
    }

    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (word1[i] === word2[j]) {
                cache[i][j] = cache[i + 1][j + 1];
            } else {
                cache[i][j] =
                    1 +
                    Math.min(
                        cache[i + 1][j],
                        cache[i][j + 1],
                        cache[i + 1][j + 1]
                    );
            }
        }
    }

    return cache[0][0];
}`;

  const generateSteps = () => {
    const word1 = "horse";
    const word2 = "ros";
    const m = word1.length;
    const n = word2.length;

    const cache = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const newSteps: Step[] = [];

    // Base cases
    for (let j = 0; j <= n; j++) {
      cache[m][j] = n - j;
    }
    newSteps.push({
      dp: cache.map((row) => [...row]),
      i: m,
      j: -1,
      word1,
      word2,
      operation: "init",
      message: "Base case: if first word is empty, we must insert all characters of second word",
      lineNumber: 10,
    });

    for (let i = 0; i <= m; i++) {
      cache[i][n] = m - i;
    }
    newSteps.push({
      dp: cache.map((row) => [...row]),
      i: -1,
      j: n,
      word1,
      word2,
      operation: "init",
      message: "Base case: if second word is empty, we must delete all characters of first word",
      lineNumber: 14,
    });

    // Main DP
    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        newSteps.push({
          dp: cache.map((row) => [...row]),
          i,
          j,
          word1,
          word2,
          operation: "compare",
          message: `Comparing '${word1[i]}' with '${word2[j]}'`,
          lineNumber: 19,
        });

        if (word1[i] === word2[j]) {
          cache[i][j] = cache[i + 1][j + 1];
          newSteps.push({
            dp: cache.map((row) => [...row]),
            i,
            j,
            word1,
            word2,
            operation: "match",
            message: `Match! '${word1[i]}' === '${word2[j]}'. Edit distance is cache[${i + 1}][${j + 1}] = ${cache[i][j]}`,
            lineNumber: 20,
          });
        } else {
          const deleteOp = cache[i + 1][j];
          const insertOp = cache[i][j + 1];
          const replaceOp = cache[i + 1][j + 1];
          cache[i][j] = 1 + Math.min(deleteOp, insertOp, replaceOp);

          const minOp = Math.min(deleteOp, insertOp, replaceOp);
          const opName = minOp === deleteOp ? "delete" : minOp === insertOp ? "insert" : "replace";

          newSteps.push({
            dp: cache.map((row) => [...row]),
            i,
            j,
            word1,
            word2,
            operation: opName,
            message: `'${word1[i]}' !== '${word2[j]}'. Min(del=${deleteOp}, ins=${insertOp}, rep=${replaceOp}) + 1 = ${cache[i][j]}`,
            lineNumber: 22,
          });
        }
      }
    }

    newSteps.push({
      dp: cache.map((row) => [...row]),
      i: 0,
      j: 0,
      word1,
      word2,
      operation: "complete",
      message: `Minimum edit distance: ${cache[0][0]}`,
      lineNumber: 33,
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
                  {currentStep.word2.split("").map((char, idx) => (
                    <th key={idx} className="border border-border p-2 bg-muted text-center font-mono">
                      {char}
                      <div className="text-[10px] text-muted-foreground font-normal">{idx}</div>
                    </th>
                  ))}
                  <th className="border border-border p-2 bg-muted text-center text-muted-foreground">
                    ∅
                    <div className="text-[10px] font-normal">{currentStep.word2.length}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentStep.dp.map((row, i) => (
                  <tr key={i}>
                    <td className="border border-border p-2 bg-muted font-semibold text-center font-mono">
                      {i < currentStep.word1.length ? (
                        <>
                          {currentStep.word1[i]}
                          <div className="text-[10px] text-muted-foreground font-normal">{i}</div>
                        </>
                      ) : "∅"}
                    </td>
                    {row.map((val, j) => (
                      <td
                        key={j}
                        className={`border border-border p-2 text-center transition-all min-w-[40px] ${i === currentStep.i && j === currentStep.j
                          ? "bg-primary/20 ring-2 ring-primary ring-inset font-bold text-primary"
                          : val !== Infinity && val >= 0
                            ? "bg-green-500/5 text-green-600"
                            : ""
                          }`}
                      >
                        {val === Infinity ? "∞" : val}
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
          <VariablePanel
            variables={{
              i: currentStep.i !== -1 ? currentStep.i : "done",
              j: currentStep.j !== -1 ? currentStep.j : "done",
              operation: currentStep.operation,
              "word1[i]": currentStep.i >= 0 && currentStep.i < currentStep.word1.length ? currentStep.word1[currentStep.i] : "-",
              "word2[j]": currentStep.j >= 0 && currentStep.j < currentStep.word2.length ? currentStep.word2[currentStep.j] : "-",
              result: currentStep.dp[0][0],
            }}
          />
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="TypeScript"
        />
      </div>
    </div>
  );
};
