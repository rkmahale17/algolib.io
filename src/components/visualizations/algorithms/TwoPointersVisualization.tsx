import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  left: number;
  right: number;
  sum: number;
  target: number;
  message: string;
  lineNumber: number;
}

export const TwoPointersVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1];
}`;

  const generateSteps = () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const target = 11;
    const newSteps: Step[] = [];
    let left = 0;
    let right = array.length - 1;

    newSteps.push({
      array: [...array],
      left,
      right,
      sum: 0,
      target,
      message: 'Initialize left pointer at start and right pointer at end',
      lineNumber: 1
    });

    while (left < right) {
      const sum = array[left] + array[right];
      
      newSteps.push({
        array: [...array],
        left,
        right,
        sum,
        target,
        message: `Calculate sum: arr[${left}] + arr[${right}] = ${array[left]} + ${array[right]} = ${sum}`,
        lineNumber: 5
      });

      if (sum === target) {
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `Found! Sum equals target (${target})`,
          lineNumber: 7
        });
        break;
      } else if (sum < target) {
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `Sum ${sum} < target ${target}, move left pointer right`,
          lineNumber: 9
        });
        left++;
      } else {
        newSteps.push({
          array: [...array],
          left,
          right,
          sum,
          target,
          message: `Sum ${sum} > target ${target}, move right pointer left`,
          lineNumber: 11
        });
        right--;
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
                const isLeft = index === currentStep.left;
                const isRight = index === currentStep.right;
                const isActive = isLeft || isRight;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative"
                  >
                    {isLeft && (
                      <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">
                        LEFT
                      </div>
                    )}
                    {isRight && (
                      <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">
                        RIGHT
                      </div>
                    )}
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isActive
                          ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                          : 'bg-gradient-to-t from-primary/60 to-primary/40'
                      }`}
                      style={{
                        height: `${(value / getMaxValue()) * 100}%`,
                        minHeight: '20px'
                      }}
                    />
                    <span
                      className={`text-xs font-mono transition-colors ${
                        isActive ? 'text-primary font-bold text-base' : 'text-muted-foreground'
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
              left: currentStep.left,
              right: currentStep.right,
              sum: currentStep.sum,
              target: currentStep.target,
              'arr[left]': currentStep.array[currentStep.left],
              'arr[right]': currentStep.array[currentStep.right]
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
