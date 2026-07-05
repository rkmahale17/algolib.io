import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info } from 'lucide-react';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

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
    pseudoStep: string;
    highlightNodes: string[];
    variables: Record<string, any>;
}

// ─── DB Codes (no modification, exact match) ────────────────────────────────

const languages: VisualizationLanguageMap = {
  typescript: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
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
}`,

  python: `def mergeTwoLists(list1, list2):
    dummy = ListNode()
    tail = dummy
    while list1 and list2:
        if list1.val < list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    if list1:
        tail.next = list1
    elif list2:
        tail.next = list2
    return dummy.next`,

  java: `public static class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode();
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                tail.next = list1;
                list1 = list1.next;
            } else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        if (list1 != null) {
            tail.next = list1;
        } else {
            tail.next = list2;
        }
        return dummy.next;
    }
}`,

  cpp: `class Solution {
public:
        ListNode * mergeTwoLists(ListNode * list1, ListNode * list2) {
            ListNode dummy(0);
            ListNode * curr = & dummy;
            while (list1 && list2) {
                if (list1 -> val <= list2 -> val) {
                    curr -> next = list1;
                    list1 = list1 -> next;
                } else {
                    curr -> next = list2;
                    list2 = list2 -> next;
                }
                curr = curr -> next;
            }
            curr -> next = list1 ? list1 : list2;
            return dummy.next;
        }
};`
};


export const MergeSortLinkedListVisualization = () => {
    const [steps, setSteps] = useState<Step[]>([]);
    const [stepLineNumbers, setStepLineNumbers] = useState<StepLineNumberMap>({});
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
            extra: Partial<Step> = {}
        ) => {
            newSteps.push({
                list1HeadId: list1,
                list2HeadId: list2,
                mergedHeadId: extra.mergedHeadId || null,
                dummyId: extra.dummyId || null,
                tailId: extra.tailId || null,
                allNodes: cloneNodes(allNodes),
                message: msg,
                pseudoStep: pseudo,
                highlightNodes: extra.highlightNodes || [],
                variables: {
                    list1: list1 ? allNodes[list1].val : 'null',
                    list2: list2 ? allNodes[list2].val : 'null',
                    tail: extra.tailId ? (allNodes[extra.tailId].id === extra.dummyId ? 'dummy' : allNodes[extra.tailId].val) : 'null',
                    ...extra.variables
                }
            });
            lines.typescript!.push(tsLine);
            lines.python!.push(pyLine);
            lines.java!.push(javaLine);
            lines.cpp!.push(cppLine);
        };

        const cloneNodes = (nodes: Record<string, ListNodeData>) => {
            const clone: Record<string, ListNodeData> = {};
            for (const id in nodes) {
                clone[id] = { ...nodes[id] };
            }
            return clone;
        };

        // Initial State
        addStep(
            'Start with two sorted linked lists',
            'START mergeTwoLists(list1, list2)',
            1, 1, 2, 3
        );

        // const dummy = new ListNode();
        const dummyId = 'dummy';
        allNodes[dummyId] = { id: dummyId, val: 0, nextId: null };
        let tailId = dummyId;
        addStep(
            'Create a dummy node to simplify merging',
            'SET dummy = ListNode()',
            2, 2, 3, 4,
            { dummyId, tailId }
        );

        // let tail = dummy;
        addStep(
            'Initialize tail pointer to dummy node',
            'SET tail = dummy',
            3, 3, 4, 5,
            { dummyId, tailId }
        );

        while (list1 && list2) {
            addStep(
                `Compare list1 (${allNodes[list1].val}) and list2 (${allNodes[list2].val})`,
                `WHILE list1 AND list2  →  ${allNodes[list1].val} vs ${allNodes[list2].val}`,
                4, 4, 5, 6,
                { dummyId, tailId, highlightNodes: [list1, list2] }
            );

            addStep(
                `Check if list1 value is smaller: ${allNodes[list1].val} < ${allNodes[list2].val}`,
                `IF list1.val < list2.val  →  ${allNodes[list1].val} < ${allNodes[list2].val}`,
                5, 5, 6, 7,
                { dummyId, tailId, highlightNodes: [list1, list2] }
            );

            if (allNodes[list1].val < allNodes[list2].val) {
                const currentL1 = list1;
                allNodes[tailId].nextId = currentL1;
                addStep(
                    `${allNodes[list1].val} < ${allNodes[list2].val}, point tail.next to list1 node`,
                    'SET tail.next = list1',
                    6, 6, 7, 8,
                    { dummyId, tailId, highlightNodes: [currentL1] }
                );

                list1 = allNodes[list1].nextId;
                addStep(
                    'Advance list1 pointer',
                    'SET list1 = list1.next',
                    7, 7, 8, 9,
                    { dummyId, tailId }
                );
            } else {
                const currentL2 = list2;
                allNodes[tailId].nextId = currentL2;
                addStep(
                    `${allNodes[list2].val} <= ${allNodes[list1].val}, point tail.next to list2 node`,
                    'SET tail.next = list2',
                    9, 9, 10, 11,
                    { dummyId, tailId, highlightNodes: [currentL2] }
                );

                list2 = allNodes[list2].nextId;
                addStep(
                    'Advance list2 pointer',
                    'SET list2 = list2.next',
                    10, 10, 11, 12,
                    { dummyId, tailId }
                );
            }

            tailId = allNodes[tailId].nextId!;
            addStep(
                'Advance tail pointer to the newly added node',
                'SET tail = tail.next',
                12, 11, 13, 14,
                { dummyId, tailId }
            );
        }

        if (list1) {
            allNodes[tailId].nextId = list1;
            addStep(
                'list2 is exhausted, attach remaining list1 nodes',
                'SET tail.next = list1  (attach remaining)',
                15, 13, 16, 16,
                { dummyId, tailId, highlightNodes: [list1] }
            );
            
            let curr = list1;
            while (allNodes[curr].nextId) curr = allNodes[curr].nextId!;
            tailId = curr;
        } else if (list2) {
            allNodes[tailId].nextId = list2;
            addStep(
                'list1 is exhausted, attach remaining list2 nodes',
                'SET tail.next = list2  (attach remaining)',
                17, 15, 18, 16,
                { dummyId, tailId, highlightNodes: [list2] }
            );

            let curr = list2;
            while (allNodes[curr].nextId) curr = allNodes[curr].nextId!;
            tailId = curr;
        }

        addStep(
            'Merge complete! Return dummy.next as the new head',
            'RETURN dummy.next',
            19, 16, 20, 17,
            { dummyId, tailId }
        );

        setSteps(newSteps);
        setStepLineNumbers(lines);
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

    const renderNode = (nodeId: string, label?: string) => {
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
                className="flex items-start"
            >
                <div className="flex flex-col items-center">
                    <div className="h-4 flex items-center justify-center w-8">
                        {label && (
                            <span className="text-[9px] font-mono text-muted-foreground uppercase whitespace-nowrap">
                                {label}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-md border-2 flex items-center justify-center text-xs transition-all duration-300 relative ${isDummy ? 'bg-muted/30 border-dashed border-muted-foreground text-muted-foreground font-mono' :
                                isHighlighted ? 'bg-primary/20 border-primary text-primary scale-110 shadow-lg shadow-primary/20 font-bold' :
                                    'bg-card border-border text-card-foreground font-semibold'
                                } ${isTail ? 'ring-2 ring-offset-1 ring-primary ring-offset-background' : ''}`}
                        >
                            {isDummy ? 'D' : node.val}
                            {isTail && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[8px] px-1 rounded-sm z-10 font-bold">
                                    Tail
                                </div>
                            )}
                        </div>
                        {node.nextId && (
                            <div className="text-muted-foreground/40 px-0.5">
                                <ArrowRight size={13} />
                            </div>
                        )}
                    </div>
                </div>
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
                {/* Left Column: Visual Simulator and Commentary */}
                <div className="space-y-4">
                    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-8 space-y-8 min-h-[400px] flex flex-col justify-center">
                        {/* List 1 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">List 1</span>
                                {currentStep.list1HeadId === null && <span className="text-xs text-muted-foreground italic">(null)</span>}
                            </div>
                            <div className="flex items-center gap-0 flex-wrap min-h-[48px]">
                                <AnimatePresence mode="popLayout">
                                    {list1Nodes.map((id, index) => renderNode(id, index === 0 ? 'list1' : undefined))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* List 2 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">List 2</span>
                                {currentStep.list2HeadId === null && <span className="text-xs text-muted-foreground italic">(null)</span>}
                            </div>
                            <div className="flex items-center gap-0 flex-wrap min-h-[48px]">
                                <AnimatePresence mode="popLayout">
                                    {list2Nodes.map((id, index) => renderNode(id, index === 0 ? 'list2' : undefined))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Merged List */}
                        <div className="space-y-2 pt-6 border-t border-border/40">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">Merged (via tail)</span>
                                {mergedNodes.length === 0 && <span className="text-xs text-muted-foreground italic">(initializing...)</span>}
                            </div>
                            <div className="flex items-center gap-0 flex-wrap min-h-[48px]">
                                <AnimatePresence mode="popLayout">
                                    {mergedNodes.map((id) => renderNode(id))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Commentary Panel */}
                    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6 relative overflow-hidden transition-all duration-300 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-border/40">
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
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
