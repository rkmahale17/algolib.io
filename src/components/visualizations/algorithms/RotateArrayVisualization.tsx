import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  k: number;
  message: string;
  highlightIndices: number[];
  lineNumber: number;
  left?: number;
  right?: number;
  phase?: string;
}

export const RotateArrayVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function rotate(nums, k) {
  const n = nums.length;
  k = k % n;
  if (k === 0) return;

  // 1. Reverse entire array
  reverse(nums, 0, n - 1);
  
  // 2. Reverse first k elements
  reverse(nums, 0, k - 1);
  
  // 3. Reverse remaining elements
  reverse(nums, k, n - 1);
}

function reverse(nums, left, right) {
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    left++;
    right--;
  }
}`;

  const reverse = (arr: number[], left: number, right: number) => {
    while (left < right) {
      [arr[left], arr[right]] = [arr[right], arr[left]];
      left++;
      right--;
    }
  };

  const generateSteps = () => {
    const nums = [1, 2, 3, 4, 5, 6, 7];
    const n = nums.length;
    let k = 3;
    const newSteps: Step[] = [];

    const addStep = (arr: number[], msg: string, line: number, l?: number, r?: number, highlights: number[] = [], phase?: string) => {
      newSteps.push({
        array: [...arr],
        k,
        message: msg,
        highlightIndices: highlights,
        lineNumber: line,
        left: l,
        right: r,
        phase
      });
    };

    // Initial state
    addStep(nums, `Initial array. Rotate by k=${k}`, 0);

    // k = k % n
    addStep(nums, `Calculate k = ${k}%${n} = ${k % n}`, 2);
    k = k % n;

    if (k === 0) {
      addStep(nums, "k is 0, no rotation needed", 3);
      setSteps(newSteps);
      return;
    }

    const performReverse = (arr: number[], left: number, right: number, startLine: number, phaseName: string) => {
      let l = left;
      let r = right;

      addStep(arr, `${phaseName}: Start reversing from index ${l} to ${r}`, startLine, l, r, [], phaseName);

      while (l < r) {
        // Highlight before swap
        addStep(arr, `${phaseName}: Comparing indices ${l} and ${r}`, 18, l, r, [l, r], phaseName);

        // Swap
        [arr[l], arr[r]] = [arr[r], arr[l]];
        addStep(arr, `${phaseName}: Swapped elements at ${l} and ${r}`, 19, l, r, [l, r], phaseName);

        // Increment/Decrement
        l++;
        r--;
        addStep(arr, `${phaseName}: Move pointers`, 20, l, r, [], phaseName);
      }
      addStep(arr, `${phaseName}: Finished`, startLine, l, r, [], phaseName);
    };

    const currentArray = [...nums];

    // Step 1: Reverse entire
    performReverse(currentArray, 0, n - 1, 6, "Reverse Entire Array");

    // Step 2: Reverse first k
    performReverse(currentArray, 0, k - 1, 9, "Reverse First K Elements");

    // Step 3: Reverse remaining
    performReverse(currentArray, k, n - 1, 12, "Reverse Remaining Elements");

    addStep(currentArray, "Rotation complete!", 13);

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
            <div className="flex flex-col items-center gap-8">
              {currentStep.phase && (
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs font- rounded-full uppercase tracking-wider border border-primary/20">
                  {currentStep.phase}
                </div>
              )}
              <div className="flex items-end justify-center gap-2 w-full max-w-lg">
                {currentStep.array.map((value, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 relative">
                    <div
                      className={`w-full aspect-square rounded flex items-center justify-center font- text-lg transition-all duration-300 ${currentStep.highlightIndices.includes(index)
                        ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                        : index === currentStep.left || index === currentStep.right
                          ? 'bg-accent text-accent-foreground border-2 border-primary ring-2 ring-primary/20 scale-105'
                          : 'bg-muted text-foreground'
                        }`}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">{index}</span>

                    {/* Pointers */}
                    <div className="h-6 flex items-start justify-center">
                      {index === currentStep.left && (
                        <span className="text-xs font-black text-primary animate-bounce">L</span>
                      )}
                      {index === currentStep.right && (
                        <span className={`text-xs font-black text-destructive animate-bounce ${index === currentStep.left ? 'ml-4' : ''}`}>R</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4 shadow-sm min-h-[5rem] flex items-center">
            <p className="text-sm text-foreground font-medium leading-relaxed">{currentStep.message}</p>
          </div>

          <div className="rounded-lg border p-4 bg-card">
            <VariablePanel
              variables={{
                phase: currentStep.phase || 'N/A',
                k: currentStep.k,
                left: currentStep.left !== undefined ? currentStep.left : 'N/A',
                right: currentStep.right !== undefined ? currentStep.right : 'N/A',
                array: currentStep.array
              }}
            />
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
      </div>
    </div>
  );
};
