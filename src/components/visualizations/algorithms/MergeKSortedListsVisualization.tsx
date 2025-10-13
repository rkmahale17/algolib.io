import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  lists: number[][];
  pointers: number[];
  result: number[];
  comparing: number[];
  min: number | null;
  message: string;
  lineNumber: number;
}

export const MergeKSortedListsVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function mergeKLists(lists: number[][]): number[] {
  const result: number[] = [];
  const pointers = new Array(lists.length).fill(0);
  
  while (true) {
    let minVal = Infinity;
    let minIdx = -1;
    
    // Find minimum among current elements
    for (let i = 0; i < lists.length; i++) {
      if (pointers[i] < lists[i].length && lists[i][pointers[i]] < minVal) {
        minVal = lists[i][pointers[i]];
        minIdx = i;
      }
    }
    
    if (minIdx === -1) break; // All lists exhausted
    
    result.push(minVal);
    pointers[minIdx]++;
  }
  
  return result;
}`;

  const generateSteps = () => {
    const lists = [
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9]
    ];
    const newSteps: Step[] = [];
    const result: number[] = [];
    const pointers = new Array(lists.length).fill(0);

    newSteps.push({
      lists,
      pointers: [...pointers],
      result: [],
      comparing: [],
      min: null,
      message: 'Initialize pointers at the start of each list',
      lineNumber: 2
    });

    while (true) {
      let minVal = Infinity;
      let minIdx = -1;
      const comparing: number[] = [];

      for (let i = 0; i < lists.length; i++) {
        if (pointers[i] < lists[i].length) {
          comparing.push(i);
          if (lists[i][pointers[i]] < minVal) {
            minVal = lists[i][pointers[i]];
            minIdx = i;
          }
        }
      }

      if (minIdx === -1) break;

      newSteps.push({
        lists,
        pointers: [...pointers],
        result: [...result],
        comparing,
        min: minVal,
        message: `Comparing values: ${comparing.map(i => lists[i][pointers[i]]).join(', ')}. Min = ${minVal}`,
        lineNumber: 9
      });

      result.push(minVal);
      pointers[minIdx]++;

      newSteps.push({
        lists,
        pointers: [...pointers],
        result: [...result],
        comparing: [],
        min: null,
        message: `Added ${minVal} to result, advance pointer in list ${minIdx}`,
        lineNumber: 18
      });
    }

    newSteps.push({
      lists,
      pointers: [...pointers],
      result: [...result],
      comparing: [],
      min: null,
      message: 'All lists merged!',
      lineNumber: 21
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">K Sorted Lists</h3>
        
        <div className="space-y-3 mb-6">
          {currentStep.lists.map((list, listIdx) => (
            <div key={listIdx} className="flex items-center gap-2">
              <div className="w-16 text-sm font-mono">List {listIdx}:</div>
              <div className="flex gap-2">
                {list.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold transition-all ${
                      idx === currentStep.pointers[listIdx]
                        ? currentStep.comparing.includes(listIdx)
                          ? 'bg-primary/20 border-primary scale-110'
                          : 'bg-green-500/20 border-green-500'
                        : idx < currentStep.pointers[listIdx]
                        ? 'bg-muted/50 border-border opacity-50'
                        : 'bg-card border-border'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-semibold mb-4">Merged Result</h3>
        <div className="flex gap-2 flex-wrap mb-6">
          {currentStep.result.map((val, idx) => (
            <div
              key={idx}
              className="w-12 h-12 flex items-center justify-center rounded-lg border-2 bg-blue-500/20 border-blue-500 font-bold"
            >
              {val}
            </div>
          ))}
          {currentStep.result.length === 0 && (
            <div className="text-muted-foreground italic">Empty</div>
          )}
        </div>

        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          'comparing': currentStep.comparing.length > 0 ? currentStep.comparing.join(', ') : 'none',
          'current min': currentStep.min !== null ? currentStep.min : 'none',
          'result size': currentStep.result.length
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};
