import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  left: number;
  right: number;
  mid: number;
  target: number;
  found: boolean;
  message: string;
  lineNumber: number;
}

export const BinarySearchVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`;

  const generateSteps = () => {
    const array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    const target = 13;
    const newSteps: Step[] = [];
    let left = 0;
    let right = array.length - 1;

    newSteps.push({
      array: [...array],
      left,
      right,
      mid: -1,
      target,
      found: false,
      message: `Searching for ${target}. Initialize left=0, right=${right}`,
      lineNumber: 1
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      
      newSteps.push({
        array: [...array],
        left,
        right,
        mid,
        target,
        found: false,
        message: `Calculate mid = (${left} + ${right}) / 2 = ${mid}. arr[${mid}] = ${array[mid]}`,
        lineNumber: 5
      });

      if (array[mid] === target) {
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: true,
          message: `Found! arr[${mid}] = ${array[mid]} equals target ${target}`,
          lineNumber: 7
        });
        break;
      } else if (array[mid] < target) {
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          message: `arr[${mid}] = ${array[mid]} < ${target}. Search right half: left = ${mid + 1}`,
          lineNumber: 9
        });
        left = mid + 1;
      } else {
        newSteps.push({
          array: [...array],
          left,
          right,
          mid,
          target,
          found: false,
          message: `arr[${mid}] = ${array[mid]} > ${target}. Search left half: right = ${mid - 1}`,
          lineNumber: 11
        });
        right = mid - 1;
      }
    }

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
                const isMid = index === currentStep.mid;
                const isInRange = index >= currentStep.left && index <= currentStep.right;
                const isOutOfRange = !isInRange;

                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                    {index === currentStep.left && (
                      <div className="absolute -top-8 text-xs font-bold text-blue-500">L</div>
                    )}
                    {index === currentStep.right && (
                      <div className="absolute -top-8 text-xs font-bold text-blue-500">R</div>
                    )}
                    {isMid && (
                      <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">MID</div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isMid && currentStep.found
                          ? 'bg-green-500 shadow-lg shadow-green-500/50 scale-110'
                          : isMid
                          ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                          : isOutOfRange
                          ? 'bg-muted opacity-30'
                          : 'bg-gradient-to-t from-primary/60 to-primary/40'
                      }`}
                      style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                    />
                    <span
                      className={`text-xs font-mono ${
                        isMid ? 'text-primary font-bold text-base' : isOutOfRange ? 'text-muted-foreground opacity-30' : 'text-muted-foreground'
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`rounded-lg border p-4 ${currentStep.found ? 'bg-green-500/20 border-green-500' : 'bg-accent/50 border-accent'}`}>
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              left: currentStep.left,
              right: currentStep.right,
              mid: currentStep.mid >= 0 ? currentStep.mid : 'calculating...',
              target: currentStep.target,
              'arr[mid]': currentStep.mid >= 0 ? currentStep.array[currentStep.mid] : 'N/A',
              searchSpace: currentStep.right - currentStep.left + 1
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
