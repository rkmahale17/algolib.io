import React, { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

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
  explanation: string;
  pseudoStep: string;
  lineNumber: number;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  python: `def reorderList(head: Optional[ListNode]) -> Optional[ListNode]:
  if not head or not head.next:
      return head
  slow = head
  fast = head
  while fast and fast.next:
      slow = slow.next
      fast = fast.next.next
  second = slow.next
  slow.next = None
  prev = None
  curr = second
  while curr:
      nxt = curr.next
      curr.next = prev
      prev = curr
      curr = nxt
  second = prev
  first = head
  while second:
      tmp1 = first.next
      tmp2 = second.next
      first.next = second
      second.next = tmp1
      first = tmp1
      second = tmp2`,

  typescript: `function reorderList(head: ListNode | null): void {
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
}`,

  java: `public class Solution {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) {
            return;
        }
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode second = slow.next;
        slow.next = null;
        ListNode prev = null;
        ListNode curr = second;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        second = prev;
        ListNode first = head;
        while (second != null) {
            ListNode tmp1 = first.next;
            ListNode tmp2 = second.next;
            first.next = second;
            second.next = tmp1;
            first = tmp1;
            second = tmp2;
        }
    }
}`,

  cpp: `class Solution {
 public:
    void reorderList(ListNode* head) {
        if (head == nullptr || head->next == nullptr) {
            return;
        }
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* second = slow->next;
        slow->next = nullptr;
        ListNode* prev = nullptr;
        ListNode* curr = second;
        while (curr != nullptr) {
            ListNode* next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
        }
        second = prev;
        ListNode* first = head;
        while (second != nullptr) {
            ListNode* tmp1 = first->next;
            ListNode* tmp2 = second->next;
            first->next = second;
            second->next = tmp1;
            first = tmp1;
            second = tmp2;
        }
    }
};`
};

