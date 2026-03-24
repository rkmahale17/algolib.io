import React, { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ListNode {
  val: number;
  next: ListNode | null;
}

interface Step {
  allLists: number[][];
  l1: number[] | null;
  l2: number[] | null;
  mergedBuilder: number[];
  phase: 'global' | 'merging' | 'complete';
  explanation: string;
  highlightedLines: number[];
  variables: Record<string, any>;
}

export const MergeKSortedListsVisualization = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const initialLists = [
    [1, 4, 5],
    [1, 3, 4],
    [2, 6]
  ];

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [];
    let lists: number[][] = initialLists.map(l => [...l]);

    s.push({
      allLists: lists.map(l => [...l]),
      l1: null, l2: null, mergedBuilder: [],
      phase: 'global',
      explanation: "Starting mergeKLists with sorted linked lists.",
      highlightedLines: [1],
      variables: { totalLists: lists.length }
    });

    s.push({
      allLists: lists.map(l => [...l]),
      l1: null, l2: null, mergedBuilder: [],
      phase: 'global',
      explanation: "Check for base case: if lists array is empty or null.",
      highlightedLines: [2],
      variables: { totalLists: lists.length }
    });

    while (lists.length > 1) {
      s.push({
        allLists: lists.map(l => [...l]),
        l1: null, l2: null, mergedBuilder: [],
        phase: 'global',
        explanation: `Main loop: lists.length = ${lists.length} > 1. Start a new round of pairwise merging. This Divide & Conquer strategy reduces the number of lists logarithmically.`,
        highlightedLines: [6],
        variables: { currentListsCount: lists.length }
      });

      const mergedLists: number[][] = [];
      s.push({
        allLists: lists.map(l => [...l]),
        l1: null, l2: null, mergedBuilder: [],
        phase: 'global',
        explanation: "Initialize an empty array to store the results of this round's merges.",
        highlightedLines: [7],
        variables: { mergedProgress: "[]" }
      });

      for (let i = 0; i < lists.length; i += 2) {
        const l1 = lists[i];
        const l2 = (i + 1 < lists.length) ? lists[i + 1] : null;

        s.push({
          allLists: lists.map(l => [...l]),
          l1, l2, mergedBuilder: [],
          phase: 'merging',
          explanation: `Pick two adjacent lists (at index ${i} and ${i + 1}) to merge into a single sorted list.`,
          highlightedLines: [9, 10, 11],
          variables: { i, l1Size: l1?.length || 0, l2Size: l2?.length || 0 }
        });

        // Simulating mergeTwoLists
        const merged: number[] = [];
        if (l1 && l2) {
          let ptr1 = 0;
          let ptr2 = 0;

          s.push({
            allLists: lists.map(l => [...l]),
            l1, l2, mergedBuilder: [],
            phase: 'merging',
            explanation: "Call mergeTwoLists. Create a dummy node to act as a placeholder for the head of the new merged list.",
            highlightedLines: [20, 21],
            variables: { l1: `[${l1.join(',')}]`, l2: `[${l2.join(',')}]`, dummy: "initialized" }
          });

          while (ptr1 < l1.length && ptr2 < l2.length) {
            s.push({
              allLists: lists.map(l => [...l]),
              l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
              phase: 'merging',
              explanation: `Iteration check: both lists still have nodes. Compare current values: ${l1[ptr1]} and ${l2[ptr2]}.`,
              highlightedLines: [23, 24],
              variables: { val1: l1[ptr1], val2: l2[ptr2] }
            });

            if (l1[ptr1] < l2[ptr2]) {
              const val = l1[ptr1];
              s.push({
                allLists: lists.map(l => [...l]),
                l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
                phase: 'merging',
                explanation: `${val} is smaller than ${l2[ptr2]}. Point tail.next to the node from list 1.`,
                highlightedLines: [25],
                variables: { chosen: val }
              });

              merged.push(val);
              ptr1++;
              s.push({
                allLists: lists.map(l => [...l]),
                l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
                phase: 'merging',
                explanation: `Shift list 1 pointer to the next node and advance the tail.`,
                highlightedLines: [26, 31],
                variables: { ptr1, mergedSize: merged.length }
              });
            } else {
              const val = l2[ptr2];
              s.push({
                allLists: lists.map(l => [...l]),
                l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
                phase: 'merging',
                explanation: `${val} is smaller than or equal to ${l1[ptr1]}. Point tail.next to the node from list 2.`,
                highlightedLines: [28],
                variables: { chosen: val }
              });

              merged.push(val);
              ptr2++;
              s.push({
                allLists: lists.map(l => [...l]),
                l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
                phase: 'merging',
                explanation: `Shift list 2 pointer to the next node and advance the tail.`,
                highlightedLines: [29, 31],
                variables: { ptr2, mergedSize: merged.length }
              });
            }
          }

          if (ptr1 < l1.length || ptr2 < l2.length) {
            const remaining = (ptr1 < l1.length) ? l1.slice(ptr1) : l2.slice(ptr2);
            s.push({
              allLists: lists.map(l => [...l]),
              l1: ptr1 < l1.length ? l1.slice(ptr1) : null,
              l2: ptr2 < l2.length ? l2.slice(ptr2) : null,
              mergedBuilder: [...merged],
              phase: 'merging',
              explanation: "One list is empty. Attach all remaining nodes from the other list in O(1) time by re-linking the next pointer.",
              highlightedLines: [34],
              variables: { remainingSize: remaining.length }
            });
            merged.push(...remaining);
          }

          s.push({
            allLists: lists.map(l => [...l]),
            l1: null, l2: null, mergedBuilder: [...merged],
            phase: 'merging',
            explanation: "Merge pair complete. Return dummy.next to get the new head.",
            highlightedLines: [35],
            variables: { mergedList: `[${merged.join(',')}]` }
          });
        } else {
          // If l2 is null, just push l1
          merged.push(...(l1 || []));
          s.push({
            allLists: lists.map(l => [...l]),
            l1: null, l2: null, mergedBuilder: [...merged],
            phase: 'merging',
            explanation: "Only one list left in this round (odd number of lists). No merge needed, just pass it to the next round.",
            highlightedLines: [12],
            variables: { merged: `[${merged.join(',')}]` }
          });
        }

        mergedLists.push(merged);
        s.push({
          allLists: lists.map(l => [...l]),
          l1: null, l2: null, mergedBuilder: [],
          phase: 'global',
          explanation: `Store the result of the merge back into our pool of sorted lists. Current pool size: ${mergedLists.length}`,
          highlightedLines: [12],
          variables: { mergedListsSize: mergedLists.length }
        });
      }

      lists = mergedLists;
      s.push({
        allLists: lists.map(l => [...l]),
        l1: null, l2: null, mergedBuilder: [],
        phase: 'global',
        explanation: "Round complete. We've replaced the original lists with their merged results, effectively halving the number of lists.",
        highlightedLines: [14],
        variables: { remainingLists: lists.length }
      });
    }

    s.push({
      allLists: lists.map(l => [...l]),
      l1: null, l2: null, mergedBuilder: [],
      phase: 'complete',
      explanation: "Process complete! All lists have been merged into a single sorted linked list. Return the final head.",
      highlightedLines: [17],
      variables: { finalSize: lists[0]?.length || 0 }
    });

    return s;
  }, [initialLists]);

  const code = `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    if (!lists || lists.length === 0) {
        return null;
    }

    while (lists.length > 1) {
        const mergedLists: Array<ListNode | null> = [];

        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i] || null;
            const l2 = (i + 1 < lists.length) ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        lists = mergedLists;
    }

    return lists[0] || null;

    function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
        const dummy = { val: -1, next: null };
        let tail = dummy;

        while (l1 && l2) {
            if (l1.val < l2.val) {
                tail.next = l1;
                l1 = l1.next;
            } else {
                tail.next = l2;
                l2 = l2.next;
            }
            tail = tail.next;
        }

        tail.next = l1 || l2;
        return dummy.next;
    }
}`;

  const step = steps[currentStep];

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
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
                            className="w-10 h-10 bg-accent/10 border-2 border-accent/30 rounded-lg flex items-center justify-center font-bold text-sm text-accent-foreground"
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

          <AnimatePresence>
            {step.phase === 'merging' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="p-6 bg-primary/5 border-primary/30 relative overflow-hidden">
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
                              initial={{ scale: 0, x: -10 }}
                              animate={{ scale: 1, x: 0 }}
                              className="w-8 h-8 bg-primary/20 border-2 border-primary/50 text-primary rounded flex items-center justify-center text-xs font-black shadow-sm shrink-0"
                            >
                              {v}
                            </motion.div>
                            {i < step.mergedBuilder.length - 1 && (
                              <ArrowRight size={12} className="text-primary/30" />
                            )}
                          </React.Fragment>
                        ))}
                        {(step.l1?.length || 0 > 0 || step.l2?.length || 0 > 0) && step.mergedBuilder.length > 0 && (
                          <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <ArrowRight size={12} className="text-muted-foreground/20" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="p-4 bg-muted/30 border-border">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-1 h-3 bg-primary rounded-full" />
              Educational Insight
            </h4>
            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-foreground/80 font-medium">
                {step.explanation}
              </p>
              <div className="pt-3 border-t border-border/50">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Why Divide & Conquer?</h5>
                <ul className="text-[10px] space-y-1.5 text-muted-foreground list-disc pl-3">
                  <li><strong>Time Complexity:</strong> O(N log k) where N is total nodes and k is number of lists.</li>
                  <li><strong>Space Complexity:</strong> O(1) in this iterative version as we reuse pointers.</li>
                  <li><strong>Mechanism:</strong> Instead of merging 1st into 2nd, then 2nd into 3rd (O(N*k)), we merge in pairs (O(N log k)).</li>
                </ul>
              </div>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
      controls={
        <SimpleStepControls
          currentStep={currentStep}
          totalSteps={steps.length}
          onStepChange={setCurrentStep}
        />
      }
    />
  );
};
