import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  currentNode: number | null;
  p: number;
  q: number;
  found: boolean;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function lowestCommonAncestor(
  root: TreeNode | null,
  p: TreeNode,
  q: TreeNode
): TreeNode | null {
  let cur = root
  while (cur) {
    if (p.val > cur.val && q.val > cur.val) {
      cur = cur.right
    }
    else if (p.val < cur.val && q.val < cur.val) {
      cur = cur.left
    }
    else {
      return cur
    }
  }
  return null
}`,

  python: `def lowestCommonAncestor(root, p, q):
    cur = root
    while cur:
        if p.val > cur.val and q.val > cur.val:
            cur = cur.right
        elif p.val < cur.val and q.val < cur.val:
            cur = cur.left
        else:
            return cur
    return None`,

  java: `public static class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode cur = root;
        while (cur != null) {
            if (p.val > cur.val && q.val > cur.val) {
                cur = cur.right;
            }
            else if (p.val < cur.val && q.val < cur.val) {
                cur = cur.left;
            }
            else {
                return cur;
            }
        }
        return null;
    }
}`,

  cpp: `class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* cur = root;
        while (cur) {
            if (p->val > cur->val && q->val > cur->val) {
                cur = cur->right;
            }
            else if (p->val < cur->val && q->val < cur->val) {
                cur = cur->left;
            }
            else {
                return cur;
            }
        }
        return nullptr;
    }
};`,
};

export const LowestCommonAncestorBSTVisualization = () => {
  const generateSteps = () => {
    const steps: Step[] = [];
    const stepLineNumbers: StepLineNumberMap = {
      typescript: [],
      python: [],
      java: [],
      cpp: []
    };

    const addLines = (ts: number, py: number, java: number, cpp: number) => {
      stepLineNumbers.typescript!.push(ts);
      stepLineNumbers.python!.push(py);
      stepLineNumbers.java!.push(java);
      stepLineNumbers.cpp!.push(cpp);
    };

    const addStep = (
      currentNode: number | null,
      p: number,
      q: number,
      found: boolean,
      msg: string,
      pseudo: string,
      ts_l: number, py_l: number, java_l: number, cpp_l: number
    ) => {
      steps.push({
        currentNode,
        p,
        q,
        found,
        message: msg,
        pseudoStep: pseudo,
        variables: {
          currentNode: currentNode ?? 'null',
          p,
          q,
          found: found ? 'TRUE' : 'FALSE'
        }
      });
      addLines(ts_l, py_l, java_l, cpp_l);
    };

    // Run Example 1: LCA(3, 5) -> 4
    const p1 = 3, q1 = 5;
    addStep(null, p1, q1, false, "Find LCA of nodes 3 and 5 in the BST.", "START lowestCommonAncestor(root, p=3, q=5)", 1, 1, 2, 3);
    addStep(6, p1, q1, false, "Initialize 'cur' with the root node (6).", "cur = root", 6, 2, 3, 4);
    addStep(6, p1, q1, false, "Check if 'cur' is not null.", "while (cur)", 7, 3, 4, 5);
    addStep(6, p1, q1, false, "Compare target values with current node 6.", "if (p.val > cur.val && q.val > cur.val)", 8, 4, 5, 6);
    addStep(6, p1, q1, false, "Check if both p and q are in the left subtree of 6.", "else if (p.val < cur.val && q.val < cur.val)", 11, 6, 8, 9);
    addStep(6, p1, q1, false, "Both nodes are smaller than 6. Move 'cur' left.", "cur = cur.left", 12, 7, 9, 10);
    
    addStep(2, p1, q1, false, "Check if 'cur' (2) is not null.", "while (cur)", 7, 3, 4, 5);
    addStep(2, p1, q1, false, "Check if both p and q are in the right subtree of 2.", "if (p.val > cur.val && q.val > cur.val)", 8, 4, 5, 6);
    addStep(2, p1, q1, false, "Both nodes are larger than 2. Move 'cur' right.", "cur = cur.right", 9, 5, 6, 7);

    addStep(4, p1, q1, false, "Check if 'cur' (4) is not null.", "while (cur)", 7, 3, 4, 5);
    addStep(4, p1, q1, false, "Check if both target values are in the right subtree of 4.", "if (p.val > cur.val && q.val > cur.val)", 8, 4, 5, 6);
    addStep(4, p1, q1, false, "Check if both target values are in the left subtree of 4.", "else if (p.val < cur.val && q.val < cur.val)", 11, 6, 8, 9);
    addStep(4, p1, q1, false, "Neither condition met. Split point found at 4.", "else", 14, 8, 11, 12);
    addStep(4, p1, q1, true, "Node 4 is the Lowest Common Ancestor. Return cur.", "return cur", 15, 9, 12, 13);

    // Run Example 2: LCA(2, 4) -> 2
    const p2 = 2, q2 = 4;
    addStep(null, p2, q2, false, "Find LCA of nodes 2 and 4 (2 is ancestor of 4).", "START lowestCommonAncestor(root, p=2, q=4)", 1, 1, 2, 3);
    addStep(6, p2, q2, false, "Initialize 'cur' with the root node (6).", "cur = root", 6, 2, 3, 4);
    addStep(6, p2, q2, false, "Check if 'cur' (6) is not null.", "while (cur)", 7, 3, 4, 5);
    addStep(6, p2, q2, false, "Compare target values with current node 6.", "if (p.val > cur.val && q.val > cur.val)", 8, 4, 5, 6);
    addStep(6, p2, q2, false, "Check if both p and q are in the left subtree of 6.", "else if (p.val < cur.val && q.val < cur.val)", 11, 6, 8, 9);
    addStep(6, p2, q2, false, "Both nodes are smaller than 6. Move 'cur' left.", "cur = cur.left", 12, 7, 9, 10);

    addStep(2, p2, q2, false, "Check if 'cur' (2) is not null.", "while (cur)", 7, 3, 4, 5);
    addStep(2, p2, q2, false, "Check if both p and q are in the right subtree of 2.", "if (p.val > cur.val && q.val > cur.val)", 8, 4, 5, 6);
    addStep(2, p2, q2, false, "Check if both p and q are in the left subtree of 2.", "else if (p.val < cur.val && q.val < cur.val)", 11, 6, 8, 9);
    addStep(2, p2, q2, false, "One value is cur.val (2). Split point found at 2.", "else", 14, 8, 11, 12);
    addStep(2, p2, q2, true, "Node 2 is the Lowest Common Ancestor. Return cur.", "return cur", 15, 9, 12, 13);

    return { steps, stepLineNumbers };
  };

  const [{ steps, stepLineNumbers }] = useState(generateSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
          const isCurrent = currentStep.currentNode === pos.val;
          const isTarget = pos.val === currentStep.p || pos.val === currentStep.q;
          const isLCA = currentStep.found && currentStep.currentNode === pos.val;

          return (
            <g key={pos.val}>
              <motion.circle
                initial={false}
                animate={{
                  r: isCurrent ? 24 : 20,
                  strokeWidth: isCurrent ? 3 : 2
                }}
                cx={pos.x}
                cy={pos.y}
                className={`transition-all duration-500 ${isLCA
                  ? 'fill-green-600 stroke-green-700 shadow-lg'
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
                className={`text-sm font-semibold transition-colors duration-300 ${isTarget || isCurrent || isLCA ? 'fill-white' : 'fill-foreground'}`}
              >
                {pos.val}
              </text>
              {isTarget && !isLCA && !isCurrent && (
                <text
                  x={pos.x}
                  y={pos.y - 28}
                  textAnchor="middle"
                  className="text-xs font-bold fill-blue-600 animate-pulse"
                >
                  {pos.val === currentStep.p ? 'p' : 'q'}
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
        currentStep={currentStepIndex}
        totalSteps={steps.length - 1}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: visual tree + commentary box + variable panel */}
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

          <div className={`rounded-lg border p-4 transition-all duration-300 ${currentStep.found ? 'bg-green-500/10 border-green-500' : 'bg-accent/50 border-accent'}`}>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-sm text-foreground font-medium"
              >
                {currentStep.message}
              </motion.p>
            </AnimatePresence>
          </div>

          <VariablePanel
            variables={{
              cur: currentStep.currentNode ?? 'null',
              p: currentStep.p,
              q: currentStep.q,
              LCAFound: currentStep.found ? 'TRUE' : 'FALSE'
            }}
          />
        </div>

        {/* Right: code / pseudocode panel */}
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={handleReset}
        />
      </div>
    </div>
  );
};
