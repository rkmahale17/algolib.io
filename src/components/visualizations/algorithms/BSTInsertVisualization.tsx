import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

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
}

export const BSTInsertVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function insertIntoBST(root, val) {
  if (!root) return new TreeNode(val);
  
  if (val < root.val) {
    root.left = insertIntoBST(root.left, val);
  } else {
    root.right = insertIntoBST(root.right, val);
  }
  
  return root;
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

    const insertValue = 5;
    const newSteps: Step[] = [];

    const insert = (node: TreeNode | null, val: number, tree: TreeNode): TreeNode | null => {
      if (!node) {
        const newNode = { val, left: null, right: null };
        calculatePositions(tree, 200, 50, 80);
        newSteps.push({
          tree: deepClone(tree),
          current: null,
          insertValue: val,
          message: `Found empty spot! Insert ${val} here`,
          lineNumber: 1
        });
        return newNode;
      }

      calculatePositions(tree, 200, 50, 80);
      newSteps.push({
        tree: deepClone(tree),
        current: node.val,
        insertValue: val,
        message: `At node ${node.val}. Compare ${val} with ${node.val}`,
        lineNumber: 3
      });

      if (val < node.val) {
        calculatePositions(tree, 200, 50, 80);
        newSteps.push({
          tree: deepClone(tree),
          current: node.val,
          insertValue: val,
          message: `${val} < ${node.val}. Go left`,
          lineNumber: 4
        });
        node.left = insert(node.left, val, tree);
      } else {
        calculatePositions(tree, 200, 50, 80);
        newSteps.push({
          tree: deepClone(tree),
          current: node.val,
          insertValue: val,
          message: `${val} ≥ ${node.val}. Go right`,
          lineNumber: 6
        });
        node.right = insert(node.right, val, tree);
      }

      return node;
    };

    const tree = deepClone(initialTree);
    calculatePositions(tree, 200, 50, 80);

    newSteps.push({
      tree: deepClone(tree),
      current: null,
      insertValue,
      message: `Insert ${insertValue} into BST`,
      lineNumber: 0
    });

    insert(tree, insertValue, tree);
    calculatePositions(tree, 200, 50, 80);

    newSteps.push({
      tree: deepClone(tree),
      current: null,
      insertValue,
      message: `Complete! ${insertValue} inserted successfully`,
      lineNumber: 10
    });

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
            currentStep.current === node.val
              ? 'fill-primary stroke-primary'
              : node.val === currentStep.insertValue
              ? 'fill-green-500 stroke-green-500'
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
            currentStep.current === node.val || node.val === currentStep.insertValue ? 'fill-white' : 'fill-foreground'
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <svg width="400" height="250" className="mx-auto">
              {currentStep.tree && renderTree(currentStep.tree)}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
        </div>

        <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
      </div>

      <VariablePanel
        variables={{
          insertValue: currentStep.insertValue,
          current: currentStep.current || 'null'
        }}
      />
    </div>
  );
};
