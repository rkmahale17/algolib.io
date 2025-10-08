import React, { useState, useEffect, useRef } from 'react';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  list: number[];
  prev: number | null;
  current: number | null;
  next: number | null;
  message: string;
  lineNumber: number;
}

export const ReverseLinkedListVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function reverseList(head: ListNode | null): ListNode | null {
  let prev = null;
  let current = head;
  
  while (current !== null) {
    let next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}`;

  const generateSteps = () => {
    const arr = [1, 2, 3, 4, 5];
    const newSteps: Step[] = [];

    newSteps.push({
      list: [...arr],
      prev: null,
      current: 0,
      next: null,
      message: 'Initialize prev=null, current=head',
      lineNumber: 2
    });

    let prev: number | null = null;
    let current: number | null = 0;

    for (let i = 0; i < arr.length; i++) {
      const next = i + 1 < arr.length ? i + 1 : null;
      
      newSteps.push({
        list: [...arr],
        prev,
        current,
        next,
        message: `Store next pointer (node ${next})`,
        lineNumber: 6
      });

      newSteps.push({
        list: [...arr],
        prev,
        current,
        next,
        message: `Reverse current.next to point to prev`,
        lineNumber: 7
      });

      prev = current;
      current = next;

      newSteps.push({
        list: [...arr],
        prev,
        current,
        next: current !== null && current + 1 < arr.length ? current + 1 : null,
        message: `Move prev and current forward`,
        lineNumber: 9
      });
    }

    newSteps.push({
      list: [...arr],
      prev,
      current,
      next: null,
      message: 'Return prev as new head',
      lineNumber: 12
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

      <div className="bg-card rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">Linked List Visualization</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {currentStep.list.map((val, idx) => (
            <div key={idx} className="flex items-center">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                  currentStep.current === idx
                    ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                    : currentStep.prev === idx
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : currentStep.next === idx
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                    : 'bg-card border-border'
                }`}
              >
                {val}
              </div>
              {idx < currentStep.list.length - 1 && (
                <div className="text-2xl mx-2 text-muted-foreground">
                  {currentStep.prev !== null && idx <= currentStep.prev ? '←' : '→'}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/20 border-2 border-blue-500"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
            <span>Prev</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500/20 border-2 border-yellow-500"></div>
            <span>Next</span>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
      </div>

      <VariablePanel
        variables={{
          prev: currentStep.prev !== null ? `Node ${currentStep.prev}` : 'null',
          current: currentStep.current !== null ? `Node ${currentStep.current}` : 'null',
          next: currentStep.next !== null ? `Node ${currentStep.next}` : 'null'
        }}
      />

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
  );
};