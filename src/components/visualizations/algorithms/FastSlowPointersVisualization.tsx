import React, { useEffect, useRef, useState } from 'react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import { LayoutList, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Step {
  nodes: number[];
  slow: number | null;
  fast: number | null;
  fastIntermediate: number | null;
  explanation: string;
  pseudoStep: string;
  isMeeting: boolean;
  result: boolean | null;
  movingPointer: 'slow' | 'fast' | 'both' | 'none';
  hasCycle: boolean;
  variables: Record<string, any>;
}

// ─── Hardcoded code per language (no comments) ──────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function hasCycle(head: ListNode | null): boolean {
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
}`,

  python: `def hasCycle(head: ListNode) -> bool:
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,

  java: `public static class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null) {
            return false;
        }
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }
}`,

  cpp: `class Solution {
    public:
        bool hasCycle(ListNode* head) {
            ListNode* slow = head;
            ListNode* fast = head;
            while (fast && fast->next) {
                slow = slow->next;
                fast = fast->next->next;
                if (slow == fast) {
                    return true;
                }
            }
            return false;
        }
};`,
};

// ─── Step generator ──────────────────────────────────────────────────────────

function generateVisualizationData(currentTestCase: 'with-cycle' | 'no-cycle') {
  const hasCycle = currentTestCase === 'with-cycle';
  const nodeValues = hasCycle ? [3, 2, 0, -4] : [1, 2, 3, 4, 5];
  const cycleStartIdx = 1;
  const steps: Step[] = [];

  const getNext = (curr: number) => {
    if (curr < 0) return -1;
    if (curr < nodeValues.length - 1) return curr + 1;
    return hasCycle ? cycleStartIdx : -1;
  };

  const stepLineNumbers: StepLineNumberMap = {
    typescript: [],
    python: [],
    java: [],
    cpp: []
  };

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  const addStep = (params: Partial<Step>, ts_l: number, py_l: number, java_l: number, cpp_l: number) => {
    steps.push({
      nodes: nodeValues,
      slow: null,
      fast: null,
      fastIntermediate: null,
      explanation: '',
      pseudoStep: '',
      isMeeting: false,
      result: null,
      movingPointer: 'none',
      hasCycle,
      variables: {},
      ...params
    });
    addLines(ts_l, py_l, java_l, cpp_l);
  };

  let slow: number | null = 0;
  let fast: number | null = 0;

  addStep({
    slow: 0,
    explanation: 'Initialize slow pointer to the head of the list (index 0).',
    pseudoStep: 'SET slow = head',
    movingPointer: 'slow',
  }, 2, 2, 6, 4);

  addStep({
    slow: 0,
    fast: 0,
    explanation: 'Initialize fast pointer to the head of the list (index 0).',
    pseudoStep: 'SET fast = head',
    movingPointer: 'fast',
  }, 3, 2, 7, 5);

  while (true) {
    addStep({
      slow,
      fast,
      explanation: 'Check if fast pointer and its next node are not null.',
      pseudoStep: `WHILE fast != null AND fast.next != null  →  fast = index ${fast === -1 ? 'null' : fast}`,
      movingPointer: 'none'
    }, 4, 3, 8, 6);

    if (fast === -1 || getNext(fast) === -1) {
      addStep({
        slow,
        fast,
        explanation: 'Loop ends because fast pointer or its next pointer reached null.',
        pseudoStep: 'Loop ends  (fast or fast.next is null)',
        movingPointer: 'none'
      }, 4, 3, 8, 6);
      break;
    }

    slow = getNext(slow!);
    addStep({
      slow,
      fast,
      explanation: `Advance slow pointer by 1 step to index ${slow} (value ${nodeValues[slow]}).`,
      pseudoStep: `SET slow = slow.next  →  index ${slow}`,
      movingPointer: 'slow'
    }, 5, 4, 9, 7);

    const fastStep1 = getNext(fast!);
    fast = fastStep1 === -1 ? -1 : getNext(fastStep1);
    addStep({
      slow,
      fast,
      explanation: fast === -1
        ? 'Advance fast pointer by 2 steps to null.'
        : `Advance fast pointer by 2 steps to index ${fast} (value ${nodeValues[fast]}).`,
      pseudoStep: `SET fast = fast.next.next  →  index ${fast === -1 ? 'null' : fast}`,
      movingPointer: 'fast'
    }, 6, 5, 10, 8);

    addStep({
      slow,
      fast,
      explanation: fast === -1
        ? `Compare slow pointer (${nodeValues[slow]}) and fast pointer (null).`
        : `Compare slow pointer (${nodeValues[slow]}) and fast pointer (${nodeValues[fast]}).`,
      pseudoStep: `IF slow == fast  →  ${slow === fast ? 'YES ✓' : 'NO ✗'}`,
      movingPointer: 'none'
    }, 7, 6, 11, 9);

    if (slow === fast) {
      addStep({
        slow,
        fast,
        isMeeting: true,
        explanation: 'Slow and fast pointers met at the same node! A cycle is detected.',
        pseudoStep: 'RETURN True  (cycle found)',
        result: true,
        movingPointer: 'none'
      }, 8, 7, 12, 10);
      break;
    }
  }

  if (fast === -1 || getNext(fast) === -1) {
    addStep({
      slow,
      fast,
      explanation: 'Fast pointer reached the end of the list. No cycle detected.',
      pseudoStep: 'RETURN False  (no cycle)',
      result: false,
      movingPointer: 'none'
    }, 11, 8, 15, 13);
  }

  steps.forEach(s => {
    s.variables = {
      slow: s.slow !== null && s.slow >= 0 ? `Node ${s.nodes[s.slow]}` : 'null',
      fast: s.fast !== null && s.fast >= 0 ? `Node ${s.nodes[s.fast]}` : 'null',
      'slow === fast': s.slow === s.fast && s.slow !== null ? 'TRUE' : 'FALSE',
      result: s.result === null ? 'in progress...' : s.result ? 'TRUE (Cycle Found)' : 'FALSE (No Cycle)'
    };
  });

  return { steps, stepLineNumbers };
}

