import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  nodes: number[];
  slow: number | null;
  fast: number | null;
  cycleStart: number | null;
  message: string;
  lineNumber: number;
  phase: 'detection' | 'finding-start';
}

export const DetectCycleVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function detectCycle(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return null;
  
  let slow = head;
  let fast = head;
  
  // Phase 1: Detect cycle
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }
  
  if (!fast || !fast.next) return null;
  
  // Phase 2: Find cycle start
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }
  
  return slow;
}`;

  const generateSteps = () => {
    const nodes = [3, 2, 0, -4]; // Cycle starts at index 1
    const cycleStartIdx = 1;
    const newSteps: Step[] = [];

    // Phase 1: Detect cycle
    newSteps.push({
      nodes,
      slow: 0,
      fast: 0,
      cycleStart: null,
      message: 'Phase 1: Initialize pointers to detect cycle',
      lineNumber: 4,
      phase: 'detection'
    });

    let slow = 0;
    let fast = 0;

    // Simulate cycle detection
    const moveCount = 6;
    for (let i = 0; i < moveCount; i++) {
      slow = (slow + 1) % nodes.length;
      if (slow < cycleStartIdx) slow = cycleStartIdx;
      
      fast = (fast + 2) % nodes.length;
      if (fast < cycleStartIdx) fast = cycleStartIdx;

      newSteps.push({
        nodes,
        slow,
        fast,
        cycleStart: null,
        message: `Move slow by 1, fast by 2. Slow at ${slow}, Fast at ${fast}`,
        lineNumber: 9,
        phase: 'detection'
      });

      if (slow === fast) {
        newSteps.push({
          nodes,
          slow,
          fast,
          cycleStart: null,
          message: 'Pointers met! Cycle detected',
          lineNumber: 11,
          phase: 'detection'
        });
        break;
      }
    }

    // Phase 2: Find cycle start
    newSteps.push({
      nodes,
      slow: 0,
      fast,
      cycleStart: null,
      message: 'Phase 2: Reset slow to head to find cycle start',
      lineNumber: 17,
      phase: 'finding-start'
    });

    slow = 0;
    while (slow !== fast) {
      slow = (slow + 1) % nodes.length;
      fast = (fast + 1) % nodes.length;
      if (fast < cycleStartIdx) fast = cycleStartIdx;
      
      newSteps.push({
        nodes,
        slow,
        fast,
        cycleStart: null,
        message: `Move both by 1. Slow at ${slow}, Fast at ${fast}`,
        lineNumber: 19,
        phase: 'finding-start'
      });
    }

    newSteps.push({
      nodes,
      slow,
      fast,
      cycleStart: slow,
      message: `Found cycle start at node ${slow}!`,
      lineNumber: 23,
      phase: 'finding-start'
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
        <h3 className="text-lg font-semibold mb-4">
          {currentStep.phase === 'detection' ? 'Phase 1: Cycle Detection' : 'Phase 2: Find Cycle Start'}
        </h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-4">
          {currentStep.nodes.map((val, idx) => (
            <div key={idx} className="flex items-center">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                  currentStep.cycleStart === idx
                    ? 'bg-red-500/20 border-red-500 text-red-500'
                    : currentStep.slow === idx && currentStep.fast === idx
                    ? 'bg-purple-500/20 border-purple-500 text-purple-500'
                    : currentStep.slow === idx
                    ? 'bg-blue-500/20 border-blue-500 text-blue-500'
                    : currentStep.fast === idx
                    ? 'bg-green-500/20 border-green-500 text-green-500'
                    : 'bg-card border-border'
                }`}
              >
                {val}
              </div>
              {idx < currentStep.nodes.length - 1 && (
                <div className="text-2xl mx-2 text-muted-foreground">→</div>
              )}
            </div>
          ))}
          <div className="text-2xl mx-2 text-muted-foreground">↺</div>
        </div>
        
        <div className="mt-4 flex gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500/20 border-2 border-blue-500"></div>
            <span>Slow Pointer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border-2 border-green-500"></div>
            <span>Fast Pointer</span>
          </div>
          {currentStep.cycleStart !== null && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/20 border-2 border-red-500"></div>
              <span>Cycle Start</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded">
          <p className="text-sm">{currentStep.message}</p>
        </div>
           <div className="mt-4 p-4 bg-muted rounded">
               <VariablePanel
        variables={{
          phase: currentStep.phase === 'detection' ? 'Detecting Cycle' : 'Finding Start',
          slow: currentStep.slow !== null ? `Node ${currentStep.slow}` : 'null',
          fast: currentStep.fast !== null ? `Node ${currentStep.fast}` : 'null',
          cycleStart: currentStep.cycleStart !== null ? `Node ${currentStep.cycleStart}` : 'not found yet'
        }}
      />
        </div>
      </div>

   

      <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="typescript" />
    </div>
    </div>
  );
};