import React, { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  nums: number[];
  n: number | null;
  perms: number[][];
  result: number[][];
  message: string;
  lineNumber: number;
}

export const PermutationsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function permute(nums: number[]): number[][] {
    const result: number[][] = [];

    if (nums.length === 1) {
        return [nums.slice()];
    }

    for (let i = 0; i < nums.length; i++) {
        const n = nums.shift()!;

        const perms = permute(nums);

        for (const perm of perms) {
            perm.push(n);
        }

        result.push(...perms);

        nums.push(n);
    }

    return result;
}`;

  const generateSteps = () => {
    const originalArr = [1, 2, 3];
    const newSteps: Step[] = [];

    function runPermute(numsRef: number[]) {
      function simulatePermute(currentNums: number[]): number[][] {
        const result: number[][] = [];

        newSteps.push({
          nums: [...currentNums], n: null, perms: [], result: [...result],
          message: `Call permute([${currentNums.join(', ')}])`,
          lineNumber: 1
        });

        newSteps.push({
          nums: [...currentNums], n: null, perms: [], result: [...result],
          message: `Initialize frame result array`,
          lineNumber: 2
        });

        if (currentNums.length === 1) {
          newSteps.push({
            nums: [...currentNums], n: null, perms: [], result: [...result],
            message: `Base case: nums.length === 1`,
            lineNumber: 4
          });

          const baseReturn = [currentNums.slice()];
          newSteps.push({
            nums: [...currentNums], n: null, perms: [], result: [...result],
            message: `Return base copy: [[${currentNums[0]}]]`,
            lineNumber: 5
          });
          return baseReturn;
        }

        const initialLen = currentNums.length;
        for (let i = 0; i < initialLen; i++) {
          newSteps.push({
            nums: [...currentNums], n: null, perms: [], result: [...result],
            message: `Iterate i=${i} / ${initialLen} over nums`,
            lineNumber: 8
          });

          const n = currentNums.shift()!;
          newSteps.push({
            nums: [...currentNums], n, perms: [], result: [...result],
            message: `Shift out head element n=${n}. nums is now: [${currentNums.join(', ')}]`,
            lineNumber: 9
          });

          newSteps.push({
            nums: [...currentNums], n, perms: [], result: [...result],
            message: `Recursively calculate perms for remaining [${currentNums.join(', ')}]`,
            lineNumber: 11
          });

          const perms = simulatePermute(currentNums);

          newSteps.push({
            nums: [...currentNums], n, perms: perms.map(p => [...p]), result: [...result],
            message: `Received child perms. Appending n=${n} to each.`,
            lineNumber: 13
          });

          for (const perm of perms) {
            perm.push(n);
          }

          newSteps.push({
            nums: [...currentNums], n, perms: perms.map(p => [...p]), result: [...result],
            message: `Appended n=${n} to permutations.`,
            lineNumber: 14
          });

          result.push(...perms);
          newSteps.push({
            nums: [...currentNums], n, perms: perms.map(p => [...p]), result: [...result],
            message: `Pushed merged perms into current frame result array.`,
            lineNumber: 17
          });

          currentNums.push(n);
          newSteps.push({
            nums: [...currentNums], n: null, perms: [], result: [...result],
            message: `Restore n=${n} back to tail of nums array: [${currentNums.join(', ')}]`,
            lineNumber: 19
          });
        }

        newSteps.push({
          nums: [...currentNums], n: null, perms: [], result: [...result],
          message: `Frame loop complete, returning result matrix.`,
          lineNumber: 22
        });
        return result;
      }

      simulatePermute(numsRef);
    }

    runPermute(originalArr);

    // Final cap step
    const lastStep = newSteps[newSteps.length - 1];
    newSteps.push({
      ...lastStep,
      message: 'Algorithm Complete!',
      lineNumber: 1,
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

        <div className="bg-card rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Frame nums</h3>
          <div className="flex gap-2 mb-6 min-h-[3rem]">
            {currentStep.nums.length > 0 ? (
              currentStep.nums.map((val, idx) => (
                <div
                  key={idx}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold bg-card border-border transition-all animate-in zoom-in"
                >
                  {val}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground italic flex items-center px-2">Empty Array</div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-4">Extracted 'n'</h3>
          <div className="flex gap-2 mb-6 min-h-[3rem]">
            {currentStep.n !== null ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-accent/20 border-accent font-bold text-accent-foreground transition-all animate-in slide-in-from-left">
                {currentStep.n}
              </div>
            ) : (
              <div className="text-muted-foreground italic flex items-center px-2">None</div>
            )}
          </div>

          <h3 className="text-lg font-semibold mb-4">Frame Result ({currentStep.result.length})</h3>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto w-full p-2 border rounded-lg bg-muted/20 min-h-[6rem]">
            {currentStep.result.map((perm, idx) => (
              <div key={idx} className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 font-mono rounded border border-green-500 text-sm animate-in fade-in">
                [{perm.join(', ')}]
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-muted/60 border rounded-lg shadow-inner">
            <p className="text-sm font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg mt-4">
            <VariablePanel
              variables={{
                'nums.length': currentStep.nums.length,
                'n value': currentStep.n !== null ? currentStep.n : 'null',
                'child perms': currentStep.perms.length,
                'result.length': currentStep.result.length
              }}
            />
          </div>
        </div>
        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />

      </div>


    </div>
  );
};
