import React, { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

import { LayoutList, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  hasCycle: boolean;
}

export const FastSlowPointersVisualization: React.FC = () => {
  const [testCase, setTestCase] = useState<'with-cycle' | 'no-cycle'>('with-cycle');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const code = `function hasCycle(head: ListNode | null): boolean {
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}`;

  const generateSteps = (currentTestCase: 'with-cycle' | 'no-cycle') => {
    const hasCycle = currentTestCase === 'with-cycle';
    const nodeValues = hasCycle ? [3, 2, 0, -4] : [1, 2, 3, 4, 5];
    const cycleStartIdx = 1;
    const newSteps: Step[] = [];

    const getNext = (curr: number) => {
      if (curr < 0) return -1; // null
      if (curr < nodeValues.length - 1) return curr + 1;
      return hasCycle ? cycleStartIdx : -1;
    };

    const addStep = (params: Partial<Step>) => {
      newSteps.push({
        nodes: nodeValues,
        slow: null,
        fast: null,
        fastIntermediate: null,
        message: '',
        lineNumber: 1, // Default to function signature 
        isMeeting: false,
        result: null,
        movingPointer: 'none',
        hasCycle,
        ...params
      });
    };

    let slow: number | null = 0;
    let fast: number | null = 0;

    // Line 2: let slow = head
    addStep({
      slow: 0,
      message: 'Initialize slow pointer at head (index 0)',
      lineNumber: 2,
      movingPointer: 'slow'
    });

    // Line 3: let fast = head
    addStep({
      slow: 0,
      fast: 0,
      message: 'Initialize fast pointer at head (index 0)',
      lineNumber: 3,
      movingPointer: 'fast'
    });

    while (true) {
      // Line 5: while condition
      addStep({
        slow,
        fast,
        message: 'Checking loop condition: fast and fast.next are non-null',
        lineNumber: 5
      });

      if (fast === -1 || getNext(fast) === -1) {
        // Loop exit condition met
        addStep({
          slow,
          fast,
          message: 'Loop ends because fast or fast.next reached null (end of list).',
          lineNumber: 5
        });
        break;
      }

      // Line 6: slow = slow.next
      slow = getNext(slow!);
      addStep({
        slow,
        fast,
        message: `Slow pointer moves 1 step to node ${nodeValues[slow]}`,
        lineNumber: 6,
        movingPointer: 'slow'
      });

      // Line 7: fast = fast.next.next
      const fastStep1 = getNext(fast!);
      fast = fastStep1 === -1 ? -1 : getNext(fastStep1);

      addStep({
        slow,
        fast,
        message: fast === -1
          ? 'Fast pointer moves 2 steps and reaches the end of the list'
          : `Fast pointer moves 2 steps to node ${nodeValues[fast]}`,
        lineNumber: 7,
        movingPointer: 'fast'
      });

      // Line 9: if (slow === fast)
      addStep({
        slow,
        fast,
        message: fast === -1
          ? `Checking if slow (${nodeValues[slow]}) equals fast (null)`
          : `Checking if slow (${nodeValues[slow]}) equals fast (${nodeValues[fast]})`,
        lineNumber: 9
      });

      if (slow === fast) {
        // Line 10: return true
        addStep({
          slow,
          fast,
          isMeeting: true,
          message: 'Slow and fast pointers met! Cycle detected.',
          lineNumber: 10,
          result: true
        });
        break;
      }

      if (newSteps.length > 100) break; // Safety against infinite loops
    }

    if (fast === -1 || getNext(fast) === -1) {
      // Line 14: return false
      addStep({
        slow,
        fast,
        message: 'No cycle detected. Reached the end of the list.',
        lineNumber: 14,
        result: false
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSteps(testCase);
  }, [testCase]);

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
      <div className="bg-muted/20 p-4 rounded-xl border border-border/50">
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
      </div>

      <div className="flex justify-center">
        <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
          <Button
            variant={testCase === 'with-cycle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTestCase('with-cycle')}
            className="h-8 text-xs gap-2"
          >
            <Hash size={14} /> With Cycle
          </Button>
          <Button
            variant={testCase === 'no-cycle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTestCase('no-cycle')}
            className="h-8 text-xs gap-2"
          >
            <LayoutList size={14} /> No Cycle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-4 sm:p-8 border shadow-sm relative overflow-hidden min-h-[350px]">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <svg width="150" height="150" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              </svg>
            </div>



            <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-12 pb-10 pt-14 px-2 overflow-x-auto no-scrollbar max-w-full">
              {currentStep.nodes.map((val, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="relative group">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-black text-xs transition-all duration-500 ${idx === currentStep.slow && idx === currentStep.fast
                        ? 'bg-amber-500 text-white border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)] scale-110 z-10'
                        : idx === currentStep.slow
                          ? 'bg-blue-500 text-white border-blue-600 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                          : idx === currentStep.fast || idx === currentStep.fastIntermediate
                            ? 'bg-purple-500 text-white border-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                            : 'bg-muted/30 border-border text-foreground group-hover:border-primary/30'
                        }`}
                    >
                      {val}
                    </div>

                    {/* Pointer Labels */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 w-20">
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

                  </div>

                  {idx < currentStep.nodes.length - 1 ? (
                    <div className="w-3 sm:w-4 h-[2px] bg-border relative opacity-60">
                      <div className="absolute right-0 -top-[4px] border-t-[5px] border-l-[8px] border-b-[5px] border-t-transparent border-b-transparent border-l-border"></div>
                    </div>
                  ) : currentStep.hasCycle ? (
                    <div className="ml-1 relative">
                      <svg width="40" height="60" viewBox="0 0 40 60" className="text-border/40">
                        <path d="M 0 30 Q 40 30 40 -10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
                        <path d="M 35 -5 L 40 -15 L 45 -5" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="text-[9px] font-black text-muted-foreground/40 absolute -top-8 left-4 uppercase tracking-widest whitespace-nowrap">Cycle Connected</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-12 p-5 bg-muted/40 backdrop-blur-sm rounded-2xl border border-border/50 min-h-[5rem] flex items-center transition-all duration-300 hover:bg-muted/60">
              <p className="text-sm font-semibold text-foreground leading-relaxed italic">
                {currentStep.message}
              </p>
            </div>
          </div>

          <VariablePanel
            variables={{
              slow: currentStep.slow !== null ? `Node ${currentStep.nodes[currentStep.slow]}` : 'null',
              fast: currentStep.fast !== null ? `Node ${currentStep.nodes[currentStep.fast]}` : 'null',
              'slow === fast': currentStep.slow === currentStep.fast ? 'TRUE' : 'FALSE',
              result: currentStep.result === null ? 'in progress...' : currentStep.result ? 'TRUE (Cycle Found)' : 'FALSE (No Cycle)'
            }}
          />
        </div>

        <div className="w-full">
          <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};