// ─── Component ───────────────────────────────────────────────────────────────

export const FastSlowPointersVisualization: React.FC = () => {
  const [testCase, setTestCase] = useState<'with-cycle' | 'no-cycle'>('with-cycle');
  const [{ steps, stepLineNumbers }, setVizData] = useState(() => generateVisualizationData(testCase));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const data = generateVisualizationData(testCase);
    setVizData(data);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [testCase]);

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
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(p => p + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(p => p - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

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
        {/* Left: visual state */}
        <div className="space-y-4">
          <div className="bg-card rounded-2xl p-4 sm:p-8 border shadow-sm relative overflow-hidden min-h-[300px] flex flex-col justify-center">
            <div className="flex flex-wrap items-center justify-center gap-x-0 gap-y-12 pb-10 pt-14 px-2 overflow-x-auto no-scrollbar max-w-full">
              {currentStep.nodes.map((val, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="relative group">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border-2 font-bold text-xs transition-all duration-500 ${idx === currentStep.slow && idx === currentStep.fast
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/50 scale-105 shadow-sm z-10'
                        : idx === currentStep.slow
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                          : idx === currentStep.fast || idx === currentStep.fastIntermediate
                            ? 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                            : 'bg-primary/5 border-primary/25 text-foreground group-hover:border-primary/45'
                        }`}
                    >
                      {val}
                    </div>

                    {/* Pointer Labels */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 w-20">
                      {idx === currentStep.slow && currentStep.slow !== null && (
                        <span className="text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">
                          Slow
                        </span>
                      )}
                      {(idx === currentStep.fast || idx === currentStep.fastIntermediate) && (currentStep.fast !== null || currentStep.fastIntermediate !== null) && (
                        <span className="text-[10px] font-bold text-blue-500 animate-pulse whitespace-nowrap">
                          Fast
                        </span>
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
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm font-medium text-foreground">{currentStep.explanation}</p>
          </div>

          <div className="bg-muted/50 rounded-lg border p-4">
            <h3 className="font-semibold mb-2 text-sm text-foreground">Fast & Slow Pointers Strategy:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>• Move two pointers at different speeds (slow by 1 node, fast by 2 nodes)</p>
              <p>• If a cycle exists, the fast pointer will eventually meet the slow pointer</p>
              <p>• If no cycle, fast pointer will reach null (end of list)</p>
              <p>• Time: O(n) · Space: O(1)</p>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        {/* Right: code / pseudocode panel */}
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};