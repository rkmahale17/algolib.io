import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  current: number[];
  index: number;
  allSubsets: number[][];
  message: string;
  lineNumber: number;
}

export const SubsetsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  
  function backtrack(start: number) {
    result.push([...current]);
    
    for (let i = start; i < nums.length; i++) {
      current.push(nums[i]);
      backtrack(i + 1);
      current.pop();
    }
  }
  
  backtrack(0);
  return result;
}`;

  const generateSteps = () => {
    const arr = [1, 2, 3];
    const newSteps: Step[] = [];
    const result: number[][] = [];
    const current: number[] = [];

    function backtrack(start: number, line: number) {
      result.push([...current]);
      newSteps.push({
        array: arr,
        current: [...current],
        index: start,
        allSubsets: result.map(s => [...s]),
        message: `Add subset [${current.join(', ')}] to result`,
        lineNumber: line
      });

      for (let i = start; i < arr.length; i++) {
        current.push(arr[i]);
        newSteps.push({
          array: arr,
          current: [...current],
          index: i,
          allSubsets: result.map(s => [...s]),
          message: `Include ${arr[i]} in current subset`,
          lineNumber: 7
        });
        
        backtrack(i + 1, 8);
        
        current.pop();
        newSteps.push({
          array: arr,
          current: [...current],
          index: i,
          allSubsets: result.map(s => [...s]),
          message: `Backtrack: Remove ${arr[i]} from current subset`,
          lineNumber: 9
        });
      }
    }

    backtrack(0, 4);
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
                idx === currentStep.index ? 'bg-primary/20 border-primary' : 'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Current Subset</h3>
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
            <div className="text-muted-foreground italic">Empty subset</div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">All Subsets ({currentStep.allSubsets.length})</h3>
        <div className="flex flex-wrap gap-2">
          {currentStep.allSubsets.map((subset, idx) => (
            <div key={idx} className="px-3 py-1 bg-muted rounded border text-sm">
              [{subset.join(', ') || 'empty'}]
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'start index': currentStep.index,
          'current subset': `[${currentStep.current.join(', ')}]`,
          'total subsets': currentStep.allSubsets.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
