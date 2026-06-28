import React, { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  allLists: number[][];
  l1: number[] | null;
  l2: number[] | null;
  mergedBuilder: number[];
  phase: 'global' | 'merging' | 'complete';
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

// ─── Hardcoded code per language (No comments, no blank lines) ───────────────
const languages: VisualizationLanguageMap = {
  python: `def mergeKLists(lists: List[Optional[ListNode]]) -> Optional[ListNode]:
    def mergeTwoLists(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        tail = dummy
        while l1 and l2:
            if l1.val < l2.val:
                tail.next = l1
                l1 = l1.next
            else:
                tail.next = l2
                l2 = l2.next
            tail = tail.next
        if l1:
            tail.next = l1
        elif l2:
            tail.next = l2
        return dummy.next
    if not lists:
        return None
    if len(lists) == 1:
        return lists[0]
    mid = len(lists) // 2
    left = mergeKLists(lists[:mid])
    right = mergeKLists(lists[mid:])
    return mergeTwoLists(left, right)`,

  typescript: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    if (!lists || lists.length === 0) {
        return null;
    }
    function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
        const dummy = new ListNode();
        let tail: ListNode = dummy;
        while (l1 !== null && l2 !== null) {
            if (l1.val < l2.val) {
                tail.next = l1;
                l1 = l1.next;
            } else {
                tail.next = l2;
                l2 = l2.next;
            }
            tail = tail.next!;
        }
        if (l1 !== null) {
            tail.next = l1;
        } else if (l2 !== null) {
            tail.next = l2;
        }
        return dummy.next;
    }
    let mergedList: ListNode | null = null;
    for (let i = 0; i < lists.length; i++) {
        mergedList = mergeTwoLists(mergedList, lists[i]);
    }
    return mergedList;
}`,

  java: `public class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) {
            return null;
        }
        return mergeKListsHelper(lists, 0, lists.length - 1);
    }
    private ListNode mergeKListsHelper(ListNode[] lists, int start, int end) {
        if (start == end) {
            return lists[start];
        }
        int mid = start + (end - start) / 2;
        ListNode left = mergeKListsHelper(lists, start, mid);
        ListNode right = mergeKListsHelper(lists, mid + 1, end);
        return mergeTwoLists(left, right);
    }
    private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode();
        ListNode tail = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val < l2.val) {
                tail.next = l1;
                l1 = l1.next;
            } else {
                tail.next = l2;
                l2 = l2.next;
            }
            tail = tail.next;
        }
        if (l1 != null) {
            tail.next = l1;
        } else {
            tail.next = l2;
        }
        return dummy.next;
    }
}`,

  cpp: `class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);
        for (ListNode* head : lists) {
            if (head) {
                heap.push(head);
            }
        }
        ListNode* dummy = new ListNode(0);
        ListNode* current = dummy;
        while (!heap.empty()) {
            ListNode* node = heap.top();
            heap.pop();
            current->next = node;
            current = current->next;
            if (node->next) {
                heap.push(node->next);
            }
        }
        return dummy->next;
    }
};`
};

// ─── Step Generator ──────────────────────────────────────────────────────────
function generateVisualizationData() {
  const initialLists = [
    [1, 4, 5],
    [1, 3, 4],
    [2, 6]
  ];

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

  let lists: number[][] = initialLists.map(l => [...l]);

  steps.push({
    allLists: lists.map(l => [...l]),
    l1: null,
    l2: null,
    mergedBuilder: [],
    phase: 'global',
    explanation: "Starting mergeKLists with sorted linked lists.",
    pseudoStep: "CALL mergeKLists(lists)",
    variables: { totalLists: lists.length }
  });
  addLines(1, 1, 2, 3);

  steps.push({
    allLists: lists.map(l => [...l]),
    l1: null,
    l2: null,
    mergedBuilder: [],
    phase: 'global',
    explanation: "Check for base case: if the input array of lists is empty or null.",
    pseudoStep: "IF lists IS EMPTY -> RETURN null",
    variables: { totalLists: lists.length }
  });
  addLines(2, 18, 3, 6);

  while (lists.length > 1) {
    steps.push({
      allLists: lists.map(l => [...l]),
      l1: null,
      l2: null,
      mergedBuilder: [],
      phase: 'global',
      explanation: `Main loop: lists.length = ${lists.length} > 1. Start a new round of pairwise merging. This Divide & Conquer strategy reduces the number of lists logarithmically.`,
      pseudoStep: `WHILE lists.length = ${lists.length} > 1`,
      variables: { currentListsCount: lists.length }
    });
    addLines(26, 22, 12, 13);

    const mergedLists: number[][] = [];
    steps.push({
      allLists: lists.map(l => [...l]),
      l1: null,
      l2: null,
      mergedBuilder: [],
      phase: 'global',
      explanation: "Initialize an empty array to store the results of this round's merges.",
      pseudoStep: "SET mergedLists = []",
      variables: { mergedProgress: "[]" }
    });
    addLines(25, 22, 12, 11);

    for (let i = 0; i < lists.length; i += 2) {
      const l1 = lists[i];
      const l2 = (i + 1 < lists.length) ? lists[i + 1] : null;

      steps.push({
        allLists: lists.map(l => [...l]),
        l1,
        l2,
        mergedBuilder: [],
        phase: 'merging',
        explanation: `Pick adjacent lists (at index ${i} and ${i + 1}) to merge.`,
        pseudoStep: `FOR i = ${i}: l1 = lists[${i}], l2 = lists[${i + 1}]`,
        variables: { i, l1Size: l1?.length || 0, l2Size: l2?.length || 0 }
      });
      addLines(27, 23, 13, 14);

      const merged: number[] = [];
      if (l1 && l2) {
        let ptr1 = 0;
        let ptr2 = 0;

        steps.push({
          allLists: lists.map(l => [...l]),
          l1,
          l2,
          mergedBuilder: [],
          phase: 'merging',
          explanation: "Call mergeTwoLists. Create a dummy node as a placeholder for the head of the new merged list.",
          pseudoStep: "CALL mergeTwoLists(l1, l2) -> dummy = {val: 0, next: null}",
          variables: { l1: `[${l1.join(',')}]`, l2: `[${l2.join(',')}]`, dummy: "initialized" }
        });
        addLines(6, 3, 18, 11);

        while (ptr1 < l1.length && ptr2 < l2.length) {
          steps.push({
            allLists: lists.map(l => [...l]),
            l1: l1.slice(ptr1),
            l2: l2.slice(ptr2),
            mergedBuilder: [...merged],
            phase: 'merging',
            explanation: `Iteration check: compare head values: l1 = ${l1[ptr1]}, l2 = ${l2[ptr2]}.`,
            pseudoStep: `WHILE l1 AND l2 -> COMPARE l1.val (${l1[ptr1]}) AND l2.val (${l2[ptr2]})`,
            variables: { val1: l1[ptr1], val2: l2[ptr2] }
          });
          addLines(8, 5, 20, 13);

          if (l1[ptr1] < l2[ptr2]) {
            const val = l1[ptr1];
            steps.push({
              allLists: lists.map(l => [...l]),
              l1: l1.slice(ptr1),
              l2: l2.slice(ptr2),
              mergedBuilder: [...merged],
              phase: 'merging',
              explanation: `Value ${val} is smaller than ${l2[ptr2]}. Point tail.next to l1 node.`,
              pseudoStep: `IF l1.val (${val}) < l2.val (${l2[ptr2]}) -> tail.next = l1`,
              variables: { chosen: val }
            });
            addLines(10, 7, 22, 16);

            merged.push(val);
            ptr1++;
            steps.push({
              allLists: lists.map(l => [...l]),
              l1: l1.slice(ptr1),
              l2: l2.slice(ptr2),
              mergedBuilder: [...merged],
              phase: 'merging',
              explanation: "Advance l1 pointer and move tail forward to the newly added node.",
              pseudoStep: "SET l1 = l1.next, tail = tail.next",
              variables: { ptr1, mergedSize: merged.length }
            });
            addLines(11, 8, 23, 17);
          } else {
            const val = l2[ptr2];
            steps.push({
              allLists: lists.map(l => [...l]),
              l1: l1.slice(ptr1),
              l2: l2.slice(ptr2),
              mergedBuilder: [...merged],
              phase: 'merging',
              explanation: `Value ${val} is smaller than or equal to ${l1[ptr1]}. Point tail.next to l2 node.`,
              pseudoStep: `ELSE -> tail.next = l2`,
              variables: { chosen: val }
            });
            addLines(13, 10, 25, 16);

            merged.push(val);
            ptr2++;
            steps.push({
              allLists: lists.map(l => [...l]),
              l1: l1.slice(ptr1),
              l2: l2.slice(ptr2),
              mergedBuilder: [...merged],
              phase: 'merging',
              explanation: "Advance l2 pointer and move tail forward to the newly added node.",
              pseudoStep: "SET l2 = l2.next, tail = tail.next",
              variables: { ptr2, mergedSize: merged.length }
            });
            addLines(14, 11, 26, 17);
          }
        }

        if (ptr1 < l1.length || ptr2 < l2.length) {
          const remaining = (ptr1 < l1.length) ? l1.slice(ptr1) : l2.slice(ptr2);
          steps.push({
            allLists: lists.map(l => [...l]),
            l1: ptr1 < l1.length ? l1.slice(ptr1) : null,
            l2: ptr2 < l2.length ? l2.slice(ptr2) : null,
            mergedBuilder: [...merged],
            phase: 'merging',
            explanation: "One list is empty. Link remaining nodes of the other list directly to tail.next.",
            pseudoStep: "SET tail.next = l1 OR l2",
            variables: { remainingSize: remaining.length }
          });
          addLines(18, 13, 30, 18);
          merged.push(...remaining);
        }

        steps.push({
          allLists: lists.map(l => [...l]),
          l1: null,
          l2: null,
          mergedBuilder: [...merged],
          phase: 'merging',
          explanation: "Merge pair complete. Return dummy.next as the head of this merged list.",
          pseudoStep: "RETURN dummy.next",
          variables: { mergedList: `[${merged.join(',')}]` }
        });
        addLines(23, 17, 35, 22);
      } else {
        merged.push(...(l1 || []));
        steps.push({
          allLists: lists.map(l => [...l]),
          l1: null,
          l2: null,
          mergedBuilder: [...merged],
          phase: 'merging',
          explanation: "Only one list left in this round (odd list count). Pass it forward directly.",
          pseudoStep: "ADD l1 to mergedLists",
          variables: { merged: `[${merged.join(',')}]` }
        });
        addLines(29, 20, 9, 22);
      }

      mergedLists.push(merged);
      steps.push({
        allLists: lists.map(l => [...l]),
        l1: null,
        l2: null,
        mergedBuilder: [],
        phase: 'global',
        explanation: `Append merged list to our list pool. Pool size: ${mergedLists.length}`,
        pseudoStep: "APPEND merged list to mergedLists",
        variables: { mergedListsSize: mergedLists.length }
      });
      addLines(27, 25, 15, 13);
    }

    lists = mergedLists;
    steps.push({
      allLists: lists.map(l => [...l]),
      l1: null,
      l2: null,
      mergedBuilder: [],
      phase: 'global',
      explanation: "Iteration round complete. We replace original lists with merged results, halving list count.",
      pseudoStep: "SET lists = mergedLists",
      variables: { remainingLists: lists.length }
    });
    addLines(26, 25, 15, 13);
  }

  steps.push({
    allLists: lists.map(l => [...l]),
    l1: null,
    l2: null,
    mergedBuilder: [],
    phase: 'complete',
    explanation: "All lists merged into a single sorted list. Return the final head.",
    pseudoStep: "RETURN lists[0]",
    variables: { finalSize: lists[0]?.length || 0 }
  });
  addLines(29, 25, 6, 22);

  return { steps, stepLineNumbers };
}

export const MergeKSortedListsVisualization = () => {
  const { steps, stepLineNumbers } = useMemo(generateVisualizationData, []);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border border-border">
            <h3 className="text-sm font-semibold mb-6 text-muted-foreground uppercase tracking-wider">Iterative Process</h3>
            <div className="space-y-6">
              {step.allLists.map((list, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                    {idx}
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    {list.length === 0 ? (
                      <span className="text-[10px] text-muted-foreground italic">empty</span>
                    ) : (
                      list.map((val, nodeIdx) => (
                        <div key={nodeIdx} className="flex items-center">
                          <motion.div
                            layout
                            className="w-10 h-10 bg-accent/10 border-2 border-accent/30 rounded-lg flex items-center justify-center font-bold text-sm text-accent-foreground animate-none"
                          >
                            {val}
                          </motion.div>
                          {nodeIdx < list.length - 1 && (
                            <ArrowRight size={14} className="text-muted-foreground/40 mx-0.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
              {step.allLists.length === 0 && <div className="text-center py-4 text-muted-foreground italic">No lists left</div>}
            </div>
          </Card>

          <AnimatePresence mode="wait">
            {step.phase === 'merging' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1 }}
              >
                <Card className="p-6 bg-primary/5 border border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <h3 className="text-sm font-semibold mb-4 uppercase tracking-widest text-primary">Merging Sandbox</h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground w-6">L1</span>
                      <div className="flex gap-2 flex-wrap">
                        {step.l1?.map((v, i) => (
                          <div key={i} className="w-8 h-8 bg-card border rounded flex items-center justify-center text-xs font-bold">{v}</div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 min-h-[40px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground w-6">L2</span>
                      <div className="flex gap-2 flex-wrap">
                        {step.l2?.map((v, i) => (
                          <div key={i} className="w-8 h-8 bg-card border rounded flex items-center justify-center text-xs font-bold">{v}</div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-primary/20">
                      <span className="text-[10px] uppercase font-bold text-primary block mb-3">Merged Progress (Linked List)</span>
                      <div className="flex flex-wrap gap-2 items-center min-h-[40px]">
                        <div className="w-8 h-8 rounded bg-muted/50 border border-dashed border-muted-foreground/50 flex items-center justify-center text-[10px] text-muted-foreground shrink-0">
                          D
                        </div>
                        {step.mergedBuilder.length > 0 && <ArrowRight size={12} className="text-muted-foreground/30" />}
                        {step.mergedBuilder.map((v, i) => (
                          <React.Fragment key={`${i}-${v}`}>
                            <motion.div
                              layout
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.1 }}
                              className="w-8 h-8 bg-primary/20 border-2 border-primary/50 text-primary rounded flex items-center justify-center text-xs font-black shadow-sm shrink-0"
                            >
                              {v}
                            </motion.div>
                            {i < step.mergedBuilder.length - 1 && (
                              <ArrowRight size={12} className="text-primary/30" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {step.explanation}
          </div>

          <div className="bg-muted/50 rounded-lg border border-border/50 p-4">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2">Complexity Overview:</h5>
            <div className="text-[11px] space-y-1 text-muted-foreground">
              <p>• <strong>Time:</strong> O(N log k) where N is total nodes across all lists, and k is the number of lists.</p>
              <p>• <strong>Space:</strong> O(1) auxiliary space (excluding the output list) since we merge lists in-place.</p>
            </div>
          </div>

          {/* Variable Panel (below the commentary box) */}
          <div className="pt-2">
            <VariablePanel variables={step.variables} />
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
