import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  originalArray: number[];
  prefixArray: number[];
  currentIndex: number;
  sum: number;
  message: string;
  lineNumber: number;
}

export const PrefixSumVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function prefixSum(arr) {
  const prefix = [arr[0]];
  
  for (let i = 1; i < arr.length; i++) {
    prefix[i] = prefix[i - 1] + arr[i];
  }
  
  return prefix;
}`;

  const generateSteps = () => {
    const array = [3, 1, 4, 1, 5, 9, 2];
    const newSteps: Step[] = [];
    const prefix: number[] = [];

    newSteps.push({
      originalArray: [...array],
      prefixArray: [],
      currentIndex: -1,
      sum: 0,
      message: 'Initialize prefix array with first element',
      lineNumber: 1
    });

    prefix.push(array[0]);
    newSteps.push({
      originalArray: [...array],
      prefixArray: [...prefix],
      currentIndex: 0,
      sum: array[0],
      message: `prefix[0] = arr[0] = ${array[0]}`,
      lineNumber: 1
    });

    for (let i = 1; i < array.length; i++) {
      const sum = prefix[i - 1] + array[i];
      prefix.push(sum);
      
      newSteps.push({
        originalArray: [...array],
        prefixArray: [...prefix],
        currentIndex: i,
        sum,
        message: `prefix[${i}] = prefix[${i - 1}] + arr[${i}] = ${prefix[i - 1]} + ${array[i]} = ${sum}`,
        lineNumber: 4
      });
    }

    newSteps.push({
      originalArray: [...array],
      prefixArray: [...prefix],
      currentIndex: array.length - 1,
      sum: prefix[prefix.length - 1],
      message: `Prefix sum array complete! Total sum = ${prefix[prefix.length - 1]}`,
      lineNumber: 7
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
  const getMaxValue = () => Math.max(...currentStep.originalArray, ...currentStep.prefixArray);

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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Original Array</h4>
              <div className="flex items-end justify-center gap-2 h-32">
                {currentStep.originalArray.map((value, index) => {
                  const isActive = index === currentStep.currentIndex;
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                      {isActive && (
                        <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">
                          CURRENT
                        </div>
                      )}
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isActive ? 'bg-primary shadow-lg shadow-primary/50 scale-105' : 'bg-gradient-to-t from-accent/60 to-accent/40'
                        }`}
                        style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                      />
                      <span className={`text-xs font-mono ${isActive ? 'text-primary font-bold text-base' : 'text-muted-foreground'}`}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Prefix Sum Array</h4>
              <div className="flex items-end justify-center gap-2 h-32">
                {currentStep.prefixArray.length > 0 ? (
                  currentStep.prefixArray.map((value, index) => {
                    const isActive = index === currentStep.currentIndex;
                    return (
                      <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${
                            isActive ? 'bg-primary shadow-lg shadow-primary/50 scale-105' : 'bg-gradient-to-t from-primary/60 to-primary/40'
                          }`}
                          style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                        />
                        <span className={`text-xs font-mono ${isActive ? 'text-primary font-bold text-base' : 'text-muted-foreground'}`}>
                          {value}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground">Building...</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          
          <div className=" rounded-lg border  p-4">
            <VariablePanel
            variables={{
              i: currentStep.currentIndex >= 0 ? currentStep.currentIndex : 'N/A',
              'arr[i]': currentStep.currentIndex >= 0 ? currentStep.originalArray[currentStep.currentIndex] : 'N/A',
              'prefix[i-1]': currentStep.currentIndex > 0 ? currentStep.prefixArray[currentStep.currentIndex - 1] : 'N/A',
              sum: currentStep.sum,
              prefixLength: currentStep.prefixArray.length
            }}
          />
          </div>
        </div>

        <div className="space-y-4">
          
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
