import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { CodeHighlighter } from '../shared/CodeHighlighter';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Step {
  currentNode: number | null;
  stack: number[];
  visited: number[];
  message: string;
  lineNumber: number;
}

export const DFSPreorderVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function preorderDFS(node) {
  if (!node) return;
  
  // Visit root
  result.push(node.val);
  
  // Traverse left subtree
  preorderDFS(node.left);
  
  // Traverse right subtree
  preorderDFS(node.right);
}`;

  // Tree structure: 1 -> 2,3 -> 4,5,6,7
  const tree: TreeNode = {
    val: 1,
    left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } },
    right: { val: 3, left: { val: 6, left: null, right: null }, right: { val: 7, left: null, right: null } }
  };

  const generateSteps = () => {
    const newSteps: Step[] = [];
    const visited: number[] = [];
    const stack: number[] = [];

    newSteps.push({
      currentNode: null,
      stack: [],
      visited: [],
      message: 'Starting DFS Preorder traversal from root',
      lineNumber: 1
    });

    const dfs = (node: TreeNode | null, depth: number = 0) => {
      if (!node) {
        newSteps.push({
          currentNode: null,
          stack: [...stack],
          visited: [...visited],
          message: 'Node is null, return',
          lineNumber: 2
        });
        return;
      }

      // Visit root (preorder)
      stack.push(node.val);
      newSteps.push({
        currentNode: node.val,
        stack: [...stack],
        visited: [...visited],
        message: `Visiting node ${node.val} (depth ${depth})`,
        lineNumber: 5
      });

      visited.push(node.val);
      newSteps.push({
        currentNode: node.val,
        stack: [...stack],
        visited: [...visited],
        message: `Added ${node.val} to result (Root)`,
        lineNumber: 5
      });

      // Traverse left subtree
      if (node.left) {
        newSteps.push({
          currentNode: node.val,
          stack: [...stack],
          visited: [...visited],
          message: `Recursing to left child ${node.left.val}`,
          lineNumber: 8
        });
        dfs(node.left, depth + 1);
      }

      // Traverse right subtree
      if (node.right) {
        newSteps.push({
          currentNode: node.val,
          stack: [...stack],
          visited: [...visited],
          message: `Recursing to right child ${node.right.val}`,
          lineNumber: 11
        });
        dfs(node.right, depth + 1);
      }

      // Backtrack
      stack.pop();
      newSteps.push({
        currentNode: node.val,
        stack: [...stack],
        visited: [...visited],
        message: `Backtracking from node ${node.val}`,
        lineNumber: 11
      });
    };

    dfs(tree);

    newSteps.push({
      currentNode: null,
      stack: [],
      visited: [...visited],
      message: `Complete! Preorder: [${visited.join(', ')}]`,
      lineNumber: 11
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

  const renderTree = (node: TreeNode | null, x: number, y: number, offset: number): JSX.Element[] => {
    if (!node) return [];
    
    const isVisited = currentStep.visited.includes(node.val);
    const isCurrent = currentStep.currentNode === node.val;
    const isInStack = currentStep.stack.includes(node.val);

    const elements: JSX.Element[] = [];

    if (node.left) {
      elements.push(
        <line key={`line-l-${node.val}`} x1={x} y1={y} x2={x - offset} y2={y + 60} stroke="hsl(var(--border))" strokeWidth="2" />
      );
      elements.push(...renderTree(node.left, x - offset, y + 60, offset / 2));
    }

    if (node.right) {
      elements.push(
        <line key={`line-r-${node.val}`} x1={x} y1={y} x2={x + offset} y2={y + 60} stroke="hsl(var(--border))" strokeWidth="2" />
      );
      elements.push(...renderTree(node.right, x + offset, y + 60, offset / 2));
    }

    elements.push(
      <g key={`node-${node.val}`}>
        <circle
          cx={x}
          cy={y}
          r="20"
          fill={isCurrent ? 'hsl(var(--primary))' : isVisited ? 'hsl(142 76% 36%)' : isInStack ? 'hsl(48 96% 53%)' : 'hsl(var(--muted))'}
          stroke={isCurrent ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text x={x} y={y} textAnchor="middle" dy=".3em" className="text-sm font-bold" fill={isVisited || isCurrent ? 'white' : 'hsl(var(--foreground))'}>
          {node.val}
        </text>
      </g>
    );

    return elements;
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
            <svg viewBox="0 0 400 250" className="w-full h-64">
              {renderTree(tree, 200, 30, 80)}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold mb-2">Call Stack</h4>
              <div className="flex flex-col-reverse gap-1">
                {currentStep.stack.map((val, i) => (
                  <div key={i} className="bg-yellow-500 text-white rounded px-2 py-1 text-center font-mono text-sm">
                    dfs({val})
                  </div>
                ))}
                {currentStep.stack.length === 0 && <div className="text-xs text-muted-foreground">Empty</div>}
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold mb-2">Visited</h4>
              <div className="flex flex-wrap gap-1">
                {currentStep.visited.map((val, i) => (
                  <div key={i} className="bg-green-500 text-white rounded px-2 py-1 font-mono text-sm">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              current: currentStep.currentNode ?? 'null',
              callStackDepth: currentStep.stack.length,
              visitedCount: currentStep.visited.length,
              'preorder result': currentStep.visited.join(' → ')
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
