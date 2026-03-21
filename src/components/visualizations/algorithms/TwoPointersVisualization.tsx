import { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  left: number;
  right: number;
  sum: number;
  target: number;
  message: string;
  lineNumber: number;
}

export const TwoPointersVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function twoSum(arr: number[], target: number): number[] {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1];
}`;

  const generateSteps = () => {
    const array = [1, 3, 4, 6, 8, 9, 11, 12, 15];
    const target = 15;
    const newSteps: Step[] = [];
    let left = 0;
    let right = array.length - 1;

    // Line 1: Function entry (implied)
    newSteps.push({
      array: [...array],
      left: -1,
      right: -1,
      sum: 0,
      target,
      message: `Starting Two-Sum with Target = ${target}. Initializing pointers.`,
      lineNumber: 1
    });

    // Line 2: Initialize left
    left = 0;
    newSteps.push({
      array: [...array],
      left,
      right: -1,
      sum: 0,
      target,
      message: 'Initialize left pointer at index 0.',
      lineNumber: 2
    });

    // Line 3: Initialize right
    right = array.length - 1;
    newSteps.push({
      array: [...array],
      left,
      right,
      sum: 0,
      target,
      message: `Initialize right pointer at index ${right} (end of array).`,
      lineNumber: 3
    });

    while (left < right) {
      // Line 5: While condition
      newSteps.push({
        array: [...array],
        left,
        right,
        sum: 0,
        target,
        message: `Check condition: left (${left}) < right (${right}) is true.`,
        lineNumber: 5
      });

      const sum = array[left] + array[right];
      // Line 6: Calculate sum
      newSteps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        message: `Calculate sum: arr[${left}] (${array[left]}) + arr[${right}] (${array[right]}) = ${sum}.`,
        lineNumber: 6
      });

      // Line 8: Check if sum equals target
      newSteps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        message: `Compare sum (${sum}) with target (${target}).`,
        lineNumber: 8
      });

      if (sum === target) {
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `Success! ${sum} matches target ${target}. Returning indices [${left}, ${right}].`,
          lineNumber: 9
        });
        break;
      } else if (sum < target) {
        // Line 10: Check if sum < target
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `${sum} is less than ${target}. We need a larger sum, so move left pointer right.`,
          lineNumber: 10
        });
        // Line 11: left++
        left++;
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `Incremented left pointer to index ${left}.`,
          lineNumber: 11
        });
      } else {
        // Line 12: Sum > target
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `${sum} is greater than ${target}. We need a smaller sum, so move right pointer left.`,
          lineNumber: 12
        });
        // Line 13: right--
        right--;
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `Decremented right pointer to index ${right}.`,
          lineNumber: 13
        });
      }
    }

    if (left >= right && newSteps[newSteps.length - 1].lineNumber !== 9) {
      newSteps.push({
        array: [...array],
        left,
        right,
        sum: 0,
        target,
        message: 'Target not found in the array.',
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };
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
                const isLeft = index === currentStep.left;
                const isRight = index === currentStep.right;
                const isActive = isLeft || isRight;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative"
                  >
                    {isLeft && (
                      <div className="absolute -top-8 text-xs font- text-primary animate-bounce">
                        LEFT
                      </div>
                    )}
                    {isRight && (
                      <div className="absolute -top-8 text-xs font- text-primary animate-bounce">
                        RIGHT
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${isActive
                        ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                        : 'bg-gradient-to-t from-primary/60 to-primary/40'
                        }`}
                      style={{
                        height: `${(value / getMaxValue()) * 100}%`,
                        minHeight: '20px'
                      }}
                    />
                    <span
                      className={`text-xs font-mono transition-colors ${isActive ? 'text-primary font- text-base' : 'text-muted-foreground'
                        }`}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
          <div className="rounded-lg border  p-4">

            <VariablePanel
              variables={{
                left: currentStep.left,
                right: currentStep.right,
                sum: currentStep.sum,
                target: currentStep.target,
                'arr[left]': currentStep.array[currentStep.left],
                'arr[right]': currentStep.array[currentStep.right]
              }}
            />
          </div>
        </div>

        <div className="space-y-4">

          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="TypeScript"
          />
        </div>
      </div>
    </div>
  );
};
