import { useEffect, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import confetti from 'canvas-confetti';

interface ListNodeData {
  id: string;
  val: number;
  isDummy?: boolean;
}

interface Step {
  nodes: ListNodeData[];
  connections: Record<string, string | null>;
  groupPrevId: string | null;
  kthId: string | null;
  groupNextId: string | null;
  currId: string | null;
  prevId: string | null;
  tempId: string | null;
  explanation: string;
  phase: 'init' | 'loop_check' | 'reversing' | 'reconnecting' | 'done';
  pseudoStep: string;
  variables: Record<string, any>;
}

interface TestCase {
  id: string;
  name: string;
  head: number[];
  k: number;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Example 1', head: [1, 2, 3, 4, 5], k: 2 },
  { id: 'ex2', name: 'Example 2', head: [1, 2, 3, 4, 5], k: 3 },
  { id: 'ex3', name: 'Whole List', head: [10, 20, 30], k: 3 },
  { id: 'ex4', name: 'Short List', head: [1, 2], k: 2 }
];

const languages: VisualizationLanguageMap = {
  typescript: `function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;
  while (true) {
    const kth = getKth(groupPrev, k);
    if (!kth) {
      break;
    }
    const groupNext = kth.next;
    let prev = groupNext;
    let curr = groupPrev.next;
    while (curr !== groupNext) {
      const temp = curr!.next;
      curr!.next = prev;
      prev = curr;
      curr = temp;
    }
    const temp = groupPrev.next;
    groupPrev.next = kth;
    groupPrev = temp!;
  }
  return dummy.next;
}
function getKth(curr: ListNode | null, k: number): ListNode | null {
  while (curr && k > 0) {
    curr = curr.next;
    k--;
  }
  return curr;
}`,
  python: `def reverseKGroup(head: ListNode | None, k: int) -> ListNode | None:
    dummy = ListNode(0, head)
    groupPrev = dummy
    while True:
        kth = getKth(groupPrev, k)
        if not kth:
            break
        groupNext = kth.next
        prev = groupNext
        curr = groupPrev.next
        while curr != groupNext:
            temp = curr.next
            curr.next = prev
            prev = curr
            curr = temp
        temp = groupPrev.next
        groupPrev.next = kth
        groupPrev = temp
    return dummy.next

def getKth(curr: ListNode | None, k: int) -> ListNode | None:
    while curr and k > 0:
        curr = curr.next
        k -= 1
    return curr`,
  java: `public static class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode groupPrev = dummy;
        while (true) {
            ListNode kth = getKth(groupPrev, k);
            if (kth == null) {
                break;
            }
            ListNode groupNext = kth.next;
            ListNode prev = groupNext;
            ListNode curr = groupPrev.next;
            while (curr != groupNext) {
                ListNode temp = curr.next;
                curr.next = prev;
                prev = curr;
                curr = temp;
            }
            ListNode temp = groupPrev.next;
            groupPrev.next = kth;
            groupPrev = temp;
        }
        return dummy.next;
    }
    private static ListNode getKth(ListNode curr, int k) {
        while (curr != null && k > 0) {
            curr = curr.next;
            k--;
        }
        return curr;
    }
}`,
  cpp: `class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode* dummy = new ListNode(0, head);
        ListNode* groupPrev = dummy;
        while (true) {
            ListNode* kth = getKth(groupPrev, k);
            if (!kth) {
                break;
            }
            ListNode* groupNext = kth->next;
            ListNode* prev = groupNext;
            ListNode* curr = groupPrev->next;
            while (curr != groupNext) {
                ListNode* temp = curr->next;
                curr->next = prev;
                prev = curr;
                curr = temp;
            }
            ListNode* temp = groupPrev->next;
            groupPrev->next = kth;
            groupPrev = temp;
        }
        ListNode* result = dummy->next;
        delete dummy;
        return result;
    }
    ListNode* getKth(ListNode* curr, int k) {
        while (curr && k > 0) {
            curr = curr->next;
            k--;
        }
        return curr;
    }
};`
};

export const ReverseNodesInKGroupVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const vals = selectedTestCase.head;
    const k = selectedTestCase.k;

    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const allNodes: ListNodeData[] = [
      { id: 'dummy', val: 0, isDummy: true }
    ];
    vals.forEach((v, idx) => {
      allNodes.push({ id: `node-${idx}`, val: v });
    });

    const connections: Record<string, string | null> = {};
    connections['dummy'] = 'node-0';
    for (let i = 0; i < vals.length; i++) {
      connections[`node-${i}`] = i < vals.length - 1 ? `node-${i + 1}` : null;
    }

    let groupPrevId: string | null = null;
    let kthId: string | null = null;
    let groupNextId: string | null = null;
    let currId: string | null = null;
    let prevId: string | null = null;
    let tempId: string | null = null;

    const getVariables = () => {
      const getValStr = (id: string | null) => {
        if (!id) return 'null';
        if (id === 'dummy') return 'dummy(0)';
        const node = allNodes.find(n => n.id === id);
        return node ? `Node(${node.val})` : 'null';
      };
      return {
        'groupPrev': getValStr(groupPrevId),
        'kth': getValStr(kthId),
        'groupNext': getValStr(groupNextId),
        'curr': getValStr(currId),
        'prev': getValStr(prevId),
        'temp': getValStr(tempId),
        'dummy.next': getValStr(connections['dummy'])
      };
    };

    const pushStep = (
      explanation: string,
      pseudo: string,
      phase: Step['phase'],
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        nodes: allNodes.map(n => ({ ...n })),
        connections: { ...connections },
        groupPrevId,
        kthId,
        groupNextId,
        currId,
        prevId,
        tempId,
        explanation,
        pseudoStep: pseudo,
        phase,
        variables: getVariables(),
        ...variablesExtra
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    pushStep(
      `Start reverseKGroup function. We will reverse node groups of size k = ${k}.`,
      `reverseKGroup(head, k=${k})`,
      'init', {},
      1, 1, 2, 3
    );

    pushStep(
      `Create a dummy node (val: 0) pointing to the original head of the list. This handles potential updates to the head.`,
      "dummy = ListNode(0, head)",
      'init', {},
      2, 2, 3, 4
    );

    groupPrevId = 'dummy';
    pushStep(
      `Initialize groupPrev to dummy. This pointer tracks the node right before the current k-group.`,
      "groupPrev = dummy",
      'init', {},
      3, 3, 5, 5
    );

    const getKthNode = (startId: string, count: number): string | null => {
      let curr: string | null = startId;
      for (let i = 0; i < count; i++) {
        if (!curr) break;
        curr = connections[curr];
      }
      return curr;
    };

    while (true) {
      pushStep(
        `Determine the k-th node (k = ${k}) starting from groupPrev.`,
        `kth = getKth(groupPrev, ${k})`,
        'loop_check', {},
        5, 5, 7, 7
      );

      const kth = getKthNode(groupPrevId!, k);
      kthId = kth;

      if (!kth) {
        pushStep(
          `There are fewer than k (${k}) nodes left after groupPrev. Reversal loop terminates.`,
          `IF not kth: break`,
          'loop_check', {},
          6, 6, 8, 8
        );
        break;
      }

      pushStep(
        `Found the k-th node: Node ${allNodes.find(n => n.id === kthId)!.val}.`,
        `kth = Node(${allNodes.find(n => n.id === kthId)!.val})`,
        'loop_check', {},
        5, 5, 7, 7
      );

      groupNextId = connections[kthId!];
      pushStep(
        `Store the node immediately after the current group in groupNext (${groupNextId ? allNodes.find(n => n.id === groupNextId)!.val : 'null'}).`,
        "groupNext = kth.next",
        'loop_check', {},
        9, 8, 11, 11
      );

      prevId = groupNextId;
      pushStep(
        `Initialize prev pointer to groupNext. This makes the original first node of the group point to groupNext after reversal.`,
        "prev = groupNext",
        'reversing', {},
        10, 9, 12, 12
      );

      currId = connections[groupPrevId!];
      pushStep(
        `Initialize curr pointer to the first node of the current group (${currId ? allNodes.find(n => n.id === currId)!.val : 'null'}).`,
        "curr = groupPrev.next",
        'reversing', {},
        11, 10, 13, 13
      );

      while (currId !== groupNextId) {
        pushStep(
          `Check loop condition: curr (${currId ? allNodes.find(n => n.id === currId)!.val : 'null'}) !== groupNext (${groupNextId ? allNodes.find(n => n.id === groupNextId)!.val : 'null'})`,
          `WHILE curr != groupNext`,
          'reversing', {},
          12, 11, 14, 14
        );

        tempId = connections[currId!];
        pushStep(
          `Store curr's original next node in temp (${tempId ? allNodes.find(n => n.id === tempId)!.val : 'null'}).`,
          "temp = curr.next",
          'reversing', {},
          13, 12, 15, 15
        );

        connections[currId!] = prevId;
        pushStep(
          `Reverse pointer: Point curr (${allNodes.find(n => n.id === currId)!.val}) to prev (${prevId ? allNodes.find(n => n.id === prevId)!.val : 'null'}).`,
          "curr.next = prev",
          'reversing', {},
          14, 13, 16, 16
        );

        prevId = currId;
        pushStep(
          `Move prev pointer forward to curr (Node ${allNodes.find(n => n.id === currId)!.val}).`,
          "prev = curr",
          'reversing', {},
          15, 14, 17, 17
        );

        currId = tempId;
        pushStep(
          `Move curr pointer forward to temp (${currId ? allNodes.find(n => n.id === currId)!.val : 'null'}).`,
          "curr = temp",
          'reversing', {},
          16, 15, 18, 18
        );
      }

      tempId = null;
      pushStep(
        `Finished reversing current group. Prepare to reconnect.`,
        `// reversal loop finished`,
        'reversing', {},
        12, 11, 14, 14
      );

      const originalHeadId = connections[groupPrevId!];
      tempId = originalHeadId;
      pushStep(
        `Store original head of the group (Node ${allNodes.find(n => n.id === originalHeadId)!.val}) in temp. This will become the tail of the reversed segment.`,
        "temp = groupPrev.next",
        'reconnecting', {},
        18, 16, 20, 20
      );

      connections[groupPrevId!] = kthId;
      pushStep(
        `Connect groupPrev (Node ${groupPrevId === 'dummy' ? 'dummy' : allNodes.find(n => n.id === groupPrevId)!.val}) to the new head of the reversed group (Node ${allNodes.find(n => n.id === kthId)!.val}).`,
        "groupPrev.next = kth",
        'reconnecting', {},
        19, 17, 21, 21
      );

      groupPrevId = tempId;
      tempId = null;
      pushStep(
        `Update groupPrev to point to the tail of the reversed group (Node ${allNodes.find(n => n.id === groupPrevId)!.val}) in preparation for the next group.`,
        "groupPrev = temp",
        'reconnecting', {},
        20, 18, 22, 22
      );

      kthId = null;
      groupNextId = null;
      currId = null;
      prevId = null;
    }

    pushStep(
      `Return dummy.next (Node ${connections['dummy'] ? allNodes.find(n => n.id === connections['dummy'])!.val : 'null'}) as the head of the modified list.`,
      `RETURN dummy.next`,
      'done', {},
      22, 19, 24, 24
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  }, [currentStepIndex, steps]);

  if (steps.length === 0) return null;

  const { groupPrevId, kthId, groupNextId, currId, prevId, tempId } = currentStep;

  const getCardStyles = (node: ListNodeData) => {
    const isGrpPrev = groupPrevId === node.id;
    const isKth = kthId === node.id;
    const isGrpNext = groupNextId === node.id;
    const isCur = currId === node.id;
    const isPrev = prevId === node.id;
    const isTemp = tempId === node.id;

    if (node.isDummy) {
      if (isGrpPrev) {
        return 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold ring-2 ring-emerald-500/20';
      }
      return 'bg-muted/80 border-dashed border-muted-foreground/30 text-muted-foreground font-medium';
    }

    if (isCur) {
      return 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-400 font-extrabold ring-2 ring-amber-500/20';
    }
    if (isPrev) {
      return 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-400 font-extrabold ring-2 ring-indigo-500/20';
    }
    if (isGrpPrev) {
      return 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold ring-2 ring-emerald-500/20';
    }
    if (isKth) {
      return 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 font-extrabold ring-2 ring-rose-500/20';
    }
    if (isGrpNext) {
      return 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-400 font-extrabold ring-2 ring-cyan-500/20';
    }
    if (isTemp) {
      return 'bg-violet-500/10 border-violet-500 text-violet-700 dark:text-violet-400 font-extrabold ring-2 ring-violet-500/20';
    }

    return 'bg-card border-border text-foreground';
  };

  const renderConnector = (fromNode: ListNodeData, toNode: ListNodeData) => {
    const nextId = currentStep.connections[fromNode.id];
    const reversedNextId = currentStep.connections[toNode.id];

    if (nextId === toNode.id) {
      return (
        <div className="flex items-center justify-center w-8 transition-all duration-300">
          <span className="text-base font-extrabold text-muted-foreground">→</span>
        </div>
      );
    }

    if (reversedNextId === fromNode.id) {
      return (
        <div className="flex items-center justify-center w-8 transition-all duration-300">
          <span className="text-base font-extrabold text-primary animate-pulse">←</span>
        </div>
      );
    }

    if (nextId && nextId !== toNode.id) {
      const targetNode = currentStep.nodes.find(n => n.id === nextId);
      const targetVal = targetNode ? (targetNode.isDummy ? 'dummy' : targetNode.val) : '?';
      return (
        <div className="flex flex-col items-center justify-center px-1 border-t-2 border-dashed border-primary/40 min-w-[3.2rem] transition-all duration-300 relative h-6">
          <span className="text-[7px] font-bold text-primary absolute -top-3.5 bg-background px-1 rounded-sm border border-primary/20 whitespace-nowrap">
            next: {targetVal}
          </span>
          <span className="text-[10px] font-extrabold text-primary">→</span>
        </div>
      );
    }

    if (nextId === null) {
      return (
        <div className="flex flex-col items-center justify-center px-1 border-t border-dotted border-muted-foreground/30 min-w-[2.5rem] transition-all duration-300 relative h-6">
          <span className="text-[7px] font-bold text-muted-foreground absolute -top-3.5 bg-background px-1 rounded-sm border border-border/20">
            null
          </span>
          <span className="text-[10px] font-extrabold text-muted-foreground">→</span>
        </div>
      );
    }

    return (
      <div className="w-8 flex items-center justify-center text-muted-foreground/30">
        ---
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Test Case Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
          Test Cases
        </h3>
        <div className="flex flex-wrap gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
          {TEST_CASES.map(tc => (
            <button
              key={tc.id}
              onClick={() => {
                setSelectedTestCaseId(tc.id);
                setCurrentStepIndex(0);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                selectedTestCaseId === tc.id 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {tc.name} (k = {tc.k})
            </button>
          ))}
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Pointer Legend */}
            <Card className="p-4 bg-card border border-border shadow-sm">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                Pointers Legend
              </span>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  <span className="font-semibold text-foreground">groupPrev</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                  <span className="font-semibold text-foreground">kth</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-500" />
                  <span className="font-semibold text-foreground">groupNext</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                  <span className="font-semibold text-foreground">curr</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                  <span className="font-semibold text-foreground">prev</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-violet-500" />
                  <span className="font-semibold text-foreground">temp</span>
                </div>
              </div>
            </Card>

            {/* Linked List Nodes Grid */}
            <Card className="p-6 bg-card border border-border shadow-sm flex flex-col justify-center min-h-[160px] overflow-x-auto">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-6">
                Linked List Nodes & Pointers
              </span>
              <div className="flex items-center justify-center gap-0.5 min-w-max pb-4">
                {currentStep.nodes.map((node, idx) => {
                  return (
                    <div key={node.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <motion.div
                          layout
                          className={`w-10 h-10 rounded-md border flex items-center justify-center font-bold text-xs relative transition-all duration-300 ${getCardStyles(node)}`}
                        >
                          {node.isDummy ? 'dummy' : node.val}
                        </motion.div>

                        <div className="flex flex-col gap-0.5 items-center mt-2 h-20 justify-start">
                          {groupPrevId === node.id && (
                            <span className="bg-emerald-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                              groupPrev
                            </span>
                          )}
                          {kthId === node.id && (
                            <span className="bg-rose-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                              kth
                            </span>
                          )}
                          {groupNextId === node.id && (
                            <span className="bg-cyan-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                              groupNext
                            </span>
                          )}
                          {currId === node.id && (
                            <span className="bg-amber-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                              curr
                            </span>
                          )}
                          {prevId === node.id && (
                            <span className="bg-indigo-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                              prev
                            </span>
                          )}
                          {tempId === node.id && (
                            <span className="bg-violet-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                              temp
                            </span>
                          )}
                        </div>
                      </div>

                      {idx < currentStep.nodes.length - 1 && 
                        renderConnector(node, currentStep.nodes[idx + 1])
                      }
                    </div>
                  );
                })}

                <div className="flex items-center">
                  {renderConnector(currentStep.nodes[currentStep.nodes.length - 1], { id: 'null', val: 0 })}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-md border border-dashed border-border flex items-center justify-center font-bold text-xs bg-muted/20 text-muted-foreground">
                      null
                    </div>
                    <div className="h-20 mt-2" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Explanation Text */}
            <Card className="p-4 border-l-4 border-primary bg-primary/5 shadow-sm flex items-center min-h-[70px]">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl shrink-0 bg-primary/10 text-primary">
                  <Info className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                    Step Narrative
                  </h4>
                  <p className="text-xs font-medium leading-relaxed text-foreground/90">
                    {currentStep.explanation}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        }
        rightContent={
          <div className="space-y-4 h-full flex flex-col">
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
            />
            <VariablePanel variables={currentStep.variables} />
          </div>
        }
        controls={
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        }
      />
    </div>
  );
};
export default ReverseNodesInKGroupVisualization;
