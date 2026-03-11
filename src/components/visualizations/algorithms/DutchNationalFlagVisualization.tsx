import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  low: number;
  mid: number;
  high: number;
  message: string;
  lineNumber: number;
}

export const DutchNationalFlagVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function sortColors(nums: number[]): void {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`;

  const generateSteps = () => {
    const initialArray = [2, 0, 2, 1, 1, 0, 2, 1, 0];
    const newSteps: Step[] = [];
    const nums = [...initialArray];
    let low = 0, mid = 0, high = nums.length - 1;

    // Line 1: Function entry
    newSteps.push({
      array: [...nums],
      low: -1,
      mid: -1,
      high: -1,
      message: 'Starting Dutch National Flag algorithm (Sort Colors).',
      lineNumber: 1
    });

    // Line 2: Initialize low
    low = 0;
    newSteps.push({
      array: [...nums],
      low,
      mid: -1,
      high: -1,
      message: 'Initialize low pointer at index 0.',
      lineNumber: 2
    });

    // Line 3: Initialize mid
    mid = 0;
    newSteps.push({
      array: [...nums],
      low,
      mid,
      high: -1,
      message: 'Initialize mid pointer at index 0.',
      lineNumber: 3
    });

    // Line 4: Initialize high
    high = nums.length - 1;
    newSteps.push({
      array: [...nums],
      low,
      mid,
      high,
      message: `Initialize high pointer at index ${high}.`,
      lineNumber: 4
    });

    while (mid <= high) {
      // Line 6: While condition
      newSteps.push({
        array: [...nums],
        low,
        mid,
        high,
        message: `Check condition: mid (${mid}) <= high (${high}) is true.`,
        lineNumber: 6
      });

      // Line 7: Check if nums[mid] === 0
      newSteps.push({
        array: [...nums],
        low,
        mid,
        high,
        message: `Check if nums[mid] (${nums[mid]}) is 0.`,
        lineNumber: 7
      });

      if (nums[mid] === 0) {
        // Line 8: Swap low and mid
        [nums[low], nums[mid]] = [nums[mid], nums[low]];
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: `nums[mid] is 0. Swap nums[low] and nums[mid].`,
          lineNumber: 8
        });

        // Line 9: low++
        low++;
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: 'Move low pointer forward.',
          lineNumber: 9
        });

        // Line 10: mid++
        mid++;
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: 'Move mid pointer forward.',
          lineNumber: 10
        });

      } else if (nums[mid] === 1) {
        // Line 11: Check if nums[mid] === 1
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: `nums[mid] is 1. Already in the middle region.`,
          lineNumber: 11
        });

        // Line 12: mid++
        mid++;
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: 'Move mid pointer forward.',
          lineNumber: 12
        });

      } else {
        // Line 13: nums[mid] is 2
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: `nums[mid] is 2. Needs to go to the high region.`,
          lineNumber: 11 // Mapping else if check or the logic below
        });

        // Line 14: Swap mid and high
        [nums[mid], nums[high]] = [nums[high], nums[mid]];
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: `Swap nums[mid] and nums[high].`,
          lineNumber: 14
        });

        // Line 15: high--
        high--;
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: 'Move high pointer backward. Mid stays current to check swapped value.',
          lineNumber: 15
        });
      }
    }

    // Line 18: Completion
    newSteps.push({
      array: [...nums],
      low,
      mid,
      high,
      message: 'Algorithm complete. Array is now sorted.',
      lineNumber: 18
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
      }, 1200 / speed);
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

  const getColorClass = (value: number) => {
    switch (value) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-white border-2 border-gray-400';
      case 2: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {currentStep.array.map((value, index) => {
                const isLow = index === currentStep.low;
                const isMid = index === currentStep.mid;
                const isHigh = index === currentStep.high;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 relative">
                    <div className="text-xs space-y-0.5 h-8">
                      {isLow && <div className="font- text-blue-500">LOW</div>}
                      {isMid && <div className="font- text-primary">MID</div>}
                      {isHigh && <div className="font- text-blue-500">HIGH</div>}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font- text-lg transition-all duration-300 ${getColorClass(
                        value
                      )} ${isMid ? 'shadow-lg shadow-primary/50 scale-110 ring-4 ring-primary' :
                        isLow || isHigh ? 'scale-105' : ''
                        }`}
                    >
                      <span className={value === 1 ? 'text-gray-800' : 'text-white'}>{value}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">[{index}]</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-muted-foreground">0 (Red)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400"></div>
                <span className="text-muted-foreground">1 (White)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">2 (Blue)</span>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className=" rounded-lg p-4">
            <VariablePanel
              variables={{
                low: currentStep.low,
                mid: currentStep.mid,
                high: currentStep.high,
                'nums[mid]': currentStep.mid <= currentStep.high ? currentStep.array[currentStep.mid] : 'done'
              }}
            />
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
      </div>


    </div>
  );
};
