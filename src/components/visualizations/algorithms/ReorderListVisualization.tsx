import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  list: number[];
  phase: 'find-middle' | 'reverse' | 'merge';
  slow: number | null;
  fast: number | null;
  secondHalfHead: number | null;
  prev: number | null;
  current: number | null;
  nextNode: number | null;
  firstHalfCurrent: number | null;
  secondHalfCurrent: number | null;
  firstHalfNext: number | null;
  secondHalfNext: number | null;
  connections: Record<number, number | null>;
  message: string;
  lineNumber: number;
  variables: Record<string, any>;
}

export const ReorderListVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<number | null>(null);

  const code = `function reorderList(head: ListNode | null): void {
  if (!head || !head.next) return;
  let slow: ListNode | null = head;
  let fast: ListNode | null = head;
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  let secondHalfHead: ListNode | null = slow!.next;
  slow!.next = null;
  let prev: ListNode | null = null;
  let current: ListNode | null = secondHalfHead;
  while (current) {
    const nextNode: ListNode | null = current.next;
    current.next = prev;
    prev = current;
    current = nextNode;
  }
  secondHalfHead = prev;
  let firstHalfCurrent: ListNode | null = head;
  let secondHalfCurrent: ListNode | null = secondHalfHead;
  while (secondHalfCurrent) {
    const firstHalfNext: ListNode | null = firstHalfCurrent!.next;
    const secondHalfNext: ListNode | null = secondHalfCurrent.next;
    firstHalfCurrent!.next = secondHalfCurrent;
    secondHalfCurrent.next = firstHalfNext;
    firstHalfCurrent = firstHalfNext;
    secondHalfCurrent = secondHalfNext;
  }
}`;

  const generateSteps = () => {
    const list = [1, 2, 3, 4, 5];
    const newSteps: Step[] = [];
    let connections: Record<number, number | null> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: null };

    const createSnap = (overrides: Partial<Step>) => ({
      list: [...list],
      phase: overrides.phase || 'find-middle',
      slow: null,
      fast: null,
      secondHalfHead: null,
      prev: null,
      current: null,
      nextNode: null,
      firstHalfCurrent: null,
      secondHalfCurrent: null,
      firstHalfNext: null,
      secondHalfNext: null,
      connections: { ...connections },
      message: '',
      lineNumber: 1,
      variables: {},
      ...overrides
    } as Step);

    newSteps.push(createSnap({
      message: "Starting reorder list algorithm with input [1, 2, 3, 4, 5].",
      lineNumber: 1,
      variables: { head: '[1, 2, 3, 4, 5]' }
    }));

    newSteps.push(createSnap({
      message: "Check if the list is empty or has only one node. If so, no reordering is needed.",
      lineNumber: 2,
      variables: { head: 'Node 1', "head.next": 'Node 2' }
    }));

    let slow = 0, fast = 0;
    newSteps.push(createSnap({
      slow,
      message: "Initialize slow pointer to the head of the list.",
      lineNumber: 3,
      variables: { head: 'Node 1', slow: 'Node 1' }
    }));

    newSteps.push(createSnap({
      slow, fast,
      message: "Initialize fast pointer to the head. We'll use these to find the middle of the list.",
      lineNumber: 4,
      variables: { slow: 'Node 1', fast: 'Node 1' }
    }));

    while (fast !== null && connections[fast] !== null) {
      newSteps.push(createSnap({
        slow, fast,
        message: "The fast pointer can still move forward. Proceed with finding the middle.",
        lineNumber: 5,
        variables: { fast: `Node ${list[fast]}`, "fast.next": `Node ${list[connections[fast]!]}` }
      }));

      slow = connections[slow]!;
      newSteps.push(createSnap({
        slow, fast,
        message: "Advance slow by one step. It moves at half the speed of the fast pointer.",
        lineNumber: 6,
        variables: { slow: `Node ${list[slow]}`, fast: `Node ${list[fast]}` }
      }));

      fast = connections[connections[fast]!]!;
      newSteps.push(createSnap({
        slow, fast,
        message: "Advance fast by two steps. When fast reaches the end, slow will be at the middle.",
        lineNumber: 7,
        variables: { slow: `Node ${list[slow]}`, fast: fast !== null ? `Node ${list[fast]}` : 'null' }
      }));
    }

    newSteps.push(createSnap({
      slow, fast,
      message: "The fast pointer has reached the end/tail. The slow pointer is now at the middle of the list.",
      lineNumber: 5,
      variables: { fast: fast !== null ? `Node ${list[fast]}` : 'null', slow: `Node ${list[slow]}` }
    }));

    let secondHalfHead: number | null = connections[slow];
    newSteps.push(createSnap({
      slow, secondHalfHead,
      message: "Identify the start of the second half of the list, which begins after the slow pointer.",
      lineNumber: 9,
      variables: { slow: `Node ${list[slow]}`, secondHalfHead: secondHalfHead !== null ? `Node ${list[secondHalfHead]}` : 'null' }
    }));

    connections[slow] = null;
    newSteps.push(createSnap({
      slow, secondHalfHead,
      message: "Break the link between the first and second halves to treat them as separate lists.",
      lineNumber: 10,
      variables: { "slow.next": 'null', secondHalfHead: `Node ${list[secondHalfHead!]}` }
    }));

    let prev: number | null = null;
    newSteps.push(createSnap({
      phase: 'reverse',
      prev,
      message: "Begin reversing the second half. Initialize prev to null to serve as the new tail.",
      lineNumber: 11,
      variables: { prev: 'null' }
    }));

    let current: number | null = secondHalfHead;
    newSteps.push(createSnap({
      phase: 'reverse',
      current, prev,
      message: "Start reversal from the head of the second half.",
      lineNumber: 12,
      variables: { current: `Node ${list[current!]}`, prev: 'null' }
    }));

    while (current !== null) {
      newSteps.push(createSnap({
        phase: 'reverse',
        current, prev,
        message: "Continue reversing while we have nodes left in the second half.",
        lineNumber: 13,
        variables: { current: `Node ${list[current]}` }
      }));

      let nextNode: number | null = connections[current];
      newSteps.push(createSnap({
        phase: 'reverse',
        current, prev, nextNode,
        message: "Temporarily store the next node so we don't lose the rest of the list.",
        lineNumber: 14,
        variables: { current: `Node ${list[current]}`, next: nextNode !== null ? `Node ${list[nextNode]}` : 'null' }
      }));

      connections[current] = prev;
      newSteps.push(createSnap({
        phase: 'reverse',
        current, prev, nextNode,
        message: "Reverse the link: the current node now points to the previous node.",
        lineNumber: 15,
        variables: { "current.next": prev !== null ? `Node ${list[prev]}` : 'null' }
      }));

      prev = current;
      newSteps.push(createSnap({
        phase: 'reverse',
        current, prev, nextNode,
        message: "Move the prev pointer forward to the current node.",
        lineNumber: 16,
        variables: { prev: `Node ${list[prev]}` }
      }));

      current = nextNode;
      newSteps.push(createSnap({
        phase: 'reverse',
        current, prev,
        message: "Move the current pointer forward to the next node to continue reversal.",
        lineNumber: 17,
        variables: { current: current !== null ? `Node ${list[current]}` : 'null' }
      }));
    }

    secondHalfHead = prev;
    newSteps.push(createSnap({
      phase: 'reverse',
      secondHalfHead,
      message: "Reversal complete. The second half is now reversed, and secondHalfHead points to its new head.",
      lineNumber: 19,
      variables: { secondHalfHead: `Node ${list[secondHalfHead!]}` }
    }));

    let firstHalfCurrent: number | null = 0;
    newSteps.push(createSnap({
      phase: 'merge',
      firstHalfCurrent,
      message: "Now we merge the two halves. Initialize firstHalfCurrent to the head of the first half.",
      lineNumber: 20,
      variables: { firstHalfCurrent: 'Node 1' }
    }));

    let secondHalfCurrent: number | null = secondHalfHead;
    newSteps.push(createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent,
      message: "Initialize secondHalfCurrent to the head of the reversed second half.",
      lineNumber: 21,
      variables: { firstHalfCurrent: 'Node 1', secondHalfCurrent: `Node ${list[secondHalfCurrent!]}` }
    }));

    while (secondHalfCurrent !== null) {
      newSteps.push(createSnap({
        phase: 'merge',
        firstHalfCurrent, secondHalfCurrent,
        message: "Continue merging while there are nodes remaining in the second half.",
        lineNumber: 22,
        variables: { secondHalfCurrent: `Node ${list[secondHalfCurrent]}` }
      }));

      let firstHalfNext: number | null = connections[firstHalfCurrent!];
      newSteps.push(createSnap({
        phase: 'merge',
        firstHalfCurrent, secondHalfCurrent, firstHalfNext,
        message: "Save the next node in the first half to maintain the structure during the merge.",
        lineNumber: 23,
        variables: { firstHalfNext: firstHalfNext !== null ? `Node ${list[firstHalfNext]}` : 'null' }
      }));

      let secondHalfNext: number | null = connections[secondHalfCurrent];
      newSteps.push(createSnap({
        phase: 'merge',
        firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
        message: "Save the next node in the reversed second half.",
        lineNumber: 24,
        variables: { secondHalfNext: secondHalfNext !== null ? `Node ${list[secondHalfNext]}` : 'null' }
      }));

      connections[firstHalfCurrent!] = secondHalfCurrent;
      newSteps.push(createSnap({
        phase: 'merge',
        firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
        message: "Insert the node from the second half between current first half nodes.",
        lineNumber: 25,
        variables: { "firstHalfCurrent.next": `Node ${list[secondHalfCurrent]}` }
      }));

      connections[secondHalfCurrent] = firstHalfNext;
      newSteps.push(createSnap({
        phase: 'merge',
        firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
        message: "Set the next pointer of the inserted node to point back to the first half's continuation.",
        lineNumber: 26,
        variables: { "secondHalfCurrent.next": firstHalfNext !== null ? `Node ${list[firstHalfNext]}` : 'null' }
      }));

      firstHalfCurrent = firstHalfNext;
      newSteps.push(createSnap({
        phase: 'merge',
        firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
        message: "Advance the first half pointer forward.",
        lineNumber: 27,
        variables: { firstHalfCurrent: firstHalfCurrent !== null ? `Node ${list[firstHalfCurrent]}` : 'null' }
      }));

      secondHalfCurrent = secondHalfNext;
      newSteps.push(createSnap({
        phase: 'merge',
        firstHalfCurrent, secondHalfCurrent,
        message: "Advance the second half pointer for the next iteration of the merge.",
        lineNumber: 28,
        variables: { secondHalfCurrent: secondHalfCurrent !== null ? `Node ${list[secondHalfCurrent]}` : 'null' }
      }));
    }

    newSteps.push(createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent,
      message: "Reordering is complete. The list is now alternating between the start and the end.",
      lineNumber: 22,
      variables: { secondHalfCurrent: 'null' }
    }));

    setSteps(newSteps);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1500 / speed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
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

  // Calculate logical order for the merge phase to show 1 -> 5 -> 2 -> 4 -> 3 sequence
  const getOrderedIndices = () => {
    const indices = Array.from({ length: currentStep.list.length }, (_, i) => i);
    if (currentStep.phase !== 'merge') return indices;

    const ordered: number[] = [];
    const visited = new Set<number>();
    let curr: number | null = 0; // Head is always index 0

    while (curr !== null && !visited.has(curr)) {
      ordered.push(curr);
      visited.add(curr);
      curr = currentStep.connections[curr];
    }

    // Append any remaining indices (shouldn't happen in a valid merge, but for safety)
    indices.forEach(idx => {
      if (!visited.has(idx)) ordered.push(idx);
    });

    return ordered;
  };

  const displayIndices = getOrderedIndices();

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
          <div className="bg-card rounded-lg p-6 border shadow-sm flex flex-col min-h-[450px]">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
              {currentStep.phase === 'find-middle' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
              {currentStep.phase === 'reverse' && <span className="w-2 h-2 rounded-full bg-purple-500" />}
              {currentStep.phase === 'merge' && <span className="w-2 h-2 rounded-full bg-green-500" />}
              {currentStep.phase === 'find-middle' && 'Phase 1: Find Middle'}
              {currentStep.phase === 'reverse' && 'Phase 2: Reverse Second Half'}
              {currentStep.phase === 'merge' && 'Phase 3: Merge Alternately'}
            </h3>

            <div className="flex-1 flex flex-col items-center justify-center gap-12 py-8">
              {/* Separate rendering for Reverse phase to show fragments clearly */}
              {currentStep.phase === 'reverse' ? (
                <div className="space-y-16 w-full flex flex-col items-center">
                  {/* First Half */}
                  <div className="flex items-center gap-x-1">
                    {[0, 1, 2].map((idx) => {
                      const nextIdx = currentStep.connections[idx];
                      return (
                        <div key={idx} className="relative flex items-center">
                          <div className={`w-8 h-8 flex items-center justify-center rounded-md border-2 font-bold text-xs bg-muted border-border text-foreground`}>
                            {currentStep.list[idx]}
                          </div>
                          {nextIdx !== null && nextIdx !== undefined && nextIdx > idx && (
                            <div className="flex items-center justify-center w-6 text-foreground font-black">→</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Second Half (the one being reversed) */}
                  <div className="flex items-center gap-x-1">
                    {[3, 4].map((idx) => {
                      const isPrev = currentStep.prev === idx;
                      const isCurrent = currentStep.current === idx;
                      const isNext = currentStep.nextNode === idx;

                      const nextIdx = currentStep.connections[idx];

                      const labels = [
                        { active: isCurrent, text: 'curr', color: 'text-blue-500', top: '-top-10' },
                        { active: isPrev, text: 'prev', color: 'text-orange-500', top: '-top-6' },
                        { active: isNext, text: 'next', color: 'text-muted-foreground', top: '-top-14' },
                      ].filter(l => l.active);

                      return (
                        <div key={idx} className="relative flex items-center">
                          {labels.map((label, lIdx) => (
                            <div key={lIdx} className={`absolute ${label.top} left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 whitespace-nowrap z-20`}>
                              <span className={`text-[10px] font-bold ${label.color} uppercase`}>{label.text}</span>
                            </div>
                          ))}

                          {nextIdx !== null && nextIdx !== undefined && nextIdx < idx && (
                            <div className="flex items-center justify-center w-6 text-foreground font-black -mr-6 z-0">
                               <span className="rotate-180 -translate-y-4">→</span>
                            </div>
                          )}

                          <div
                            className={`w-8 h-8 flex items-center justify-center rounded-md border-2 font-bold text-xs transition-all duration-300 ${
                              isCurrent ? 'bg-blue-500/20 border-blue-500 text-foreground scale-110 shadow-md z-10' :
                              isPrev ? 'bg-orange-500/20 border-orange-500 text-foreground scale-110 shadow-md z-10' :
                              'bg-muted border-border text-foreground'
                            }`}
                          >
                            {currentStep.list[idx]}
                          </div>

                          {nextIdx !== null && nextIdx !== undefined && nextIdx > idx && (
                            <div className="flex items-center justify-center w-6 text-foreground font-black">→</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Merge or Find-Middle Phase */
                <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-16">
                  {displayIndices.map((idx, pos) => {
                    const val = currentStep.list[idx];
                    const isSlow = currentStep.slow === idx;
                    const isFast = currentStep.fast === idx;
                    const isFirst = currentStep.firstHalfCurrent === idx;
                    const isSecond = currentStep.secondHalfCurrent === idx || currentStep.secondHalfHead === idx;
                    const isCurrent = currentStep.current === idx;
                    const isTmp = currentStep.nextNode === idx || currentStep.firstHalfNext === idx || currentStep.secondHalfNext === idx;

                    const nextIdx = currentStep.connections[idx];

                    const labels = [
                      { active: isSlow, text: 'slow', color: 'text-blue-500', top: '-top-6' },
                      { active: isFast, text: 'fast', color: 'text-purple-500', top: '-top-10' },
                      { active: isFirst, text: 'first', color: 'text-blue-500', top: '-top-6' },
                      { active: isSecond, text: 'second', color: 'text-green-500', top: '-top-10' },
                      { active: isCurrent, text: 'curr', color: 'text-blue-500', top: '-top-10' },
                      { active: isTmp, text: 'next', color: 'text-muted-foreground', top: '-top-14' },
                    ].filter(l => l.active);

                    // For straight line in merge, we check if next index is the one physically next to it
                    const isLogicalNext = nextIdx !== null && nextIdx !== undefined && nextIdx === displayIndices[pos + 1];

                    return (
                      <div key={idx} className="relative flex items-center">
                        {labels.map((label, lIdx) => (
                          <div key={lIdx} className={`absolute ${label.top} left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 whitespace-nowrap z-20`}>
                            <span className={`text-[10px] font-bold ${label.color} uppercase`}>{label.text}</span>
                          </div>
                        ))}

                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-md border-2 font-bold text-xs transition-all duration-300 ${
                            isSlow || isFirst || isCurrent ? 'bg-blue-500/20 border-blue-500 text-foreground scale-110 shadow-md z-10' :
                            isFast ? 'bg-purple-500/20 border-purple-500 text-foreground scale-110 shadow-md z-10' :
                            isSecond ? 'bg-green-500/20 border-green-500 text-foreground scale-110 shadow-md z-10' :
                            'bg-muted border-border text-foreground'
                          }`}
                        >
                          {val}
                        </div>

                        {nextIdx !== null && nextIdx !== undefined && (
                          <div className={`flex items-center justify-center w-6 text-foreground font-black ${!isLogicalNext ? 'opacity-20' : ''}`}>
                            →
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-8 p-4 bg-muted/40 rounded-lg border border-border/50">
              <p className="text-sm font-medium leading-relaxed text-foreground">{currentStep.message}</p>
            </div>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="typescript" />
      </div>
    </div>
  );
};
