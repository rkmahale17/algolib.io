import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  left: number;
  right: number;
  mid: number;
  target: number;
  found: boolean;
  message: string;
  lineNumber: number;
}

export const BinarySearchVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`;

  const generateSteps = () => {
    const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    const target = 13;
    const newSteps: Step[] = [];
    let left = 0;
    let right = array.length - 1;

    // Line 1: Function entry
    newSteps.push({
      array: [...array],
      left: -1,
      right: -1,
      mid: -1,
      target,
      found: false,
      message: `Starting Binary Search for target ${target}.`,
      lineNumber: 1
    });

    // Line 2: Initialize left
    newSteps.push({
      array: [...array],
      left: 0,
      right: -1,
      mid: -1,
      target,
      found: false,
      message: 'Initialize left pointer at index 0.',
      lineNumber: 2
    });

    // Line 3: Initialize right
    newSteps.push({
      array: [...array],
      left: 0,
      right: array.length - 1,
      mid: -1,
      target,
      found: false,
      message: `Initialize right pointer at index ${array.length - 1}.`,
      lineNumber: 3
    });

    while (left <= right) {
      // Line 5: While condition
      newSteps.push({
        array: [...array],
        left,
        right,
        mid: -1,
        target,
        found: false,
        message: `Check condition: left (${left}) <= right (${right}) is true.`,
        lineNumber: 5
      });

      const mid = Math.floor((left + right) / 2);
      // Line 6: Calculate mid
      newSteps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        message: `Calculate mid: Math.floor((${left} + ${right}) / 2) = ${mid}.`,
        lineNumber: 6
      });

      // Line 8: Check if arr[mid] === target
      newSteps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        message: `Compare arr[${mid}] (${array[mid]}) with target (${target}).`,
        lineNumber: 8
      });

      if (array[mid] === target) {
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: true,
          message: `Success! arr[${mid}] matches target ${target}. Returning index ${mid}.`,
          lineNumber: 9
        });
        break;
      } else if (array[mid] < target) {
        // Line 10: Check if arr[mid] < target
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          message: `${array[mid]} is less than ${target}. Search the right half.`,
          lineNumber: 10
        });
        // Line 11: left = mid + 1
        left = mid + 1;
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          message: `Update left pointer to mid + 1 = ${left}.`,
          lineNumber: 11
        });
      } else {
        // Line 12: arr[mid] > target
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          message: `${array[mid]} is greater than ${target}. Search the left half.`,
          lineNumber: 12
        });
        // Line 13: right = mid - 1
        right = mid - 1;
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          message: `Update right pointer to mid - 1 = ${right}.`,
          lineNumber: 13
        });
      }
    }

    if (left > right && newSteps[newSteps.length - 1].lineNumber !== 9) {
      // Line 17: Return -1
      newSteps.push({
        array: [...array],
        left,
        right,
        mid: -1,
        target,
        found: false,
        message: `Search range exhausted (left > right). Target ${target} not found. Returning -1.`,
        lineNumber: 17
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
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
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
  const getMaxValue = () => Math.max(...currentStep.array);

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <div className="flex items-end justify-center gap-2 h-64">
              {currentStep.array.map((value, index) => {
                const isMid = index === currentStep.mid;
                const isInRange = index >= currentStep.left && index <= currentStep.right;
                const isOutOfRange = !isInRange;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                    {index === currentStep.left && (
                      <div className="absolute -top-8 text-xs font- text-blue-500">L</div>
                    )}
                    {index === currentStep.right && (
                      <div className="absolute -top-8 text-xs font- text-blue-500">R</div>
                    )}
                    {isMid && (
                      <div className="absolute -top-8 text-xs font- text-primary animate-bounce">MID</div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${isMid && currentStep.found
                        ? 'bg-green-500 shadow-lg shadow-green-500/50 scale-110'
                        : isMid
                          ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                          : isOutOfRange
                            ? 'bg-muted opacity-30'
                            : 'bg-gradient-to-t from-primary/60 to-primary/40'
                        }`}
                      style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                    />
                    <span
                      className={`text-xs font-mono ${isMid ? 'text-primary font- text-base' : isOutOfRange ? 'text-muted-foreground opacity-30' : 'text-muted-foreground'
                        }`}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-lg border p-4 ${currentStep.found ? 'bg-green-500/20 border-green-500' : 'bg-accent/50 border-accent'}`}>
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
          <div className={`rounded-lg border p-4 `}>

            <VariablePanel
              variables={{
                left: currentStep.left,
                right: currentStep.right,
                mid: currentStep.mid >= 0 ? currentStep.mid : 'calculating...',
                target: currentStep.target,
                'arr[mid]': currentStep.mid >= 0 ? currentStep.array[currentStep.mid] : 'N/A',
                searchSpace: currentStep.right - currentStep.left + 1
              }}
            />
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
      </div>


    </div>
  );
};
