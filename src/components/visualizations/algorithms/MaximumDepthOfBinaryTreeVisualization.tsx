import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { TreeDeciduous, Inbox, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  currentNodeVal: number | null;
  maxDepthFound: number;
  currentDepth: number;
  queue: { val: number; depth: number }[];
  variables: Record<string, any>;
  explanation: string;
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function maxDepth(root: TreeNode | null): number {
  if (!root) {
    return 0;
  }
  let max = 0;
  const queue: [TreeNode, number][] = [[root, 1]];
  while (queue.length > 0) {
    const [node, depth] = queue.shift()!;
    max = Math.max(max, depth);
    if (node.left) {
      queue.push([node.left, depth + 1]);
    }
    if (node.right) {
      queue.push([node.right, depth + 1]);
    }
  }
  return max;
}`,
  python: `def maxDepth(root: TreeNode | None) -> int:
    if not root:
        return 0
    stack = [(root, 1)]
    res = 0
    while stack:
        node, depth = stack.pop()
        if node:
            res = max(res, depth)
            stack.append((node.left, depth + 1))
            stack.append((node.right, depth + 1))
    return res`,
  java: `public static class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        return Math.max(leftDepth, rightDepth) + 1;
    }
}`,
  cpp: `class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        int depth = 0;
        vector<pair<TreeNode*, int>> stack;
        stack.push_back({root, 1});
        while (!stack.empty()) {
            TreeNode* node = stack.back().first;
            int currentDepth = stack.back().second;
            stack.pop_back();
            depth = max(depth, currentDepth);
            if (node->left) {
                stack.push_back({node->left, currentDepth + 1});
            }
            if (node->right) {
                stack.push_back({node->right, currentDepth + 1});
            }
        }
        return depth;
    }
};`
};

export const MaximumDepthOfBinaryTreeVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseType, setCaseType] = useState<'case1' | 'case2'>('case1');

  const treeData = useMemo(() => {
    if (caseType === 'case1') {
      return {
        val: 3,
        left: { val: 9, left: null, right: null },
        right: {
          val: 20,
          left: { val: 15, left: null, right: null },
          right: { val: 7, left: null, right: null }
        }
      };
    } else {
      return {
        val: 1,
        left: { 
          val: 2, 
          left: { val: 4, left: null, right: null }, 
          right: { val: 5, left: null, right: null } 
        },
        right: { val: 3, left: null, right: null }
      };
    }
  }, [caseType]);

  const { steps, stepLineNumbers } = useMemo(() => {
    const stepsList: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const root = treeData;

    const addStep = (
      nodeVal: number | null,
      maxDepth: number,
      depth: number,
      q: { val: number; depth: number }[],
      variables: Record<string, any>,
      explanation: string,
      pseudo: string,
      ts: number, py: number, java: number, cpp: number
    ) => {
      stepsList.push({
        currentNodeVal: nodeVal,
        maxDepthFound: maxDepth,
        currentDepth: depth,
        queue: q,
        variables,
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
          null, 0, 0, [],
          { root: "null" },
          "Root is null, return 0.",
          "IF NOT root  →  RETURN 0",
          2, 2, 3, 4
        );
        return { steps: stepsList, stepLineNumbers: lines };
    }

    let max = 0;
    const queue: [any, number][] = [[root, 1]];

    addStep(
      null, 0, 0, [[root.val, 1]].map(q => ({ val: q[0], depth: q[1] })),
      { max, "queue": "[[root, 1]]" },
      "Initialize max to 0 and a queue with the root node at depth 1.",
      "SET max = 0, queue = [[root, 1]]",
      6, 4, 5, 5
    );

    while (queue.length > 0) {
        addStep(
          null, max, 0, queue.map(q => ({ val: q[0].val, depth: q[1] })),
          { "queue.length": queue.length, max },
          "Queue is not empty, continuing BFS traversal.",
          "WHILE queue IS NOT EMPTY",
          7, 6, 6, 8
        );

        const [node, depth] = queue.shift()!;
        
        addStep(
          node.val, max, depth, queue.map(q => ({ val: q[0].val, depth: q[1] })),
          { node: node.val, depth, max },
          `Dequeue node ${node.val} at depth ${depth}.`,
          "SET [node, depth] = queue.shift()",
          8, 7, 6, 9
        );

        const oldMax = max;
        max = Math.max(max, depth);

        addStep(
          node.val, max, depth, queue.map(q => ({ val: q[0].val, depth: q[1] })),
          { depth, "prev_max": oldMax, "new_max": max },
          `Update maximum depth encountered so far: max(${oldMax}, ${depth}) = ${max}.`,
          `SET max = max(max, depth) → ${max}`,
          9, 9, 8, 12
        );

        addStep(
          node.val, max, depth, queue.map(q => ({ val: q[0].val, depth: q[1] })),
          { "node.left": node.left ? node.left.val : "null" },
          node.left 
            ? `Left child exists (${node.left.val}). Enqueue it with depth ${depth + 1}.`
            : `No left child for node ${node.val}.`,
          `IF node.left  →  ${node.left ? 'YES ✓' : 'NO ✗'}`,
          10, 10, 6, 13
        );

        if (node.left) {
            queue.push([node.left, depth + 1]);
            addStep(
              node.val, max, depth, queue.map(q => ({ val: q[0].val, depth: q[1] })),
              { added: node.left.val, depth: depth + 1 },
              `Pushed [${node.left.val}, ${depth + 1}] to the queue.`,
              `CALL queue.push([node.left, depth + 1])`,
              11, 10, 6, 14
            );
        }

        addStep(
          node.val, max, depth, queue.map(q => ({ val: q[0].val, depth: q[1] })),
          { "node.right": node.right ? node.right.val : "null" },
          node.right 
            ? `Right child exists (${node.right.val}). Enqueue it with depth ${depth + 1}.`
            : `No right child for node ${node.val}.`,
          `IF node.right  →  ${node.right ? 'YES ✓' : 'NO ✗'}`,
          13, 11, 7, 16
        );

        if (node.right) {
            queue.push([node.right, depth + 1]);
            addStep(
              node.val, max, depth, queue.map(q => ({ val: q[0].val, depth: q[1] })),
              { added: node.right.val, depth: depth + 1 },
              `Pushed [${node.right.val}, ${depth + 1}] to the queue.`,
              `CALL queue.push([node.right, depth + 1])`,
              14, 11, 7, 17
            );
        }
    }

    addStep(
      null, max, 0, [],
      { return: max },
      `All nodes processed. The final maximum depth is ${max}.`,
      `RETURN max → ${max}`,
      17, 12, 8, 20
    );

    return { steps: stepsList, stepLineNumbers: lines };
  }, [treeData]);

  const handleCaseToggle = (type: 'case1' | 'case2') => {
    setCaseType(type);
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderTree = () => {
    const positions: Record<number, { x: number, y: number }> = caseType === 'case1' 
      ? {
          3: { x: 200, y: 40 },
          9: { x: 100, y: 120 },
          20: { x: 300, y: 120 },
          15: { x: 250, y: 200 },
          7: { x: 350, y: 200 }
        }
      : {
          1: { x: 200, y: 40 },
          2: { x: 100, y: 120 },
          3: { x: 300, y: 120 },
          4: { x: 50, y: 200 },
          5: { x: 150, y: 200 }
        };

    const edges = caseType === 'case1'
      ? [[3, 9], [3, 20], [20, 15], [20, 7]]
      : [[1, 2], [1, 3], [2, 4], [2, 5]];

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
            const isCurrent = val === step.currentNodeVal;
            const inQueue = step.queue.some(q => q.val === val);
            
            return (
              <g key={val}>
                <motion.circle
                  cx={positions[val].x} cy={positions[val].y} r="18"
                  animate={{
                    fill: isCurrent ? '#3b82f6' : inQueue ? '#3b82f620' : 'hsl(var(--card))',
                    stroke: isCurrent ? '#3b82f6' : inQueue ? '#3b82f6' : 'hsl(var(--border))',
                    scale: isCurrent ? 1.2 : 1
                  }}
                  transition={{ duration: 0 }}
                  strokeWidth="2"
                />
                <text 
                  x={positions[val].x} y={positions[val].y + 4} textAnchor="middle" 
                  className={`text-[11px] font-bold select-none ${isCurrent ? 'fill-white' : 'fill-foreground'}`}
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
        <div className="flex items-center gap-4 w-full justify-between">
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
          <div className="flex gap-2">
            <button 
              onClick={() => handleCaseToggle('case1')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case1' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Tree 1
            </button>
            <button 
              onClick={() => handleCaseToggle('case2')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case2' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Tree 2
            </button>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-6 flex flex-col h-full">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-4 opacity-90 flex items-center gap-2">
              <TreeDeciduous size={16} className="text-primary" />
              BFS Traversal
            </h2>
            <Card className="p-8 bg-card/60 backdrop-blur border-border/50 shadow-sm overflow-hidden flex justify-center items-center">
              {renderTree()}
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-4">
               <Card className="p-4 bg-primary/5 border-l-4 border-primary shadow-sm h-full flex flex-col justify-center">
                 <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary/80 mb-2">Commentary</h4>
                 <p className="text-[13px] font-medium leading-relaxed text-foreground/90">
                   {step.explanation}
                 </p>
               </Card>
             </div>
             
             <Card className="p-4 bg-muted/30 border-muted">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Inbox size={12} />
                    Queue Status
                  </h4>
                  <div className="flex items-center gap-1">
                    <Maximize2 size={10} className="text-muted-foreground" />
                    <span className="text-[10px] font-bold text-primary">{step.maxDepthFound}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence mode="popLayout">
                    {step.queue.map((q, idx) => (
                      <motion.div 
                        key={`${q.val}-${idx}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0 }}
                        className="flex flex-col items-center p-2 bg-background rounded border border-border shadow-sm min-w-[45px]"
                      >
                        <span className="text-[12px] font-bold text-primary">{q.val}</span>
                        <span className="text-[9px] text-muted-foreground font-mono">d:{q.depth}</span>
                      </motion.div>
                    ))}
                    {step.queue.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">Empty</span>
                    )}
                  </AnimatePresence>
                </div>
             </Card>
          </div>

          <div className="p-1">
            <VariablePanel variables={step.variables} />
          </div>
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
      }
    />
  );
};
export default MaximumDepthOfBinaryTreeVisualization;