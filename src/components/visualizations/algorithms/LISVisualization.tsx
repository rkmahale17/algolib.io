import React, { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  array: number[];
  dp: number[];
  currentIndex: number;
  maxLength: number;
  message: string;
  lineNumber: number;
}

export const LISVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function lengthOfLIS(nums) {
  const n = nums.length;
  const dp = Array(n).fill(1);
  let maxLength = 1;
  
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxLength = Math.max(maxLength, dp[i]);
  }
  
  return maxLength;
}`;

  const generateSteps = () => {
    const array = [10, 9, 2, 5, 3, 7, 101, 18];
    const n = array.length;
    const dp = Array(n).fill(1);
    const newSteps: Step[] = [];
    let maxLength = 1;

    newSteps.push({
      array: [...array],
      dp: [...dp],
      currentIndex: 0,
      maxLength,
      message: "Initialize: Each element forms a subsequence of length 1",
      lineNumber: 3,
    });

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (array[i] > array[j]) {
          const prev = dp[i];
          dp[i] = Math.max(dp[i], dp[j] + 1);

          if (prev !== dp[i]) {
            newSteps.push({
              array: [...array],
              dp: [...dp],
              currentIndex: i,
              maxLength,
              message: `nums[${i}]=${array[i]} > nums[${j}]=${array[j]}: dp[${i}] = max(${prev}, ${dp[j]} + 1) = ${dp[i]}`,
              lineNumber: 9,
            });
          }
        }
      }
      maxLength = Math.max(maxLength, dp[i]);

      newSteps.push({
        array: [...array],
        dp: [...dp],
        currentIndex: i,
        maxLength,
        message: `Completed index ${i}: LIS ending at ${array[i]} has length ${dp[i]}`,
        lineNumber: 12,
      });
    }

    newSteps.push({
      array: [...array],
      dp: [...dp],
      currentIndex: n - 1,
      maxLength,
      message: `Maximum LIS length: ${maxLength}`,
      lineNumber: 15,
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
  const maxVal = Math.max(...currentStep.array);

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
          <h3 className="text-lg font-semibold mb-4">
            Longest Increasing Subsequence
          </h3>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">
                Array Values
              </div>
              <div className="flex items-end justify-center gap-2 h-32">
                {currentStep.array.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative"
                  >
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        idx === currentStep.currentIndex
                          ? "bg-primary shadow-lg shadow-primary/50"
                          : "bg-gradient-to-t from-blue-500/60 to-blue-500/40"
                      }`}
                      style={{
                        height: `${(value / maxVal) * 100}%`,
                        minHeight: "20px",
                      }}
                    />
                    <span className="text-xs font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">
                DP Array (LIS length)
              </div>
              <div className="flex gap-2 justify-center overflow-x-auto">
                {currentStep.dp.map((length, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-12 h-12 rounded border-2 flex items-center justify-center font-bold transition-all ${
                        idx === currentStep.currentIndex
                          ? "bg-primary/20 border-primary text-primary scale-110"
                          : length === currentStep.maxLength
                          ? "bg-green-500/20 border-green-500 text-green-500"
                          : "bg-card border-border"
                      }`}
                    >
                      {length}
                    </div>
                    <div className="text-xs text-muted-foreground">{idx}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                currentIndex: currentStep.currentIndex,
                currentValue: currentStep.array[currentStep.currentIndex],
                lisLength: currentStep.dp[currentStep.currentIndex],
                maxLength: currentStep.maxLength,
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
