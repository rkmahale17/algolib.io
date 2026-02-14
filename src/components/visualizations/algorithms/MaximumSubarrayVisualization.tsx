import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  i: number;
  maxSub: number;
  curSum: number;
  message: string;
  lineNumber: number;
  highlightIndices: number[];
}

export const MaximumSubarrayVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function maxSubArray(nums: number[]): number {
  // Initialize maxSub with the first element
  let maxSub = nums[0];

  // Current subarray sum
  let curSum = 0;

  for (const n of nums) {
    // If current sum becomes negative,
    // reset it because it won't help future sums
    if (curSum < 0) {
      curSum = 0;
    }

    // Add current number to current sum
    curSum += n;

    // Update maximum subarray sum
    maxSub = Math.max(maxSub, curSum);
  }

  return maxSub;
}`;

  const generateSteps = () => {
    const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const newSteps: Step[] = [];
    
    // Initial state
    let maxSub = nums[0];
    let curSum = 0;
    
    newSteps.push({
      array: [...nums],
      i: -1,
      maxSub,
      curSum,
      message: `Initialize maxSub = ${maxSub}, curSum = 0`,
      lineNumber: 3,
      highlightIndices: []
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      
      // Start of loop iteration
      newSteps.push({
        array: [...nums],
        i,
        maxSub,
        curSum,
        message: `Processing number: ${n}`,
        lineNumber: 8,
        highlightIndices: [i]
      });

      // Check if curSum < 0
      if (curSum < 0) {
        newSteps.push({
          array: [...nums],
          i,
          maxSub,
          curSum,
          message: `curSum (${curSum}) is negative. Resetting to 0.`,
          lineNumber: 11,
        highlightIndices: [i]
        });
        
        curSum = 0;
        
        newSteps.push({
          array: [...nums],
          i,
          maxSub,
          curSum,
          message: `curSum reset to 0`,
          lineNumber: 12,
        highlightIndices: [i]
        });
      }

      // Add current number
      const oldSum = curSum;
      curSum += n;
      
      newSteps.push({
        array: [...nums],
        i,
        maxSub,
        curSum,
        message: `Add ${n} to curSum: ${oldSum} + ${n} = ${curSum}`,
        lineNumber: 16,
        highlightIndices: [i]
      });

      // Update maxSub
      const oldMax = maxSub;
      maxSub = Math.max(maxSub, curSum);
      
      newSteps.push({
        array: [...nums],
        i,
        maxSub,
        curSum,
        message: `Update maxSub: max(${oldMax}, ${curSum}) = ${maxSub}`,
        lineNumber: 19,
        highlightIndices: [i]
      });
    }

    // Final result
    newSteps.push({
      array: [...nums],
      i: nums.length,
      maxSub,
      curSum,
      message: `Finished! Maximum Subarray Sum is ${maxSub}`,
      lineNumber: 22,
      highlightIndices: []
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
            <div className="flex items-center justify-center gap-2 overflow-x-auto">
              {currentStep.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 rounded flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      index === currentStep.i
                        ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {value}
                  </div>
                  <span className="text-xs text-muted-foreground">{index}</span>
                  {index === currentStep.i && <span className="text-xs font-bold text-primary">n</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
          
          <div className="rounded-lg border p-4">
            <VariablePanel
              variables={{
                maxSub: currentStep.maxSub,
                curSum: currentStep.curSum,
                n: currentStep.i >= 0 && currentStep.i < currentStep.array.length ? currentStep.array[currentStep.i] : 'N/A'
              }}
            />
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
      </div>
    </div>
  );
};
