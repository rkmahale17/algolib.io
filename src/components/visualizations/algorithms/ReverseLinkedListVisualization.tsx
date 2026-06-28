import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  nodes: number[];
  prev: number | null;
  current: number | null;
  next: number | null;
  reversedLinks: Set<number>;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  python: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
  typescript: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  while (curr !== null) {
    const nextNode: ListNode | null = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}`,
  java: `public class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }
}`,
  cpp: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        ListNode* nextNode = nullptr;
        while (curr != nullptr) {
            nextNode = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }
};`,
};

const generateVisualizationData = () => {
  const list = [1, 2, 3, 4, 5];
  const steps: Step[] = [];
  const stepLineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
  const reversedLinks = new Set<number>();

  const addLines = (ts: number, py: number, java: number, cpp: number) => {
    stepLineNumbers.typescript!.push(ts);
    stepLineNumbers.python!.push(py);
    stepLineNumbers.java!.push(java);
    stepLineNumbers.cpp!.push(cpp);
  };

  // 1. Initial State / Signature
  steps.push({
    nodes: list,
    prev: null,
    current: null,
    next: null,
    reversedLinks: new Set(reversedLinks),
    explanation: "Start with the head of the list.",
    pseudoStep: "CALL reverseList(head)",
    variables: { head: "Node 1" }
  });
  addLines(1, 1, 2, 3);

  // 2. Initialize prev = null
  steps.push({
    nodes: list,
    prev: null,
    current: null,
    next: null,
    reversedLinks: new Set(reversedLinks),
    explanation: "Initialize 'prev' pointer as null.",
    pseudoStep: "SET prev = null",
    variables: { prev: "null" }
  });
  addLines(2, 2, 3, 4);

  // 3. Initialize curr = head
  steps.push({
    nodes: list,
    prev: null,
    current: 0,
    next: null,
    reversedLinks: new Set(reversedLinks),
    explanation: "Initialize 'curr' pointer as the head of the list.",
    pseudoStep: "SET curr = head",
    variables: { prev: "null", curr: "Node 1" }
  });
  addLines(3, 3, 4, 5);

  let prev: number | null = null;
  let current: number | null = 0;

  while (current !== null) {
    // 4. Loop check
    steps.push({
      nodes: list,
      prev,
      current,
      next: null,
      reversedLinks: new Set(reversedLinks),
      explanation: `Check if current node is not null. Current: Node ${current + 1}`,
      pseudoStep: `WHILE curr ≠ null → Node ${current + 1} ≠ null`,
      variables: {
        prev: prev !== null ? `Node ${prev + 1}` : "null",
        curr: `Node ${current + 1}`
      }
    });
    addLines(4, 4, 5, 7);

    // 5. Store next
    const next: number | null = current + 1 < list.length ? current + 1 : null;
    steps.push({
      nodes: list,
      prev,
      current,
      next,
      reversedLinks: new Set(reversedLinks),
      explanation: `Store the next node (Node ${next !== null ? next + 1 : "null"}) before reversing the link pointer.`,
      pseudoStep: `SET next = curr.next → Node ${next !== null ? next + 1 : "null"}`,
      variables: {
        prev: prev !== null ? `Node ${prev + 1}` : "null",
        curr: `Node ${current + 1}`,
        next: next !== null ? `Node ${next + 1}` : "null"
      }
    });
    addLines(5, 5, 6, 8);

    // 6. Reverse pointer
    reversedLinks.add(current);
    steps.push({
      nodes: list,
      prev,
      current,
      next,
      reversedLinks: new Set(reversedLinks),
      explanation: `Point current node's next to 'prev' (Node ${prev !== null ? prev + 1 : "null"}). Pointer reversed!`,
      pseudoStep: `SET curr.next = prev → Node ${prev !== null ? prev + 1 : "null"}`,
      variables: {
        prev: prev !== null ? `Node ${prev + 1}` : "null",
        curr: `Node ${current + 1}`,
        next: next !== null ? `Node ${next + 1}` : "null"
      }
    });
    addLines(6, 6, 7, 9);

    // 7. Move prev
    prev = current;
    steps.push({
      nodes: list,
      prev,
      current,
      next,
      reversedLinks: new Set(reversedLinks),
      explanation: "Move 'prev' pointer forward to the current node.",
      pseudoStep: `SET prev = curr → Node ${prev + 1}`,
      variables: {
        prev: `Node ${prev + 1}`,
        curr: `Node ${current + 1}`,
        next: next !== null ? `Node ${next + 1}` : "null"
      }
    });
    addLines(7, 7, 8, 10);

    // 8. Move curr
    current = next;
    steps.push({
      nodes: list,
      prev,
      current,
      next: null,
      reversedLinks: new Set(reversedLinks),
      explanation: "Move 'curr' pointer forward to the stored next node.",
      pseudoStep: `SET curr = next → Node ${current !== null ? current + 1 : "null"}`,
      variables: {
        prev: `Node ${prev + 1}`,
        curr: current !== null ? `Node ${current + 1}` : "null"
      }
    });
    addLines(8, 8, 9, 11);
  }

  // 9. Loop check failed
  steps.push({
    nodes: list,
    prev,
    current: null,
    next: null,
    reversedLinks: new Set(reversedLinks),
    explanation: "Current is null. The traversal is complete and loop terminates.",
    pseudoStep: "WHILE curr ≠ null → FALSE ✗",
    variables: {
      prev: `Node ${prev + 1}`,
      curr: "null"
    }
  });
  addLines(4, 4, 5, 7);

  // 10. Return result
  steps.push({
    nodes: list,
    prev,
    current: null,
    next: null,
    reversedLinks: new Set(reversedLinks),
    explanation: `Return 'prev' (Node ${prev + 1}) as the new head of the reversed list.`,
    pseudoStep: `RETURN prev → Node ${prev + 1}`,
    variables: { return: `Node ${prev + 1}` }
  });
  addLines(10, 9, 11, 13);

  return { steps, stepLineNumbers };
};

export const ReverseLinkedListVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData();
  }, []);

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <div className="space-y-6">
      {/* Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Visual Representation & Variables & Commentary */}
        <div className="bg-card rounded-lg p-6 border space-y-6 overflow-hidden flex flex-col justify-between">
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
                    <div className={`w-8 h-8 flex items-center justify-center rounded-md font-bold text-xs border-2 transition-all duration-300 ${
                      isCurrent
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

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {currentStep.explanation}
          </div>

          {/* Variable Panel (below the commentary box) */}
          <div className="pt-2">
            <VariablePanel variables={currentStep.variables} />
          </div>
        </div>

        {/* Right Column: Code panel (VisualizationCodePanel) */}
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      </div>
    </div>
  );
};
