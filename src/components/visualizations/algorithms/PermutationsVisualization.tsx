import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  current: number[];
  used: boolean[];
  allPerms: number[][];
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
  const current: number[] = [];
  const used: boolean[] = new Array(nums.length).fill(false);
  
  function backtrack() {
    if (current.length === nums.length) {
      result.push([...current]);
      return;
    }
    
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      
      current.push(nums[i]);
      used[i] = true;
      backtrack();
      current.pop();
      used[i] = false;
    }
  }
  
  backtrack();
  return result;
}`;

  const generateSteps = () => {
    const arr = [1, 2, 3];
    const newSteps: Step[] = [];
    const result: number[][] = [];
    const current: number[] = [];
    const used: boolean[] = new Array(arr.length).fill(false);

    function backtrack(line: number) {
      if (current.length === arr.length) {
        result.push([...current]);
        newSteps.push({
          array: arr,
          current: [...current],
          used: [...used],
          allPerms: result.map(p => [...p]),
          message: `Complete permutation found: [${current.join(', ')}]`,
          lineNumber: 7
        });
        return;
      }

      for (let i = 0; i < arr.length; i++) {
        if (used[i]) continue;

        current.push(arr[i]);
        used[i] = true;
        newSteps.push({
          array: arr,
          current: [...current],
          used: [...used],
          allPerms: result.map(p => [...p]),
          message: `Add ${arr[i]} to current permutation`,
          lineNumber: 14
        });

        backtrack(16);

        current.pop();
        used[i] = false;
        newSteps.push({
          array: arr,
          current: [...current],
          used: [...used],
          allPerms: result.map(p => [...p]),
          message: `Backtrack: Remove ${arr[i]}`,
          lineNumber: 17
        });
      }
    }

    backtrack(5);
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Input Array</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.array.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                currentStep.used[idx] ? 'bg-green-500/20 border-green-500' : 'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Current Permutation</h3>
        <div className="flex gap-2 mb-6 min-h-[3rem]">
          {currentStep.current.length > 0 ? (
            currentStep.current.map((val, idx) => (
              <div
                key={idx}
                className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-blue-500/20 border-blue-500 font-bold"
              >
                {val}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground italic">Empty</div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">All Permutations ({currentStep.allPerms.length})</h3>
        <div className="flex flex-wrap gap-2">
          {currentStep.allPerms.map((perm, idx) => (
            <div key={idx} className="px-3 py-1 bg-muted rounded border text-sm">
              [{perm.join(', ')}]
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'current length': currentStep.current.length,
          'used count': currentStep.used.filter(u => u).length,
          'total perms': currentStep.allPerms.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
