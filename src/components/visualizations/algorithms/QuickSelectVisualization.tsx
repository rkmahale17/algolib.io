import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  left: number;
  right: number;
  pivotIndex: number;
  k: number;
  message: string;
  lineNumber: number;
  partitionIndex?: number;
}

export const QuickSelectVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function quickSelect(arr, left, right, k) {
  if (left === right) return arr[left];
  
  const pivotIndex = partition(arr, left, right);
  
  if (k === pivotIndex) {
    return arr[k];
  } else if (k < pivotIndex) {
    return quickSelect(arr, left, pivotIndex - 1, k);
  } else {
    return quickSelect(arr, pivotIndex + 1, right, k);
  }
}`;

  const generateSteps = () => {
    const array = [7, 10, 4, 3, 20, 15];
    const k = 2; // Find 3rd smallest (0-indexed)
    const newSteps: Step[] = [];

    const partition = (arr: number[], left: number, right: number, steps: Step[]) => {
      const pivot = arr[right];
      steps.push({
        array: [...arr],
        left,
        right,
        pivotIndex: right,
        k,
        message: `Partition: pivot = arr[${right}] = ${pivot}`,
        lineNumber: 3
      });

      let i = left - 1;
      for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            left,
            right,
            pivotIndex: right,
            k,
            message: `arr[${j}] = ${arr[j]} ≤ pivot. Swap with position ${i}`,
            lineNumber: 3
          });
        }
      }
      [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
      steps.push({
        array: [...arr],
        left,
        right,
        pivotIndex: i + 1,
        k,
        partitionIndex: i + 1,
        message: `Place pivot at position ${i + 1}`,
        lineNumber: 3
      });
      return i + 1;
    };

    const quickSelect = (arr: number[], left: number, right: number, k: number, steps: Step[]) => {
      if (left === right) {
        steps.push({
          array: [...arr],
          left,
          right,
          pivotIndex: left,
          k,
          message: `Found! arr[${k}] = ${arr[k]} is the ${k + 1}th smallest element`,
          lineNumber: 1
        });
        return arr[left];
      }

      const pivotIndex = partition(arr, left, right, steps);

      if (k === pivotIndex) {
        steps.push({
          array: [...arr],
          left,
          right,
          pivotIndex,
          k,
          message: `Found! Pivot position ${pivotIndex} equals k=${k}. Answer: ${arr[k]}`,
          lineNumber: 5
        });
        return arr[k];
      } else if (k < pivotIndex) {
        steps.push({
          array: [...arr],
          left,
          right,
          pivotIndex,
          k,
          message: `k=${k} < pivot=${pivotIndex}. Search left partition`,
          lineNumber: 7
        });
        return quickSelect(arr, left, pivotIndex - 1, k, steps);
      } else {
        steps.push({
          array: [...arr],
          left,
          right,
          pivotIndex,
          k,
          message: `k=${k} > pivot=${pivotIndex}. Search right partition`,
          lineNumber: 9
        });
        return quickSelect(arr, pivotIndex + 1, right, k, steps);
      }
    };

    newSteps.push({
      array: [...array],
      left: 0,
      right: array.length - 1,
      pivotIndex: -1,
      k,
      message: `Find ${k + 1}th smallest element (0-indexed k=${k})`,
      lineNumber: 0
    });

    const arr = [...array];
    quickSelect(arr, 0, arr.length - 1, k, newSteps);

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
                const isK = index === currentStep.k;
                const isPivot = index === currentStep.pivotIndex;
                const isInRange = index >= currentStep.left && index <= currentStep.right;
                const isPartition = index === currentStep.partitionIndex;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                    {isK && (
                      <div className="absolute -top-8 text-xs font-bold text-green-500">TARGET</div>
                    )}
                    {isPivot && !isPartition && (
                      <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">PIVOT</div>
                    )}
                    {isPartition && (
                      <div className="absolute -top-8 text-xs font-bold text-purple-500">FINAL</div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isK && isPivot
                          ? 'bg-green-500 shadow-lg shadow-green-500/50 scale-110'
                          : isPartition
                          ? 'bg-purple-500 shadow-lg'
                          : isPivot
                          ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                          : !isInRange
                          ? 'bg-muted opacity-30'
                          : 'bg-gradient-to-t from-primary/60 to-primary/40'
                      }`}
                      style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                    />
                    <span
                      className={`text-xs font-mono ${
                        isPivot || isK ? 'text-primary font-bold text-base' : !isInRange ? 'opacity-30 text-muted-foreground' : 'text-muted-foreground'
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
              k: currentStep.k,
              target: `${currentStep.k + 1}th smallest`,
              left: currentStep.left,
              right: currentStep.right,
              pivot: currentStep.pivotIndex >= 0 ? currentStep.array[currentStep.pivotIndex] : 'N/A',
              searchSpace: currentStep.right - currentStep.left + 1
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
