import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  heap: number[];
  current: number;
  k: number;
  result: number | null;
  message: string;
  lineNumber: number;
}

export const KthLargestVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function findKthLargest(nums: number[], k: number): number {
  // Min heap of size k
  const heap: number[] = [];
  
  for (const num of nums) {
    if (heap.length < k) {
      heap.push(num);
      heap.sort((a, b) => a - b);
    } else if (num > heap[0]) {
      heap[0] = num;
      heap.sort((a, b) => a - b);
    }
  }
  
  return heap[0]; // Kth largest
}`;

  const generateSteps = () => {
    const arr = [3, 2, 1, 5, 6, 4];
    const k = 2;
    const newSteps: Step[] = [];
    const heap: number[] = [];

    newSteps.push({
      array: arr,
      heap: [],
      current: -1,
      k,
      result: null,
      message: `Find ${k}th largest element using min heap of size ${k}`,
      lineNumber: 1
    });

    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];
      
      if (heap.length < k) {
        heap.push(num);
        heap.sort((a, b) => a - b);
        newSteps.push({
          array: arr,
          heap: [...heap],
          current: i,
          k,
          result: null,
          message: `Add ${num} to heap (size < ${k})`,
          lineNumber: 6
        });
      } else if (num > heap[0]) {
        heap[0] = num;
        heap.sort((a, b) => a - b);
        newSteps.push({
          array: arr,
          heap: [...heap],
          current: i,
          k,
          result: null,
          message: `${num} > ${heap[0]} (min), replace and reheapify`,
          lineNumber: 9
        });
      } else {
        newSteps.push({
          array: arr,
          heap: [...heap],
          current: i,
          k,
          result: null,
          message: `${num} ≤ ${heap[0]} (min), skip`,
          lineNumber: 8
        });
      }
    }

    newSteps.push({
      array: arr,
      heap: [...heap],
      current: -1,
      k,
      result: heap[0],
      message: `Result: ${heap[0]} is the ${k}th largest element`,
      lineNumber: 14
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
        <h3 className="text-lg font-semibold mb-4">Array (Find {currentStep.k}th Largest)</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.array.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                idx === currentStep.current
                  ? 'bg-primary/20 border-primary'
                  : 'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Min Heap (size = {currentStep.k})</h3>
        <div className="flex gap-2 mb-6 min-h-[3rem]">
          {currentStep.heap.length > 0 ? (
            currentStep.heap.map((val, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                  idx === 0 ? 'bg-green-500/20 border-green-500' : 'bg-blue-500/20 border-blue-500'
                }`}
              >
                {val}
              </div>
            ))
          ) : (
            <div className="text-muted-foreground italic">Empty heap</div>
          )}
        </div>

        {currentStep.result !== null && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded">
            <p className="text-sm font-semibold">{currentStep.k}th Largest: {currentStep.result}</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'k': currentStep.k,
          'current': currentStep.current >= 0 ? currentStep.current : 'done',
          'heap size': currentStep.heap.length,
          'heap min': currentStep.heap.length > 0 ? currentStep.heap[0] : 'none'
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
