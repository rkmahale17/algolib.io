import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, LayoutList, Hash } from 'lucide-react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Button } from '@/components/ui/button';

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
  lineNumber: number;
  highlightNodes: string[];
  variables: Record<string, any>;
  isComplete: boolean;
}

export const MiddleNodeVisualization: React.FC = () => {
  const [listType, setListType] = useState<'odd' | 'even'>('odd');
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}`;

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

    const addStep = (msg: string, line: number, slow: string | null, fast: string | null, extra: any = {}) => {
      newSteps.push({
        headId,
        slowId: slow,
        fastId: fast,
        allNodes: { ...allNodes },
        message: msg,
        lineNumber: line,
        highlightNodes: extra.highlightNodes || [],
        variables: {
          slow: slow ? allNodes[slow].val : 'null',
          fast: fast ? allNodes[fast].val : 'null',
          'fast.next': fast && allNodes[fast].nextId ? allNodes[allNodes[fast].nextId!].val : 'null',
        },
        isComplete: !!extra.isComplete
      });
    };

    // Initial State
    addStep(`Find the middle of a linked list with ${vals.length} nodes (${type} length)`, 0, null, null);

    // let slow = head;
    let slowId: string | null = headId;
    addStep('Initialize slow pointer at head', 1, slowId, null);

    // let fast = head;
    let fastId: string | null = headId;
    addStep('Initialize fast pointer at head', 2, slowId, fastId);

    // while (fast && fast.next)
    while (fastId && allNodes[fastId]?.nextId) {
      addStep('Check loop condition: fast and fast.next are not null', 4, slowId, fastId, { highlightNodes: [fastId, allNodes[fastId].nextId] });

      // slow = slow.next;
      slowId = allNodes[slowId!].nextId;
      addStep('Move slow pointer forward by one node', 5, slowId, fastId, { highlightNodes: [slowId] });

      // fast = fast.next.next;
      const nextId = allNodes[fastId!].nextId;
      fastId = nextId ? allNodes[nextId].nextId : null;
      addStep('Move fast pointer forward by two nodes', 6, slowId, fastId, { highlightNodes: [fastId].filter(Boolean) });
    }

    // Loop end
    addStep(`Loop finished: fast is ${fastId ? allNodes[fastId].val : 'null'}${!fastId ? '' : ` and fast.next is null`}.`, 4, slowId, fastId);

    // return slow;
    addStep(`Middle node found! Value is ${allNodes[slowId!].val}.`, 9, slowId, fastId, { isComplete: true, highlightNodes: [slowId] });

    setSteps(newSteps);
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
      }, 1000 / speed);
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
    generateSteps(listType);
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

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
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-8 min-h-[300px] flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 flex-wrap relative z-10">
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
                        <div className="h-10 flex flex-col justify-end gap-1 mb-2">
                          <AnimatePresence>
                            {isFast && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm"
                              >
                                FAST
                              </motion.div>
                            )}
                            {isSlow && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm"
                              >
                                SLOW
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
                          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg transition-colors relative ${isMiddle ? 'bg-primary/20 ring-4 ring-primary/20' :
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
                        <div className={`mx-1 mt-10 transition-colors duration-300 ${currentStep.highlightNodes.includes(id) && currentStep.highlightNodes.includes(node.nextId)
                            ? 'text-primary' : 'text-muted-foreground/30'
                          }`}>
                          <ArrowRight size={24} />
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

          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/5 rounded-xl border border-accent/20 p-5 flex gap-4 shadow-sm"
          >
            <div className="bg-accent/10 rounded-full p-2 h-fit">
              <Info className="text-accent-foreground" size={20} />
            </div>
            <p className="text-sm font-medium leading-relaxed">{currentStep.message}</p>
          </motion.div>

          <VariablePanel variables={currentStep.variables} />
        </div>

        <div className="space-y-4">
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <LayoutList size={14} className="text-primary" /> How it Works
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground">The Tortoise and the Hare</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This algorithm uses two pointers moving at different speeds. By the time the fast pointer reaches the end, the slow pointer will be exactly at the middle.
                </p>
              </div>
              <ul className="text-xs space-y-3">
                <li className="flex gap-3 items-start">
                  <div className="bg-primary/10 text-primary rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 font-bold">1</div>
                  <span><strong>Slow</strong> moves forward one node at a time.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-secondary/10 text-secondary-foreground rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 font-bold">2</div>
                  <span><strong>Fast</strong> moves twice as fast, skipping one node each turn.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-muted text-muted-foreground rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 font-bold">3</div>
                  <span>When <strong>Fast</strong> hits the end (<code>null</code>) or its <code>next</code> is null, the loop ends.</span>
                </li>
              </ul>
              <div className="pt-2">
                <p className="text-[10px] text-muted-foreground italic border-t border-border/50 pt-2">
                  * Note: For even-length lists, this implementation returns the <strong>second</strong> middle node.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};