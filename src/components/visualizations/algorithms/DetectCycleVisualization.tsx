import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Button } from '@/components/ui/button';
import { Link, CircleOff } from 'lucide-react';

interface Step {
  nodes: number[];
  cycleStartIdx: number | null;
  slow: number | null;
  fast: number | null;
  foundCycleStart: number | null;
  message: string;
  lineNumber: number;
  phase: 'detection' | 'finding-start' | 'complete';
  movingPointer?: 'slow' | 'fast' | 'both' | 'none';
}

export const DetectCycleVisualization: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef<number | null>(null);

  const cases = [
    { name: "With Cycle", nodes: [3, 2, 0, -4], cycleStartIdx: 1, icon: <Link className="w-4 h-4" /> },
    { name: "No Cycle", nodes: [1, 2, 3, 4], cycleStartIdx: null, icon: <CircleOff className="w-4 h-4" /> }
  ];
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);

  const code = `function detectCycle(head) {
  if (!head || !head.next) {
    return null;
  }
  
  let slow = head;
  let fast = head;
  
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    
    if (slow === fast) {
      break;
    }
  }
  
  if (!fast || !fast.next) {
    return null;
  }
  
  slow = head;
  while (slow !== fast) {
    slow = slow.next;
    fast = fast.next;
  }
  
  return slow;
}`;

  const generateSteps = (nodes: number[], cycleStartIdx: number | null) => {
    const newSteps: Step[] = [];

    const getNext = (curr: number | null) => {
      if (curr === null) return null;
      if (cycleStartIdx === null) {
        return curr < nodes.length - 1 ? curr + 1 : null;
      }
      if (curr < nodes.length - 1) {
        return curr + 1;
      }
      return cycleStartIdx;
    };

    const addStep = (s: number | null, f: number | null, msg: string, line: number, ph: Step['phase'], moving: Step['movingPointer'] = 'none', fcs: number | null = null) => {
      newSteps.push({
        nodes,
        cycleStartIdx,
        slow: s,
        fast: f,
        foundCycleStart: fcs,
        message: msg,
        lineNumber: line,
        phase: ph,
        movingPointer: moving
      });
    };

    addStep(null, null, `Case: ${cycleStartIdx !== null ? 'Linked List with cycle' : 'Linked List without cycle'}.`, 1, 'detection');
    addStep(null, null, "Check if list is empty or has only one node.", 2, 'detection');

    let slow: number | null = 0;
    let fast: number | null = 0;

    addStep(slow, fast, "Initialize slow and fast pointers at the head.", 6, 'detection', 'both');
    addStep(slow, fast, "Assign fast pointer to head.", 7, 'detection', 'fast');

    while (true) {
      addStep(slow, fast, "Check while condition: are fast and fast.next non-null?", 9, 'detection');

      const nextSlow = getNext(slow);
      addStep(slow, fast, `Move slow one step: ${slow} -> ${nextSlow}.`, 10, 'detection', 'slow');
      slow = nextSlow;

      const midFast = getNext(fast);
      const nextFast = getNext(midFast);
      addStep(slow, fast, `Move fast two steps: ${fast} -> ${midFast} -> ${nextFast}.`, 11, 'detection', 'fast');
      fast = nextFast;

      if (fast === null || getNext(fast) === null) {
        addStep(slow, fast, "Fast pointer reached the end of the list. No cycle detected.", 18, 'detection');
        addStep(slow, fast, "Return null.", 19, 'complete');
        return newSteps;
      }

      addStep(slow, fast, `Check if slow (${slow}) === fast (${fast}).`, 13, 'detection');
      if (slow === fast) {
        addStep(slow, fast, "Slow and fast pointers met! Cycle detected.", 14, 'detection');
        break;
      }
    }

    addStep(slow, fast, "Cycle confirmed. Checking if fast or fast.next is null (safety check).", 18, 'detection');

    addStep(slow, fast, "Phase 2: Reset slow pointer to head. Keep fast at meeting point.", 22, 'finding-start', 'slow');
    slow = 0;

    while (slow !== fast) {
      addStep(slow, fast, `Check if slow (${slow}) !== fast (${fast}).`, 23, 'finding-start');

      const nextSlow = getNext(slow);
      const nextFast = getNext(fast);
      addStep(slow, fast, `Move both pointers one step. Slow: ${slow}->${nextSlow}, Fast: ${fast}->${nextFast}.`, 24, 'finding-start', 'both');
      slow = nextSlow;
      fast = nextFast;
    }

    addStep(slow, fast, `Pointers met at index ${slow}. This is the start of the cycle.`, 28, 'complete', 'none', slow);
    addStep(slow, fast, `Return node at index ${slow}.`, 28, 'complete', 'none', slow);

    return newSteps;
  };

  useEffect(() => {
    const selectedCase = cases[selectedCaseIndex];
    setSteps(generateSteps(selectedCase.nodes, selectedCase.cycleStartIdx));
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedCaseIndex]);

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
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handleCaseChange = (index: number) => {
    if (index === selectedCaseIndex) return;
    setSelectedCaseIndex(index);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <StepControls
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStepForward={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
          onStepBack={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
          onReset={() => { setCurrentStepIndex(0); setIsPlaying(false); }}
          isPlaying={isPlaying}
          currentStep={currentStepIndex}
          totalSteps={steps.length - 1}
          speed={speed}
          onSpeedChange={setSpeed}
        />
        
        <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50 backdrop-blur-sm self-start sm:self-center">
          {cases.map((testCase, idx) => (
            <button
              key={idx}
              onClick={() => handleCaseChange(idx)}
              className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedCaseIndex === idx 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {selectedCaseIndex === idx && (
                <motion.div
                  layoutId="activeCaseCycle"
                  className="absolute inset-0 bg-background shadow-sm border border-border/50 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {testCase.icon}
                {testCase.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-8">
          <div className="flex flex-wrap items-center justify-center gap-y-12 gap-x-4 py-8">
            {currentStep.nodes.map((val, idx) => (
              <div key={idx} className="flex items-center">
                <div className="relative">
                  <motion.div
                    animate={{
                      scale: (idx === currentStep.slow || idx === currentStep.fast) ? 1.1 : 1,
                      backgroundColor: currentStep.foundCycleStart === idx ? 'rgba(34, 197, 94, 0.2)' : 'transparent'
                    }}
                    className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-mono font-bold transition-colors duration-200 ${
                      currentStep.foundCycleStart === idx
                        ? 'border-green-500 text-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                        : (idx === currentStep.slow && idx === currentStep.fast)
                          ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                          : idx === currentStep.slow
                            ? 'border-blue-500 bg-blue-500/10 text-blue-600'
                            : idx === currentStep.fast
                              ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                              : 'border-border text-muted-foreground'
                    }`}
                  >
                    {val}
                  </motion.div>

                  {/* Pointer Indicators */}
                  <AnimatePresence>
                    {idx === currentStep.slow && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2"
                      >
                        <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">S</div>
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-blue-500 mx-auto" />
                      </motion.div>
                    )}
                    {idx === currentStep.fast && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute ${idx === currentStep.slow ? '-top-14' : '-top-8'} left-1/2 -translate-x-1/2`}
                      >
                        <div className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">F</div>
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-purple-500 mx-auto" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {idx < currentStep.nodes.length - 1 ? (
                  <div className="w-8 h-0.5 bg-border mx-1 relative">
                    <div className="absolute right-0 -top-[3px] border-t-[4px] border-l-[6px] border-b-[4px] border-t-transparent border-b-transparent border-l-border" />
                  </div>
                ) : (
                  currentStep.cycleStartIdx !== null && (
                    <div className="ml-2 relative">
                      <svg width="40" height="40" viewBox="0 0 40 40" className="text-border fill-none overflow-visible">
                        <path d="M 0 20 C 40 20 40 -40 0 -40" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" className="opacity-50" />
                        <path d="M -5 -35 L 0 -40 L 5 -35" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="text-[8px] font-black uppercase text-muted-foreground absolute -top-12 -left-2 rotate-[-90deg] tracking-tighter">Cycle</span>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>

          <div className="p-4 bg-accent/30 rounded-lg border border-accent/20 min-h-[60px] flex items-center">
            <p className="text-sm font-medium leading-relaxed text-foreground">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              "Phase": currentStep.phase === 'detection' ? "1: Detection" : (currentStep.phase === 'finding-start' ? "2: Finding Start" : "3: Complete"),
              "Slow Pointer": currentStep.slow !== null ? `Node[${currentStep.slow}]` : "null",
              "Fast Pointer": currentStep.fast !== null ? `Node[${currentStep.fast}]` : "null",
              "slow === fast": currentStep.slow === currentStep.fast ? "TRUE" : "FALSE"
            }}
          />
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="typescript"
        />
      </div>
    </div>
  );
};