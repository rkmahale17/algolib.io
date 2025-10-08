import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  i: number;
  correctIndex: number;
  message: string;
  lineNumber: number;
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

    newSteps.push({
      array: [...nums],
      i: 0,
      correctIndex: -1,
      message: 'Start cyclic sort: place each number at its correct index',
      lineNumber: 0
    });

    while (i < nums.length) {
      const correctIndex = nums[i] - 1;

      newSteps.push({
        array: [...nums],
        i,
        correctIndex,
        message: `nums[${i}]=${nums[i]} should be at index ${correctIndex}`,
        lineNumber: 4
      });

      if (nums[i] !== nums[correctIndex]) {
        [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
        newSteps.push({
          array: [...nums],
          i,
          correctIndex,
          message: `Swapped ${nums[correctIndex]} with ${nums[i]}`,
          lineNumber: 8
        });
      } else {
        newSteps.push({
          array: [...nums],
          i,
          correctIndex,
          message: `nums[${i}]=${nums[i]} is in correct position. Move to next`,
          lineNumber: 10
        });
        i++;
      }
    }

    newSteps.push({
      array: [...nums],
      i: nums.length,
      correctIndex: -1,
      message: 'Complete! Array is sorted',
      lineNumber: 14
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
            <div className="flex items-center justify-center gap-2">
              {currentStep.array.map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-16 h-16 rounded flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      index === currentStep.i
                        ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                        : index === currentStep.correctIndex
                        ? 'bg-green-500 text-white shadow-lg scale-110'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {value}
                  </div>
                  <span className="text-xs text-muted-foreground">{index}</span>
                  {index === currentStep.i && <span className="text-xs font-bold text-primary">i</span>}
                  {index === currentStep.correctIndex && <span className="text-xs font-bold text-green-500">target</span>}
                </div>
              ))}
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
          i: currentStep.i,
          'nums[i]': currentStep.i < currentStep.array.length ? currentStep.array[currentStep.i] : 'N/A',
          correctIndex: currentStep.correctIndex >= 0 ? currentStep.correctIndex : 'N/A',
          array: currentStep.array
        }}
      />
    </div>
  );
};
