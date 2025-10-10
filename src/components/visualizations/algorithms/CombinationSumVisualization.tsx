import React, { useEffect, useRef, useState } from "react";

import { CodeHighlighter } from "../shared/CodeHighlighter";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";

interface Step {
  candidates: number[];
  target: number;
  current: number[];
  currentSum: number;
  start: number;
  allCombinations: number[][];
  message: string;
  lineNumber: number;
}

export const CombinationSumVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function combinationSum(candidates: number[], target: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  
  function backtrack(start: number, sum: number) {
    if (sum === target) {
      result.push([...current]);
      return;
    }
    if (sum > target) return;
    
    for (let i = start; i < candidates.length; i++) {
      current.push(candidates[i]);
      backtrack(i, sum + candidates[i]);
      current.pop();
    }
  }
  
  backtrack(0, 0);
  return result;
}`;

  const generateSteps = () => {
    const candidates = [2, 3, 5];
    const target = 8;
    const newSteps: Step[] = [];
    const result: number[][] = [];
    const current: number[] = [];

    function backtrack(start: number, sum: number, line: number) {
      if (sum === target) {
        result.push([...current]);
        newSteps.push({
          candidates,
          target,
          current: [...current],
          currentSum: sum,
          start,
          allCombinations: result.map((c) => [...c]),
          message: `Found valid combination: [${current.join(
            ", "
          )}] = ${target}`,
          lineNumber: 6,
        });
        return;
      }
      if (sum > target) {
        newSteps.push({
          candidates,
          target,
          current: [...current],
          currentSum: sum,
          start,
          allCombinations: result.map((c) => [...c]),
          message: `Sum ${sum} exceeds target ${target}, backtrack`,
          lineNumber: 9,
        });
        return;
      }

      for (let i = start; i < candidates.length; i++) {
        current.push(candidates[i]);
        const newSum = sum + candidates[i];
        newSteps.push({
          candidates,
          target,
          current: [...current],
          currentSum: newSum,
          start: i,
          allCombinations: result.map((c) => [...c]),
          message: `Add ${candidates[i]}, sum = ${newSum}`,
          lineNumber: 12,
        });

        backtrack(i, newSum, 13);

        current.pop();
      }
    }

    backtrack(0, 0, 4);
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
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1)
      setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
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
          <h3 className="text-lg font-semibold">
            Candidates: [{currentStep.candidates.join(", ")}]
          </h3>
          <div className="text-center p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Target</div>
            <div className="text-3xl font-bold text-primary">
              {currentStep.target}
            </div>
          </div>

          <h3 className="text-lg font-semibold">
            Current Combination (Sum: {currentStep.currentSum})
          </h3>
          <div className="flex gap-2 min-h-[3rem]">
            {currentStep.current.length > 0 ? (
              currentStep.current.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold ${
                    currentStep.currentSum === currentStep.target
                      ? "bg-green-500/20 border-green-500"
                      : currentStep.currentSum > currentStep.target
                      ? "bg-red-500/20 border-red-500"
                      : "bg-blue-500/20 border-blue-500"
                  }`}
                >
                  {val}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground italic">Empty</div>
            )}
          </div>

          <h3 className="text-lg font-semibold">
            Valid Combinations ({currentStep.allCombinations.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {currentStep.allCombinations.map((comb, idx) => (
              <div
                key={idx}
                className="px-3 py-1 bg-muted rounded border text-sm"
              >
                [{comb.join(" + ")}] = {currentStep.target}
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
          <div className="rounded-lg">
            <VariablePanel
              variables={{
                target: currentStep.target,
                "current sum": currentStep.currentSum,
                remaining: currentStep.target - currentStep.currentSum,
                "valid combinations": currentStep.allCombinations.length,
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
