import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';

interface Step {
  currentNode: number | null;
  leftVal: number | null;
  rightVal: number | null;
  swapped: boolean;
  tree: { [key: number]: { left: number | null; right: number | null } };
  message: string;
  highlightedLines: number[];
  stackDepth: number;
}

export const InvertBinaryTreeVisualization = () => {
  const code = `function invertTree(root: TreeNode | null): TreeNode | null {
  if (root === null) return null;
  
  const temp = root.left;
  root.left = root.right;
  root.right = temp;
  
  invertTree(root.left);
  invertTree(root.right);
  
  return root;
}`;

  const initialTree = {
    4: { left: 2, right: 7 },
    2: { left: 1, right: 3 },
    7: { left: 6, right: 9 },
    1: { left: null, right: null },
    3: { left: null, right: null },
    6: { left: null, right: null },
    9: { left: null, right: null }
  };

  const steps: Step[] = [
    // --- 1. Root Node (4) ---
    { currentNode: 4, leftVal: 2, rightVal: 7, swapped: false, tree: initialTree, message: "Start: invertTree(4). Entering root function.", highlightedLines: [1, 2], stackDepth: 1 },
    { currentNode: 4, leftVal: 2, rightVal: 7, swapped: false, tree: initialTree, message: "Storing current root.left (2) in temp variable.", highlightedLines: [4], stackDepth: 1 },
    { currentNode: 4, leftVal: 7, rightVal: 7, swapped: false, tree: initialTree, message: "Assigning root.right (7) to root.left.", highlightedLines: [5], stackDepth: 1 },
    { currentNode: 4, leftVal: 7, rightVal: 2, swapped: true, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Assigning temp (2) to root.right. Children swapped! ✓", highlightedLines: [6], stackDepth: 1 },

    // --- 2. Recurse Left (Node 7) ---
    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Recurse Left: Calling invertTree(7).", highlightedLines: [8], stackDepth: 2 },
    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "At node 7: Checking if root is null. It's not.", highlightedLines: [2], stackDepth: 2 },
    { currentNode: 7, leftVal: 6, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Storing node 7's left child (6) in temp.", highlightedLines: [4], stackDepth: 2 },
    { currentNode: 7, leftVal: 9, rightVal: 9, swapped: false, tree: { ...initialTree, 4: { left: 7, right: 2 } }, message: "Assigning node 7's right child (9) to its left child.", highlightedLines: [5], stackDepth: 2 },
    { currentNode: 7, leftVal: 9, rightVal: 6, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Assigning temp (6) to node 7's right child. Swapped! ✓", highlightedLines: [6], stackDepth: 2 },

    // --- 3. Base Cases & Returns ---
    { currentNode: 9, leftVal: null, rightVal: null, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Recurse Left on node 7: invertTree(9).", highlightedLines: [8], stackDepth: 3 },
    { currentNode: 9, leftVal: null, rightVal: null, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "At node 9: Child nodes are null, returning.", highlightedLines: [2], stackDepth: 3 },
    { currentNode: 9, leftVal: null, rightVal: null, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Node 9 complete, returning node up the stack.", highlightedLines: [11], stackDepth: 3 },

    { currentNode: 6, leftVal: null, rightVal: null, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Recurse Right on node 7: invertTree(6).", highlightedLines: [9], stackDepth: 3 },
    { currentNode: 6, leftVal: null, rightVal: null, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Node 6 complete, returning node up the stack.", highlightedLines: [11], stackDepth: 3 },
    { currentNode: 7, leftVal: 9, rightVal: 6, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Returning from node 7 function call.", highlightedLines: [11], stackDepth: 2 },

    // --- 4. Recurse Right (Node 2) ---
    { currentNode: 2, leftVal: 1, rightVal: 3, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Back at root (4): Recurse Right: calling invertTree(2).", highlightedLines: [9], stackDepth: 1 },
    { currentNode: 2, leftVal: 1, rightVal: 3, swapped: false, tree: { 4: { left: 7, right: 2 }, 2: { left: 1, right: 3 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "At node 2: Swapping its children 1 and 3.", highlightedLines: [4, 5, 6], stackDepth: 2 },
    { currentNode: 2, leftVal: 3, rightVal: 1, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 3, right: 1 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Inverting children of node 2 complete. ✓", highlightedLines: [6], stackDepth: 2 },
    { currentNode: 2, leftVal: 3, rightVal: 1, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 3, right: 1 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "Returning from node 2 function call.", highlightedLines: [11], stackDepth: 2 },

    // --- 5. Final Result ---
    { currentNode: 4, leftVal: 7, rightVal: 2, swapped: true, tree: { 4: { left: 7, right: 2 }, 2: { left: 3, right: 1 }, 7: { left: 9, right: 6 }, 1: { left: null, right: null }, 3: { left: null, right: null }, 6: { left: null, right: null }, 9: { left: null, right: null } }, message: "All work finished! Final tree fully inverted. ✓", highlightedLines: [11], stackDepth: 1 }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const variables = useMemo(() => ({
    currentNode: currentStep.currentNode ?? 'null',
    leftChild: currentStep.leftVal ?? 'null',
    rightChild: currentStep.rightVal ?? 'null',
    stackDepth: currentStep.stackDepth
  }), [currentStep]);

  const renderTree = () => {
    const tree = currentStep.tree;
    // Normalized coordinates for 400x220 viewBox
    const positions = [
      { x: 200, y: 40, value: 4 },
      { x: 120, y: 100, value: tree[4]?.left ?? 2 },
      { x: 280, y: 100, value: tree[4]?.right ?? 7 },
      { x: 80, y: 160, value: tree[tree[4]?.left ?? 2]?.left ?? 1 },
      { x: 160, y: 160, value: tree[tree[4]?.left ?? 2]?.right ?? 3 },
      { x: 240, y: 160, value: tree[tree[4]?.right ?? 7]?.left ?? 6 },
      { x: 320, y: 160, value: tree[tree[4]?.right ?? 7]?.right ?? 9 }
    ];

    return (
      <div className="w-full aspect-[400/220] relative">
        <svg
          viewBox="0 0 400 220"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Edges */}
          <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={120} y1={100} x2={80} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={120} y1={100} x2={160} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={240} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={320} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />

          {/* Nodes */}
          {positions.map((pos, i) => {
            const isCurrent = currentStep.currentNode === pos.value;
            const isSwapped = currentStep.swapped && currentStep.currentNode === pos.value;

            return (
              <g key={i}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  animate={{
                    fill: isSwapped ? '#22c55e' : isCurrent ? '#eab308' : 'hsl(var(--card))',
                    scale: isCurrent ? 1.1 : 1
                  }}
                  className="stroke-border"
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 6}
                  textAnchor="middle"
                  className="text-xs font-bold fill-foreground select-none"
                >
                  {pos.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Controls - No background or bordering card */}
      <div className="px-2">
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Visualization & Context */}
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/5 shadow-lg overflow-hidden">
            {renderTree()}
          </Card>

          <div className="space-y-4">
            {/* Commentary Box - Now above VariablePanel */}
            <Card className="p-4 bg-primary/5 border-2 border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-sm font-medium leading-relaxed"
                  >
                    {currentStep.message}
                  </motion.p>
                </AnimatePresence>
              </div>
            </Card>

            <VariablePanel variables={variables} />
          </div>
        </div>

        {/* Right Column: Code Editor */}
        <div className="lg:h-[calc(100vh-250px)] min-h-[500px]">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={currentStep.highlightedLines}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
