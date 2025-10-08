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
  current: number | null;
  p: number;
  q: number;
  foundP: boolean;
  foundQ: boolean;
  lca: number | null;
  message: string;
  lineNumber: number;
}

export const LowestCommonAncestorVisualization = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) {
    return root;
  }
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) {
    return root; // LCA found
  }
  
  return left || right;
}`;

  const createTree = (): TreeNode => {
    return {
      val: 3,
      left: {
        val: 5,
        left: { val: 6, left: null, right: null },
        right: { val: 2, left: null, right: null }
      },
      right: {
        val: 1,
        left: { val: 0, left: null, right: null },
        right: { val: 8, left: null, right: null }
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

    const p = 5;
    const q = 1;
    const newSteps: Step[] = [];
    let foundLCA: number | null = null;

    const findLCA = (node: TreeNode | null): boolean => {
      if (!node) return false;

      newSteps.push({
        current: node ? node.val : null,
        p,
        q,
        foundP: false,
        foundQ: false,
        lca: foundLCA,
        message: `Checking node ${node?.val}`,
        lineNumber: 1
      });

      if (node.val === p || node.val === q) {
        newSteps.push({
          current: node.val,
          p,
          q,
          foundP: node.val === p,
          foundQ: node.val === q,
          lca: foundLCA,
          message: `Found target node ${node.val}`,
          lineNumber: 2
        });
        return true;
      }

      const leftFound = findLCA(node.left);
      const rightFound = findLCA(node.right);

      if (leftFound && rightFound && !foundLCA) {
        foundLCA = node.val;
        newSteps.push({
          current: node.val,
          p,
          q,
          foundP: leftFound,
          foundQ: rightFound,
          lca: foundLCA,
          message: `LCA found! Both ${p} and ${q} are in different subtrees of ${node.val}`,
          lineNumber: 9
        });
      }

      return leftFound || rightFound;
    };

    newSteps.push({
      current: null,
      p,
      q,
      foundP: false,
      foundQ: false,
      lca: null,
      message: `Find LCA of nodes ${p} and ${q}`,
      lineNumber: 0
    });

    findLCA(root);

    newSteps.push({
      current: null,
      p,
      q,
      foundP: true,
      foundQ: true,
      lca: foundLCA,
      message: `Complete! LCA is ${foundLCA}`,
      lineNumber: 13
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
            node.val === currentStep.lca
              ? 'fill-green-500 stroke-green-500'
              : node.val === currentStep.p || node.val === currentStep.q
              ? 'fill-blue-500 stroke-blue-500'
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
            node.val === currentStep.lca || node.val === currentStep.p || node.val === currentStep.q || currentStep.current === node.val
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

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
              <div className="text-muted-foreground">Node P</div>
              <div className="font-bold text-blue-500">{currentStep.p}</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 text-center">
              <div className="text-muted-foreground">Node Q</div>
              <div className="font-bold text-blue-500">{currentStep.q}</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-center">
              <div className="text-muted-foreground">LCA</div>
              <div className="font-bold text-green-500">{currentStep.lca || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <VariablePanel
            variables={{
              current: currentStep.current || 'null',
              p: currentStep.p,
              q: currentStep.q,
              lca: currentStep.lca || 'null'
            }}
          />
          <CodeHighlighter code={code} highlightedLine={currentStep.lineNumber} language="TypeScript" />
        </div>
      </div>
    </div>
  );
};
