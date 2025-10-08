import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  n: number;
  k: number;
  current: number[];
  start: number;
  allCombinations: number[][];
  message: string;
  lineNumber: number;
}

export const CombinationsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function combine(n: number, k: number): number[][] {
  const result: number[][] = [];
  const current: number[] = [];
  
  function backtrack(start: number) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    
    for (let i = start; i <= n; i++) {
      current.push(i);
      backtrack(i + 1);
      current.pop();
    }
  }
  
  backtrack(1);
  return result;
}`;

  const generateSteps = () => {
    const n = 4;
    const k = 2;
    const newSteps: Step[] = [];
    const result: number[][] = [];
    const current: number[] = [];

    function backtrack(start: number, line: number) {
      if (current.length === k) {
        result.push([...current]);
        newSteps.push({
          n,
          k,
          current: [...current],
          start,
          allCombinations: result.map(c => [...c]),
          message: `Found combination: [${current.join(', ')}]`,
          lineNumber: 6
        });
        return;
      }

      for (let i = start; i <= n; i++) {
        current.push(i);
        newSteps.push({
          n,
          k,
          current: [...current],
          start: i,
          allCombinations: result.map(c => [...c]),
          message: `Add ${i} to current combination`,
          lineNumber: 11
        });

        backtrack(i + 1, 12);

        current.pop();
        newSteps.push({
          n,
          k,
          current: [...current],
          start: i,
          allCombinations: result.map(c => [...c]),
          message: `Backtrack: Remove ${i}`,
          lineNumber: 13
        });
      }
    }

    backtrack(1, 4);
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
        <h3 className="text-lg font-semibold mb-4">Range: 1 to {currentStep.n}, Choose {currentStep.k}</h3>
        <div className="flex gap-2 mb-6">
          {Array.from({ length: currentStep.n }, (_, i) => i + 1).map((val) => (
            <div
              key={val}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                val === currentStep.start ? 'bg-primary/20 border-primary' :
                currentStep.current.includes(val) ? 'bg-green-500/20 border-green-500' :
                'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Current Combination ({currentStep.current.length}/{currentStep.k})</h3>
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

        <h3 className="text-lg font-semibold mb-4">All Combinations ({currentStep.allCombinations.length})</h3>
        <div className="flex flex-wrap gap-2">
          {currentStep.allCombinations.map((comb, idx) => (
            <div key={idx} className="px-3 py-1 bg-muted rounded border text-sm">
              [{comb.join(', ')}]
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'n': currentStep.n,
          'k': currentStep.k,
          'current size': currentStep.current.length,
          'total combinations': currentStep.allCombinations.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
