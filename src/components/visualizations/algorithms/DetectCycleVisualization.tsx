import React, { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
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
  movingPointer?: 'slow' | 'fast' | 'both' | 'none';
}

export const DetectCycleVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function detectCycle(head) {
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
    const nodes = [3, 2, 0, -4]; // Cycle: -4 -> 2 (index 1)
    const cycleStartIdx = 1;
    const newSteps: Step[] = [];

    const addStep = (s: number | null, f: number | null, msg: string, line: number, ph: 'detection' | 'finding-start', moving: 'slow' | 'fast' | 'both' | 'none' = 'none', cs: number | null = null) => {
      newSteps.push({
        nodes,
        slow: s,
        fast: f,
        cycleStart: cs,
        message: msg,
        lineNumber: line,
        phase: ph,
        movingPointer: moving
      });
    };

    // Initialization
    addStep(null, null, 'Initialize slow and fast pointers to head', 4, 'detection');
    addStep(0, 0, 'Both pointers start at the head (index 0)', 5, 'detection', 'both');

    let slow = 0;
    let fast = 0;
    let metNode = -1;

    // Phase 1: Detection
    const getNext = (curr: number) => {
      if (curr < cycleStartIdx) { // Before cycle starts, just move linearly
        return curr + 1;
      } else { // Inside cycle
        return (curr + 1 - cycleStartIdx) % (nodes.length - cycleStartIdx) + cycleStartIdx;
      }
    };

    while (true) {
      addStep(slow, fast, 'Check if fast and fast.next are non-null', 8, 'detection');

      // slow = slow.next
      const nextSlow = getNext(slow);
      addStep(slow, fast, `Slow pointer moves from index ${slow} to ${nextSlow}`, 9, 'detection', 'slow');
      slow = nextSlow;

      // fast = fast.next (first part)
      const fastMid = getNext(fast);
      addStep(slow, fast, `Fast pointer moves from index ${fast} to ${fastMid} (first step)`, 10, 'detection', 'fast');

      // fast = fast.next (second part)
      const nextFast = getNext(fastMid);
      addStep(slow, fastMid, `Fast pointer moves from index ${fastMid} to ${nextFast} (second step)`, 10, 'detection', 'fast');
      fast = nextFast;

      addStep(slow, fast, `Check if slow (${slow}) === fast (${fast})`, 12, 'detection');

      if (slow === fast) {
        addStep(slow, fast, 'Pointers met! A cycle is confirmed', 12, 'detection', 'none');
        metNode = slow;
        break;
      }

      // Safety break to prevent infinite loops in simulation if logic is off
      if (newSteps.length > 50) {
        console.warn("Safety break triggered in Phase 1 simulation.");
        break;
      }
    }

    // Phase 2: Reset slow to head
    addStep(slow, fast, 'Phase 2: Reset slow to head to find the cycle start', 18, 'finding-start', 'slow');
    slow = 0;
    addStep(slow, fast, 'Slow is now at head (index 0), fast remains at meeting point (index ' + fast + ')', 18, 'finding-start', 'none');

    while (slow !== fast) {
      addStep(slow, fast, `Check if slow (${slow}) !== fast (${fast})`, 19, 'finding-start');

      const nextSlow = getNext(slow);
      const nextFast = getNext(fast);
      addStep(slow, fast, `Move both pointers one step forward. Slow: ${slow} -> ${nextSlow}, Fast: ${fast} -> ${nextFast}`, 20, 'finding-start', 'both');
      slow = nextSlow;
      fast = nextFast;

      if (newSteps.length > 100) { // Safety break
        console.warn("Safety break triggered in Phase 2 simulation.");
        break;
      }
    }

    addStep(slow, fast, `Success! Pointers met at index ${slow}, which is the cycle start`, 24, 'finding-start', 'none', slow);

    setSteps(newSteps);
    setCurrentStepIndex(0);
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
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-8 border shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>

            <h3 className="text-lg font- mb-6 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${currentStep.phase === 'detection' ? 'bg-blue-500' : 'bg-purple-500'}`}></span>
              {currentStep.phase === 'detection' ? 'Phase 1: Cycle Detection' : 'Phase 2: Find Cycle Start'}
            </h3>

            <div className="flex items-center gap-4 overflow-x-auto pb-8 pt-4">
              {currentStep.nodes.map((val, idx) => (
                <div key={idx} className="flex items-center flex-shrink-0">
                  <div className="relative">
                    <div
                      className={`w-16 h-16 flex items-center justify-center rounded-2xl border-2 font-black text-xl transition-all duration-300 ${currentStep.cycleStart === idx
                        ? 'bg-green-500 text-white border-green-600 shadow-lg scale-110'
                        : idx === currentStep.slow && idx === currentStep.fast
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                          : idx === currentStep.slow
                            ? 'bg-blue-500 text-white border-blue-600'
                            : idx === currentStep.fast
                              ? 'bg-purple-500 text-white border-purple-600'
                              : 'bg-muted/50 border-border text-muted-foreground'
                        }`}
                    >
                      {val}
                    </div>

                    {/* Pointer Labels */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                      {idx === currentStep.slow && currentStep.slow !== null && (
                        <div className={`px-2 py-0.5 rounded text-[10px] font- shadow-sm ${currentStep.movingPointer === 'slow' || currentStep.movingPointer === 'both' ? 'bg-blue-600 text-white animate-bounce' : 'bg-blue-100 text-blue-700'}`}>
                          SLOW
                        </div>
                      )}
                      {idx === currentStep.fast && currentStep.fast !== null && (
                        <div className={`px-2 py-0.5 rounded text-[10px] font- shadow-sm mt-1 ${currentStep.movingPointer === 'fast' || currentStep.movingPointer === 'both' ? 'bg-purple-600 text-white animate-bounce' : 'bg-purple-100 text-purple-700'}`}>
                          FAST
                        </div>
                      )}
                    </div>
                  </div>

                  {idx < currentStep.nodes.length - 1 ? (
                    <div className="w-12 h-0.5 bg-border mx-1 relative">
                      <div className="absolute right-0 -top-1.5 border-t-[6px] border-l-[10px] border-b-[6px] border-t-transparent border-b-transparent border-l-border"></div>
                    </div>
                  ) : (
                    <div className="ml-2 relative">
                      <svg width="40" height="60" viewBox="0 0 40 60" className="text-border">
                        <path d="M 0 30 Q 40 30 40 -30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
                        <path d="M 35 -20 L 40 -30 L 45 -20" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="text-[10px] font- text-muted-foreground absolute -bottom-2 -right-4">CYCLE</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-muted/50 rounded-xl border border-border/50 min-h-[5rem] flex items-center">
              <p className="text-sm font-semibold text-foreground leading-relaxed">{currentStep.message}</p>
            </div>

            <div className="mt-6">
              <VariablePanel
                variables={{
                  phase: currentStep.phase === 'detection' ? 'Detecting Cycle' : 'Finding Start',
                  slow: currentStep.slow !== null ? `Index ${currentStep.slow}` : 'null',
                  fast: currentStep.fast !== null ? `Index ${currentStep.fast}` : 'null',
                  'slow === fast': currentStep.slow === currentStep.fast ? 'TRUE' : 'FALSE',
                  cycleStart: currentStep.cycleStart !== null ? `Index ${currentStep.cycleStart}` : 'not found'
                }}
              />
            </div>
          </div>

          <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};