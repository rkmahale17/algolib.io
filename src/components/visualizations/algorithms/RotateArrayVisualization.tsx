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
}

export const RotateArrayVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function rotate(nums, k) {
  k = k % nums.length;
  
  // Reverse entire array
  reverse(nums, 0, nums.length - 1);
  
  // Reverse first k elements
  reverse(nums, 0, k - 1);
  
  // Reverse remaining elements
  reverse(nums, k, nums.length - 1);
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
    const k = 3;
    const newSteps: Step[] = [];

    newSteps.push({
      array: [...nums],
      k,
      message: `Rotate array by k=${k} positions. Use 3 reversal steps`,
      highlightIndices: [],
      lineNumber: 0
    });

    // Step 1: Reverse entire array
    const arr1 = [...nums];
    reverse(arr1, 0, arr1.length - 1);
    newSteps.push({
      array: arr1,
      k,
      message: 'Step 1: Reverse entire array',
      highlightIndices: Array.from({ length: arr1.length }, (_, i) => i),
      lineNumber: 4
    });

    // Step 2: Reverse first k elements
    const arr2 = [...arr1];
    reverse(arr2, 0, k - 1);
    newSteps.push({
      array: arr2,
      k,
      message: `Step 2: Reverse first ${k} elements`,
      highlightIndices: Array.from({ length: k }, (_, i) => i),
      lineNumber: 7
    });

    // Step 3: Reverse remaining elements
    const arr3 = [...arr2];
    reverse(arr3, k, arr3.length - 1);
    newSteps.push({
      array: arr3,
      k,
      message: `Step 3: Reverse remaining elements`,
      highlightIndices: Array.from({ length: arr3.length - k }, (_, i) => i + k),
      lineNumber: 10
    });

    newSteps.push({
      array: arr3,
      k,
      message: `Complete! Array rotated by ${k} positions`,
      highlightIndices: [],
      lineNumber: 11
    });

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
            <div className="flex items-end justify-center gap-2 h-32">
              {currentStep.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-full aspect-square rounded flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      currentStep.highlightIndices.includes(index)
                        ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {value}
                  </div>
                  <span className="text-xs text-muted-foreground">{index}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          
          <div className=" rounded-lg border  p-4">

  <VariablePanel
        variables={{
          k: currentStep.k,
          'array.length': currentStep.array.length,
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
