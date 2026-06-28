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
  first: number | null;
  second: number | null;
  prev: number | null;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function recoverTree(root: TreeNode | null): void {
  let first: TreeNode | null = null;
  let second: TreeNode | null = null;
  let prev: TreeNode | null = null;
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    inorder(node.left);
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  if (first && second) {
    [first.val, second.val] = [second.val, first.val];
  }
}`,

  python: `def recoverTree(root):
    first = None
    second = None
    prev = None
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        inorder(node.left)
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        prev = node
        inorder(node.right)
    inorder(root)
    if first and second:
        first.val, second.val = second.val, first.val`,

  java: `public static class Solution {
    private TreeNode first;
    private TreeNode second;
    private TreeNode prev;
    public void recoverTree(TreeNode root) {
        first = null;
        second = null;
        prev = null;
        inorder(root);
        if (first != null && second != null) {
            int temp = first.val;
            first.val = second.val;
            second.val = temp;
        }
    }
    private void inorder(TreeNode node) {
        if (node == null) {
            return;
        }
        inorder(node.left);
        if (prev != null && prev.val > node.val) {
            if (first == null) {
                first = prev;
            }
            second = node;
        }
        prev = node;
        inorder(node.right);
    }
}`,

  cpp: `class Solution {
private:
    TreeNode* first;
    TreeNode* second;
    TreeNode* prev;
public:
    void recoverTree(TreeNode* root) {
        first = nullptr;
        second = nullptr;
        prev = nullptr;
        inorder(root);
        if (first != nullptr && second != nullptr) {
            int temp = first->val;
            first->val = second->val;
            second->val = temp;
        }
    }
private:
    void inorder(TreeNode* node) {
        if (node == nullptr) {
            return;
        }
        inorder(node->left);
        if (prev != nullptr && prev->val > node->val) {
            if (first == nullptr) {
                first = prev;
            }
            second = node;
        }
        prev = node;
        inorder(node->right);
    }
};`,
};

export const RecoverBSTVisualization = () => {
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
      val: 3,
      left: { val: 1, left: null, right: null },
      right: {
        val: 4,
        left: { val: 2, left: null, right: null },
        right: null
      }
    };

    const steps: Step[] = [];
    const tree = deepClone(initialTree);
    calculatePositions(tree, 200, 50, 80);

    let first: TreeNode | null = null;
    let second: TreeNode | null = null;
    let prev: TreeNode | null = null;

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

    const addStep = (currentNode: number | null, msg: string, pseudo: string, ts_l: number, py_l: number, java_l: number, cpp_l: number) => {
      const currentTree = deepClone(tree);
      calculatePositions(currentTree, 200, 50, 80);
      steps.push({
        tree: currentTree,
        current: currentNode,
        first: first?.val || null,
        second: second?.val || null,
        prev: prev?.val || null,
        message: msg,
        pseudoStep: pseudo,
        variables: {
          currentNode: currentNode ?? 'null',
          prev: prev?.val ?? 'null',
          first: first?.val ?? 'null',
          second: second?.val ?? 'null'
        }
      });
      addLines(ts_l, py_l, java_l, cpp_l);
    };

    // Initialize variables
    addStep(null, 'Initializing tracking variables (first, second, prev).', 'first = null, second = null, prev = null', 2, 2, 6, 8);

    // Call inorder
    addStep(null, 'Starting inorder traversal of the tree.', 'inorder(root)', 15, 16, 9, 11);

    const inorder = (node: TreeNode | null) => {
      if (!node) {
        addStep(null, 'Node is null. Backtrack.', 'if (!node) → return', 6, 7, 17, 20);
        addStep(null, 'Return from null node.', 'return', 6, 8, 18, 21);
        return;
      }

      // Check if node is null (NO)
      addStep(node.val, `Checking if node (${node.val}) is null.`, 'if (!node) → NO', 6, 7, 17, 20);

      // Go left
      addStep(node.val, `Traverse left subtree of node ${node.val}.`, 'inorder(node.left)', 7, 9, 20, 23);
      inorder(node.left);

      // Compare
      addStep(node.val, `Visit node ${node.val}.${prev ? ` Compare prev (${prev.val}) with current (${node.val}).` : ''}`, 'if (prev && prev.val > node.val)', 8, 10, 21, 24);
      if (prev && prev.val > node.val) {
        addStep(node.val, `BST violation found: prev (${prev.val}) > current (${node.val}).`, 'if (!first)', 9, 11, 22, 25);
        if (!first) {
          first = prev;
          addStep(node.val, `First incorrect node identified as prev node (${first.val}).`, `first = prev  →  ${first.val}`, 9, 12, 23, 26);
        }
        second = node;
        addStep(node.val, `Second incorrect node identified as current node (${second.val}).`, `second = node  →  ${second.val}`, 10, 13, 25, 28);
      }

      // Update prev
      prev = node;
      addStep(node.val, `Update prev pointer to current node ${prev.val}.`, `prev = node  →  ${prev.val}`, 12, 14, 27, 30);

      // Go right
      addStep(node.val, `Traverse right subtree of node ${node.val}.`, 'inorder(node.right)', 13, 15, 28, 31);
      inorder(node.right);
    };

    inorder(tree);

    if (first && second) {
      addStep(null, `Identify incorrect nodes: ${first.val} and ${second.val}.`, 'if (first && second)', 16, 17, 10, 12);

      const val1 = first.val;
      const val2 = second.val;
      first.val = val2;
      second.val = val1;

      addStep(null, `Swap values: ${val1} ↔ ${val2} to restore BST properties.`, `swap(first.val, second.val)  →  ${val2} ↔ ${val1}`, 17, 18, 11, 13);
      addStep(null, 'BST recovery complete!', 'RETURN', 19, 18, 15, 17);
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
          <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="currentColor" strokeWidth="2" className="text-border transition-all duration-300" />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="currentColor" strokeWidth="2" className="text-border transition-all duration-300" />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          className={`transition-all duration-300 ${node.val === currentStep.first || node.val === currentStep.second
            ? 'fill-red-500 stroke-red-600 shadow-lg'
            : currentStep.current === node.val
              ? 'fill-primary stroke-primary animate-pulse'
              : 'fill-card stroke-border'
            }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`text-sm font-semibold transition-colors duration-300 ${node.val === currentStep.first || node.val === currentStep.second || currentStep.current === node.val
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 pb-4 overflow-hidden">
            <svg viewBox="0 0 400 250" className="w-full h-64 overflow-visible">
              {currentStep.tree && renderTree(currentStep.tree)}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              currentNode: currentStep.current ?? 'null',
              prev: currentStep.prev ?? 'null',
              first: currentStep.first ?? 'null',
              second: currentStep.second ?? 'null'
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
