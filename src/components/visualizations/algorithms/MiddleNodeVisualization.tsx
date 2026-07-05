import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, LayoutList, Hash } from 'lucide-react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Button } from '@/components/ui/button';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface ListNodeData {
  id: string;
  val: number;
  nextId: string | null;
}

interface Step {
  headId: string;
  slowId: string | null;
  fastId: string | null;
  allNodes: Record<string, ListNodeData>;
  message: string;
  pseudoStep: string;
  highlightNodes: string[];
  variables: Record<string, any>;
  isComplete: boolean;
}

// ─── DB Codes (no modification, exact match) ────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function middleNode(head: ListNode | null): ListNode | null {
    let slow =  head;
    let fast = head;
    while(fast && fast.next){
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,

  python: `def middleNode(head):
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,

  java: `public static class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`,

  cpp: `class Solution {
public:
        ListNode * middleNode(ListNode * head) {
          ListNode * slow = head, * fast = head;
          while (fast && fast -> next) {
            slow = slow -> next;
            fast = fast -> next -> next;
          }
          return slow;
        }
};`
};

export const MiddleNodeVisualization: React.FC = () => {
  const [listType, setListType] = useState<'odd' | 'even'>('odd');
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateSteps = (type: 'odd' | 'even') => {
    const vals = type === 'odd' ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6];
    const allNodes: Record<string, ListNodeData> = {};

    let headId = 'node-0';
    for (let i = 0; i < vals.length; i++) {
      const id = `node-${i}`;
      allNodes[id] = {
        id,
        val: vals[i],
        nextId: i < vals.length - 1 ? `node-${i + 1}` : null
      };
    }

    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = {
        typescript: [],
        python: [],
        java: [],
        cpp: []
    };

    const addStep = (
        msg: string,
        pseudo: string,
        tsLine: number,
        pyLine: number,
        javaLine: number,
        cppLine: number,
        slow: string | null,
        fast: string | null,
        extra: any = {}
    ) => {
      newSteps.push({
        headId,
        slowId: slow,
        fastId: fast,
        allNodes: { ...allNodes },
        message: msg,
        pseudoStep: pseudo,
        highlightNodes: extra.highlightNodes || [],
        variables: {
          slow: slow ? allNodes[slow].val : 'null',
          fast: fast ? allNodes[fast].val : 'null',
          'fast.next': fast && allNodes[fast].nextId ? allNodes[allNodes[fast].nextId!].val : 'null',
        },
        isComplete: !!extra.isComplete
      });
      lines.typescript!.push(tsLine);
      lines.python!.push(pyLine);
      lines.java!.push(javaLine);
      lines.cpp!.push(cppLine);
    };

    // Initial State
    addStep(
        `Find the middle of a linked list with ${vals.length} nodes (${type} length)`,
        'START middleNode(head)',
        1, 1, 2, 3,
        null, null
    );

    // let slow = head;
    let slowId: string | null = headId;
    addStep(
        'Initialize slow pointer at head',
        'SET slow = head',
        2, 2, 3, 4,
        slowId, null
    );

    // let fast = head;
    let fastId: string | null = headId;
    addStep(
        'Initialize fast pointer at head',
        'SET fast = head',
        3, 3, 4, 4,
        slowId, fastId
    );

    // while (fast && fast.next)
    while (fastId && allNodes[fastId]?.nextId) {
      addStep(
          'Check loop condition: fast and fast.next are both not null',
          `WHILE fast AND fast.next  →  ${allNodes[fastId].val} and ${allNodes[allNodes[fastId].nextId!].val}`,
          4, 4, 5, 5,
          slowId, fastId,
          { highlightNodes: [fastId, allNodes[fastId].nextId].filter(Boolean) }
      );

      // slow = slow.next;
      slowId = allNodes[slowId!].nextId;
      addStep(
          'Move slow pointer forward by one node',
          'SET slow = slow.next',
          5, 5, 6, 6,
          slowId, fastId,
          { highlightNodes: [slowId] }
      );

      // fast = fast.next.next;
      const nextId = allNodes[fastId!].nextId;
      fastId = nextId ? allNodes[nextId].nextId : null;
      addStep(
          'Move fast pointer forward by two nodes (jump to next.next)',
          'SET fast = fast.next.next',
          6, 6, 7, 7,
          slowId, fastId,
          { highlightNodes: [fastId].filter(Boolean) }
      );
    }

    // Loop end
    const endMsg = !fastId
      ? 'Loop finished: fast pointer reached null'
      : 'Loop finished: fast.next is null';
    addStep(
        endMsg,
        'WHILE loop finished',
        4, 4, 5, 5,
        slowId, fastId
    );

    // return slow;
    addStep(
        `Middle node found! Returning node with value ${allNodes[slowId!].val}.`,
        'RETURN slow',
        8, 7, 9, 9,
        slowId, fastId,
        { isComplete: true, highlightNodes: [slowId] }
    );

    setSteps(newSteps);
    setStepLineNumbers(lines);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSteps(listType);
  }, [listType]);

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
      }, 1200 / speed);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const getNodes = () => {
    const nodes: string[] = [];
    let curr: string | null = currentStep.headId;
    while (curr) {
      nodes.push(curr);
      curr = currentStep.allNodes[curr].nextId;
    }
    return nodes;
  };

  const allNodeIds = getNodes();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
        <StepControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStepForward={handleStepForward}
          onStepBack={handleStepBack}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStepIndex}
          totalSteps={steps.length - 1}
        />

        <div className="flex bg-muted/50 p-1 rounded-lg border border-border/50">
          <Button
            variant={listType === 'odd' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setListType('odd')}
            className="h-8 text-xs gap-2"
          >
            <Hash size={14} /> Odd Length (5)
          </Button>
          <Button
            variant={listType === 'even' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setListType('even')}
            className="h-8 text-xs gap-2"
          >
            <LayoutList size={14} /> Even Length (6)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Visual simulator, Commentary, and Variables */}
        <div className="space-y-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-8 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-1 flex-wrap relative z-10">
              <AnimatePresence mode="popLayout">
                {allNodeIds.map((id, index) => {
                  const node = currentStep.allNodes[id];
                  const isSlow = currentStep.slowId === id;
                  const isFast = currentStep.fastId === id;
                  const isHighlighted = currentStep.highlightNodes.includes(id);
                  const isMiddle = currentStep.isComplete && isSlow;

                  return (
                    <motion.div
                      layout
                      key={id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center"
                    >
                      <div className="flex flex-col items-center relative">
                        {/* Pointers Container */}
                        <div className="h-8 flex flex-col justify-end gap-0.5 mb-1.5">
                          <AnimatePresence>
                             {isFast && (
                              <motion.div
                                key="fast-pointer"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-[10px] font-bold text-blue-500"
                              >
                                Fast
                              </motion.div>
                            )}
                            {isSlow && (
                              <motion.div
                                key="slow-pointer"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-[10px] font-bold text-blue-500"
                              >
                                Slow
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Node Circle */}
                        <motion.div
                          animate={{
                            scale: isHighlighted ? 1.15 : 1,
                            borderColor: isMiddle ? 'var(--primary)' : isHighlighted ? 'var(--primary)' : 'var(--border)',
                          }}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-colors relative ${isMiddle ? 'bg-primary/20 ring-2 ring-primary/20' :
                            isHighlighted ? 'bg-primary/10' : 'bg-card'
                            }`}
                        >
                          {node.val}
                          {isMiddle && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1"
                            >
                              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>

                      {/* Arrow */}
                      {node.nextId && (
                        <div className={`mx-0.5 mt-8 transition-colors duration-300 ${currentStep.highlightNodes.includes(id) && currentStep.highlightNodes.includes(node.nextId)
                          ? 'text-primary' : 'text-muted-foreground/30'
                          }`}>
                          <ArrowRight size={16} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Pointer Explanation labels at bottom */}
            <div className="mt-12 flex justify-center gap-6 text-xs font-medium border-t border-border/50 pt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                <span className="text-muted-foreground">Slow Pointer (1 step)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary shadow-sm shadow-secondary/40"></div>
                <span className="text-muted-foreground">Fast Pointer (2 steps)</span>
              </div>
            </div>
          </div>

          {/* Commentary Panel */}
          <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-75 rounded-full" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                    Algorithm Commentary
                  </span>
                </div>
                <div className="font-mono text-[10px] tracking-tight bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/40">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Info className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                    Current Action
                  </h4>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStepIndex}
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -5, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium leading-relaxed text-foreground/90 select-none"
                    >
                      {currentStep.message}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code & Pseudocode Display and Variables */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      </div>
    </div>
  );
};
export default MiddleNodeVisualization;