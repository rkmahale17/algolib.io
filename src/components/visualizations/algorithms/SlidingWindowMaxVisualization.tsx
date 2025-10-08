import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  k: number;
  windowStart: number;
  deque: number[];
  result: number[];
  message: string;
  lineNumber: number;
}

export const SlidingWindowMaxVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function maxSlidingWindow(nums: number[], k: number): number[] {
  const result: number[] = [];
  const deque: number[] = []; // Store indices
  
  for (let i = 0; i < nums.length; i++) {
    // Remove indices outside window
    while (deque.length && deque[0] < i - k + 1) {
      deque.shift();
    }
    
    // Remove smaller elements
    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    
    deque.push(i);
    
    // Add to result when window is full
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  
  return result;
}`;

  const generateSteps = () => {
    const arr = [1, 3, -1, -3, 5, 3, 6, 7];
    const k = 3;
    const newSteps: Step[] = [];
    const result: number[] = [];
    const deque: number[] = [];

    newSteps.push({
      array: arr,
      k,
      windowStart: 0,
      deque: [],
      result: [],
      message: `Find max in each sliding window of size ${k}`,
      lineNumber: 1
    });

    for (let i = 0; i < arr.length; i++) {
      // Remove indices outside window
      while (deque.length && deque[0] < i - k + 1) {
        deque.shift();
      }

      // Remove smaller elements
      while (deque.length && arr[deque[deque.length - 1]] < arr[i]) {
        deque.pop();
      }

      deque.push(i);

      const windowStart = Math.max(0, i - k + 1);

      newSteps.push({
        array: arr,
        k,
        windowStart,
        deque: [...deque],
        result: [...result],
        message: `Process arr[${i}] = ${arr[i]}, deque contains indices of potential maximums`,
        lineNumber: 11
      });

      if (i >= k - 1) {
        result.push(arr[deque[0]]);
        newSteps.push({
          array: arr,
          k,
          windowStart,
          deque: [...deque],
          result: [...result],
          message: `Window complete. Max = ${arr[deque[0]]} at index ${deque[0]}`,
          lineNumber: 18
        });
      }
    }

    newSteps.push({
      array: arr,
      k,
      windowStart: arr.length - k,
      deque: [...deque],
      result: [...result],
      message: 'All windows processed',
      lineNumber: 22
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Array (Window Size = {currentStep.k})</h3>
        <div className="flex gap-2 mb-6">
          {currentStep.array.map((val, idx) => (
            <div
              key={idx}
              className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                idx >= currentStep.windowStart && idx < currentStep.windowStart + currentStep.k
                  ? currentStep.deque[0] === idx
                    ? 'bg-green-500/20 border-green-500 scale-110'
                    : 'bg-primary/20 border-primary'
                  : 'bg-card border-border'
              }`}
            >
              {val}
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Deque (Indices)</h3>
        <div className="flex gap-2 mb-6 min-h-[3rem]">
          {currentStep.deque.length > 0 ? (
            currentStep.deque.map((idx, i) => (
              <div
                key={i}
                className={`w-16 h-12 flex flex-col items-center justify-center rounded-lg border-2 font-bold transition-all ${
                  i === 0 ? 'bg-green-500/20 border-green-500' : 'bg-blue-500/20 border-blue-500'
                }`}
              >
                <div className="text-xs text-muted-foreground">idx:{idx}</div>
                <div>{currentStep.array[idx]}</div>
              </div>
            ))
          ) : (
            <div className="text-muted-foreground italic">Empty deque</div>
          )}
        </div>

        <h3 className="text-lg font-semibold mb-4">Result (Window Maximums)</h3>
        <div className="flex gap-2 flex-wrap mb-6">
          {currentStep.result.map((val, idx) => (
            <div
              key={idx}
              className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-green-500/20 border-green-500 font-bold"
            >
              {val}
            </div>
          ))}
          {currentStep.result.length === 0 && (
            <div className="text-muted-foreground italic">No windows completed yet</div>
          )}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'window start': currentStep.windowStart,
          'k': currentStep.k,
          'deque size': currentStep.deque.length,
          'results': currentStep.result.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
