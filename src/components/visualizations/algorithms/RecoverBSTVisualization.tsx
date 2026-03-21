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
  first: number | null;
  second: number | null;
  prev: number | null;
  message: string;
  lineNumber: number;
}

export const RecoverBSTVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function recoverTree(root) {
  let first = null, second = null;
  let prev = null;
  
  function inorder(node) {
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
  [first.val, second.val] = [second.val, first.val];
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
    const tree: TreeNode = {
      val: 3,
      left: { val: 1, left: null, right: null },
      right: {
        val: 4,
        left: { val: 2, left: null, right: null },
        right: null
      }
    };

    const newSteps: Step[] = [];
    let first: TreeNode | null = null;
    let second: TreeNode | null = null;
    let prev: TreeNode | null = null;

    // Helper to push positioned steps
    const pushStep = (msg: string, line: number, current: number | null) => {
      const currentTree = deepClone(tree);
      calculatePositions(currentTree, 200, 50, 80);
      newSteps.push({
        tree: currentTree,
        current,
        first: first?.val || null,
        second: second?.val || null,
        prev: prev?.val || null,
        message: msg,
        lineNumber: line
      });
    };

    const inorder = (node: TreeNode | null) => {
      if (!node) return;

      pushStep(`Going left from node ${node.val}.`, 8, node.val);
      inorder(node.left);

      pushStep(`Visiting node ${node.val}.${prev ? ` Comparing with prev (${prev.val}).` : ''}`, 10, node.val);
      if (prev && prev.val > node.val) {
        if (!first) {
          first = prev;
          pushStep(`Violation found: prev(${prev.val}) > current(${node.val}). Marking first as ${first.val}.`, 11, node.val);
        }
        second = node;
        pushStep(`Marking second as current node (${second.val}).`, 12, node.val);
      }

      prev = node;
      pushStep(`Updating prev to ${prev.val}.`, 14, node.val);

      pushStep(`Going right from node ${node.val}.`, 16, node.val);
      inorder(node.right);
    };

    pushStep("Initializing tracking variables.", 2, null);
    pushStep("Starting inorder traversal.", 19, null);

    inorder(tree);

    if (first && second) {
      pushStep(`Identifying nodes to swap: ${first.val} and ${second.val}.`, 20, null);

      const val1 = first.val;
      const val2 = second.val;
      first.val = val2;
      second.val = val1;

      pushStep(`Swapping values: ${val1} ↔ ${val2}.`, 20, null);
      pushStep("BST recovery complete!", 21, null);
    }

    setSteps(newSteps);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSteps();
  }, []);

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
      }, 1000 / speed);
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
    generateSteps();
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];

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
          r="24"
          className={`transition-all duration-300 ${node.val === currentStep.first || node.val === currentStep.second
            ? 'fill-red-500 stroke-red-600 shadow-lg shadow-red-500/50'
            : currentStep.current === node.val
              ? 'fill-primary stroke-primary'
              : 'fill-card stroke-border'
            }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`text-sm font-medium transition-colors duration-300 ${node.val === currentStep.first || node.val === currentStep.second || currentStep.current === node.val
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
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 pb-4 overflow-hidden">
            <svg viewBox="0 0 400 250" className="w-full h-64 overflow-visible">
              {currentStep.tree && renderTree(currentStep.tree)}
            </svg>
          </div>

          <div className={`rounded-lg border p-4 transition-all duration-300 ${currentStep.lineNumber === 20 ? 'bg-green-500/10 border-green-500' : 'bg-accent/50 border-accent'}`}>
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="rounded-lg border bg-card p-2">
            <VariablePanel
              variables={{
                current: currentStep.current ?? 'null',
                prev: currentStep.prev ?? 'null',
                first: currentStep.first ?? 'null',
                second: currentStep.second ?? 'null'
              }}
            />
          </div>
        </div>

        <AnimatedCodeEditor code={code} highlightedLines={[currentStep.lineNumber]} language="TypeScript" />
      </div>
    </div>
  );
};
