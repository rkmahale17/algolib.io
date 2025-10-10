import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  mask: number;
  binary: string;
  subset: number[];
  allSubsets: number[][];
  message: string;
  lineNumber: number;
}

export const SubsetBitsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function generateSubsets(arr: number[]): number[][] {
  const n = arr.length;
  const subsets: number[][] = [];
  
  // Iterate through all possible bitmasks
  // 2^n combinations (0 to 2^n - 1)
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset: number[] = [];
    
    // Check each bit position
    for (let i = 0; i < n; i++) {
      // If bit i is set, include arr[i]
      if (mask & (1 << i)) {
        subset.push(arr[i]);
      }
    }
    
    subsets.push(subset);
  }
  
  return subsets;
}`;

  const generateSteps = () => {
    const arr = [1, 2, 3];
    const n = arr.length;
    const newSteps: Step[] = [];
    const allSubsets: number[][] = [];

    newSteps.push({
      array: arr,
      mask: 0,
      binary: '000',
      subset: [],
      allSubsets: [],
      message: `Generate all 2^${n} = ${1 << n} subsets using bit manipulation`,
      lineNumber: 1
    });

    for (let mask = 0; mask < (1 << n); mask++) {
      const subset: number[] = [];
      const binary = mask.toString(2).padStart(n, '0');

      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) {
          subset.push(arr[i]);
        }
      }

      allSubsets.push([...subset]);

      newSteps.push({
        array: arr,
        mask,
        binary,
        subset: [...subset],
        allSubsets: allSubsets.map(s => [...s]),
        message: `Mask ${mask} (${binary}): ${subset.length > 0 ? `include [${subset.join(', ')}]` : 'empty set'}`,
        lineNumber: 10
      });
    }

    newSteps.push({
      array: arr,
      mask: (1 << n) - 1,
      binary: '111',
      subset: arr,
      allSubsets: allSubsets.map(s => [...s]),
      message: `Generated all ${allSubsets.length} subsets!`,
      lineNumber: 19
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

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
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
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
        <h3 className="text-lg font-semibold mb-4">Array</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.array.map((val, idx) => {
            const bitSet = (currentStep.mask & (1 << idx)) !== 0;
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                    bitSet ? 'bg-green-500/20 border-green-500' : 'bg-card border-border'
                  }`}
                >
                  {val}
                </div>
                <div className="text-xs text-muted-foreground">bit {idx}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Mask (Decimal)</div>
            <div className="text-2xl font-bold">{currentStep.mask}</div>
          </div>
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Mask (Binary)</div>
            <div className="text-2xl font-mono font-bold">{currentStep.binary}</div>
          </div>
          <div className="p-4 bg-muted rounded border">
            <div className="text-sm text-muted-foreground mb-1">Subset Size</div>
            <div className="text-2xl font-bold text-primary">{currentStep.subset.length}</div>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-4">Current Subset</h3>
        <div className="flex gap-2 mb-6 min-h-[3rem]">
          {currentStep.subset.length > 0 ? (
            currentStep.subset.map((val, idx) => (
              <div
                key={idx}
                className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-blue-500/20 border-blue-500 font-bold"
              >
                {val}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground italic">Empty set (∅)</div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">All Subsets ({currentStep.allSubsets.length})</h3>
        <div className="flex flex-wrap gap-2">
          {currentStep.allSubsets.map((subset, idx) => (
            <div key={idx} className="px-3 py-1 bg-muted rounded border text-sm">
              [{subset.join(', ') || '∅'}]
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'mask': currentStep.mask,
          'binary': currentStep.binary,
          'subset size': currentStep.subset.length,
          'total subsets': currentStep.allSubsets.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
