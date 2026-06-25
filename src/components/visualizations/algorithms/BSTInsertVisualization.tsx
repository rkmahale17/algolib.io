import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

interface Step {
  tree: TreeNode | null;
  current: number | null;
  insertValue: number;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {
  if (!root) {
    return new TreeNode(val);
  }
  let cur: TreeNode = root;
  while (true) {
    if (val > cur.val) {
      if (!cur.right) {
        cur.right = new TreeNode(val);
        return root;
      }
      cur = cur.right;
    } else {
      if (!cur.left) {
        cur.left = new TreeNode(val);
        return root;
      }
      cur = cur.left;
    }
  }
}`,

  python: `def insertIntoBST(root, val):
    if not root:
        return TreeNode(val)
    cur = root
    while True:
        if val > cur.val:
            if not cur.right:
                cur.right = TreeNode(val)
                return root
            cur = cur.right
        else:
            if not cur.left:
                cur.left = TreeNode(val)
                return root
            cur = cur.left`,

  java: `public static class Solution {
    public TreeNode insertIntoBST(TreeNode root, int val) {
        if (root == null) {
            return new TreeNode(val);
        }
        TreeNode cur = root;
        while (true) {
            if (val > cur.val) {
                if (cur.right == null) {
                    cur.right = new TreeNode(val);
                    return root;
                }
                cur = cur.right;
            } else {
                if (cur.left == null) {
                    cur.left = new TreeNode(val);
                    return root;
                }
                cur = cur.left;
            }
        }
    }
}`,

  cpp: `class Solution {
public:
    TreeNode* insertIntoBST(TreeNode* root, int val) {
        if (root == nullptr) {
            return new TreeNode(val);
        }
        TreeNode* cur = root;
        while (true) {
            if (val > cur->val) {
                if (cur->right == nullptr) {
                    cur->right = new TreeNode(val);
                    return root;
                }
                cur = cur->right;
            }
            else {
                if (cur->left == nullptr) {
                    cur->left = new TreeNode(val);
                    return root;
                }
                cur = cur->left;
            }
        }
    }
};`,
};

export const BSTInsertVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const deepClone = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      val: node.val,
      left: deepClone(node.left),
      right: deepClone(node.right),
      x: node.x,
      y: node.y
    };
  };

  const calculatePositions = (node: TreeNode | null, x: number, y: number, spacing: number) => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) calculatePositions(node.left, x - spacing, y + 60, spacing / 2);
    if (node.right) calculatePositions(node.right, x + spacing, y + 60, spacing / 2);
  };

  const generateSteps = () => {
    const initialTree: TreeNode = {
      val: 4,
      left: {
        val: 2,
        left: { val: 1, left: null, right: null },
        right: { val: 3, left: null, right: null }
      },
      right: {
        val: 6,
        left: null,
        right: { val: 7, left: null, right: null }
      }
    };

    const val = 5;
    const steps: Step[] = [];
    const tree = deepClone(initialTree);
    calculatePositions(tree, 200, 40, 80);

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

    const addStep = (currentNode: number | null, activeTree: TreeNode | null, msg: string, pseudo: string, ts_l: number, py_l: number, java_l: number, cpp_l: number) => {
      steps.push({
        tree: deepClone(activeTree),
        current: currentNode,
        insertValue: val,
        message: msg,
        pseudoStep: pseudo,
        variables: {
          val,
          root: activeTree ? 'TreeNode' : 'null',
          'cur.val': currentNode ?? 'null'
        }
      });
      addLines(ts_l, py_l, java_l, cpp_l);
    };

    // 1. Function entry
    addStep(null, tree, `Starting insertion of value ${val} into BST.`, `START insertIntoBST(root, val = ${val})`, 1, 1, 2, 3);

    // 2. Check if !root
    addStep(null, tree, `Checking if the tree is empty.`, 'if (!root)', 2, 2, 3, 4);

    if (!tree) {
      addStep(val, { val, left: null, right: null, x: 200, y: 40 }, `Tree is empty. Creating new root with value ${val}.`, 'return new TreeNode(val)', 3, 3, 4, 5);
      return { steps, stepLineNumbers };
    }

    // 3. Initialize cur
    let cur = tree;
    addStep(cur.val, tree, `Initialize 'cur' pointer to the root (${cur.val}).`, 'cur = root', 5, 4, 6, 7);

    while (true) {
      // while(true)
      addStep(cur.val, tree, `Traversing from node ${cur.val}.`, 'while (true)', 6, 5, 7, 8);

      // Compare val > cur.val
      addStep(cur.val, tree, `Compare insert value ${val} with current node value ${cur.val}.`, `if (val > cur.val)  →  ${val} > ${cur.val}  →  ${val > cur.val ? 'YES ✓' : 'NO ✗'}`, 7, 6, 8, 9);

      if (val > cur.val) {
        // Check !cur.right
        addStep(cur.val, tree, `Check if node ${cur.val} has a right child.`, 'if (!cur.right)', 8, 7, 9, 10);

        if (!cur.right) {
          // Insert right
          cur.right = { val, left: null, right: null };
          calculatePositions(tree, 200, 40, 80);
          addStep(cur.val, tree, `Right child is null. Inserting ${val} as right child of ${cur.val}.`, `cur.right = new TreeNode(${val})`, 9, 8, 10, 11);
          // Return root
          addStep(null, tree, `Insertion complete. Returning root of BST.`, 'return root', 10, 9, 11, 12);
          break;
        }
        // cur = cur.right
        cur = cur.right;
        addStep(cur.val, tree, `${val} > previous node value. Moving to right child (${cur.val}).`, 'cur = cur.right', 12, 10, 13, 14);
      } else {
        // Check !cur.left
        addStep(cur.val, tree, `Check if node ${cur.val} has a left child.`, 'if (!cur.left)', 14, 12, 15, 17);

        if (!cur.left) {
          // Insert left
          cur.left = { val, left: null, right: null };
          calculatePositions(tree, 200, 40, 80);
          addStep(cur.val, tree, `Left child is null. Inserting ${val} as left child of ${cur.val}.`, `cur.left = new TreeNode(${val})`, 15, 13, 16, 18);
          // Return root
          addStep(null, tree, `Insertion complete. Returning root of BST.`, 'return root', 16, 14, 17, 19);
          break;
        }
        // cur = cur.left
        cur = cur.left;
        addStep(cur.val, tree, `${val} <= previous node value. Moving to left child (${cur.val}).`, 'cur = cur.left', 18, 15, 19, 21);
      }
    }

    return { steps, stepLineNumbers };
  };

  const [{ steps, stepLineNumbers }] = useState(generateSteps);

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

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    return (
      <g key={`${node.val}-${node.x}-${node.y}`}>
        {node.left && node.left.x !== undefined && node.left.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-border transition-all duration-300"
          />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-border transition-all duration-300"
          />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          className={`transition-all duration-300 ${currentStep.current === node.val
            ? 'fill-primary stroke-primary'
            : node.val === currentStep.insertValue
              ? 'fill-green-600 stroke-green-600 shadow-lg'
              : 'fill-card stroke-border'
            }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`text-sm font-semibold transition-colors duration-300 ${currentStep.current === node.val || node.val === currentStep.insertValue
            ? 'fill-white'
            : 'fill-foreground'
            }`}
        >
          {node.val}
        </text>
        {node.left && renderTree(node.left)}
        {node.right && renderTree(node.right)}
      </g>
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <svg viewBox="0 0 400 250" className="w-full h-64">
              {currentStep.tree && renderTree(currentStep.tree)}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              insertValue: currentStep.insertValue,
              'cur.val': currentStep.current ?? 'null',
              treeRoot: currentStep.tree ? 'TreeNode (4)' : 'null'
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
