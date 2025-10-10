import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  list1: number[];
  list2: number[];
  merged: number[];
  p1: number;
  p2: number;
  message: string;
  lineNumber: number;
}

export const MergeSortedListsVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function mergeTwoLists(l1, l2) {
  const merged = [];
  let p1 = 0, p2 = 0;
  
  while (p1 < l1.length && p2 < l2.length) {
    if (l1[p1] <= l2[p2]) {
      merged.push(l1[p1++]);
    } else {
      merged.push(l2[p2++]);
    }
  }
  
  while (p1 < l1.length) merged.push(l1[p1++]);
  while (p2 < l2.length) merged.push(l2[p2++]);
  
  return merged;
}`;

  const generateSteps = () => {
    const list1 = [1, 3, 5, 7];
    const list2 = [2, 4, 6, 8];
    const merged: number[] = [];
    let p1 = 0, p2 = 0;
    const newSteps: Step[] = [];

    newSteps.push({
      list1: [...list1],
      list2: [...list2],
      merged: [],
      p1: 0,
      p2: 0,
      message: 'Merge two sorted lists using two pointers',
      lineNumber: 0
    });

    while (p1 < list1.length && p2 < list2.length) {
      if (list1[p1] <= list2[p2]) {
        merged.push(list1[p1]);
        newSteps.push({
          list1: [...list1],
          list2: [...list2],
          merged: [...merged],
          p1,
          p2,
          message: `${list1[p1]} ≤ ${list2[p2]}, add ${list1[p1]} from list1`,
          lineNumber: 6
        });
        p1++;
      } else {
        merged.push(list2[p2]);
        newSteps.push({
          list1: [...list1],
          list2: [...list2],
          merged: [...merged],
          p1,
          p2,
          message: `${list2[p2]} < ${list1[p1]}, add ${list2[p2]} from list2`,
          lineNumber: 8
        });
        p2++;
      }
    }

    while (p1 < list1.length) {
      merged.push(list1[p1]);
      newSteps.push({
        list1: [...list1],
        list2: [...list2],
        merged: [...merged],
        p1,
        p2,
        message: `Add remaining ${list1[p1]} from list1`,
        lineNumber: 13
      });
      p1++;
    }

    while (p2 < list2.length) {
      merged.push(list2[p2]);
      newSteps.push({
        list1: [...list1],
        list2: [...list2],
        merged: [...merged],
        p1,
        p2,
        message: `Add remaining ${list2[p2]} from list2`,
        lineNumber: 14
      });
      p2++;
    }

    newSteps.push({
      list1: [...list1],
      list2: [...list2],
      merged: [...merged],
      p1,
      p2,
      message: 'Complete! Lists merged',
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">List 1:</p>
              <div className="flex gap-2">
                {currentStep.list1.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded flex items-center justify-center font-bold transition-all duration-300 ${
                      idx === currentStep.p1 ? 'bg-blue-500 text-white scale-110' : 'bg-muted text-foreground'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">List 2:</p>
              <div className="flex gap-2">
                {currentStep.list2.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded flex items-center justify-center font-bold transition-all duration-300 ${
                      idx === currentStep.p2 ? 'bg-green-500 text-white scale-110' : 'bg-muted text-foreground'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Merged:</p>
              <div className="flex gap-2 flex-wrap">
                {currentStep.merged.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded flex items-center justify-center font-bold bg-primary text-primary-foreground"
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="rounder-lg border">
            <VariablePanel
            variables={{
              p1: currentStep.p1,
              p2: currentStep.p2,
              'merged.length': currentStep.merged.length,
              list1: currentStep.list1,
              list2: currentStep.list2
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
