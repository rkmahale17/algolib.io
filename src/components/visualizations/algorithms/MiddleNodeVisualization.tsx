import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  list: number[];
  slow: number | null;
  fast: number | null;
  message: string;
  lineNumber: number;
  isMiddle: boolean;
}

export const MiddleNodeVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  
  return slow;
}`;

  const generateSteps = () => {
    const arr = [1, 2, 3, 4, 5];
    const newSteps: Step[] = [];

    newSteps.push({
      list: arr,
      slow: 0,
      fast: 0,
      message: 'Initialize slow and fast pointers at head',
      lineNumber: 2,
      isMiddle: false
    });

    let slow = 0;
    let fast = 0;

    while (fast < arr.length && fast + 1 < arr.length) {
      slow++;
      fast += 2;

      newSteps.push({
        list: arr,
        slow,
        fast: fast < arr.length ? fast : null,
        message: `Move slow by 1 (node ${slow}), fast by 2 (node ${fast < arr.length ? fast : 'end'})`,
        lineNumber: 6,
        isMiddle: false
      });
    }

    newSteps.push({
      list: arr,
      slow,
      fast: fast < arr.length ? fast : null,
      message: `Fast reached end. Slow is at middle node ${slow}`,
      lineNumber: 9,
      isMiddle: true
    });

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
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
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
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
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Linked List Visualization</h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {currentStep.list.map((val, idx) => (
              <div key={idx} className="flex items-center">
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                    currentStep.isMiddle && currentStep.slow === idx
                      ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                      : currentStep.slow === idx
                      ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                      : currentStep.fast === idx
                      ? 'bg-green-500/20 border-green-500 text-green-500'
                      : 'bg-card border-border'
                  }`}
                >
                  {val}
                </div>
                {idx < currentStep.list.length - 1 && (
                  <div className="text-2xl mx-2 text-muted-foreground">→</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500/20 border-2 border-blue-500"></div>
              <span>Slow Pointer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
              <span>Fast Pointer</span>
            </div>
            {currentStep.isMiddle && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500/20 border-2 border-blue-500"></div>
                <span>Middle Node</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 p-4 bg-muted rounded">
            <p className="text-sm">{currentStep.message}</p>
          </div>
          <div className='rounded-lg'>
    <VariablePanel
        variables={{
          slow: currentStep.slow !== null ? `Node ${currentStep.slow} (value: ${currentStep.list[currentStep.slow]})` : 'null',
          fast: currentStep.fast !== null ? `Node ${currentStep.fast} (value: ${currentStep.list[currentStep.fast]})` : 'null',
          'is middle': String(currentStep.isMiddle)
        }}
      />
</div>
        </div>


        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
      </div>

    
    </div>
  );
};