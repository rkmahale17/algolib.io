import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { ArrowRight } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  list: number[];
  left: number | null; // index mapping relative to `list` (-1 means dummy)
  right: number | null; // index mapping relative to `list`
  nVar: number;
  explanation: string;
  pseudoStep: string;
  lineNumber: number;
  isMatch?: boolean;
  toRemove: number | null;
  removed: boolean;
}

const languages: VisualizationLanguageMap = {
  python: `def removeNthFromEnd(head: ListNode, n: int) -> ListNode:
    dummy = ListNode(0, head)
    left = dummy
    right = head
    while n > 0 and right:
        right = right.next
        n -= 1
    while right:
        left = left.next
        right = right.next
    left.next = left.next.next
    return dummy.next`,
  typescript: `function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let left: ListNode | null = dummy;
  let right: ListNode | null = head;
  while (n > 0 && right !== null) {
    right = right.next;
    n -= 1;
  }
  while (right !== null) {
    left = left!.next;
    right = right.next;
  }
  left!.next = left!.next!.next;
  return dummy.next;
}`,
  java: `public class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode left = dummy;
        ListNode right = head;
        while (n > 0 && right != null) {
            right = right.next;
            n--;
        }
        while (right != null) {
            left = left.next;
            right = right.next;
        }
        left.next = left.next.next;
        return dummy.next;
    }
}`,
  cpp: `class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* left = dummy;
        ListNode* right = head;
        while (n > 0 && right != nullptr) {
            right = right->next;
            n--;
        }
        while (right != nullptr) {
            left = left->next;
            right = right->next;
        }
        ListNode* toDelete = left->next;
        left->next = left->next->next;
        delete toDelete;
        ListNode* result = dummy->next;
        delete dummy;
        return result;
    }
};`,
};

const generateVisualizationData = () => {
  const s: Step[] = [];
  const list = [1, 2, 3, 4, 5];
  const targetN = 2;

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

  let nVar = targetN;
  let left: number | null = null;
  let right: number | null = null;

  const snap = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, isMatch: boolean = false, toRemove: number | null = null, removed: boolean = false, overrideList?: number[]) => {
    s.push({
      list: overrideList ? [...overrideList] : [...list],
      left,
      right: right !== null && right >= list.length ? null : right,
      nVar,
      explanation: msg,
      pseudoStep: pseudo,
      lineNumber: tsLine,
      isMatch,
      toRemove,
      removed
    });
    addLines(tsLine, pyLine, javaLine, cppLine);
  };

  snap("Execution starts.", "CALL removeNthFromEnd(head, n)", 1, 1, 2, 3, false);

  snap("Initialize dummy node to handle potential head removals.", "SET dummy = ListNode(0, head)", 2, 2, 3, 4, false);

  left = -1;
  snap("Initialize left pointer starting at the dummy node.", "SET left = dummy", 3, 3, 4, 5, false);

  right = 0;
  snap("Initialize right pointer starting at the head node.", "SET right = head", 4, 4, 5, 6, false);

  while (true) {
    snap(`Verify constraint check: is n (${nVar}) > 0 AND right is valid?`, `WHILE n > 0 AND right ≠ null → ${nVar} > 0?`, 5, 5, 6, 7, false);
    if (nVar > 0 && right !== null && right < list.length) {
      right += 1;
      snap("True. Advance the right pointer forward by one node.", "SET right = right.next", 6, 6, 7, 8, false);
      nVar -= 1;
      snap(`Decrement tracking variable n to ${nVar}.`, `SET n = n - 1 → n = ${nVar}`, 7, 7, 8, 9, true);
    } else {
      break;
    }
  }

  while (true) {
    snap("Verify dual sweep: does right pointer exist?", "WHILE right ≠ null", 9, 8, 10, 11, false);
    if (right !== null && right < list.length) {
      left += 1;
      snap("True. Move left pointer forward.", "SET left = left.next", 10, 9, 11, 12, false);
      right += 1;
      snap("Move right pointer forward synchronously to maintain spacing.", "SET right = right.next", 11, 10, 12, 13, true);
    } else {
      break;
    }
  }

  const toRemoveTarget = left! + 1;
  snap("Left pointer is now positioned just before the node to delete.", "SET left.next = left.next.next", 13, 11, 14, 16, true, toRemoveTarget, false);

  const resultList = [...list];
  resultList.splice(toRemoveTarget, 1);

  snap("Node removed. Return the head of the modified list (dummy.next).", "RETURN dummy.next", 14, 12, 15, 20, true, null, true, resultList);

  return { steps: s, stepLineNumbers };
};

