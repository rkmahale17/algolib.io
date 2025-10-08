import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface Step {
  array: number[];
  stack: number[];
  currentIndex: number;
  result: number[];
  message: string;
  lineNumber: number;
}

export const MonotonicStackVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function nextGreaterElement(arr) {
  const result = new Array(arr.length).fill(-1);
  const stack = [];
  
  for (let i = 0; i < arr.length; i++) {
    while (stack.length > 0 && arr[i] > arr[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = arr[i];
    }
    stack.push(i);
  }
  
  return result;
}`;

  const generateSteps = () => {
    const array = [4, 5, 2, 10, 8];
    const newSteps: Step[] = [];
    const result = new Array(array.length).fill(-1);
    const stack: number[] = [];

    newSteps.push({
      array: [...array],
      stack: [...stack],
      currentIndex: -1,
      result: [...result],
      message: 'Initialize: result array with -1, empty stack',
      lineNumber: 1
    });

    for (let i = 0; i < array.length; i++) {
      newSteps.push({
        array: [...array],
        stack: [...stack],
        currentIndex: i,
        result: [...result],
        message: `Process arr[${i}] = ${array[i]}`,
        lineNumber: 4
      });

      while (stack.length > 0 && array[i] > array[stack[stack.length - 1]]) {
        const idx = stack[stack.length - 1];
        newSteps.push({
          array: [...array],
          stack: [...stack],
          currentIndex: i,
          result: [...result],
          message: `${array[i]} > arr[${idx}] = ${array[idx]}. Found next greater!`,
          lineNumber: 5
        });
        
        stack.pop();
        result[idx] = array[i];
        
        newSteps.push({
          array: [...array],
          stack: [...stack],
          currentIndex: i,
          result: [...result],
          message: `Set result[${idx}] = ${array[i]}, pop ${idx} from stack`,
          lineNumber: 6
        });
      }

      stack.push(i);
      newSteps.push({
        array: [...array],
        stack: [...stack],
        currentIndex: i,
        result: [...result],
        message: `Push index ${i} to stack`,
        lineNumber: 9
      });
    }

    newSteps.push({
      array: [...array],
      stack: [...stack],
      currentIndex: array.length - 1,
      result: [...result],
      message: `Complete! Remaining stack elements have no next greater element`,
      lineNumber: 12
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Array</h4>
              <div className="flex items-end justify-center gap-2 h-32">
                {currentStep.array.map((value, index) => {
                  const isCurrent = index === currentStep.currentIndex;
                  const isInStack = currentStep.stack.includes(index);
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-[60px] relative">
                      {isCurrent && (
                        <div className="absolute -top-8 text-xs font-bold text-primary animate-bounce">▼</div>
                      )}
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isCurrent
                            ? 'bg-primary shadow-lg shadow-primary/50 scale-105'
                            : isInStack
                            ? 'bg-yellow-500 shadow-lg'
                            : 'bg-gradient-to-t from-primary/60 to-primary/40'
                        }`}
                        style={{ height: `${(value / getMaxValue()) * 100}%`, minHeight: '20px' }}
                      />
                      <span className={`text-xs font-mono ${isCurrent ? 'text-primary font-bold text-base' : 'text-muted-foreground'}`}>
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Stack (indices)</h4>
              <div className="flex flex-col-reverse gap-1 h-32 justify-end">
                {currentStep.stack.length > 0 ? (
                  currentStep.stack.map((idx, i) => (
                    <div
                      key={i}
                      className="bg-yellow-500 text-white rounded px-4 py-2 text-center font-mono font-bold animate-in slide-in-from-bottom"
                    >
                      {idx} (val: {currentStep.array[idx]})
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground text-center">Empty</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Result (Next Greater)</h4>
              <div className="flex gap-2 justify-center">
                {currentStep.result.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded flex items-center justify-center font-mono font-bold ${
                      val !== -1 ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {val}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">[{idx}]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              i: currentStep.currentIndex >= 0 ? currentStep.currentIndex : 'init',
              'arr[i]': currentStep.currentIndex >= 0 ? currentStep.array[currentStep.currentIndex] : 'N/A',
              stackSize: currentStep.stack.length,
              stackTop: currentStep.stack.length > 0 ? `${currentStep.stack[currentStep.stack.length - 1]} (${currentStep.array[currentStep.stack[currentStep.stack.length - 1]]})` : 'empty'
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
