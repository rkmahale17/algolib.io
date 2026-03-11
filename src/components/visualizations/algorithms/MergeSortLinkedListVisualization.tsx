import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { CodeHighlighter } from '../shared/CodeHighlighter';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface ListNodeData {
    id: string;
    val: number;
    nextId: string | null;
}

interface Step {
    list1HeadId: string | null;
    list2HeadId: string | null;
    mergedHeadId: string | null;
    dummyId: string | null;
    tailId: string | null;
    allNodes: Record<string, ListNodeData>;
    message: string;
    lineNumber: number;
    highlightNodes: string[];
    variables: Record<string, any>;
}

export const MergeSortLinkedListVisualization = () => {
    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const code = `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode();
  let tail = dummy;

  while (list1 && list2) {
    if (list1.val < list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  if (list1) {
    tail.next = list1;
  } else if (list2) {
    tail.next = list2;
  }

  return dummy.next;
}`;

    const generateSteps = () => {
        const l1Vals = [1, 3, 5];
        const l2Vals = [2, 4, 6];

        const allNodes: Record<string, ListNodeData> = {};

        const createList = (vals: number[], prefix: string) => {
            let headId: string | null = null;
            let prevId: string | null = null;
            for (let i = 0; i < vals.length; i++) {
                const id = `${prefix}-${i}`;
                allNodes[id] = { id, val: vals[i], nextId: null };
                if (prevId) allNodes[prevId].nextId = id;
                if (i === 0) headId = id;
                prevId = id;
            }
            return headId;
        };

        let list1 = createList(l1Vals, 'l1');
        let list2 = createList(l2Vals, 'l2');

        const newSteps: Step[] = [];

        const cloneNodes = (nodes: Record<string, ListNodeData>) => {
            const clone: Record<string, ListNodeData> = {};
            for (const id in nodes) {
                clone[id] = { ...nodes[id] };
            }
            return clone;
        };

        const addStep = (msg: string, line: number, extra: Partial<Step> = {}) => {
            newSteps.push({
                list1HeadId: list1,
                list2HeadId: list2,
                mergedHeadId: extra.mergedHeadId || null,
                dummyId: extra.dummyId || null,
                tailId: extra.tailId || null,
                allNodes: cloneNodes(allNodes),
                message: msg,
                lineNumber: line,
                highlightNodes: extra.highlightNodes || [],
                variables: {
                    list1: list1 ? allNodes[list1].val : 'null',
                    list2: list2 ? allNodes[list2].val : 'null',
                    tail: extra.tailId ? (allNodes[extra.tailId].id === extra.dummyId ? 'dummy' : allNodes[extra.tailId].val) : 'null',
                    ...extra.variables
                }
            });
        };

        // Initial State
        addStep('Start with two sorted linked lists', 0);

        // const dummy = new ListNode();
        const dummyId = 'dummy';
        allNodes[dummyId] = { id: dummyId, val: 0, nextId: null };
        let tailId = dummyId;
        addStep('Create a dummy node to simplify merging', 1, { dummyId, tailId });

        // let tail = dummy;
        addStep('Initialize tail pointer to dummy node', 2, { dummyId, tailId });

        while (list1 && list2) {
            addStep(`Compare list1 (${allNodes[list1].val}) and list2 (${allNodes[list2].val})`, 4, { dummyId, tailId, highlightNodes: [list1, list2] });

            if (allNodes[list1].val < allNodes[list2].val) {
                // tail.next = list1;
                const currentL1 = list1;
                allNodes[tailId].nextId = currentL1;
                addStep(`${allNodes[list1].val} < ${allNodes[list2].val}, point tail.next to list1 node`, 6, { dummyId, tailId, highlightNodes: [currentL1] });

                // list1 = list1.next;
                list1 = allNodes[list1].nextId;
                addStep('Advance list1 pointer', 7, { dummyId, tailId });
            } else {
                // tail.next = list2;
                const currentL2 = list2;
                allNodes[tailId].nextId = currentL2;
                addStep(`${allNodes[list2].val} <= ${allNodes[list1].val}, point tail.next to list2 node`, 9, { dummyId, tailId, highlightNodes: [currentL2] });

                // list2 = list2.next;
                list2 = allNodes[list2].nextId;
                addStep('Advance list2 pointer', 10, { dummyId, tailId });
            }

            // tail = tail.next;
            tailId = allNodes[tailId].nextId!;
            addStep('Advance tail pointer to the newly added node', 12, { dummyId, tailId });
        }

        if (list1) {
            // tail.next = list1;
            allNodes[tailId].nextId = list1;
            addStep('list2 is exhausted, attach remaining list1 nodes', 16, { dummyId, tailId, highlightNodes: [list1] });
        } else if (list2) {
            // tail.next = list2;
            allNodes[tailId].nextId = list2;
            addStep('list1 is exhausted, attach remaining list2 nodes', 18, { dummyId, tailId, highlightNodes: [list2] });
        }

        addStep('Merge complete! Return dummy.next as the new head', 21, { dummyId, tailId });

        setSteps(newSteps);
        setCurrentStepIndex(0);
    };

    useEffect(() => {
        generateSteps();
    }, []);

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
        generateSteps();
    };

    if (steps.length === 0) return null;

    const currentStep = steps[currentStepIndex];

    const renderNode = (nodeId: string, label?: string, isSpecial: boolean = false) => {
        const node = currentStep.allNodes[nodeId];
        if (!node) return null;

        const isHighlighted = currentStep.highlightNodes.includes(nodeId);
        const isTail = currentStep.tailId === nodeId;
        const isDummy = currentStep.dummyId === nodeId;

        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={nodeId}
                className="flex items-center"
            >
                <div className="flex flex-col items-center">
                    {label && <span className="text-[10px] font-mono text-muted-foreground mb-1 uppercase">{label}</span>}
                    <div
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font- transition-all duration-300 relative ${isDummy ? 'bg-muted/50 border-dashed border-muted-foreground' :
                            isHighlighted ? 'bg-primary/20 border-primary text-primary scale-110 shadow-lg shadow-primary/20' :
                                'bg-card border-border text-card-foreground'
                            } ${isTail ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''}`}
                    >
                        {isDummy ? 'D' : node.val}
                        {isTail && (
                            <div className="absolute -top-6 bg-primary text-primary-foreground text-[10px] px-1 rounded font-">
                                TAIL
                            </div>
                        )}
                    </div>
                </div>
                {node.nextId && (
                    <motion.div layout className="mx-2 text-muted-foreground">
                        <ArrowRight size={20} />
                    </motion.div>
                )}
            </motion.div>
        );
    };

    const getListNodes = (headId: string | null) => {
        const nodes: string[] = [];
        let currId = headId;
        const visited = new Set<string>();
        while (currId && !visited.has(currId)) {
            nodes.push(currId);
            visited.add(currId);
            currId = currentStep.allNodes[currId].nextId;
        }
        return nodes;
    };

    const list1Nodes = getListNodes(currentStep.list1HeadId);
    const list2Nodes = getListNodes(currentStep.list2HeadId);

    // For merged list, we start from dummy
    const mergedNodes = currentStep.dummyId ? getListNodes(currentStep.dummyId) : [];

    return (
        <div className="space-y-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div className="bg-muted/30 rounded-xl border border-border/50 p-6 space-y-8 min-h-[400px]">
                        {/* List 1 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-primary">List 1</span>
                                {currentStep.list1HeadId === null && <span className="text-xs text-muted-foreground italic">(null)</span>}
                            </div>
                            <div className="flex items-center gap-1 flex-wrap min-h-[60px]">
                                <AnimatePresence mode="popLayout">
                                    {list1Nodes.map((id, index) => renderNode(id, index === 0 ? 'list1' : undefined))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* List 2 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-secondary">List 2</span>
                                {currentStep.list2HeadId === null && <span className="text-xs text-muted-foreground italic">(null)</span>}
                            </div>
                            <div className="flex items-center gap-1 flex-wrap min-h-[60px]">
                                <AnimatePresence mode="popLayout">
                                    {list2Nodes.map((id, index) => renderNode(id, index === 0 ? 'list2' : undefined))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Merged List */}
                        <div className="space-y-2 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">Merged (via tail)</span>
                                {mergedNodes.length === 0 && <span className="text-xs text-muted-foreground italic">(initializing...)</span>}
                            </div>
                            <div className="flex items-center gap-1 flex-wrap min-h-[60px]">
                                <AnimatePresence mode="popLayout">
                                    {mergedNodes.map((id) => renderNode(id))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        key={currentStepIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/5 rounded-lg border border-primary/20 p-4 flex gap-3"
                    >
                        <Info className="text-primary shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-foreground leading-relaxed">{currentStep.message}</p>
                    </motion.div>

                    <VariablePanel variables={currentStep.variables} />
                </div>

                <div className="space-y-4">
                    <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />

                    <div className="bg-card rounded-lg border border-border p-4">
                        <h4 className="text-xs font- uppercase tracking-wider text-muted-foreground mb-3">Algorithm Logic</h4>
                        <ul className="text-xs space-y-2 text-muted-foreground">
                            <li className="flex gap-2">
                                <span className="text-primary font-">•</span>
                                <span>Use a <strong>dummy node</strong> to avoid edge cases with the head of the list.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary font-">•</span>
                                <span>The <strong>tail pointer</strong> always tracks the end of the newly formed list.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary font-">•</span>
                                <span>Compare heads of both lists and connect the smaller one to <code>tail.next</code>.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary font-">•</span>
                                <span>Once one list is empty, attach the remaining nodes of the other list in <strong>O(1)</strong> time.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
