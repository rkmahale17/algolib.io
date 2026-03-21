import { useState, useMemo } from 'react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

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
      explanation: "Starting mergeKLists with 3 sorted linked lists.",
      highlightedLines: [1],
      variables: { totalLists: lists.length }
    });

    s.push({
      allLists: lists.map(l => [...l]),
      l1: null, l2: null, mergedBuilder: [],
      phase: 'global',
      explanation: "Check if lists array is empty.",
      highlightedLines: [2],
      variables: { totalLists: lists.length }
    });

    while (lists.length > 1) {
      s.push({
        allLists: lists.map(l => [...l]),
        l1: null, l2: null, mergedBuilder: [],
        phase: 'global',
        explanation: `Outer loop: lists.length = ${lists.length} > 1. Start a new round of pairing.`,
        highlightedLines: [6],
        variables: { lists: lists.length }
      });

      const mergedLists: number[][] = [];
      s.push({
        allLists: lists.map(l => [...l]),
        l1: null, l2: null, mergedBuilder: [],
        phase: 'global',
        explanation: "Initialize an empty array for this round's merged lists.",
        highlightedLines: [7],
        variables: { mergedLists: "[]" }
      });

      for (let i = 0; i < lists.length; i += 2) {
        const l1 = lists[i];
        const l2 = (i + 1 < lists.length) ? lists[i + 1] : null;

        s.push({
          allLists: lists.map(l => [...l]),
          l1, l2, mergedBuilder: [],
          phase: 'merging',
          explanation: `Pairing lists at index ${i} and ${i + 1}.`,
          highlightedLines: [9, 10, 11],
          variables: { i, l1: l1 ? `[${l1.join(',')}]` : 'null', l2: l2 ? `[${l2.join(',')}]` : 'null' }
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
            explanation: "Initialize mergeTwoLists with a dummy node.",
            highlightedLines: [19, 20, 21],
            variables: { l1: `[${l1.join(',')}]`, l2: `[${l2.join(',')}]`, merged: "[]" }
          });

          while (ptr1 < l1.length && ptr2 < l2.length) {
            s.push({
              allLists: lists.map(l => [...l]),
              l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
              phase: 'merging',
              explanation: `Comparing ${l1[ptr1]} and ${l2[ptr2]}.`,
              highlightedLines: [23, 24],
              variables: { val1: l1[ptr1], val2: l2[ptr2] }
            });

            if (l1[ptr1] < l2[ptr2]) {
              merged.push(l1[ptr1]);
              ptr1++;
              s.push({
                allLists: lists.map(l => [...l]),
                l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
                phase: 'merging',
                explanation: `l1 value is smaller. Append to merged list and move l1 pointer.`,
                highlightedLines: [25, 26],
                variables: { added: merged[merged.length - 1], ptr1 }
              });
            } else {
              merged.push(l2[ptr2]);
              ptr2++;
              s.push({
                allLists: lists.map(l => [...l]),
                l1: l1.slice(ptr1), l2: l2.slice(ptr2), mergedBuilder: [...merged],
                phase: 'merging',
                explanation: `l2 value is smaller/equal. Append to merged list and move l2 pointer.`,
                highlightedLines: [28, 29, 31],
                variables: { added: merged[merged.length - 1], ptr2 }
              });
            }
          }

          const remaining = (ptr1 < l1.length) ? l1.slice(ptr1) : l2.slice(ptr2);
          merged.push(...remaining);
          s.push({
            allLists: lists.map(l => [...l]),
            l1: null, l2: null, mergedBuilder: [...merged],
            phase: 'merging',
            explanation: `One list exhausted. Append remaining nodes: [${remaining.join(',')}]`,
            highlightedLines: [34, 35],
            variables: { merged: `[${merged.join(',')}]` }
          });
        } else {
          // If l2 is null, just push l1
          merged.push(...(l1 || []));
          s.push({
            allLists: lists.map(l => [...l]),
            l1: null, l2: null, mergedBuilder: [...merged],
            phase: 'merging',
            explanation: "Only one list available in this pair. Pass it through.",
            highlightedLines: [12],
            variables: { merged: `[${merged.join(',')}]` }
          });
        }

        mergedLists.push(merged);
        s.push({
          allLists: lists.map(l => [...l]),
          l1: null, l2: null, mergedBuilder: [],
          phase: 'global',
          explanation: `Pushed merged pair result [${merged.join(',')}] to round's list.`,
          highlightedLines: [12],
          variables: { mergedListsSize: mergedLists.length }
        });
      }

      lists = mergedLists;
      s.push({
        allLists: lists.map(l => [...l]),
        l1: null, l2: null, mergedBuilder: [],
        phase: 'global',
        explanation: "Round complete. Update global lists array for the next pass.",
        highlightedLines: [14],
        variables: { currentLists: lists.length }
      });
    }

    s.push({
      allLists: lists.map(l => [...l]),
      l1: null, l2: null, mergedBuilder: [],
      phase: 'complete',
      explanation: "Only one list remains. Returning the final merged result.",
      highlightedLines: [17],
      variables: { resultSize: lists[0].length }
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
                  <div className="flex gap-2 flex-wrap">
                    {list.map((val, nodeIdx) => (
                      <div key={nodeIdx} className="flex items-center">
                        <motion.div
                          layout
                          className="w-10 h-10 bg-accent/10 border-2 border-accent/30 rounded-lg flex items-center justify-center font-bold text-sm"
                        >
                          {val}
                        </motion.div>
                        {nodeIdx < list.length - 1 && <span className="text-muted-foreground mx-1">→</span>}
                      </div>
                    ))}
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
                      <span className="text-[10px] uppercase font-bold text-primary block mb-2">Merged Progress</span>
                      <div className="flex flex-wrap gap-2">
                        {step.mergedBuilder.map((v, i) => (
                          <motion.div
                            key={`${i}-${v}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 bg-primary/20 border-2 border-primary/50 text-primary rounded flex items-center justify-center text-xs font-black shadow-sm"
                          >
                            {v}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <Card className="p-4 bg-muted/30 border-border">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Explanation</h4>
            <p className="text-sm leading-relaxed">{step.explanation}</p>
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
