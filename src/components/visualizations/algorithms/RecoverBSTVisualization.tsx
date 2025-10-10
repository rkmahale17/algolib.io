import { useEffect, useRef, useState } from 'react';

import { CodeHighlighter } from '../shared/CodeHighlighter';
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
      right: deepClone(node.right)
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
    // Create BST with two swapped nodes (3 and 2)
    const tree: TreeNode = {
      val: 3, // Should be 2
      left: { val: 1, left: null, right: null },
      right: {
        val: 4,
        left: { val: 2, left: null, right: null }, // Should be 3
        right: null
      }
    };

    const newSteps: Step[] = [];
    let first: TreeNode | null = null;
    let second: TreeNode | null = null;
    let prev: TreeNode | null = null;

    const inorder = (node: TreeNode | null) => {
      if (!node) return;

      inorder(node.left);

      const currentTree = deepClone(tree);
      calculatePositions(currentTree, 200, 50, 80);

      newSteps.push({
        tree: currentTree,
        current: node.val,
        first: first?.val || null,
        second: second?.val || null,
        prev: prev?.val || null,
        message: `Visit node ${node.val}${prev ? `. Compare with prev=${prev.val}` : ''}`,
        lineNumber: 8
      });

      if (prev && prev.val > node.val) {
        if (!first) {
          first = prev;
          newSteps.push({
            tree: deepClone(currentTree),
            current: node.val,
            first: first.val,
            second: second?.val || null,
            prev: prev.val,
            message: `Found violation: ${prev.val} > ${node.val}. Mark first=${first.val}`,
            lineNumber: 10
          });
        }
        second = node;
        newSteps.push({
          tree: deepClone(currentTree),
          current: node.val,
          first: first?.val || null,
          second: second.val,
          prev: prev.val,
          message: `Update second=${second.val}`,
          lineNumber: 11
        });
      }

      prev = node;
      inorder(node.right);
    };

    const currentTree = deepClone(tree);
    calculatePositions(currentTree, 200, 50, 80);

    newSteps.push({
      tree: currentTree,
      current: null,
      first: null,
      second: null,
      prev: null,
      message: 'Recover BST: Find two swapped nodes via inorder traversal',
      lineNumber: 0
    });

    inorder(tree);

    // Swap the values
    if (first && second) {
      [first.val, second.val] = [second.val, first.val];
      const finalTree = deepClone(tree);
      calculatePositions(finalTree, 200, 50, 80);

      newSteps.push({
        tree: finalTree,
        current: null,
        first: second.val,
        second: first.val,
        prev: null,
        message: `Swap values: ${second.val} ↔ ${first.val}`,
        lineNumber: 19
      });

      newSteps.push({
        tree: finalTree,
        current: null,
        first: null,
        second: null,
        prev: null,
        message: 'Complete! BST recovered',
        lineNumber: 20
      });
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
          <line x1={node.x} y1={node.y} x2={node.left.x} y2={node.left.y} stroke="currentColor" strokeWidth="2" className="text-border" />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line x1={node.x} y1={node.y} x2={node.right.x} y2={node.right.y} stroke="currentColor" strokeWidth="2" className="text-border" />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="24"
          className={`transition-all duration-300 ${
            node.val === currentStep.first || node.val === currentStep.second
              ? 'fill-red-500 stroke-red-500'
              : currentStep.current === node.val
              ? 'fill-primary stroke-primary'
              : 'fill-muted stroke-border'
          }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`font-bold ${
            node.val === currentStep.first || node.val === currentStep.second || currentStep.current === node.val
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-x-auto">
            <svg width="400" height="250" className="mx-auto">
              {currentStep.tree && renderTree(currentStep.tree)}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center">
              <div className="text-muted-foreground">First</div>
              <div className="font-bold text-red-500">{currentStep.first || 'null'}</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center">
              <div className="text-muted-foreground">Second</div>
              <div className="font-bold text-red-500">{currentStep.second || 'null'}</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
              <div className="text-muted-foreground">Prev</div>
              <div className="font-bold text-blue-500">{currentStep.prev || 'null'}</div>
            </div>
          </div>

          <div className="rounded-lg ">
               <VariablePanel
            variables={{
              current: currentStep.current || 'null',
              first: currentStep.first || 'null',
              second: currentStep.second || 'null',
              prev: currentStep.prev || 'null'
            }}
          />
          </div>
        </div>

        <div className="space-y-4">
       
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
