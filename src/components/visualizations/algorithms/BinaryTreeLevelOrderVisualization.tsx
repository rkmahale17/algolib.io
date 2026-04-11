import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';

interface Step {
  queue: number[];
  result: number[][];
  currentLevel: number[];
  levelSize: number;
  i: number | string;
  currentNode: number | string;
  message: string;
  highlightedLines: number[];
}

export const BinaryTreeLevelOrderVisualization = () => {
  const code = `function levelOrder(root: TreeNode | null): number[][] {
  if (root === null) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`;

  // Line Mapping:
  // 1: function levelOrder...
  // 2:   if (root === null) return [];
  // 3:   const result: number[][] = [];
  // 4:   const queue: TreeNode[] = [root];
  // 5:   while (queue.length > 0) {
  // 6:     const levelSize = queue.length;
  // 7:     const currentLevel: number[] = [];
  // 8:     for (let i = 0; i < levelSize; i++) {
  // 9:       const node = queue.shift()!;
  // 10:      currentLevel.push(node.val);
  // 11:      if (node.left) queue.push(node.left);
  // 12:      if (node.right) queue.push(node.right);
  // 13:    }
  // 14:    result.push(currentLevel);
  // 15:  }
  // 16:  return result;
  // 17: }

  const steps: Step[] = [
    { queue: [], result: [], currentLevel: [], levelSize: 0, i: '-', currentNode: '-', message: "The algorithm begins. Our first task is to check if the root is null. This handles the edge case of an empty tree.", highlightedLines: [2] },
    { queue: [], result: [], currentLevel: [], levelSize: 0, i: '-', currentNode: 3, message: "The root node exists (value: 3), so the null check is bypassed and the function continues.", highlightedLines: [2] },
    { queue: [], result: [], currentLevel: [], levelSize: 0, i: '-', currentNode: '-', message: "We initialize an empty array called 'result'. This will eventually store our final list of levels: [[layer 0], [layer 1], ...].", highlightedLines: [3] },
    { queue: [3], result: [], currentLevel: [], levelSize: 0, i: '-', currentNode: '-', message: "We initialize a queue with the root node. In a Level-Order Traversal (BFS), a queue is essential for processing nodes layer by layer.", highlightedLines: [4] },

    { queue: [3], result: [], currentLevel: [], levelSize: 0, i: '-', currentNode: '-', message: "We enter the main 'while' loop. This loop will persist as long as there are nodes remaining in the queue to be explored.", highlightedLines: [5] },
    { queue: [3], result: [], currentLevel: [], levelSize: 1, i: '-', currentNode: '-', message: "We measure 'levelSize' (queue.length = 1). This tells the algorithm exactly how many nodes currently exist at this specific depth of the tree.", highlightedLines: [6] },
    { queue: [3], result: [], currentLevel: [], levelSize: 1, i: '-', currentNode: '-', message: "We prepare an empty 'currentLevel' list. This will accumulate the values of all nodes at the current depth.", highlightedLines: [7] },

    { queue: [3], result: [], currentLevel: [], levelSize: 1, i: 0, currentNode: '-', message: "We enter the 'for' loop to process precisely 'levelSize' nodes. Currently, i = 0.", highlightedLines: [8] },
    { queue: [], result: [], currentLevel: [], levelSize: 1, i: 0, currentNode: 3, message: "We dequeue node 3. This node is now 'active' and its children will be the next to enter the queue.", highlightedLines: [9] },
    { queue: [], result: [], currentLevel: [3], levelSize: 1, i: 0, currentNode: 3, message: "We add the value 3 to our 'currentLevel' list. Node 3 is part of the first level.", highlightedLines: [10] },

    { queue: [], result: [], currentLevel: [3], levelSize: 1, i: 0, currentNode: 3, message: "Checking node 3's left child. Value 9 is found and pushed to the back of the queue.", highlightedLines: [11] },
    { queue: [9], result: [], currentLevel: [3], levelSize: 1, i: 0, currentNode: 3, message: "Checking node 3's right child. Value 20 is found and pushed into the queue. Level 1 nodes are now queued up.", highlightedLines: [12] },
    { queue: [9, 20], result: [], currentLevel: [3], levelSize: 1, i: 1, currentNode: '-', message: "Loop check: i is incremented to 1. Since i is no longer less than levelSize (1), the inner loop terminates.", highlightedLines: [8] },

    { queue: [9, 20], result: [[3]], currentLevel: [3], levelSize: 1, i: '-', currentNode: '-', message: "All nodes for Level 0 have been processed. We push the 'currentLevel' list ([3]) into our final 'result' array.", highlightedLines: [14] },

    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 1, i: '-', currentNode: '-', message: "The queue is not empty (it contains [9, 20]), indicating we have another level to process.", highlightedLines: [5] },
    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 2, i: '-', currentNode: '-', message: "Level 1 contains 2 nodes (9 and 20). We set 'levelSize' to 2.", highlightedLines: [6] },
    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 2, i: '-', currentNode: '-', message: "Resetting 'currentLevel' to an empty list to collect node values for Level 1.", highlightedLines: [7] },

    { queue: [9, 20], result: [[3]], currentLevel: [], levelSize: 2, i: 0, currentNode: '-', message: "Starting the inner processing for Level 1. Processing node 0 of 2 (i = 0).", highlightedLines: [8] },
    { queue: [20], result: [[3]], currentLevel: [], levelSize: 2, i: 0, currentNode: 9, message: "We dequeue the first node at this level: node 9.", highlightedLines: [9] },
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, i: 0, currentNode: 9, message: "Adding value 9 to the current level collection.", highlightedLines: [10] },

    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, i: 0, currentNode: 9, message: "Node 9 is a leaf; it has no left or right children to add to the queue.", highlightedLines: [11] },
    { queue: [20], result: [[3]], currentLevel: [9], levelSize: 2, i: 1, currentNode: '-', message: "Moving to the next node in the current level (i = 1).", highlightedLines: [8] },
    { queue: [], result: [[3]], currentLevel: [9], levelSize: 2, i: 1, currentNode: 20, message: "We dequeue node 20.", highlightedLines: [9] },
    { queue: [], result: [[3]], currentLevel: [9, 20], levelSize: 2, i: 1, currentNode: 20, message: "Adding value 20 to the 'currentLevel' array, making it [9, 20].", highlightedLines: [10] },

    { queue: [], result: [[3]], currentLevel: [9, 20], levelSize: 2, i: 1, currentNode: 20, message: "Node 20 has a left child (15), so we add it to the queue for the next layer.", highlightedLines: [11] },
    { queue: [15], result: [[3]], currentLevel: [9, 20], levelSize: 2, i: 1, currentNode: 20, message: "Node 20 has a right child (7), so we add it to the queue as well.", highlightedLines: [12] },
    { queue: [15, 7], result: [[3]], currentLevel: [9, 20], levelSize: 2, i: 2, currentNode: '-', message: "All work for the 2 nodes at this level is finished (i = 2, levelSize = 2).", highlightedLines: [8] },

    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [9, 20], levelSize: 2, i: '-', currentNode: '-', message: "Level 1 processing complete. We push [9, 20] into our final 'result'.", highlightedLines: [14] },

    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, i: '-', currentNode: '-', message: "Re-entering main loop. The queue contains nodes for Level 2.", highlightedLines: [5] },
    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, i: '-', currentNode: '-', message: "Level 2 has 2 nodes: 15 and 7. We set 'levelSize' to 2.", highlightedLines: [6] },
    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, i: '-', currentNode: '-', message: "Preparing Level 2's 'currentLevel' list.", highlightedLines: [7] },

    { queue: [15, 7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, i: 0, currentNode: '-', message: "Processing node 0 of 2 for Level 2 (i = 0).", highlightedLines: [8] },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [], levelSize: 2, i: 0, currentNode: 15, message: "Dequeue node 15.", highlightedLines: [9] },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, i: 0, currentNode: 15, message: "Add value 15 to Level 2's dataset.", highlightedLines: [10] },

    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, i: 0, currentNode: 15, message: "Node 15 is a leaf node; no children to enqueue.", highlightedLines: [11] },
    { queue: [7], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, i: 1, currentNode: '-', message: "Moving to the final node of Level 2 (i = 1).", highlightedLines: [8] },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15], levelSize: 2, i: 1, currentNode: 7, message: "Dequeue node 7.", highlightedLines: [9] },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, i: 1, currentNode: 7, message: "Add value 7 to Level 2 dataset.", highlightedLines: [10] },

    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, i: 1, currentNode: 7, message: "Node 7 is also a leaf node; no children to explore.", highlightedLines: [11] },
    { queue: [], result: [[3], [9, 20]], currentLevel: [15, 7], levelSize: 2, i: 2, currentNode: '-', message: "Finished processing Level 2 nodes (i = 2, levelSize = 2).", highlightedLines: [8] },

    { queue: [], result: [[3], [9, 20], [15, 7]], currentLevel: [15, 7], levelSize: 2, i: '-', currentNode: '-', message: "Level 2 complete! We push [15, 7] into our 'result'. our final result is now [[3], [9, 20], [15, 7]].", highlightedLines: [14] },

    { queue: [], result: [[3], [9, 20], [15, 7]], currentLevel: [], levelSize: 0, i: '-', currentNode: '-', message: "The queue is now empty. We break out of the main 'while' loop.", highlightedLines: [5] },
    { queue: [], result: [[3], [9, 20], [15, 7]], currentLevel: [], levelSize: 0, i: '-', currentNode: '-', message: "Returning the fully constructed level-order traversal result.", highlightedLines: [16] }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const renderTree = () => {
    const positions = [
      { x: 200, y: 40, value: 3, level: 0 },
      { x: 120, y: 100, value: 9, level: 1 },
      { x: 280, y: 100, value: 20, level: 1 },
      { x: 240, y: 160, value: 15, level: 2 },
      { x: 320, y: 160, value: 7, level: 2 }
    ];

    const visitedNodes = step.result.flat();

    return (
      <div className="w-full">
        <svg viewBox="0 0 400 220" className="w-full h-auto">
          {/* Lines */}
          <line x1={200} y1={40} x2={120} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={200} y1={40} x2={280} y2={100} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={240} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />
          <line x1={280} y1={100} x2={320} y2={160} stroke="currentColor" className="text-border" strokeWidth="2" />

          {/* Nodes */}
          {positions.map((pos, i) => {
            const isCurrent = step.currentNode === pos.value;
            const isInQueue = step.queue.includes(pos.value);
            const isVisited = visitedNodes.includes(pos.value) || (step.currentLevel.includes(pos.value) && currentStep < steps.length - 1);

            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  className={`${isCurrent
                    ? 'fill-yellow-500'
                    : isVisited
                      ? 'fill-green-500'
                      : isInQueue
                        ? 'fill-blue-500'
                        : 'fill-card'
                    } stroke-foreground`}
                  strokeWidth="2"
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="text-xs font-bold fill-foreground"
                >
                  {pos.value}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 35}
                  textAnchor="middle"
                  className="text-[10px] fill-muted-foreground"
                >
                  L{pos.level}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <SimpleStepControls
        currentStep={currentStep}
        totalSteps={steps.length}
        onStepChange={setCurrentStep}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-sm font-semibold mb-4 text-center">Binary Tree Structure</div>
            {renderTree()}
            <div className="mt-4 flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-foreground" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 border border-foreground" />
                <span>In Queue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500 border border-foreground" />
                <span>Visited</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-primary bg-primary/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm font-medium leading-relaxed">{step.message}</p>
              </motion.div>
            </AnimatePresence>
          </Card>

          <VariablePanel
            variables={{
              queue: `[${step.queue.join(', ')}]`,
              levelSize: step.levelSize,
              i: step.i,
              currentNode: step.currentNode,
              currentLevel: `[${step.currentLevel.join(', ')}]`,
              result: JSON.stringify(step.result)
            }}
          />
        </div>

        <div className="h-full">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={step.highlightedLines}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};