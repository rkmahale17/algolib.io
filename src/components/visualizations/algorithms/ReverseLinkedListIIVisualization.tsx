import { useEffect, useRef, useState, useCallback } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface ListNodeData {
  id: string;
  val: number;
  isDummy?: boolean;
}

interface Step {
  nodes: ListNodeData[];
  connections: Record<string, string | null>;
  leftPrevId: string | null;
  curId: string | null;
  prevId: string | null;
  tmpNextId: string | null;
  explanation: string;
  lineNumber: number;
  variables: Record<string, any>;
  phase: 'init' | 'traverse' | 'init_reverse' | 'reverse' | 'reconnect' | 'done';
}

interface TestCase {
  id: string;
  name: string;
  head: number[];
  left: number;
  right: number;
}

const TEST_CASES: TestCase[] = [
  { id: 'ex1', name: 'Example 1', head: [1, 2, 3, 4, 5], left: 2, right: 4 },
  { id: 'ex2', name: 'Example 2', head: [5], left: 1, right: 1 },
  { id: 'ex3', name: 'Reversing Front', head: [1, 2, 3, 4], left: 1, right: 3 },
  { id: 'ex4', name: 'Whole List', head: [10, 20, 30], left: 1, right: 3 }
];

export const ReverseLinkedListIIVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
    const dummy = new ListNode(0, head);

    let leftPrev: ListNode = dummy;
    let cur: ListNode | null = head;

    for (let i = 0; i < left - 1; i++) {
        leftPrev = cur!;
        cur = cur!.next;
    }

    let prev: ListNode | null = null;

    for (let i = 0; i < right - left + 1; i++) {
        const tmpNext = cur!.next;
        cur!.next = prev;
        prev = cur;
        cur = tmpNext;
    }

    leftPrev.next!.next = cur;
    leftPrev.next = prev;

    return dummy.next;
}`;

  const generateSteps = useCallback(() => {
    const vals = selectedTestCase.head;
    const left = selectedTestCase.left;
    const right = selectedTestCase.right;

    const newSteps: Step[] = [];

    // Construct node list
    const allNodes: ListNodeData[] = [
      { id: 'dummy', val: 0, isDummy: true }
    ];
    vals.forEach((v, idx) => {
      allNodes.push({ id: `node-${idx}`, val: v });
    });

    // Connections map: node.id -> nextNode.id
    const connections: Record<string, string | null> = {};
    connections['dummy'] = 'node-0';
    for (let i = 0; i < vals.length; i++) {
      connections[`node-${i}`] = i < vals.length - 1 ? `node-${i + 1}` : null;
    }

    // Pointer state trackers
    let leftPrevId: string | null = null;
    let curId: string | null = null;
    let prevId: string | null = null;
    let tmpNextId: string | null = null;

    const getVariables = () => {
      const getValStr = (id: string | null) => {
        if (!id) return 'null';
        if (id === 'dummy') return 'dummy(0)';
        const node = allNodes.find(n => n.id === id);
        return node ? `Node(${node.val})` : 'null';
      };
      return {
        'leftPrev': getValStr(leftPrevId),
        'cur': getValStr(curId),
        'prev': getValStr(prevId),
        'tmpNext': getValStr(tmpNextId),
        'dummy.next': getValStr(connections['dummy'])
      };
    };

    const pushStep = (
      lineNumber: number,
      explanation: string,
      phase: Step['phase'],
      variablesExtra: Record<string, any> = {}
    ) => {
      newSteps.push({
        nodes: allNodes.map(n => ({ ...n })),
        connections: { ...connections },
        leftPrevId,
        curId,
        prevId,
        tmpNextId,
        explanation,
        lineNumber,
        phase,
        variables: getVariables(),
        ...variablesExtra
      });
    };

    // Step 1: Start
    pushStep(1, `Start reverseBetween function. We will reverse the list segment from position left = ${left} to right = ${right}.`, 'init');

    // Step 2: Dummy Node
    pushStep(2, `Create a dummy node (val: 0) pointing to the original head of the list. This handles edge cases when left = 1.`, 'init');

    // Step 4: leftPrev = dummy
    leftPrevId = 'dummy';
    pushStep(4, `Initialize leftPrev pointer to the dummy node.`, 'init');

    // Step 5: cur = head
    curId = 'node-0';
    pushStep(5, `Initialize cur pointer to the head of the list (value ${vals[0]}).`, 'init');

    // Step 7: Traversing loop
    pushStep(7, `Traverse left - 1 times to find the node preceding position 'left'.`, 'traverse');

    for (let i = 0; i < left - 1; i++) {
      // Line 8: leftPrev = cur
      leftPrevId = curId;
      pushStep(8, `Move leftPrev to cur (Node ${allNodes.find(n => n.id === curId)!.val}).`, 'traverse');

      // Line 9: cur = cur.next
      curId = connections[curId!];
      pushStep(9, `Move cur to cur.next (Node ${curId ? allNodes.find(n => n.id === curId)!.val : 'null'}).`, 'traverse');

      // Line 7: Loop check
      pushStep(7, `Iteration index i = ${i + 1}.`, 'traverse');
    }

    // Step 12: prev = null
    prevId = null;
    pushStep(12, `Initialize prev pointer to null. This will act as the new next-target as we reverse connections in the sublist.`, 'init_reverse');

    // Step 14: Reversal loop
    pushStep(14, `Start the reversal loop to run right - left + 1 = ${right - left + 1} times.`, 'reverse');

    for (let i = 0; i < right - left + 1; i++) {
      // Loop check / start of iteration
      pushStep(14, `Reversal iteration ${i + 1}: current node to process is cur (value ${allNodes.find(n => n.id === curId)!.val}).`, 'reverse');

      // Line 15: tmpNext = cur.next
      tmpNextId = connections[curId!];
      pushStep(15, `Store cur.next in tmpNext (${tmpNextId ? allNodes.find(n => n.id === tmpNextId)!.val : 'null'}) to avoid losing the rest of the list.`, 'reverse');

      // Line 16: cur.next = prev
      connections[curId!] = prevId;
      pushStep(16, `Reverse connection: Point cur's next to prev (${prevId ? allNodes.find(n => n.id === prevId)!.val : 'null'}).`, 'reverse');

      // Line 17: prev = cur
      prevId = curId;
      pushStep(17, `Move prev forward to cur (Node ${allNodes.find(n => n.id === curId)!.val}).`, 'reverse');

      // Line 18: cur = tmpNext
      curId = tmpNextId;
      pushStep(18, `Move cur forward to tmpNext (${curId ? allNodes.find(n => n.id === curId)!.val : 'null'}).`, 'reverse');
    }

    // Loop end
    tmpNextId = null;
    pushStep(14, `Finished sublist reversal. Pointers are prepared for reconnection.`, 'reverse');

    // Step 21: leftPrev.next!.next = cur
    const originalLeftNodeId = connections[leftPrevId!];
    connections[originalLeftNodeId!] = curId;
    pushStep(21, `Connect the tail of the reversed sublist (Node ${allNodes.find(n => n.id === originalLeftNodeId)!.val}) to the node after the sublist (Node ${curId ? allNodes.find(n => n.id === curId)!.val : 'null'}).`, 'reconnect');

    // Step 22: leftPrev.next = prev
    connections[leftPrevId!] = prevId;
    pushStep(22, `Connect the node preceding the sublist (Node ${leftPrevId === 'dummy' ? 'dummy' : allNodes.find(n => n.id === leftPrevId)!.val}) to the new head of the reversed sublist (Node ${prevId ? allNodes.find(n => n.id === prevId)!.val : 'null'}).`, 'reconnect');

    // Step 24: return dummy.next
    pushStep(24, `Return dummy.next (Node ${connections['dummy'] ? allNodes.find(n => n.id === connections['dummy'])!.val : 'null'}) as the new head of the list.`, 'done');

    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, [selectedTestCase]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

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
      }, 1500 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

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

  const currentStep = steps[currentStepIndex];
  const { leftPrevId, curId, prevId, tmpNextId } = currentStep;

  const getCardStyles = (node: ListNodeData) => {
    const isCur = curId === node.id;
    const isPrev = prevId === node.id;
    const isLeftPrev = leftPrevId === node.id;
    const isTmpNext = tmpNextId === node.id;

    if (node.isDummy) {
      if (isLeftPrev) {
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
    if (isLeftPrev) {
      return 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-extrabold ring-2 ring-emerald-500/20';
    }
    if (isTmpNext) {
      return 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 font-extrabold ring-2 ring-rose-500/20';
    }

    return 'bg-card border-border text-foreground';
  };

  const renderConnector = (fromNode: ListNodeData, toNode: ListNodeData) => {
    const nextId = currentStep.connections[fromNode.id];
    const reversedNextId = currentStep.connections[toNode.id];

    // Standard next connection
    if (nextId === toNode.id) {
      return (
        <div className="flex items-center justify-center w-8 transition-all duration-300">
          <span className="text-base font-extrabold text-muted-foreground">→</span>
        </div>
      );
    }

    // Reversed connection
    if (reversedNextId === fromNode.id) {
      return (
        <div className="flex items-center justify-center w-8 transition-all duration-300">
          <span className="text-base font-extrabold text-primary animate-pulse">←</span>
        </div>
      );
    }

    // Skipping connection
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

    // Null connection
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
    <VisualizationLayout
      leftContent={
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
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                    selectedTestCaseId === tc.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {tc.name} (L:{tc.left}, R:{tc.right})
                </button>
              ))}
            </div>
          </div>

          {/* Pointer Legend */}
          <Card className="p-4 bg-card border border-border shadow-sm">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Pointers Legend
            </span>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span className="font-semibold text-foreground">leftPrev</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                <span className="font-semibold text-foreground">cur</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                <span className="font-semibold text-foreground">prev</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                <span className="font-semibold text-foreground">tmpNext</span>
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
                      {/* Node Card */}
                      <motion.div
                        layout
                        className={`w-10 h-10 rounded-md border flex items-center justify-center font-bold text-xs relative transition-all duration-300 ${getCardStyles(node)}`}
                      >
                        {node.isDummy ? 'dummy' : node.val}
                      </motion.div>

                      {/* Pointer Badges beneath Node */}
                      <div className="flex flex-col gap-0.5 items-center mt-2 h-16 justify-start">
                        {leftPrevId === node.id && (
                          <span className="bg-emerald-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                            leftPrev
                          </span>
                        )}
                        {curId === node.id && (
                          <span className="bg-amber-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                            cur
                          </span>
                        )}
                        {prevId === node.id && (
                          <span className="bg-indigo-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                            prev
                          </span>
                        )}
                        {tmpNextId === node.id && (
                          <span className="bg-rose-500 text-white text-[7px] px-1 py-0.5 rounded font-extrabold uppercase shadow-sm">
                            tmpNext
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Connector arrow between adjacent nodes */}
                    {idx < currentStep.nodes.length - 1 && 
                      renderConnector(node, currentStep.nodes[idx + 1])
                    }
                  </div>
                );
              })}

              {/* Final Null block */}
              <div className="flex items-center">
                {renderConnector(currentStep.nodes[currentStep.nodes.length - 1], { id: 'null', val: 0 })}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-md border border-dashed border-border flex items-center justify-center font-bold text-xs bg-muted/20 text-muted-foreground">
                    null
                  </div>
                  <div className="h-16 mt-2" />
                </div>
              </div>
            </div>
          </Card>

          {/* Explanation Text */}
          <Card className="p-4 border-l-4 border-primary bg-accent/40 shadow-sm flex items-center min-h-[70px]">
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
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="typescript"
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
  );
};
