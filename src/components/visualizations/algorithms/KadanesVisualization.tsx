import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  currentIndex: number;
  currentSum: number;
  maxSum: number;
  subarrayStart: number;
  subarrayEnd: number;
  message: string;
  lineNumber: number;
}

export const KadanesVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}`;

  const generateSteps = () => {
    const array = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    const newSteps: Step[] = [];
    let maxSum = array[0];
    let currentSum = array[0];
    let subarrayStart = 0;
    let subarrayEnd = 0;
    let tempStart = 0;

    newSteps.push({
      array: [...array],
      currentIndex: 0,
      currentSum,
      maxSum,
      subarrayStart: 0,
      subarrayEnd: 0,
      message: `Initialize: currentSum = maxSum = arr[0] = ${array[0]}`,
      lineNumber: 1
    });

    for (let i = 1; i < array.length; i++) {
      const extendSum = currentSum + array[i];
      const startNew = array[i];
      
      if (startNew > extendSum) {
        currentSum = startNew;
        tempStart = i;
        newSteps.push({
          array: [...array],
          currentIndex: i,
          currentSum,
          maxSum,
          subarrayStart,
          subarrayEnd,
          message: `arr[${i}] = ${array[i]} > currentSum + arr[${i}] = ${extendSum}. Start new subarray.`,
          lineNumber: 5
        });
      } else {
        currentSum = extendSum;
        newSteps.push({
          array: [...array],
          currentIndex: i,
          currentSum,
          maxSum,
          subarrayStart,
          subarrayEnd,
          message: `Extend: currentSum = currentSum + arr[${i}] = ${currentSum}`,
          lineNumber: 5
        });
      }

      if (currentSum > maxSum) {
        maxSum = currentSum;
        subarrayStart = tempStart;
        subarrayEnd = i;
        newSteps.push({
          array: [...array],
          currentIndex: i,
          currentSum,
          maxSum,
          subarrayStart,
          subarrayEnd,
          message: `New max found! maxSum = ${maxSum}. Best subarray: [${subarrayStart}...${subarrayEnd}]`,
          lineNumber: 6
        });
      }
    }

    newSteps.push({
      array: [...array],
      currentIndex: array.length - 1,
      currentSum,
      maxSum,
      subarrayStart,
      subarrayEnd,
      message: `Complete! Maximum subarray sum = ${maxSum}`,
      lineNumber: 9
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
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {currentStep.array.map((value, index) => {
                const isCurrent = index === currentStep.currentIndex;
                const isInMaxSubarray = index >= currentStep.subarrayStart && index <= currentStep.subarrayEnd;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 relative">
                    {isCurrent && (
                      <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">▼</div>
                    )}
                    <div
                      className={`w-14 h-14 rounded flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${
                        isInMaxSubarray
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-110'
                          : isCurrent
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-105'
                          : value < 0
                          ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                          : 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                      }`}
                    >
                      {value}
                    </div>
                    <span className="text-xs text-muted-foreground">[{index}]</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-xs text-muted-foreground mb-1">Maximum Subarray</div>
            <div className="font-mono text-sm">
              [{currentStep.subarrayStart}...{currentStep.subarrayEnd}] = {currentStep.maxSum}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              i: currentStep.currentIndex,
              'arr[i]': currentStep.array[currentStep.currentIndex],
              currentSum: currentStep.currentSum,
              maxSum: currentStep.maxSum,
              subarrayRange: `[${currentStep.subarrayStart}, ${currentStep.subarrayEnd}]`
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