const generateVisualizationData = () => {
  const list = [1, 2, 3, 4, 5];
  const steps: Step[] = [];
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

  let connections: Record<number, number | null> = { 0: 1, 1: 2, 2: 3, 3: 4, 4: null };

  const createSnap = (overrides: Partial<Step>, tsLine: number, pyLine: number, javaLine: number, cppLine: number) => {
    steps.push({
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
      explanation: overrides.explanation || '',
      pseudoStep: overrides.pseudoStep || '',
      lineNumber: tsLine,
      variables: overrides.variables || {},
      ...overrides
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  // 1. Initial State
  createSnap({
    explanation: "Starting reorder list algorithm with input [1, 2, 3, 4, 5].",
    pseudoStep: "CALL reorderList(head)",
    variables: { head: '[1, 2, 3, 4, 5]' }
  }, 1, 1, 2, 3);

  // 2. Check head/next null
  createSnap({
    explanation: "Check if the list is empty or has only one node. If so, return head.",
    pseudoStep: "IF head IS null OR head.next IS null -> RETURN",
    variables: { head: 'Node 1', "head.next": 'Node 2' }
  }, 2, 2, 3, 4);

  let slow = 0, fast = 0;
  // 3. Initialize slow
  createSnap({
    slow,
    explanation: "Initialize slow pointer to the head of the list.",
    pseudoStep: "SET slow = head",
    variables: { head: 'Node 1', slow: 'Node 1' }
  }, 3, 4, 6, 7);

  // 4. Initialize fast
  createSnap({
    slow, fast,
    explanation: "Initialize fast pointer to the head of the list.",
    pseudoStep: "SET fast = head",
    variables: { slow: 'Node 1', fast: 'Node 1' }
  }, 4, 5, 7, 8);

  while (fast !== null && connections[fast] !== null) {
    // 5. Loop check
    createSnap({
      slow, fast,
      explanation: "Check while loop condition: fast and fast.next are not null.",
      pseudoStep: `WHILE fast AND fast.next → Node ${list[fast]} ≠ null`,
      variables: { fast: `Node ${list[fast]}`, "fast.next": `Node ${list[connections[fast]!]}` }
    }, 5, 6, 8, 9);

    // 6. Move slow
    slow = connections[slow]!;
    createSnap({
      slow, fast,
      explanation: "Advance slow pointer by one node.",
      pseudoStep: "SET slow = slow.next",
      variables: { slow: `Node ${list[slow]}`, fast: `Node ${list[fast]}` }
    }, 6, 7, 9, 10);

    // 7. Move fast
    fast = connections[connections[fast]!]!;
    createSnap({
      slow, fast,
      explanation: "Advance fast pointer by two nodes.",
      pseudoStep: "SET fast = fast.next.next",
      variables: { slow: `Node ${list[slow]}`, fast: fast !== null ? `Node ${list[fast]}` : 'null' }
    }, 7, 8, 10, 11);
  }

  // 8. Loop check failed
  createSnap({
    slow, fast,
    explanation: "Fast pointer reached the end of the list. Loop terminates.",
    pseudoStep: "WHILE fast AND fast.next → FALSE ✗",
    variables: { fast: fast !== null ? `Node ${list[fast]}` : 'null', slow: `Node ${list[slow]}` }
  }, 5, 6, 8, 9);

  let secondHalfHead: number | null = connections[slow];
  // 9. Get head of second half
  createSnap({
    slow, secondHalfHead,
    explanation: "Set secondHalfHead to the node after slow.",
    pseudoStep: "SET second = slow.next",
    variables: { slow: `Node ${list[slow]}`, secondHalfHead: secondHalfHead !== null ? `Node ${list[secondHalfHead]}` : 'null' }
  }, 9, 9, 12, 13);

  // 10. Split first and second halves
  connections[slow] = null;
  createSnap({
    slow, secondHalfHead,
    explanation: "Disconnect the first half from the second half by setting slow.next to null.",
    pseudoStep: "SET slow.next = null",
    variables: { "slow.next": 'null', secondHalfHead: `Node ${list[secondHalfHead!]}` }
  }, 10, 10, 13, 14);

  let prev: number | null = null;
  // 11. Reversal prev = null
  createSnap({
    phase: 'reverse',
    prev,
    explanation: "Begin reversing the second half. Initialize prev pointer to null.",
    pseudoStep: "SET prev = null",
    variables: { prev: 'null' }
  }, 11, 11, 14, 15);

  let current: number | null = secondHalfHead;
  // 12. Reversal curr = second
  createSnap({
    phase: 'reverse',
    current, prev,
    explanation: "Initialize current pointer to the head of the second half.",
    pseudoStep: "SET curr = second",
    variables: { current: `Node ${list[current!]}`, prev: 'null' }
  }, 12, 12, 15, 16);

  while (current !== null) {
    // 13. Reversal loop check
    createSnap({
      phase: 'reverse',
      current, prev,
      explanation: "Loop condition: is current pointer not null?",
      pseudoStep: `WHILE curr → Node ${list[current]} ≠ null`,
      variables: { current: `Node ${list[current]}` }
    }, 13, 13, 16, 17);

    let nextNode: number | null = connections[current];
    // 14. Reversal store next
    createSnap({
      phase: 'reverse',
      current, prev, nextNode,
      explanation: "Temporarily store current's next node.",
      pseudoStep: "SET next = curr.next",
      variables: { current: `Node ${list[current]}`, next: nextNode !== null ? `Node ${list[nextNode]}` : 'null' }
    }, 14, 14, 17, 18);

    connections[current] = prev;
    // 15. Reversal point back
    createSnap({
      phase: 'reverse',
      current, prev, nextNode,
      explanation: "Point current's next link backward to the prev node.",
      pseudoStep: "SET curr.next = prev",
      variables: { "current.next": prev !== null ? `Node ${list[prev]}` : 'null' }
    }, 15, 15, 18, 19);

    prev = current;
    // 16. Reversal move prev
    createSnap({
      phase: 'reverse',
      current, prev, nextNode,
      explanation: "Move prev pointer forward to current.",
      pseudoStep: "SET prev = curr",
      variables: { prev: `Node ${list[prev]}` }
    }, 16, 16, 19, 20);

    current = nextNode;
    // 17. Reversal move curr
    createSnap({
      phase: 'reverse',
      current, prev,
      explanation: "Move current pointer forward to the stored next node.",
      pseudoStep: "SET curr = next",
      variables: { current: current !== null ? `Node ${list[current]}` : 'null' }
    }, 17, 17, 20, 21);
  }

  // 18. Reversal complete loop check failed
  secondHalfHead = prev;
  createSnap({
    phase: 'reverse',
    secondHalfHead,
    explanation: "Current is null. Reversal is complete. Set secondHalfHead to the new head (prev).",
    pseudoStep: "SET second = prev",
    variables: { secondHalfHead: `Node ${list[secondHalfHead!]}` }
  }, 19, 18, 22, 23);

  let firstHalfCurrent: number | null = 0;
  // 19. Merge first = head
  createSnap({
    phase: 'merge',
    firstHalfCurrent,
    explanation: "Initialize firstHalfCurrent pointer to the head of the first half.",
    pseudoStep: "SET first = head",
    variables: { firstHalfCurrent: 'Node 1' }
  }, 20, 19, 23, 24);

  let secondHalfCurrent: number | null = secondHalfHead;
  // 20. Merge second = prev
  createSnap({
    phase: 'merge',
    firstHalfCurrent, secondHalfCurrent,
    explanation: "Initialize secondHalfCurrent pointer to the head of the reversed second half.",
    pseudoStep: "SET second = prev",
    variables: { firstHalfCurrent: 'Node 1', secondHalfCurrent: `Node ${list[secondHalfCurrent!]}` }
  }, 21, 18, 22, 23);

  while (secondHalfCurrent !== null) {
    // 21. Merge loop check
    createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent,
      explanation: "Loop condition: is secondHalfCurrent not null?",
      pseudoStep: `WHILE second → Node ${list[secondHalfCurrent]} ≠ null`,
      variables: { secondHalfCurrent: `Node ${list[secondHalfCurrent]}` }
    }, 22, 20, 24, 25);

    let firstHalfNext: number | null = connections[firstHalfCurrent!];
    // 22. Merge store first next
    createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent, firstHalfNext,
      explanation: "Temporarily store the next node in the first half.",
      pseudoStep: "SET tmp1 = first.next",
      variables: { firstHalfNext: firstHalfNext !== null ? `Node ${list[firstHalfNext]}` : 'null' }
    }, 23, 21, 25, 26);

    let secondHalfNext: number | null = connections[secondHalfCurrent];
    // 23. Merge store second next
    createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
      explanation: "Temporarily store the next node in the second half.",
      pseudoStep: "SET tmp2 = second.next",
      variables: { secondHalfNext: secondHalfNext !== null ? `Node ${list[secondHalfNext]}` : 'null' }
    }, 24, 22, 26, 27);

    connections[firstHalfCurrent!] = secondHalfCurrent;
    // 24. Merge point first to second
    createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
      explanation: "Connect current node in first half to current node in second half.",
      pseudoStep: "SET first.next = second",
      variables: { "firstHalfCurrent.next": `Node ${list[secondHalfCurrent]}` }
    }, 25, 23, 27, 28);

    connections[secondHalfCurrent] = firstHalfNext;
    // 25. Merge point second to first next
    createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
      explanation: "Connect current node in second half to original next node in first half.",
      pseudoStep: "SET second.next = tmp1",
      variables: { "secondHalfCurrent.next": firstHalfNext !== null ? `Node ${list[firstHalfNext]}` : 'null' }
    }, 26, 24, 28, 29);

    firstHalfCurrent = firstHalfNext;
    // 26. Merge move first
    createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent, firstHalfNext, secondHalfNext,
      explanation: "Advance first pointer forward.",
      pseudoStep: "SET first = tmp1",
      variables: { firstHalfCurrent: firstHalfCurrent !== null ? `Node ${list[firstHalfCurrent]}` : 'null' }
    }, 27, 25, 29, 30);

    secondHalfCurrent = secondHalfNext;
    // 27. Merge move second
    createSnap({
      phase: 'merge',
      firstHalfCurrent, secondHalfCurrent,
      explanation: "Advance second pointer forward.",
      pseudoStep: "SET second = tmp2",
      variables: { secondHalfCurrent: secondHalfCurrent !== null ? `Node ${list[secondHalfCurrent]}` : 'null' }
    }, 28, 26, 30, 31);
  }

  // 28. Merge loop check failed / completed
  createSnap({
    phase: 'merge',
    firstHalfCurrent, secondHalfCurrent,
    explanation: "Reordering complete. Alternating links are successfully established.",
    pseudoStep: "RETURN",
    variables: { secondHalfCurrent: 'null' }
  }, 22, 20, 24, 25);

  return { steps, stepLineNumbers };
};

export const ReorderListVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData();
  }, []);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

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
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-6 border shadow-sm flex flex-col min-h-[450px]">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
              {currentStep.phase === 'find-middle' && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
              {currentStep.phase === 'reverse' && <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />}
              {currentStep.phase === 'merge' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
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

            {/* Descriptive Commentary Box (at the bottom) */}
            <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
              <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Process Step
              </div>
              {currentStep.explanation}
            </div>
          </div>

          {/* Variable Panel (below the commentary box) */}
          <div className="pt-2">
            <VariablePanel variables={currentStep.variables} />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
