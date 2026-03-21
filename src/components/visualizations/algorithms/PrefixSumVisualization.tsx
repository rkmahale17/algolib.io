import { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  originalArray: number[];
  prefixArray: number[];
  currentIndex: number;
  sum: number;
  message: string;
  lineNumber: number;
}

export const PrefixSumVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function prefixSum(arr: number[]): number[] {
  const prefix = [arr[0]];
  
  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
  }
  
  return prefix;
}`;

  const generateSteps = () => {
    const array = [3, 1, 4, 1, 5, 9, 2];
    const newSteps: Step[] = [];
    const prefix: number[] = [];

    // Line 1: Function entry
    newSteps.push({
      originalArray: [...array],
      prefixArray: [],
      currentIndex: -1,
      sum: 0,
      message: 'Starting Prefix Sum calculation.',
      lineNumber: 1
    });

    // Line 2: Initialize prefix with first element
    prefix.push(array[0]);
    newSteps.push({
      originalArray: [...array],
      prefixArray: [...prefix],
      currentIndex: 0,
      sum: array[0],
      message: `Initialize prefix array with the first element: prefix[0] = arr[0] = ${array[0]}.`,
      lineNumber: 2
    });

    for (let i = 1; i < array.length; i++) {
      // Line 4: For loop check
      newSteps.push({
        originalArray: [...array],
        prefixArray: [...prefix],
        currentIndex: i,
        sum: prefix[i - 1],
        message: `Iteration i = ${i}. We will calculate prefix[${i}] using the previous sum.`,
        lineNumber: 4
      });

      const currentVal = array[i];
      const prevSum = prefix[i - 1];
      const newSum = prevSum + currentVal;

      // Line 5: Calculate and assign
      newSteps.push({
        originalArray: [...array],
        prefixArray: [...prefix],
        currentIndex: i,
        sum: newSum,
        message: `Calculate prefix[${i}]: prefix[${i - 1}] (${prevSum}) + arr[${i}] (${currentVal}) = ${newSum}.`,
        lineNumber: 5
      });

      prefix.push(newSum);
      newSteps.push({
        originalArray: [...array],
        prefixArray: [...prefix],
        currentIndex: i,
        sum: newSum,
        message: `prefix[${i}] is now stored as ${newSum}.`,
        lineNumber: 5
      });
    }

    // Line 8: Return
    newSteps.push({
      originalArray: [...array],
      prefixArray: [...prefix],
      currentIndex: array.length - 1,
      sum: prefix[prefix.length - 1],
      message: 'Prefix sum array calculation complete.',
      lineNumber: 8
    });

    setSteps(newSteps);
    setCurrentStepIndex(0);
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
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
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
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const getMaxValue = () => Math.max(...currentStep.originalArray, ...currentStep.prefixArray);

  return (
    <div className="space-y-6">
      <StepControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg border border-border/50 p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Original Array</h4>
              <div className="flex items-end justify-center gap-2 h-32">
                {currentStep.originalArray.map((value, index) => {
                  const isActive = index === currentStep.currentIndex;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                      {isActive && (
                        <div className="absolute -top-8 text-xs font- text-primary animate-bounce">
                          CURRENT
                        </div>
                      )}
                      <div className="absolute inset-0 bottom-6 bg-muted/40 border border-dashed border-border rounded-t -z-10" />
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${isActive ? 'bg-primary shadow-lg shadow-primary/50 scale-105' : 'bg-gradient-to-t from-accent/60 to-accent/40'
                          }`}
                        style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                      />
                      <span className={`text-xs font-mono ${isActive ? 'text-primary font- text-base' : 'text-muted-foreground'}`}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Prefix Sum Array</h4>
              <div className="flex items-end justify-center gap-2 h-32">
                {currentStep.originalArray.map((_, index) => {
                  const value = currentStep.prefixArray[index];
                  const hasValue = value !== undefined;
                  const isActive = index === currentStep.currentIndex;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                      <div className="absolute inset-0 bottom-6 bg-muted/40 border border-dashed border-border rounded-t -z-10" />
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${isActive ? 'bg-primary shadow-lg shadow-primary/50 scale-105' : hasValue ? 'bg-gradient-to-t from-primary/60 to-primary/40' : 'opacity-0'
                          }`}
                        style={{ height: hasValue ? `${(value / getMaxValue()) * 100}%` : '0px', minHeight: hasValue ? '20px' : '0px' }}
                      />
                      <span className={`text-xs font-mono ${isActive ? 'text-primary font- text-base' : 'text-muted-foreground'}`}>
                        {hasValue ? value : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>


          <div className=" rounded-lg border  p-4">
            <VariablePanel
              variables={{
                i: currentStep.currentIndex >= 0 ? currentStep.currentIndex : 'N/A',
                'arr[i]': currentStep.currentIndex >= 0 ? currentStep.originalArray[currentStep.currentIndex] : 'N/A',
                'prefix[i-1]': currentStep.currentIndex > 0 ? currentStep.prefixArray[currentStep.currentIndex - 1] : 'N/A',
                sum: currentStep.sum,
                prefixLength: currentStep.prefixArray.length
              }}
            />
          </div>
        </div>

        <div className="space-y-4">

          <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
