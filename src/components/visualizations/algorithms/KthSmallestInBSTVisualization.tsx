import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  cur: number | null;
  stack: number[];
  n: number;
  k: number;
  visitedNodes: number[];
  foundNode: number | null;
  message: string;
  highlightedLines: number[];
}

export const KthSmallestInBSTVisualization = () => {
  const code = `function kthSmallest(root: TreeNode | null, k: number): number {
    let n = 0
    const stack: TreeNode[] = []
    let cur: TreeNode | null = root

    while (cur !== null || stack.length > 0) {
        while (cur !== null) {
            stack.push(cur)
            cur = cur.left
        }

        cur = stack.pop()!
        n++

        if (n === k) {
            return cur.val
        }

        cur = cur.right
    }
    return -1
}`;

  const steps: Step[] = [
    { cur: 3, stack: [], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "Initialize. n = 0, k = 3, cur = root (3).", highlightedLines: [1, 2, 3, 4] },
    { cur: 3, stack: [], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "Enter loop: cur is not null or stack is not empty.", highlightedLines: [6] },
    { cur: 3, stack: [], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "cur (3) is not null, entering inner loop to find leftmost node.", highlightedLines: [7] },
    { cur: 3, stack: [3], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "Push current node 3 onto the stack.", highlightedLines: [8] },
    { cur: 1, stack: [3], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "Move to the left child of 3 (node 1).", highlightedLines: [9] },
    { cur: 1, stack: [3], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "cur (1) is not null, continue inner loop.", highlightedLines: [7] },
    { cur: 1, stack: [3, 1], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "Push current node 1 onto the stack.", highlightedLines: [8] },
    { cur: null, stack: [3, 1], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "Move to the left child of 1 (null).", highlightedLines: [9] },
    { cur: null, stack: [3, 1], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "cur is null, exit inner loop.", highlightedLines: [7] },
    { cur: 1, stack: [3], n: 0, k: 3, visitedNodes: [], foundNode: null, message: "Pop from stack: node 1 is the smallest in this subtree.", highlightedLines: [12] },
    { cur: 1, stack: [3], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "Increment counter n to 1.", highlightedLines: [13] },
    { cur: 1, stack: [3], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "Check if n (1) is equal to k (3). Not yet.", highlightedLines: [15] },
    { cur: 2, stack: [3], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "Move to the right child of 1 (node 2).", highlightedLines: [19] },
    { cur: 2, stack: [3], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "Next iteration: cur (2) is not null.", highlightedLines: [6] },
    { cur: 2, stack: [3], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "cur (2) is not null, enter inner loop.", highlightedLines: [7] },
    { cur: 2, stack: [3, 2], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "Push node 2 onto the stack.", highlightedLines: [8] },
    { cur: null, stack: [3, 2], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "Move to the left child of 2 (null).", highlightedLines: [9] },
    { cur: null, stack: [3, 2], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "cur is null, exit inner loop.", highlightedLines: [7] },
    { cur: 2, stack: [3], n: 1, k: 3, visitedNodes: [1], foundNode: null, message: "Pop from stack: node 2 is next in order.", highlightedLines: [12] },
    { cur: 2, stack: [3], n: 2, k: 3, visitedNodes: [1, 2], foundNode: null, message: "Increment counter n to 2.", highlightedLines: [13] },
    { cur: 2, stack: [3], n: 2, k: 3, visitedNodes: [1, 2], foundNode: null, message: "Check if n (2) is equal to k (3). Not yet.", highlightedLines: [15] },
    { cur: null, stack: [3], n: 2, k: 3, visitedNodes: [1, 2], foundNode: null, message: "Move to the right child of 2 (null).", highlightedLines: [19] },
    { cur: null, stack: [3], n: 2, k: 3, visitedNodes: [1, 2], foundNode: null, message: "Next iteration: stack is not empty.", highlightedLines: [6] },
    { cur: null, stack: [3], n: 2, k: 3, visitedNodes: [1, 2], foundNode: null, message: "cur is null, skip inner loop.", highlightedLines: [7] },
    { cur: 3, stack: [], n: 2, k: 3, visitedNodes: [1, 2], foundNode: null, message: "Pop from stack: node 3 is next in order.", highlightedLines: [12] },
    { cur: 3, stack: [], n: 3, k: 3, visitedNodes: [1, 2, 3], foundNode: null, message: "Increment counter n to 3.", highlightedLines: [13] },
    { cur: 3, stack: [], n: 3, k: 3, visitedNodes: [1, 2, 3], foundNode: 3, message: "n (3) is equal to k (3)! Found the 3rd smallest element.", highlightedLines: [15, 16] },
    { cur: 3, stack: [], n: 3, k: 3, visitedNodes: [1, 2, 3], foundNode: 3, message: "3rd smallest element in the BST is 3.", highlightedLines: [16] }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const treeData = [
    { id: 3, x: 200, y: 50, left: 1, right: 4 },
    { id: 1, x: 120, y: 120, right: 2 },
    { id: 4, x: 280, y: 120 },
    { id: 2, x: 180, y: 190 }
  ];

  const renderTree = () => {
    return (
      <svg viewBox="0 0 400 250" className="w-full h-auto max-w-[400px] mx-auto">
        {/* Connections */}
        <line x1="200" y1="50" x2="120" y2="120" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="2" />
        <line x1="200" y1="50" x2="280" y2="120" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="2" />
        <line x1="120" y1="120" x2="180" y2="190" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="2" />

        {treeData.map((node) => {
          const isCurrent = step.cur === node.id;
          const isVisited = step.visitedNodes.includes(node.id);
          const isFound = step.foundNode === node.id;
          const inStack = step.stack.includes(node.id);

          return (
            <g key={node.id}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="22"
                initial={false}
                animate={{
                  fill: isFound ? "#22c55e" : isCurrent ? "#eab308" : inStack ? "#3b82f6" : isVisited ? "#94a3b8" : "transparent",
                  stroke: isFound ? "#22c55e" : isCurrent ? "#eab308" : inStack ? "#3b82f6" : "#94a3b8",
                  strokeWidth: isCurrent || isFound || inStack ? 3 : 2
                }}
                transition={{ duration: 0 }}
              />
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                className={`text-sm font-bold ${isCurrent || isFound || inStack ? "fill-white" : "fill-foreground"}`}
              >
                {node.id}
              </text>
              {isVisited && (
                <text
                  x={node.x}
                  y={node.y - 30}
                  textAnchor="middle"
                  className="text-xs font-bold fill-primary"
                >
                  #{step.visitedNodes.indexOf(node.id) + 1}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SimpleStepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6 relative overflow-hidden">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Tree Visualization</div>
            {renderTree()}
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>In Stack</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-400" />
                <span>Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Found</span>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0 }}
                  className="text-sm leading-relaxed"
                >
                  {step.message}
                </motion.div>
              </AnimatePresence>
            </Card>

            <VariablePanel
              variables={{
                k: step.k,
                n: step.n,
                stack: `[${step.stack.join(', ')}]`,
                cur: step.cur === null ? "null" : step.cur,
                visited: `[${step.visitedNodes.join(', ')}]`
              }}
            />
          </div>
        </div>

        <Card className="overflow-hidden border-none shadow-none bg-transparent">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={step.highlightedLines}
          />
        </Card>
      </div>
    </div>
  );
};
