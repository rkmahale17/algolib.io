import React, { useEffect, useRef, useState } from "react";

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  array: number[];
  dp: number[];
  currentIndex: number; // i
  compareIndex?: number; // j
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

  const code = `function lengthOfLIS(nums: number[]): number {
    const n = nums.length;

    const LIS: number[] = new Array(n).fill(1);

    for (let i = n - 1; i >= 0; i--) {
        for (let j = i + 1; j < n; j++) {
            if (nums[i] < nums[j]) {
                LIS[i] = Math.max(LIS[i], 1 + LIS[j]);
            }
        }
    }

    return Math.max(...LIS);
}`;

  const generateSteps = () => {
    const nums = [10, 9, 2, 5, 3, 7, 101, 18];
    const n = nums.length;
    const LIS = new Array(n).fill(1);
    const newSteps: Step[] = [];

    newSteps.push({
      array: [...nums],
      dp: [...LIS],
      currentIndex: -1,
      maxLength: 1,
      message: "Initialize LIS array with 1s. Each element is an LIS of length 1 by itself.",
      lineNumber: 4,
    });

    for (let i = n - 1; i >= 0; i--) {
      newSteps.push({
        array: [...nums],
        dp: [...LIS],
        currentIndex: i,
        maxLength: Math.max(...LIS),
        message: `Outer loop: i = ${i} (value: ${nums[i]})`,
        lineNumber: 6,
      });

      for (let j = i + 1; j < n; j++) {
        newSteps.push({
          array: [...nums],
          dp: [...LIS],
          currentIndex: i,
          compareIndex: j,
          maxLength: Math.max(...LIS),
          message: `Compare nums[${i}] (${nums[i]}) with nums[${j}] (${nums[j]})`,
          lineNumber: 8,
        });

        if (nums[i] < nums[j]) {
          const oldVal = LIS[i];
          LIS[i] = Math.max(LIS[i], 1 + LIS[j]);

          newSteps.push({
            array: [...nums],
            dp: [...LIS],
            currentIndex: i,
            compareIndex: j,
            maxLength: Math.max(...LIS),
            message: `${nums[i]} < ${nums[j]}: Update LIS[${i}] = max(${oldVal}, 1 + LIS[${j}]) = ${LIS[i]}`,
            lineNumber: 9,
          });
        }
      }
    }

    newSteps.push({
      array: [...nums],
      dp: [...LIS],
      currentIndex: -1,
      maxLength: Math.max(...LIS),
      message: `Return maximum value in LIS array: ${Math.max(...LIS)}`,
      lineNumber: 14,
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
                Array Values (nums)
              </div>
              {/* Added flex-wrap for wrapping */}
              <div className="flex flex-wrap items-end justify-center gap-2">
                {currentStep.array.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 mb-2"
                    style={{ minWidth: '40px' }}
                  >
                    <div
                      className={`w-10 rounded-t transition-all duration-300 flex items-end justify-center pb-1 ${idx === currentStep.currentIndex
                        ? "bg-primary shadow-lg shadow-primary/50 ring-2 ring-primary ring-offset-2"
                        : idx === currentStep.compareIndex
                          ? "bg-secondary ring-2 ring-secondary ring-offset-2"
                          : "bg-blue-500/30"
                        }`}
                      style={{
                        height: `${Math.max((value / maxVal) * 60, 24)}px`, // Base size logic
                      }}
                    >
                      <span className="text-[10px] font-">{value}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{idx}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground mb-2">
                DP Array (LIS starting at index)
              </div>
              {/* Added flex-wrap here too for consistency */}
              <div className="flex flex-wrap gap-2 justify-center">
                {currentStep.dp.map((length, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1 mb-2">
                    <div
                      className={`w-10 h-10 rounded border-2 flex items-center justify-center font- transition-all ${idx === currentStep.currentIndex
                        ? "bg-primary/20 border-primary text-primary scale-110"
                        : length > 1
                          ? "bg-green-500/10 border-green-500/50 text-green-600"
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
            <p className="text-sm font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg mt-4">
            <VariablePanel
              variables={{
                i: currentStep.currentIndex !== -1 ? currentStep.currentIndex : undefined,
                j: currentStep.compareIndex,
                "nums[i]": currentStep.currentIndex !== -1 ? currentStep.array[currentStep.currentIndex] : undefined,
                "nums[j]": currentStep.compareIndex !== undefined ? currentStep.array[currentStep.compareIndex] : undefined,
                "LIS[i]": currentStep.currentIndex !== -1 ? currentStep.dp[currentStep.currentIndex] : undefined,
                result: currentStep.maxLength,
              }}
            />
          </div>
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
