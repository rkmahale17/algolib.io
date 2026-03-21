import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface Step {
  currentNode: number | null;
  p: number;
  q: number;
  found: boolean;
  message: string;
  lineNumber: number;
  variables: Record<string, any>;
}

export const LowestCommonAncestorBSTVisualization = () => {
  const code = `function lowestCommonAncestor(root, p, q) {
  let cur = root;

  while (cur) {
    if (p.val > cur.val && q.val > cur.val) {
      cur = cur.right;
    } else if (p.val < cur.val && q.val < cur.val) {
      cur = cur.left;
    } else {
      return cur;
    }
  }

  return null;
}`;

  // Example 1: LCA(3, 5) -> 4
  const steps1: Step[] = [
    { currentNode: null, p: 3, q: 5, found: false, message: "Find LCA of nodes 3 and 5 in the BST.", lineNumber: 1, variables: { p: '3', q: '5', root: '6' } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Initialize 'cur' with the root node (6).", lineNumber: 2, variables: { cur: '6', p: '3', q: '5' } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "While 'cur' is not null, traverse the tree.", lineNumber: 4, variables: { cur: '6' } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Compare p(3) and q(5) with cur(6).", lineNumber: 5, variables: { p: '3', q: '5', cur: '6', 'both > cur': false } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Check if both p(3) and q(5) are less than cur(6).", lineNumber: 7, variables: { p: '3', q: '5', cur: '6', 'both < cur': true } },
    { currentNode: 6, p: 3, q: 5, found: false, message: "Both are smaller. Move 'cur' to the left child (2).", lineNumber: 8, variables: { cur: '6', next: 'left (2)' } },
    { currentNode: 2, p: 3, q: 5, found: false, message: "Updated 'cur' to 2. Continue loop.", lineNumber: 4, variables: { cur: '2' } },
    { currentNode: 2, p: 3, q: 5, found: false, message: "Check if both p(3) and q(5) are greater than cur(2).", lineNumber: 5, variables: { p: '3', q: '5', cur: '2', 'both > cur': true } },
    { currentNode: 2, p: 3, q: 5, found: false, message: "Both are greater. Move 'cur' to the right child (4).", lineNumber: 6, variables: { cur: '2', next: 'right (4)' } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Updated 'cur' to 4. Continue loop.", lineNumber: 4, variables: { cur: '4' } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Check if both nodes are in the same subtree.", lineNumber: 5, variables: { p: '3', q: '5', cur: '4', 'both > cur': false } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Check if both nodes are in the same subtree.", lineNumber: 7, variables: { p: '3', q: '5', cur: '4', 'both < cur': false } },
    { currentNode: 4, p: 3, q: 5, found: false, message: "Neither condition met. Split point found at 4!", lineNumber: 10, variables: { cur: '4', status: 'split' } },
    { currentNode: 4, p: 3, q: 5, found: true, message: "Node 4 is the Lowest Common Ancestor.", lineNumber: 10, variables: { LCA: '4' } }
  ];

  // Example 2: LCA(2, 4) -> 2
  const steps2: Step[] = [
    { currentNode: null, p: 2, q: 4, found: false, message: "Find LCA of nodes 2 and 4 (where 2 is an ancestor of 4).", lineNumber: 1, variables: { p: '2', q: '4', root: '6' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Initialize 'cur' with the root node (6).", lineNumber: 2, variables: { cur: '6' } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Check traversal conditions at node 6.", lineNumber: 7, variables: { p: '2', q: '4', cur: '6', 'both < cur': true } },
    { currentNode: 6, p: 2, q: 4, found: false, message: "Both are smaller. Move to left child (2).", lineNumber: 8, variables: { next: 'left (2)' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Updated 'cur' to 2. Continue loop.", lineNumber: 4, variables: { cur: '2' } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "At node 2, p(2) matches cur(2).", lineNumber: 5, variables: { p: '2', q: '4', cur: '2', 'both > cur': false } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "At node 2, p(2) matches cur(2).", lineNumber: 7, variables: { p: '2', q: '4', cur: '2', 'both < cur': false } },
    { currentNode: 2, p: 2, q: 4, found: false, message: "Split/Found point identified at 2.", lineNumber: 10, variables: { cur: '2', status: 'LCA node reached' } },
    { currentNode: 2, p: 2, q: 4, found: true, message: "Node 2 is the Lowest Common Ancestor.", lineNumber: 10, variables: { LCA: '2' } }
  ];

  const allSteps = [...steps1, ...steps2];

  const [idx, setIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const step = allSteps[idx];
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && idx < allSteps.length - 1) {
      intervalRef.current = setInterval(() => {
        setIdx(prev => {
          if (prev >= allSteps.length - 1) {
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
    }
  }, [isPlaying, idx, allSteps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => idx < allSteps.length - 1 && setIdx(prev => prev + 1);
  const handleStepBack = () => idx > 0 && setIdx(prev => prev - 1);
  const handleReset = () => {
    setIdx(0);
    setIsPlaying(false);
  };

  const renderTree = () => {
    const nodes = [
      { x: 200, y: 40, val: 6, left: 2, right: 8 },
      { x: 100, y: 100, val: 2, left: 0, right: 4 },
      { x: 300, y: 100, val: 8, left: 7, right: 9 },
      { x: 50, y: 160, val: 0, left: null, right: null },
      { x: 150, y: 160, val: 4, left: 3, right: 5 },
      { x: 250, y: 160, val: 7, left: null, right: null },
      { x: 350, y: 160, val: 9, left: null, right: null },
      { x: 125, y: 220, val: 3, left: null, right: null },
      { x: 175, y: 220, val: 5, left: null, right: null },
    ];

    const findNode = (val: number) => nodes.find(n => n.val === val);

    return (
      <svg viewBox="0 0 400 260" className="w-full h-64 overflow-visible">
        {nodes.map(node => (
          <g key={`links-${node.val}`}>
            {node.left !== null && (
              <line
                x1={node.x} y1={node.y}
                x2={findNode(node.left)!.x} y2={findNode(node.left)!.y}
                stroke="currentColor" className="text-border transition-all duration-300" strokeWidth="2"
              />
            )}
            {node.right !== null && (
              <line
                x1={node.x} y1={node.y}
                x2={findNode(node.right)!.x} y2={findNode(node.right)!.y}
                stroke="currentColor" className="text-border transition-all duration-300" strokeWidth="2"
              />
            )}
          </g>
        ))}
        {nodes.map((pos) => {
          const isCurrent = step.currentNode === pos.val;
          const isTarget = pos.val === step.p || pos.val === step.q;
          const isLCA = step.found && step.currentNode === pos.val;

          return (
            <g key={pos.val}>
              <motion.circle
                initial={false}
                animate={{
                  r: isCurrent ? 26 : 22,
                  strokeWidth: isCurrent ? 4 : 2
                }}
                cx={pos.x}
                cy={pos.y}
                className={`transition-all duration-500 ${isLCA
                  ? 'fill-green-500 stroke-green-600 shadow-lg shadow-green-500/50'
                  : isCurrent
                    ? 'fill-primary stroke-primary'
                    : isTarget
                      ? 'fill-blue-500 stroke-blue-600'
                      : 'fill-card stroke-border'
                  }`}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dy=".3em"
                className={`text-sm font-medium transition-colors duration-300 ${isTarget || isCurrent || isLCA ? 'fill-white' : 'fill-foreground'}`}
              >
                {pos.val}
              </text>
              {isTarget && !isLCA && !isCurrent && (
                <text
                  x={pos.x}
                  y={pos.y - 32}
                  textAnchor="middle"
                  className="text-xs font-bold fill-blue-600 animate-pulse"
                >
                  {pos.val === step.p ? 'p' : 'q'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

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
        currentStep={idx}
        totalSteps={allSteps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 pb-4 overflow-hidden relative">
            <div className="absolute top-4 right-4 flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-muted-foreground">Targets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-medium text-muted-foreground">Current</span>
              </div>
            </div>
            {renderTree()}
          </div>

          <div className={`rounded-lg border p-4 transition-all duration-300 ${step.found ? 'bg-green-500/10 border-green-500' : 'bg-accent/50 border-accent'}`}>
            <AnimatePresence mode="wait">
              <motion.p
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-sm text-foreground font-medium"
              >
                {step.message}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className='rounded-lg border bg-card'>
            <VariablePanel variables={step.variables} />
          </div>
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[step.lineNumber]} language="TypeScript" />
      </div>
    </div>
  );
};
