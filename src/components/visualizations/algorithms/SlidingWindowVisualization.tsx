import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  windowStart: number;
  windowEnd: number;
  windowSize: number;
  windowSum: number;
  maxSum: number;
  message: string;
  lineNumber: number;
}

export const SlidingWindowVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function maxSumSubarray(arr, k) {
  let maxSum = 0;
  let windowSum = 0;
  
  // Calculate first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`;

  const generateSteps = () => {
    const array = [2, 1, 5, 1, 3, 2, 4, 7, 1];
    const k = 3;
    const newSteps: Step[] = [];
    let windowSum = 0;
    let maxSum = 0;

    // Initial window calculation
    newSteps.push({
      array: [...array],
      windowStart: 0,
      windowEnd: -1,
      windowSize: k,
      windowSum: 0,
      maxSum: 0,
      message: `Initialize: window size k = ${k}`,
      lineNumber: 1
    });

    for (let i = 0; i < k; i++) {
      windowSum += array[i];
      newSteps.push({
        array: [...array],
        windowStart: 0,
        windowEnd: i,
        windowSize: k,
        windowSum,
        maxSum: 0,
        message: `Building first window: add arr[${i}] = ${array[i]}, windowSum = ${windowSum}`,
        lineNumber: 6
      });
    }
    maxSum = windowSum;

    newSteps.push({
      array: [...array],
      windowStart: 0,
      windowEnd: k - 1,
      windowSize: k,
      windowSum,
      maxSum,
      message: `First window complete! windowSum = ${windowSum}, maxSum = ${maxSum}`,
      lineNumber: 8
    });

    // Sliding window
    for (let i = k; i < array.length; i++) {
      const oldElement = array[i - k];
      const newElement = array[i];
      windowSum = windowSum - oldElement + newElement;
      
      newSteps.push({
        array: [...array],
        windowStart: i - k + 1,
        windowEnd: i,
        windowSize: k,
        windowSum,
        maxSum,
        message: `Slide window: remove arr[${i - k}] = ${oldElement}, add arr[${i}] = ${newElement}`,
        lineNumber: 12
      });

      if (windowSum > maxSum) {
        maxSum = windowSum;
        newSteps.push({
          array: [...array],
          windowStart: i - k + 1,
          windowEnd: i,
          windowSize: k,
          windowSum,
          maxSum,
          message: `New maximum found! windowSum ${windowSum} > maxSum, update maxSum = ${maxSum}`,
          lineNumber: 13
        });
      }
    }

    newSteps.push({
      array: [...array],
      windowStart: array.length - k,
      windowEnd: array.length - 1,
      windowSize: k,
      windowSum,
      maxSum,
      message: `Complete! Maximum sum of ${k} consecutive elements is ${maxSum}`,
      lineNumber: 16
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
                const isInWindow = index >= currentStep.windowStart && index <= currentStep.windowEnd;
                const isWindowStart = index === currentStep.windowStart;
                const isWindowEnd = index === currentStep.windowEnd;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative"
                  >
                    {isWindowStart && (
                      <div className="absolute -top-8 text-xs font-bold text-primary">
                        START
                      </div>
                    )}
                    {isWindowEnd && (
                      <div className="absolute -top-8 text-xs font-bold text-primary">
                        END
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 relative ${
                        isInWindow
                          ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                          : 'bg-gradient-to-t from-primary/60 to-primary/40'
                      }`}
                      style={{
                        height: `${(value / getMaxValue()) * 100}%`,
                        minHeight: '20px'
                      }}
                    >
                      {isInWindow && (
                        <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-mono transition-colors ${
                        isInWindow ? 'text-primary font-bold text-base' : 'text-muted-foreground'
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
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              windowStart: currentStep.windowStart,
              windowEnd: currentStep.windowEnd,
              windowSize: currentStep.windowSize,
              windowSum: currentStep.windowSum,
              maxSum: currentStep.maxSum,
              'window': currentStep.array.slice(currentStep.windowStart, currentStep.windowEnd + 1)
            }}
          />
          <CodeHighlighter
            code={code}
            highlightedLine={currentStep.lineNumber}
            language="TypeScript"
          />
        </div>
      </div>
    </div>
  );
};
