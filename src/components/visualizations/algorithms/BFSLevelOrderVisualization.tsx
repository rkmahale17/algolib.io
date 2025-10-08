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
  level?: number;
}

interface Step {
  visited: number[];
  queue: number[];
  current: number | null;
  currentLevel: number;
  message: string;
  lineNumber: number;
}

export const BFSLevelOrderVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const level = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}`;

  const createTree = (): TreeNode => {
    return {
      val: 1,
      left: {
        val: 2,
        left: { val: 4, left: null, right: null, level: 2 },
        right: { val: 5, left: null, right: null, level: 2 },
        level: 1
      },
      right: {
        val: 3,
        left: { val: 6, left: null, right: null, level: 2 },
        right: { val: 7, left: null, right: null, level: 2 },
        level: 1
      },
      level: 0
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
    const queue: TreeNode[] = [root];

    newSteps.push({
      visited: [],
      queue: [root.val],
      current: null,
      currentLevel: 0,
      message: 'Start BFS Level Order: Use queue to traverse level by level',
      lineNumber: 0
    });

    let level = 0;
    while (queue.length > 0) {
      const levelSize = queue.length;

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        visited.push(node.val);

        newSteps.push({
          visited: [...visited],
          queue: queue.map(n => n.val),
          current: node.val,
          currentLevel: level,
          message: `Process node ${node.val} at level ${level}`,
          lineNumber: 11
        });

        if (node.left) {
          queue.push(node.left);
          newSteps.push({
            visited: [...visited],
            queue: queue.map(n => n.val),
            current: node.val,
            currentLevel: level,
            message: `Add left child ${node.left.val} to queue`,
            lineNumber: 14
          });
        }

        if (node.right) {
          queue.push(node.right);
          newSteps.push({
            visited: [...visited],
            queue: queue.map(n => n.val),
            current: node.val,
            currentLevel: level,
            message: `Add right child ${node.right.val} to queue`,
            lineNumber: 15
          });
        }
      }

      level++;
    }

    newSteps.push({
      visited,
      queue: [],
      current: null,
      currentLevel: level,
      message: `Complete! Visited: [${visited.join(', ')}]`,
      lineNumber: 21
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
              : currentStep.queue.includes(node.val)
              ? 'fill-blue-500 stroke-blue-500'
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
            currentStep.visited.includes(node.val) || currentStep.current === node.val || currentStep.queue.includes(node.val)
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
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <svg width="400" height="250" className="mx-auto">
              {renderTree(tree)}
            </svg>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Queue:</p>
              <div className="flex gap-2 flex-wrap">
                {currentStep.queue.map((val, idx) => (
                  <div key={idx} className="w-10 h-10 rounded bg-blue-500 text-white flex items-center justify-center font-bold">
                    {val}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Visited:</p>
              <div className="flex gap-2 flex-wrap">
                {currentStep.visited.map((val, idx) => (
                  <div key={idx} className="w-10 h-10 rounded bg-green-500 text-white flex items-center justify-center font-bold">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              current: currentStep.current || 'null',
              level: currentStep.currentLevel,
              'queue.length': currentStep.queue.length,
              'visited.length': currentStep.visited.length
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
