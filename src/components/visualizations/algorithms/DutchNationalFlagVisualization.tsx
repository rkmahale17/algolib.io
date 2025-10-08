import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

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

  const code = `function sortColors(nums) {
  let low = 0, mid = 0;
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
    const array = [2, 0, 2, 1, 1, 0, 2, 1, 0];
    const newSteps: Step[] = [];
    const nums = [...array];
    let low = 0, mid = 0, high = nums.length - 1;

    newSteps.push({
      array: [...nums],
      low,
      mid,
      high,
      message: 'Initialize: low=0, mid=0, high=last index. Goal: 0s left, 1s middle, 2s right',
      lineNumber: 1
    });

    while (mid <= high) {
      if (nums[mid] === 0) {
        [nums[low], nums[mid]] = [nums[mid], nums[low]];
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: `nums[${mid}] = 0. Swap with low pointer. Move both low and mid forward.`,
          lineNumber: 6
        });
        low++;
        mid++;
      } else if (nums[mid] === 1) {
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: `nums[${mid}] = 1. Already in correct region. Move mid forward.`,
          lineNumber: 10
        });
        mid++;
      } else {
        [nums[mid], nums[high]] = [nums[high], nums[mid]];
        newSteps.push({
          array: [...nums],
          low,
          mid,
          high,
          message: `nums[${mid}] = 2. Swap with high pointer. Move high backward. Don't move mid (need to check swapped value).`,
          lineNumber: 12
        });
        high--;
      }
    }

    newSteps.push({
      array: [...nums],
      low,
      mid,
      high,
      message: 'Complete! Array sorted: all 0s, then 1s, then 2s.',
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
                      {isLow && <div className="font-bold text-blue-500">LOW</div>}
                      {isMid && <div className="font-bold text-primary">MID</div>}
                      {isHigh && <div className="font-bold text-purple-500">HIGH</div>}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${getColorClass(
                        value
                      )} ${
                        isMid ? 'shadow-lg shadow-primary/50 scale-110 ring-4 ring-primary' : 
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
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
      </div>

      <VariablePanel
        variables={{
          low: currentStep.low,
          mid: currentStep.mid,
          high: currentStep.high,
          'nums[mid]': currentStep.mid <= currentStep.high ? currentStep.array[currentStep.mid] : 'done'
        }}
      />
    </div>
  );
};
