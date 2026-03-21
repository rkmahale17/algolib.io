import { useEffect, useRef, useState } from 'react';

import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';

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
  lineNumber: number;
  variables: Record<string, any>;
}

export const BSTInsertVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function insertIntoBST(root: TreeNode | null, val: number): TreeNode | null {
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
}`;

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
    const newSteps: Step[] = [];
    const tree = deepClone(initialTree);
    calculatePositions(tree, 200, 40, 80);

    // Step 1: Function entry
    newSteps.push({
      tree: deepClone(tree),
      current: null,
      insertValue: val,
      message: `Starting insertion of value ${val} into BST.`,
      lineNumber: 1,
      variables: { val, root: 'TreeNode' }
    });

    // Step 2: Check if !root
    newSteps.push({
      tree: deepClone(tree),
      current: null,
      insertValue: val,
      message: `Checking if the tree is empty.`,
      lineNumber: 2,
      variables: { val, root: tree ? 'TreeNode' : 'null' }
    });

    if (!tree) {
      // (This case won't be hit with our initialTree but for completeness)
      newSteps.push({
        tree: { val, left: null, right: null, x: 200, y: 40 },
        current: val,
        insertValue: val,
        message: `Tree is empty. Creating new root with value ${val}.`,
        lineNumber: 3,
        variables: { val }
      });
      setSteps(newSteps);
      return;
    }

    // Step 6: Initialize cur
    let cur = tree;
    newSteps.push({
      tree: deepClone(tree),
      current: cur.val,
      insertValue: val,
      message: `Initialize 'cur' pointer to the root (${cur.val}).`,
      lineNumber: 6,
      variables: { val, 'cur.val': cur.val }
    });

    while (true) {
      // Step 8: While(true)
      newSteps.push({
        tree: deepClone(tree),
        current: cur.val,
        insertValue: val,
        message: `Starting tree traversal from node ${cur.val}.`,
        lineNumber: 8,
        variables: { val, 'cur.val': cur.val }
      });

      // Step 9: Check val > cur.val
      newSteps.push({
        tree: deepClone(tree),
        current: cur.val,
        insertValue: val,
        message: `Comparing ${val} with current node value ${cur.val}.`,
        lineNumber: 9,
        variables: { val, 'cur.val': cur.val, condition: `${val} > ${cur.val}` }
      });

      if (val > cur.val) {
        // Step 10: Check !cur.right
        newSteps.push({
          tree: deepClone(tree),
          current: cur.val,
          insertValue: val,
          message: `Check if node ${cur.val} has a right child.`,
          lineNumber: 10,
          variables: { val, 'cur.val': cur.val, 'cur.right': cur.right ? cur.right.val : 'null' }
        });

        if (!cur.right) {
          // Step 11: Insert right
          cur.right = { val, left: null, right: null };
          calculatePositions(tree, 200, 40, 80);
          newSteps.push({
            tree: deepClone(tree),
            current: cur.val,
            insertValue: val,
            message: `Right child is null. Inserting ${val} as right child of ${cur.val}.`,
            lineNumber: 11,
            variables: { val, 'cur.val': cur.val, 'new node': val }
          });
          // Step 12: Return root
          newSteps.push({
            tree: deepClone(tree),
            current: null,
            insertValue: val,
            message: `Insertion complete. Returning root.`,
            lineNumber: 12,
            variables: { val }
          });
          break;
        }
        // Step 14: cur = cur.right
        cur = cur.right;
        newSteps.push({
          tree: deepClone(tree),
          current: cur.val,
          insertValue: val,
          message: `${val} > previous node value. Moving to right child (${cur.val}).`,
          lineNumber: 14,
          variables: { val, 'cur.val': cur.val }
        });
      } else {
        // Step 16: Check !cur.left
        newSteps.push({
          tree: deepClone(tree),
          current: cur.val,
          insertValue: val,
          message: `Check if node ${cur.val} has a left child.`,
          lineNumber: 16,
          variables: { val, 'cur.val': cur.val, 'cur.left': cur.left ? cur.left.val : 'null' }
        });

        if (!cur.left) {
          // Step 17: Insert left
          cur.left = { val, left: null, right: null };
          calculatePositions(tree, 200, 40, 80);
          newSteps.push({
            tree: deepClone(tree),
            current: cur.val,
            insertValue: val,
            message: `Left child is null. Inserting ${val} as left child of ${cur.val}.`,
            lineNumber: 17,
            variables: { val, 'cur.val': cur.val, 'new node': val }
          });
          // Step 18: Return root
          newSteps.push({
            tree: deepClone(tree),
            current: null,
            insertValue: val,
            message: `Insertion complete. Returning root.`,
            lineNumber: 18,
            variables: { val }
          });
          break;
        }
        // Step 20: cur = cur.left
        cur = cur.left;
        newSteps.push({
          tree: deepClone(tree),
          current: cur.val,
          insertValue: val,
          message: `${val} <= previous node value. Moving to left child (${cur.val}).`,
          lineNumber: 20,
          variables: { val, 'cur.val': cur.val }
        });
      }
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isPlaying && currentStepIndex < steps.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleStepForward = () => currentStepIndex < steps.length - 1 && setCurrentStepIndex(prev => prev + 1);
  const handleStepBack = () => currentStepIndex > 0 && setCurrentStepIndex(prev => prev - 1);
  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

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
          r="24"
          className={`transition-all duration-300 ${currentStep.current === node.val
            ? 'fill-primary stroke-primary'
            : node.val === currentStep.insertValue
              ? 'fill-green-500 stroke-green-500 shadow-lg'
              : 'fill-card stroke-border'
            }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`font-medium transition-colors duration-300 ${currentStep.current === node.val || node.val === currentStep.insertValue
            ? 'fill-primary-foreground'
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
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 pb-4">
            <svg viewBox="0 0 400 250" className="w-full h-64 overflow-visible">
              {currentStep.tree && renderTree(currentStep.tree)}
            </svg>
          </div>

          <div className={`rounded-lg border p-4 transition-colors duration-300 ${currentStep.lineNumber === 12 || currentStep.lineNumber === 18
            ? 'bg-green-500/10 border-green-500/50'
            : 'bg-accent/50 border-accent'
            }`}>
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className='rounded-lg border bg-card'>
            <VariablePanel
              variables={currentStep.variables}
            />
          </div>
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="TypeScript" />
      </div>
    </div>
  );
};
