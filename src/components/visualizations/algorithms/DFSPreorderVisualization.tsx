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

  const code = `function preorderDFS(root) {
  const result = [];
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);
    
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
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
    const stack = [tree.val];
    const nodeMap: Map<number, TreeNode> = new Map();
    
    const buildMap = (node: TreeNode | null) => {
      if (!node) return;
      nodeMap.set(node.val, node);
      buildMap(node.left);
      buildMap(node.right);
    };
    buildMap(tree);

    newSteps.push({
      currentNode: null,
      stack: [...stack],
      visited: [],
      message: 'Initialize: Push root (1) to stack',
      lineNumber: 2
    });

    while (stack.length > 0) {
      const val = stack.pop()!;
      const node = nodeMap.get(val)!;
      visited.push(val);

      newSteps.push({
        currentNode: val,
        stack: [...stack],
        visited: [...visited],
        message: `Pop ${val} from stack, add to result`,
        lineNumber: 5
      });

      if (node.right) {
        stack.push(node.right.val);
        newSteps.push({
          currentNode: val,
          stack: [...stack],
          visited: [...visited],
          message: `Push right child ${node.right.val} to stack`,
          lineNumber: 8
        });
      }

      if (node.left) {
        stack.push(node.left.val);
        newSteps.push({
          currentNode: val,
          stack: [...stack],
          visited: [...visited],
          message: `Push left child ${node.left.val} to stack`,
          lineNumber: 9
        });
      }
    }

    newSteps.push({
      currentNode: null,
      stack: [],
      visited: [...visited],
      message: `Complete! Preorder: [${visited.join(', ')}]`,
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
              <h4 className="text-sm font-semibold mb-2">Stack</h4>
              <div className="flex flex-col-reverse gap-1">
                {currentStep.stack.map((val, i) => (
                  <div key={i} className="bg-yellow-500 text-white rounded px-2 py-1 text-center font-mono text-sm">
                    {val}
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
              stackSize: currentStep.stack.length,
              visitedCount: currentStep.visited.length,
              preorder: currentStep.visited
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
