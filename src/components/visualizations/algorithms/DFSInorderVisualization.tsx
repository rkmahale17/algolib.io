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
  visited: number[];
  current: number | null;
  stack: number[];
  message: string;
  lineNumber: number;
}

export const DFSInorderVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function inorder(root) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    traverse(node.left);   // Visit left
    result.push(node.val); // Visit root
    traverse(node.right);  // Visit right
  }
  
  traverse(root);
  return result;
}`;

  const createTree = (): TreeNode => {
    return {
      val: 4,
      left: {
        val: 2,
        left: { val: 1, left: null, right: null },
        right: { val: 3, left: null, right: null }
      },
      right: {
        val: 6,
        left: { val: 5, left: null, right: null },
        right: { val: 7, left: null, right: null }
      }
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
    const root = createTree();
    calculatePositions(root, 200, 50, 80);
    setTree(root);

    const newSteps: Step[] = [];
    const visited: number[] = [];
    const stack: number[] = [];

    const traverse = (node: TreeNode | null) => {
      if (!node) return;

      stack.push(node.val);
      newSteps.push({
        visited: [...visited],
        current: node.val,
        stack: [...stack],
        message: `Visit node ${node.val}, go left first`,
        lineNumber: 6
      });

      traverse(node.left);

      visited.push(node.val);
      newSteps.push({
        visited: [...visited],
        current: node.val,
        stack: [...stack],
        message: `Process node ${node.val} (left done, process root)`,
        lineNumber: 7
      });

      traverse(node.right);

      stack.pop();
      newSteps.push({
        visited: [...visited],
        current: node.val,
        stack: [...stack],
        message: `Node ${node.val} complete (right done)`,
        lineNumber: 8
      });
    };

    newSteps.push({
      visited: [],
      current: null,
      stack: [],
      message: 'Start DFS Inorder: Left → Root → Right',
      lineNumber: 0
    });

    traverse(root);

    newSteps.push({
      visited,
      current: null,
      stack: [],
      message: `Complete! Inorder: [${visited.join(', ')}]`,
      lineNumber: 12
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

  if (steps.length === 0 || !tree) return null;

  const currentStep = steps[currentStepIndex];

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    return (
      <g key={node.val}>
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
              : currentStep.visited.includes(node.val)
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
          className={`font-bold ${currentStep.visited.includes(node.val) || currentStep.current === node.val ? 'fill-white' : 'fill-foreground'}`}
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
        <div className="space-y-4 ">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6 overflow-x-auto">
            <svg width="400" height="250" className="mx-auto">
              {renderTree(tree)}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-2">Visited Order:</p>
            <div className="flex gap-2 flex-wrap">
              {currentStep.visited.map((val, idx) => (
                <div key={idx} className="w-10 h-10 rounded bg-green-500 text-white flex items-center justify-center font-bold">
                  {val}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              current: currentStep.current || 'null',
              'stack.size': currentStep.stack.length,
              'visited.length': currentStep.visited.length,
              visited: currentStep.visited
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
