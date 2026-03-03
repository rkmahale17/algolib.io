import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  array: number[];
  i: number;
  correctIndex: number;
  message: string;
  lineNumber: number;
  comparingIndices: number[];
  isSwap?: boolean;
}

export const CyclicSortVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function cyclicSort(nums) {
  let i = 0;
  
  while (i < nums.length) {
    const correctIndex = nums[i] - 1;
    
    if (nums[i] !== nums[correctIndex]) {
      // Swap to correct position
      [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
    } else {
      i++;
    }
  }
  
  return nums;
}`;

  const generateSteps = () => {
    const nums = [3, 1, 5, 4, 2];
    const newSteps: Step[] = [];
    let i = 0;

    const addStep = (arr: number[], msg: string, line: number, currentI: number, targetIdx: number, comparing: number[] = [], swap: boolean = false) => {
      newSteps.push({
        array: [...arr],
        i: currentI,
        correctIndex: targetIdx,
        message: msg,
        lineNumber: line,
        comparingIndices: comparing,
        isSwap: swap
      });
    };

    addStep(nums, 'Start cyclic sort: place each number at its correct index (value - 1)', 0, 0, -1);

    while (i < nums.length) {
      const val = nums[i];
      const correctIndex = val - 1;

      // Calculate correctIndex
      addStep(nums, `Index i=${i}, value=${val}. Should be at index ${val}-1 = ${correctIndex}`, 4, i, correctIndex, [i]);

      // Highlight both for comparison
      addStep(nums, `Checking if nums[i] (${val}) is at its correct position nums[${correctIndex}] (${nums[correctIndex]})`, 6, i, correctIndex, [i, correctIndex]);

      if (nums[i] !== nums[correctIndex]) {
        // Prepare for swap
        addStep(nums, `Mismatch found! Swapping ${nums[i]} with ${nums[correctIndex]}`, 8, i, correctIndex, [i, correctIndex], true);

        // Finalize swap
        [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        addStep(nums, `Swapped elements. Now nums[${correctIndex}] = ${nums[correctIndex]}`, 8, i, correctIndex, [i, correctIndex]);
      } else {
        // Increment i
        addStep(nums, `${val} is already at index ${i}. Move to next index`, 10, i, correctIndex, [i]);
        i++;
        addStep(nums, `Incrementing i to ${i}`, 10, i, -1);
      }
    }

    addStep(nums, 'Complete! All elements are at their correct indices', 14, i, -1);

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-8 shadow-inner">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {currentStep.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-xl transition-all duration-300 border-2 ${currentStep.isSwap && currentStep.comparingIndices.includes(index)
                      ? 'bg-yellow-500 text-white border-yellow-600 shadow-lg scale-110 rotate-3'
                      : currentStep.comparingIndices.includes(index)
                        ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                        : index === currentStep.i
                          ? 'bg-blue-500/20 text-blue-700 border-blue-500'
                          : index === value - 1
                            ? 'bg-green-500/10 text-green-700 border-green-500/30'
                            : 'bg-card text-foreground border-border'
                      }`}
                  >
                    {value}
                  </div>
                  <div className="flex flex-col items-center min-h-[3rem]">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Idx {index}</span>
                    <div className="flex flex-col gap-0.5 mt-1">
                      {index === currentStep.i && (
                        <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded uppercase">i</span>
                      )}
                      {index === currentStep.correctIndex && (
                        <span className="px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-black rounded uppercase">target</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-5 shadow-sm min-h-[5rem] flex items-center">
            <p className="text-sm font-medium leading-relaxed">{currentStep.message}</p>
          </div>

          <div className="rounded-lg border p-4 bg-card shadow-sm">
            <VariablePanel
              variables={{
                i: currentStep.i < currentStep.array.length ? currentStep.i : 'done',
                'nums[i]': currentStep.i < currentStep.array.length ? currentStep.array[currentStep.i] : '-',
                targetIndex: currentStep.correctIndex >= 0 ? currentStep.correctIndex : '-',
                'nums[target]': currentStep.correctIndex >= 0 ? currentStep.array[currentStep.correctIndex] : '-',
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
