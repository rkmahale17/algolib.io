import { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  array: number[];
  windowStart: number;
  windowEnd: number;
  windowSize: number;
  windowSum: number;
  maxSum: number;
  message: string;
  pseudoStep: string;
}

// ─── Hardcoded code per language ─────────────────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function maxSumSubarray(arr: number[], k: number): number {
  let maxSum = 0;
  let windowSum = 0;
  
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}`,

  python: `def max_sum_subarray(arr: List[int], k: int) -> int:
    max_sum = 0
    window_sum = 0
    
    for i in range(k):
        window_sum += arr[i]
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum = window_sum - arr[i - k] + arr[i]
        max_sum = max(max_sum, window_sum)
        
    return max_sum`,

  java: `public static class Solution {
    public int maxSumSubarray(int[] arr, int k) {
        int maxSum = 0;
        int windowSum = 0;
        
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        maxSum = windowSum;
        
        for (int i = k; i < arr.length; i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = Math.max(maxSum, windowSum);
        }
        
        return maxSum;
    }
}`,

  cpp: `class Solution {
public:
    int maxSumSubarray(vector<int>& arr, int k) {
        int maxSum = 0;
        int windowSum = 0;
        
        for (int i = 0; i < k; i++) {
            windowSum += arr[i];
        }
        maxSum = windowSum;
        
        for (int i = k; i < arr.size(); i++) {
            windowSum = windowSum - arr[i - k] + arr[i];
            maxSum = max(maxSum, windowSum);
        }
        
        return maxSum;
    }
};`
};

// ─── Step Generator ──────────────────────────────────────────────────────────

function generateVisualizationData() {
  const array = [2, 1, 5, 1, 3, 2, 4, 7, 1];
  const k = 3;
  const steps: Step[] = [];
  let windowSum = 0;
  let maxSum = 0;

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  // Line 1: Function entry
  steps.push({
    array: [...array],
    windowStart: -1,
    windowEnd: -1,
    windowSize: k,
    windowSum: 0,
    maxSum: 0,
    message: `Starting Maximum Sum Subarray with k = ${k}.`,
    pseudoStep: `START maxSumSubarray(arr, k = ${k})`
  });
  addLines(1, 1, 2, 3);

  // Line 2: Initialize maxSum
  steps.push({
    array: [...array],
    windowStart: -1,
    windowEnd: -1,
    windowSize: k,
    windowSum: 0,
    maxSum: 0,
    message: 'Initialize maxSum = 0.',
    pseudoStep: 'SET maxSum = 0'
  });
  addLines(2, 2, 3, 4);

  // Line 3: Initialize windowSum
  steps.push({
    array: [...array],
    windowStart: -1,
    windowEnd: -1,
    windowSize: k,
    windowSum: 0,
    maxSum: 0,
    message: 'Initialize windowSum = 0.',
    pseudoStep: 'SET windowSum = 0'
  });
  addLines(3, 3, 4, 5);

  // Building first window
  for (let i = 0; i < k; i++) {
    // Line 5: For loop check
    steps.push({
      array: [...array],
      windowStart: 0,
      windowEnd: i - 1,
      windowSize: k,
      windowSum,
      maxSum,
      message: `Building first window: i = ${i}.`,
      pseudoStep: `FOR i = 0 to k-1  →  i = ${i} < ${k}  →  YES ✓`
    });
    addLines(5, 5, 6, 7);

    windowSum += array[i];
    // Line 6: Add to windowSum
    steps.push({
      array: [...array],
      windowStart: 0,
      windowEnd: i,
      windowSize: k,
      windowSum,
      maxSum,
      message: `Add arr[${i}] (${array[i]}) to windowSum. windowSum is now ${windowSum}.`,
      pseudoStep: `SET windowSum = windowSum + arr[i]  →  windowSum = ${windowSum}`
    });
    addLines(6, 6, 7, 8);
  }

  maxSum = windowSum;
  // Line 8: Set initial maxSum
  steps.push({
    array: [...array],
    windowStart: 0,
    windowEnd: k - 1,
    windowSize: k,
    windowSum,
    maxSum,
    message: `First window built. Set initial maxSum = windowSum = ${maxSum}.`,
    pseudoStep: `SET maxSum = windowSum  →  maxSum = ${maxSum}`
  });
  addLines(8, 7, 9, 10);

  // Sliding window
  for (let i = k; i < array.length; i++) {
    const oldIndex = i - k;
    const newIndex = i;

    // Line 10: For loop check
    steps.push({
      array: [...array],
      windowStart: oldIndex,
      windowEnd: newIndex - 1,
      windowSize: k,
      windowSum,
      maxSum,
      message: `Sliding window: i = ${i}.`,
      pseudoStep: `FOR i = k to arr.length-1  →  i = ${i} < ${array.length}  →  YES ✓`
    });
    addLines(10, 9, 11, 12);

    // Line 11: Subtract old, add new
    const oldVal = array[oldIndex];
    const newVal = array[newIndex];

    // Show subtraction first
    steps.push({
      array: [...array],
      windowStart: oldIndex + 1,
      windowEnd: newIndex - 1,
      windowSize: k,
      windowSum: windowSum - oldVal,
      maxSum,
      message: `Remove arr[${oldIndex}] (${oldVal}) from windowSum.`,
      pseudoStep: `windowSum = windowSum − arr[i−k]  →  windowSum = ${windowSum - oldVal}`
    });
    addLines(11, 10, 12, 13);

    windowSum = windowSum - oldVal + newVal;

    // Show addition
    steps.push({
      array: [...array],
      windowStart: oldIndex + 1,
      windowEnd: newIndex,
      windowSize: k,
      windowSum,
      maxSum,
      message: `Add arr[${newIndex}] (${newVal}) to windowSum. windowSum is now ${windowSum}.`,
      pseudoStep: `windowSum = windowSum + arr[i]  →  windowSum = ${windowSum}`
    });
    addLines(11, 10, 12, 13);

    // Line 12: Update maxSum
    const prevMax = maxSum;
    maxSum = Math.max(maxSum, windowSum);
    steps.push({
      array: [...array],
      windowStart: oldIndex + 1,
      windowEnd: newIndex,
      windowSize: k,
      windowSum,
      maxSum,
      message: windowSum > prevMax
        ? `New maximum found! ${windowSum} > ${prevMax}. Update maxSum = ${maxSum}.`
        : `${windowSum} is not greater than ${prevMax}. maxSum remains ${maxSum}.`,
      pseudoStep: `SET maxSum = max(maxSum, windowSum)  →  maxSum = ${maxSum}`
    });
    addLines(12, 11, 13, 14);
  }

  // Line 15: Return
  steps.push({
    array: [...array],
    windowStart: array.length - k,
    windowEnd: array.length - 1,
    windowSize: k,
    windowSum,
    maxSum,
    message: `Algorithm complete. The maximum sum subarray of size ${k} has sum ${maxSum}.`,
    pseudoStep: `RETURN maxSum  →  ${maxSum}`
  });
  addLines(15, 13, 16, 17);

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const SlidingWindowVisualization = () => {
  const [{ steps, stepLineNumbers }] = useState(generateVisualizationData);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

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
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 flex flex-col justify-center items-center min-h-[250px] overflow-x-auto">
            <div className="relative inline-flex items-center gap-2 py-10">
              {/* Sliding Window Border Outline Overlay */}
              {currentStep.windowStart !== -1 && currentStep.windowEnd !== -1 && (
                <div
                  className="absolute border-2 border-dashed border-primary rounded-lg bg-primary/5 pointer-events-none transition-all duration-300 z-10"
                  style={{
                    left: `${currentStep.windowStart * 40}px`,
                    width: `${(currentStep.windowEnd - currentStep.windowStart + 1) * 40 - 8}px`,
                    top: '40px',
                    height: '32px',
                  }}
                />
              )}
              {currentStep.array.map((value, index) => {
                const isInWindow = index >= currentStep.windowStart && index <= currentStep.windowEnd;
                const isWindowStart = index === currentStep.windowStart;
                const isWindowEnd = index === currentStep.windowEnd;

                return (
                  <div
                    key={index}
                    className="relative flex flex-col items-center pt-10 w-8"
                  >
                    {isWindowStart && (
                      <span className="absolute top-0 text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">
                        Start
                      </span>
                    )}
                    {isWindowEnd && (
                      <span className={`absolute text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap ${isWindowStart ? 'top-4' : 'top-0'}`}>
                        End
                      </span>
                    )}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${isInWindow
                        ? 'bg-primary/20 border-primary shadow-sm'
                        : 'bg-primary/5 border-primary/25 text-muted-foreground'
                        }`}
                    >
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className=" rounded-lg border p-4">
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
          </div>
        </div>

        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
        </div>
      </div>
    </div>
  );
};
