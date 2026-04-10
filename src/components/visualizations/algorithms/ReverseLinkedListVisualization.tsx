import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { StepControls } from '../shared/StepControls';

interface Step {
  nodes: number[];
  prev: number | null;
  current: number | null;
  next: number | null;
  reversedLinks: Set<number>;
  message: string;
  lineNumber: number;
  variables: Record<string, any>;
}

export const ReverseLinkedListVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const list = [1, 2, 3, 4, 5];

  const steps = useMemo(() => {
    const newSteps: Step[] = [];
    const reversedLinks = new Set<number>();

    // Initial State
    newSteps.push({
      nodes: list,
      prev: null,
      current: null,
      next: null,
      reversedLinks: new Set(reversedLinks),
      message: "Start with the head of the list.",
      lineNumber: 1,
      variables: { head: "Node 1" }
    });

    // let prev = null;
    newSteps.push({
      nodes: list,
      prev: null,
      current: null,
      next: null,
      reversedLinks: new Set(reversedLinks),
      message: "Initialize 'prev' pointer as null.",
      lineNumber: 2,
      variables: { prev: "null" }
    });

    // let current = head;
    newSteps.push({
      nodes: list,
      prev: null,
      current: 0,
      next: null,
      reversedLinks: new Set(reversedLinks),
      message: "Initialize 'current' pointer as the head node.",
      lineNumber: 3,
      variables: { prev: "null", current: "Node 1" }
    });

    let prev: number | null = null;
    let current: number | null = 0;

    while (current !== null) {
      // while (current !== null)
      newSteps.push({
        nodes: list,
        prev,
        current,
        next: null,
        reversedLinks: new Set(reversedLinks),
        message: `Check if current node is not null. Current: Node ${current + 1}`,
        lineNumber: 4,
        variables: { prev: prev !== null ? `Node ${prev + 1}` : "null", current: `Node ${current + 1}` }
      });

      // let next = current.next;
      const next: number | null = current + 1 < list.length ? current + 1 : null;
      newSteps.push({
        nodes: list,
        prev,
        current,
        next,
        reversedLinks: new Set(reversedLinks),
        message: `Store the next node (Node ${next !== null ? next + 1 : "null"}) before reversing the pointer.`,
        lineNumber: 5,
        variables: { prev: prev !== null ? `Node ${prev + 1}` : "null", current: `Node ${current + 1}`, next: next !== null ? `Node ${next + 1}` : "null" }
      });

      // current.next = prev;
      reversedLinks.add(current);
      newSteps.push({
        nodes: list,
        prev,
        current,
        next,
        reversedLinks: new Set(reversedLinks),
        message: `Point current node's next to 'prev' (Node ${prev !== null ? prev + 1 : "null"}). Pointer reversed!`,
        lineNumber: 6,
        variables: { prev: prev !== null ? `Node ${prev + 1}` : "null", current: `Node ${current + 1}`, next: next !== null ? `Node ${next + 1}` : "null" }
      });

      // prev = current;
      prev = current;
      newSteps.push({
        nodes: list,
        prev,
        current,
        next,
        reversedLinks: new Set(reversedLinks),
        message: "Move 'prev' pointer forward to the current node.",
        lineNumber: 7,
        variables: { prev: `Node ${prev + 1}`, current: `Node ${current + 1}`, next: next !== null ? `Node ${next + 1}` : "null" }
      });

      // current = next;
      current = next;
      newSteps.push({
        nodes: list,
        prev,
        current,
        next: null, // Reset next visually for the next iteration start
        reversedLinks: new Set(reversedLinks),
        message: "Move 'current' pointer forward to the next node.",
        lineNumber: 8,
        variables: { prev: `Node ${prev + 1}`, current: current !== null ? `Node ${current + 1}` : "null" }
      });
    }

    // Final while check
    newSteps.push({
      nodes: list,
      prev,
      current: null,
      next: null,
      reversedLinks: new Set(reversedLinks),
      message: "Current is null, the loop ends.",
      lineNumber: 4,
      variables: { prev: `Node ${prev + 1}`, current: "null" }
    });

    // return prev;
    newSteps.push({
      nodes: list,
      prev,
      current: null,
      next: null,
      reversedLinks: new Set(reversedLinks),
      message: "Return 'prev' as the new head of the reversed list.",
      lineNumber: 10,
      variables: { return: `Node ${prev! + 1}` }
    });

    return newSteps;
  }, []);

  const currentStep = steps[currentStepIndex];

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

  return (
    <div className="space-y-6">
      <StepControls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={() => setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
        onStepBack={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
        onReset={() => {
          setCurrentStepIndex(0);
          setIsPlaying(false);
        }}
        isPlaying={isPlaying}
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
        speed={speed}
        onSpeedChange={setSpeed}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 border space-y-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Linked List View</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-primary border border-primary"></div>
                <span className="text-foreground text-[10px] sm:text-xs">Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-orange-500 border border-orange-500"></div>
                <span className="text-foreground text-[10px] sm:text-xs">Prev</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-blue-500 border border-blue-500"></div>
                <span className="text-foreground text-[10px] sm:text-xs">Next</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-12">
            <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-6 pb-4 max-w-full">
              {currentStep.nodes.map((val, idx) => {
                const isCurrent = currentStep.current === idx;
                const isPrev = currentStep.prev === idx;
                const isNext = currentStep.next === idx;
                const isReversed = currentStep.reversedLinks.has(idx);

                return (
                  <div key={idx} className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-xs border-2 transition-all duration-300 ${isCurrent
                      ? "bg-primary/20 border-primary text-foreground scale-110 shadow-md z-10"
                      : isPrev
                        ? "bg-orange-500/20 border-orange-500 text-foreground"
                        : isNext
                          ? "bg-blue-500/20 border-blue-500 text-foreground"
                          : "bg-muted border-border text-foreground"
                      }`}>
                      {val}
                    </div>
                    {idx < currentStep.nodes.length - 1 && (
                      <div className={`flex items-center justify-center w-4 text-foreground font-bold transition-all duration-300 ${isReversed ? "rotate-180" : ""}`}>
                        →
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-accent/30 rounded-lg border border-accent/20">
            <p className="text-sm font-medium leading-relaxed text-foreground">{currentStep.message}</p>
          </div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <AnimatedCodeEditor
          code={code}
          highlightedLines={[currentStep.lineNumber]}
          language="TypeScript"
        />
      </div>
    </div>
  );
};