export const RemoveNthNodeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateVisualizationData();
  }, []);

  const step = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-4">
          <Card className="p-5 bg-card/50 backdrop-blur-sm border border-border shadow-lg">
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-widest text-center">
              Pointers Topology Reference
            </h3>
            <div className="flex flex-col gap-6 p-4">
              <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-8 pb-4 pt-6">
                <div className="relative flex items-center justify-center">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-muted-foreground uppercase">
                    {step.left === -1 ? 'L' : ''}
                  </span>
                  <div className={`w-8 h-8 flex items-center justify-center rounded border-2 border-dashed font-bold text-xs transition-all shadow-sm ${
                    step.left === -1 
                      ? 'bg-primary/20 border-primary text-primary shadow-primary/20 scale-110' 
                      : 'bg-muted/30 border-muted-foreground text-muted-foreground opacity-50'
                  }`}>
                    D
                  </div>
                </div>
                <ArrowRight className="w-3 h-3 mx-1 text-muted-foreground opacity-50" />

                {step.list.map((val, idx) => {
                  const isLeft = step.left === (step.removed && idx >= step.toRemove! ? idx + 1 : idx);
                  const isRight = step.right === (step.removed && idx >= step.toRemove! ? idx + 1 : idx);
                  const isRemovedTarget = step.toRemove === idx && !step.removed;

                  return (
                    <div key={idx} className="flex items-center">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted-foreground uppercase w-10 text-center overflow-visible whitespace-nowrap">
                          {isLeft && isRight ? 'L,R' : isLeft ? 'L' : isRight ? 'R' : ''}
                        </span>
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded border-2 font-bold text-sm transition-all shadow-sm ${
                            isRemovedTarget
                              ? 'bg-destructive/20 border-destructive text-destructive scale-110 shadow-destructive/20'
                              : isLeft && isRight
                              ? 'bg-gradient-to-br from-primary/30 to-secondary/30 border-primary text-primary shadow-primary/20'
                              : isLeft
                              ? 'bg-primary/20 border-primary text-primary shadow-primary/20 scale-110'
                              : isRight
                              ? 'bg-secondary/20 border-secondary text-secondary-foreground shadow-secondary/20 scale-110'
                              : 'bg-card border-border text-foreground'
                          }`}
                        >
                          {val}
                        </div>
                      </div>
                      {idx < step.list.length - 1 && (
                        <ArrowRight className={`w-3 h-3 mx-1 transition-all ${
                          step.removed && step.toRemove === idx ? 'text-destructive scale-125' : 'text-muted-foreground opacity-50'
                        }`} />
                      )}
                    </div>
                  );
                })}

                <ArrowRight className="w-3 h-3 mx-1 text-muted-foreground opacity-50" />
                <div className="relative flex items-center justify-center">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-muted-foreground uppercase">
                    {step.right === null && step.left !== null ? 'R' : ''}
                  </span>
                  <div className={`w-8 h-8 px-1 flex items-center justify-center rounded border-2 border-dashed font-bold text-[10px] transition-all shadow-sm ${
                    step.right === null && step.left !== null 
                      ? 'bg-secondary/20 border-secondary text-secondary-foreground shadow-secondary/20 scale-110' 
                      : 'bg-muted/30 border-muted-foreground text-muted-foreground opacity-30'
                  }`}>
                    NUL
                  </div>
                </div>
              </div>

              <div className="flex gap-4 text-xs font-mono justify-center items-center flex-wrap pt-4 border-t border-border">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  <span className="text-primary font-bold text-[10px] uppercase tracking-wider">Left Pointer</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-secondary/10 border border-secondary/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                  <span className="text-secondary-foreground font-bold text-[10px] uppercase tracking-wider">Right Pointer</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-destructive/10 border border-destructive/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                  <span className="text-destructive font-bold text-[10px] uppercase tracking-wider">To Remove</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Descriptive Commentary Box (at the bottom) */}
          <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
            <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Process Step
            </div>
            {step.explanation}
          </div>

          {/* Variable Panel (below the commentary box) */}
          <div className="pt-2">
            <VariablePanel
              variables={{
                "n": step.nVar,
                "left": step.left === -1 ? 'dummy node [val: 0]' : step.left !== null ? `node[${step.left}] -> ${step.list[step.left]}` : 'null',
                "right": step.right !== null ? `node[${step.right}] -> ${step.list[step.right]}` : 'null',
              }}
            />
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
