import React, { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface ListNode {
  val: number;
  next: ListNode | null;
}

interface Step {
  nodes: number[];
  slow: number | null;
  fast: number | null;
  fastIntermediate: number | null; // For showing the first step of fast pointer
  message: string;
  lineNumber: number;
  isMeeting: boolean;
  result: boolean | null;
  movingPointer: 'slow' | 'fast' | 'both' | 'none';
}

export const FastSlowPointersVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function hasCycle(head: ListNode | null): boolean {

  // Initialize two pointers:
  // slow moves 1 step at a time
  // fast moves 2 steps at a time
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // Traverse the list
  // We stop if fast reaches end (no cycle)
  while (fast !== null && fast.next !== null) {

    // Move slow pointer by 1 step
    slow = slow!.next;

    // Move fast pointer by 2 steps
    fast = fast.next.next;

    // If at any point slow and fast meet,
    // there must be a cycle
    if (slow === fast) {
      return true;
    }
  }

  // If we exit the loop,
  // fast reached null → no cycle
  return false;
}`;

  const generateSteps = () => {
    const nodeValues = [3, 2, 0, -4]; // Cycle: -4 -> 2 (index 1)
    const cycleStartIdx = 1;
    const newSteps: Step[] = [];

    const getNext = (curr: number) => {
      if (curr < 0) return -1; // null
      if (curr < nodeValues.length - 1) return curr + 1;
      return cycleStartIdx; // Cycle back to index 1
    };

    const addStep = (params: Partial<Step>) => {
      newSteps.push({
        nodes: nodeValues,
        slow: null,
        fast: null,
        fastIntermediate: null,
        message: '',
        lineNumber: 1,
        isMeeting: false,
        result: null,
        movingPointer: 'none',
        ...params
      });
    };

    let slow = 0;
    let fast = 0;

    // Line 6: slow = head
    addStep({
      slow: 0,
      message: 'Initialize slow pointer at head (index 0)',
      lineNumber: 6,
      movingPointer: 'slow'
    });

    // Line 7: fast = head
    addStep({
      slow: 0,
      fast: 0,
      message: 'Initialize fast pointer at head (index 0)',
      lineNumber: 7,
      movingPointer: 'fast'
    });

    while (true) {
      // Line 11: while condition
      addStep({
        slow,
        fast,
        message: 'Checking loop condition: fast and fast.next are non-null',
        lineNumber: 11
      });

      // Line 14: slow = slow.next
      const nextSlow = getNext(slow);
      addStep({
        slow,
        fast,
        message: `Moving slow pointer from node ${nodeValues[slow]} to ${nodeValues[nextSlow]}`,
        lineNumber: 14,
        movingPointer: 'slow'
      });
      slow = nextSlow;
      addStep({
        slow,
        fast,
        message: `Slow pointer is now at node ${nodeValues[slow]}`,
        lineNumber: 14
      });

      // Line 17: fast = fast.next.next (Step 1)
      const fastStep1 = getNext(fast);
      addStep({
        slow,
        fast,
        fastIntermediate: fastStep1,
        message: `Moving fast pointer: first step to node ${nodeValues[fastStep1]}`,
        lineNumber: 17,
        movingPointer: 'fast'
      });

      // Line 17: fast = fast.next.next (Step 2)
      const fastStep2 = getNext(fastStep1);
      addStep({
        slow,
        fast: fastStep1,
        fastIntermediate: fastStep2,
        message: `Moving fast pointer: second step to node ${nodeValues[fastStep2]}`,
        lineNumber: 17,
        movingPointer: 'fast'
      });
      fast = fastStep2;
      addStep({
        slow,
        fast,
        message: `Fast pointer is now at node ${nodeValues[fast]}`,
        lineNumber: 17
      });

      // Line 21: if (slow === fast)
      addStep({
        slow,
        fast,
        message: `Checking if slow (${nodeValues[slow]}) equals fast (${nodeValues[fast]})`,
        lineNumber: 21
      });

      if (slow === fast) {
        // Line 22: return true
        addStep({
          slow,
          fast,
          isMeeting: true,
          message: 'Slow and fast pointers met! Cycle detected.',
          lineNumber: 22,
          result: true
        });
        break;
      }

      if (newSteps.length > 100) break; // Safety
    }

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
          <div className="bg-card rounded-2xl p-4 sm:p-8 border shadow-sm relative overflow-hidden min-h-[350px]">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>

            <h3 className="text-base sm:text-lg font- mb-8 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-blue-500 animate-pulse`}></span>
              Fast & Slow Pointer Visualization
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-16 pb-12 pt-16 px-2 no-scrollbar max-w-full">
              {currentStep.nodes.map((val, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="relative group">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl sm:rounded-2xl border-2 font-black text-base sm:text-xl transition-all duration-500 ${idx === currentStep.slow && idx === currentStep.fast
                        ? 'bg-amber-500 text-white border-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110 z-10'
                        : idx === currentStep.slow
                          ? 'bg-blue-500 text-white border-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                          : idx === currentStep.fast || idx === currentStep.fastIntermediate
                            ? 'bg-purple-500 text-white border-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'bg-muted/30 border-border text-muted-foreground group-hover:border-primary/30'
                        }`}
                    >
                      {val}
                    </div>

                    {/* Pointer Labels */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 w-20">
                      {idx === currentStep.slow && currentStep.slow !== null && (
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow-sm transition-all duration-300 ${currentStep.movingPointer === 'slow' || currentStep.movingPointer === 'both' ? 'bg-blue-600 text-white animate-bounce' : 'bg-blue-100 text-blue-700'}`}>
                          SLOW
                        </div>
                      )}
                      {(idx === currentStep.fast || idx === currentStep.fastIntermediate) && (currentStep.fast !== null || currentStep.fastIntermediate !== null) && (
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow-sm transition-all duration-300 mt-1 ${currentStep.movingPointer === 'fast' || currentStep.movingPointer === 'both' ? 'bg-purple-600 text-white animate-bounce' : 'bg-purple-100 text-purple-700'}`}>
                          FAST
                        </div>
                      )}
                    </div>

                    {/* Index Label */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font- text-muted-foreground/60 uppercase tracking-tighter">
                      Idx {idx}
                    </div>
                  </div>

                  {idx < currentStep.nodes.length - 1 ? (
                    <div className="w-8 sm:w-12 h-[2px] bg-border mx-1 relative opacity-60">
                      <div className="absolute right-0 -top-[5px] border-t-[6px] border-l-[10px] border-b-[6px] border-t-transparent border-b-transparent border-l-border"></div>
                    </div>
                  ) : (
                    <div className="ml-2 relative">
                      <svg width="40" height="60" viewBox="0 0 40 60" className="text-border/40">
                        <path d="M 0 30 Q 40 30 40 -10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
                        <path d="M 35 -5 L 40 -15 L 45 -5" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="text-[9px] font-black text-muted-foreground/40 absolute -top-8 left-4 uppercase tracking-widest whitespace-nowrap">Cycle to Idx 1</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 p-5 bg-muted/40 backdrop-blur-sm rounded-2xl border border-border/50 min-h-[5rem] flex items-center transition-all duration-300 hover:bg-muted/60">
              <p className="text-sm font-semibold text-foreground/90 leading-relaxed italic">
                {currentStep.message}
              </p>
            </div>
          </div>

          <VariablePanel
            variables={{
              slow: currentStep.slow !== null ? `Node ${currentStep.nodes[currentStep.slow]} (Idx ${currentStep.slow})` : 'null',
              fast: currentStep.fast !== null ? `Node ${currentStep.nodes[currentStep.fast]} (Idx ${currentStep.fast})` : 'null',
              'slow === fast': currentStep.slow === currentStep.fast ? 'TRUE' : 'FALSE',
              result: currentStep.result === null ? 'in progress...' : currentStep.result ? 'TRUE (Cycle Found)' : 'FALSE (No Cycle)'
            }}
          />
        </div>

        <div className="w-full">
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};