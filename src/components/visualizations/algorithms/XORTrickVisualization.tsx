import React, { useState, useEffect, useRef } from "react";
import { StepControls } from "../shared/StepControls";
import { VariablePanel } from "../shared/VariablePanel";
import { VisualizationCodePanel } from "../shared/VisualizationCodePanel";
import type { StepLineNumberMap, VisualizationLanguageMap } from "@/types/visualization";

interface Step {
  nums: number[];
  i: number;
  result: number;
  prevResult: number;
  currentValue: number;
  binaryResult: string;
  binaryValue: string;
  message: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function singleNumber(nums: number[]): number {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result ^= nums[i];
  }
  return result;
}`,
  python: `def singleNumber(nums):
    res = 0
    for n in nums:
        res ^= n
    return res`,
  java: `public static class Solution {
    public int singleNumber(int[] nums) {
        int res = 0;
        for (int n : nums) {
            res = n ^ res;
        }
        return res;
    }
}`,
  cpp: `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for (int n : nums) {
            res = res ^ n;
        }
        return res;
    }
};`
};

export const XORTrickVisualization: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateStepsData = () => {
    const nums = [4, 2, 4, 5, 2];
    const steps: Step[] = [];
    let result = 0;
    const toBinary = (n: number) => n.toString(2).padStart(4, "0");

    const stepLineNumbers: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLineNumbers.typescript!.push(ts);
      stepLineNumbers.python!.push(py);
      stepLineNumbers.java!.push(java);
      stepLineNumbers.cpp!.push(cpp);
    };

    steps.push({
      nums, i: -1, result: 0, prevResult: 0, currentValue: 0,
      binaryResult: toBinary(0), binaryValue: "0000",
      message: "Starting the singleNumber function.",
      pseudoStep: "CALL singleNumber(nums)"
    });
    addLines(1, 1, 2, 3);

    steps.push({
      nums, i: -1, result: 0, prevResult: 0, currentValue: 0,
      binaryResult: toBinary(0), binaryValue: "0000",
      message: "Initializing result = 0. XOR identity property: 0 ^ x = x.",
      pseudoStep: "SET result = 0"
    });
    addLines(2, 2, 3, 4);

    for (let i = 0; i < nums.length; i++) {
      steps.push({
        nums, i, result, prevResult: result, currentValue: nums[i],
        binaryResult: toBinary(result), binaryValue: toBinary(nums[i]),
        message: `Loop iteration i = ${i}. Checking loop condition.`,
        pseudoStep: `FOR element IN nums  →  nums[${i}] = ${nums[i]}`
      });
      addLines(3, 3, 4, 5);

      const prevResult = result;
      result ^= nums[i];

      steps.push({
        nums, i, result, prevResult, currentValue: nums[i],
        binaryResult: toBinary(result), binaryValue: toBinary(nums[i]),
        message: `XORing result (${prevResult}) with nums[${i}] (${nums[i]}). Result is now ${result}.`,
        pseudoStep: `SET result = result ^ nums[${i}]  →  ${prevResult} ^ ${nums[i]} = ${result}`
      });
      addLines(4, 4, 5, 6);
    }

    steps.push({
      nums, i: nums.length, result, prevResult: result, currentValue: 0,
      binaryResult: toBinary(result), binaryValue: "0000",
      message: "Loop finished. All numbers have been XORed.",
      pseudoStep: "END FOR"
    });
    addLines(3, 3, 4, 5);

    steps.push({
      nums, i: -1, result, prevResult: result, currentValue: 0,
      binaryResult: toBinary(result), binaryValue: "0000",
      message: `Returning the final result: ${result}. This is the number that appeared only once.`,
      pseudoStep: `RETURN result  →  ${result}`
    });
    addLines(6, 5, 7, 8);

    const lastStep = steps[steps.length - 1];
    steps.push({
      ...lastStep,
      message: "Algorithm Complete!",
      pseudoStep: "DONE"
    });
    addLines(6, 5, 7, 8);

    return { steps, stepLineNumbers };
  };

  const { steps, stepLineNumbers } = generateStepsData();

  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
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
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
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
  const pseudoSteps = steps.map((s) => s.pseudoStep);

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
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-6 border shadow-sm flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Input Array (nums)</h3>
              <div className="flex flex-wrap gap-3">
                {currentStep.nums.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl border-2 font-bold transition-all relative ${
                      idx === currentStep.i
                        ? "bg-primary text-primary-foreground border-primary scale-110 shadow-lg z-10"
                        : "bg-muted/50 border-border text-foreground"
                    }`}
                  >
                    <span className="text-xl">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Bitwise XOR Operation</h3>
              <div className="bg-muted/30 rounded-xl p-6 border border-border/50 space-y-4">
                <div className="flex items-center justify-between font-mono text-sm">
                  <span className="text-muted-foreground">Previous Result:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-foreground">{currentStep.prevResult}</span>
                    <span className="text-primary tracking-widest">{currentStep.binaryResult}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest text-xs font-bold">
                    <span className="w-5 h-5 flex items-center justify-center bg-primary/20 text-primary rounded-full">
                      ^
                    </span>
                    nums[{currentStep.i === -1 || currentStep.i >= currentStep.nums.length ? "x" : currentStep.i}]:
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-foreground">
                      {currentStep.i === -1 || currentStep.i >= currentStep.nums.length ? "0" : currentStep.currentValue}
                    </span>
                    <span className="text-accent tracking-widest">
                      {currentStep.i === -1 || currentStep.i >= currentStep.nums.length ? "0000" : currentStep.binaryValue}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between font-mono text-sm">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs">New Result:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-primary">
                      {currentStep.result}
                    </span>
                    <span className="text-primary font-bold tracking-[0.2em]">
                      {currentStep.binaryResult}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Algorithm Logic</h4>
            <p className="text-sm text-foreground leading-relaxed font-medium">
              {currentStep.message}
            </p>
          </div>

          <VariablePanel
            variables={{
              i: currentStep.i === -1 ? "N/A" : currentStep.i,
              result: currentStep.result,
              "nums[i]": currentStep.i >= 0 && currentStep.i < currentStep.nums.length ? currentStep.nums[currentStep.i] : "N/A",
              binary: currentStep.binaryResult,
            }}
          />
        </div>

        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
