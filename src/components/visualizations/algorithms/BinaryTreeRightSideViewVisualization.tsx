import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { TreeDeciduous, Inbox, ListChecks } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  queue: number[];
  result: number[];
  levelSize: number;
  i: number | string;
  currentNode: number | string;
  rightSideNode: number | string;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function rightSideView(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];
  while (queue.length > 0) {
    let rightSideNode: TreeNode | null = null;
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      rightSideNode = node;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    if (rightSideNode) {
      result.push(rightSideNode.val);
    }
  }
  return result;
}`,
  python: `def rightSideView(root: TreeNode | None) -> list[int]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        right_side_val = None
        for _ in range(level_size):
            node = queue.popleft()
            right_side_val = node.val
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        if right_side_val is not None:
            result.append(right_side_val)
    return result`,
  java: `public static class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            TreeNode rightmostNode = null;
            for (int i = 0; i < levelSize; i++) {
                TreeNode currentNode = queue.poll();
                rightmostNode = currentNode;
                if (currentNode.left != null) {
                    queue.offer(currentNode.left);
                }
                if (currentNode.right != null) {
                    queue.offer(currentNode.right);
                }
            }
            if (rightmostNode != null) {
                result.add(rightmostNode.val);
            }
        }
        return result;
    }
}`,
  cpp: `class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        if (!root) {
            return {};
        }
        vector<int> result;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            int levelSize = q.size();
            int rightmostVal = 0;
            for (int i = 0; i < levelSize; ++i) {
                TreeNode* node = q.front();
                q.pop();
                rightmostVal = node->val;
                if (node->left) {
                    q.push(node->left);
                }
                if (node->right) {
                    q.push(node->right);
                }
            }
            result.push_back(rightmostVal);
        }
        return result;
    }
};`
};

export const BinaryTreeRightSideViewVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTestCase, setActiveTestCase] = useState(0);

  const testCases = [
    {
      id: 'case1',
      name: 'Example 1',
      data: {
        val: 1,
        left: { 
          val: 2, 
          left: null, 
          right: { val: 5, left: null, right: null } 
        },
        right: {
          val: 3,
          left: null,
          right: { val: 4, left: null, right: null }
        }
      },
      positions: {
        1: { x: 200, y: 40 },
        2: { x: 100, y: 120 },
        3: { x: 300, y: 120 },
        5: { x: 150, y: 200 },
        4: { x: 350, y: 200 }
      },
      edges: [[1, 2], [1, 3], [2, 5], [3, 4]]
    },
    {
      id: 'case2',
      name: 'Example 2',
      data: {
        val: 1,
        left: {
          val: 2,
          left: {
            val: 4,
            left: { val: 5, left: null, right: null },
            right: null
          },
          right: null
        },
        right: {
          val: 3,
          left: null,
          right: null
        }
      },
      positions: {
        1: { x: 200, y: 40 },
        2: { x: 120, y: 100 },
        3: { x: 280, y: 100 },
        4: { x: 80, y: 160 },
        5: { x: 40, y: 220 }
      },
      edges: [[1, 2], [1, 3], [2, 4], [4, 5]]
    }
  ];

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const root = testCases[activeTestCase].data;

    const addStep = (
      q: number[],
      res: number[],
      levelSize: number,
      i: number | string,
      currentNode: number | string,
      rightSideNode: number | string,
      explanation: string,
      pseudo: string,
      ts: number, py: number, java: number, cpp: number
    ) => {
      stepsList.push({
        queue: q,
        result: res,
        levelSize,
        i,
        currentNode,
        rightSideNode,
        explanation,
        pseudoStep: pseudo
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    if (!root) {
      addStep(
        [], [], 0, '-', '-', '-',
        "Since the tree is completely empty, we can't see any nodes from the right side. We immediately return an empty array.",
        "IF NOT root  →  RETURN []",
        2, 2, 4, 4
      );
      return { steps: stepsList, stepLineNumbers: lines };
    }

    const result: number[] = [];
    const queue: any[] = [root];

    addStep(
      [root.val], [], 0, '-', '-', '-',
      "We're using Breadth-First Search (BFS) to traverse the tree level by level. We start by putting the root node in our queue to begin processing.",
      "SET result = [], queue = [root]",
      4, 5, 8, 9
    );

    while (queue.length > 0) {
      let rightSideNode: any = null;
      const levelSize = queue.length;
      addStep(
        queue.map(q => q.val), [...result], levelSize, '-', '-', '-',
        `We start processing a new level. We freeze the current queue size (${levelSize}) so we only process nodes currently on this level, ignoring children we're about to add.`,
        `SET levelSize = queue.length → ${levelSize}`,
        7, 7, 10, 11
      );

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        rightSideNode = node;

        addStep(
          queue.map(q => q.val), [...result], levelSize, i, node.val, rightSideNode.val,
          `We dequeue ${node.val}. We constantly overwrite 'rightSideNode' with the current node. Since we process from left to right, this ensures the last node on the level stays saved here!`,
          `SET rightSideNode = queue.shift() → ${node.val}`,
          9, 10, 13, 14
        );

        if (node.left) {
          queue.push(node.left);
          addStep(
            queue.map(q => q.val), [...result], levelSize, i, node.val, rightSideNode.val,
            `We push the left child (${node.left.val}) to the queue so it can be processed when we move down to the next level.`,
            `CALL queue.push(node.left)`,
            11, 13, 16, 18
          );
        }

        if (node.right) {
          queue.push(node.right);
          addStep(
            queue.map(q => q.val), [...result], levelSize, i, node.val, rightSideNode.val,
            `We push the right child (${node.right.val}) to the queue for the next level's processing.`,
            `CALL queue.push(node.right)`,
            12, 15, 20, 21
          );
        }
      }

      if (rightSideNode) {
        result.push(rightSideNode.val);
        addStep(
          queue.map(q => q.val), [...result], levelSize, '-', '-', rightSideNode.val,
          `We've finished scanning this level. The final node we processed was ${rightSideNode.val}, making it the rightmost node visible from the side! We add it to our result array.`,
          `CALL result.push(${rightSideNode.val})`,
          15, 17, 23, 24
        );
      }
    }

    addStep(
      [], [...result], 0, '-', '-', '-',
      "The queue is empty, meaning we've visited every level in the tree. Our result array now perfectly represents the view from the right side. We return it!",
      "RETURN result",
      18, 18, 26, 26
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [activeTestCase]);

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderTree = () => {
    const currentCase = testCases[activeTestCase];
    const { positions, edges } = currentCase;
    const nodeVals = Object.keys(positions).map(Number);

    return (
      <div className="w-full aspect-[400/240] relative">
        <svg viewBox="0 0 400 240" className="w-full h-full">
          {edges.map(([u, v], i) => (
            <line 
              key={i} 
              x1={positions[u].x} y1={positions[u].y} 
              x2={positions[v].x} y2={positions[v].y} 
              stroke="currentColor" className="text-border" strokeWidth="2" 
            />
          ))}
          {nodeVals.map(val => {
            const isCurrent = val === step.currentNode;
            const isRightSide = val === step.rightSideNode;
            const inQueue = step.queue.includes(val);
            const inResult = step.result.includes(val);
            
            return (
              <g key={val}>
                <motion.circle
                  cx={positions[val].x} cy={positions[val].y} r="18"
                  animate={{
                    fill: isCurrent ? '#3b82f6' : isRightSide && !inResult ? '#f59e0b20' : inResult ? '#10b98120' : inQueue ? '#3b82f620' : 'hsl(var(--card))',
                    stroke: isCurrent ? '#3b82f6' : isRightSide && !inResult ? '#f59e0b' : inResult ? '#10b981' : inQueue ? '#3b82f6' : 'hsl(var(--border))',
                    scale: isCurrent ? 1.2 : 1
                  }}
                  transition={{ duration: 0 }}
                  strokeWidth="2"
                />
                <text 
                  x={positions[val].x} y={positions[val].y + 4} textAnchor="middle" 
                  className={`text-[11px] font-bold select-none \${isCurrent ? 'fill-white' : 'fill-foreground'}`}
                >
                  {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <VisualizationLayout
      controls={
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
          
          <div className="flex items-center p-1 bg-muted/50 rounded-lg border border-border/50">
            {testCases.map((tc, idx) => (
              <button
                key={tc.id}
                onClick={() => { setActiveTestCase(idx); setCurrentStep(0); }}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all relative \${
                  activeTestCase === idx 
                    ? 'text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTestCase === idx && (
                  <motion.div
                    layoutId="active-case-bg"
                    className="absolute inset-0 bg-primary rounded-md"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tc.name}</span>
              </button>
            ))}
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-4 opacity-90 flex items-center gap-2">
              <TreeDeciduous size={16} className="text-primary" />
              Binary Tree Right Side View
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden flex justify-center items-center">
              {renderTree()}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="p-4 bg-primary/5 border-l-4 border-primary shadow-sm h-full flex flex-col justify-center">
               <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary/80 mb-2">Commentary</h4>
               <p className="text-[13px] font-medium leading-relaxed text-foreground/90">
                 {step.explanation}
               </p>
             </Card>
             
             <Card className="p-4 bg-muted/30 border-muted">
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <Inbox size={12} />
                  Queue Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {step.queue.map((q, idx) => (
                      <motion.div 
                        key={`\${q}-\${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0 }}
                        className="p-2 bg-background rounded border border-border shadow-sm min-w-[35px] text-center"
                      >
                        <span className="text-[12px] font-bold text-primary">{q}</span>
                      </motion.div>
                    ))}
                    {step.queue.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">Empty</span>
                    )}
                  </AnimatePresence>
                </div>
             </Card>
          </div>

          <Card className="p-4 bg-muted/30 border-muted">
             <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
               <ListChecks size={12} />
               Result (Right Side View)
             </h4>
             <div className="flex flex-wrap gap-2 min-h-[32px] items-center">
               {step.result.map((v, i) => (
                 <span key={i} className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 rounded text-[12px] font-bold">
                   {v}
                 </span>
               ))}
               {step.result.length === 0 && <span className="text-xs text-muted-foreground italic">No nodes processed yet</span>}
             </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStep}
            onLanguageChange={() => setCurrentStep(0)}
          />
          <VariablePanel
            variables={{
              levelSize: step.levelSize,
              "i": step.i,
              currentNode: step.currentNode,
              rightSideNode: step.rightSideNode,
            }}
          />
        </div>
      }
    />
  );
};
export default BinaryTreeRightSideViewVisualization;
