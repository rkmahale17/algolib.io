import { useState, useEffect, useRef } from 'react';
import { VariablePanel } from '../shared/VariablePanel';
import { StepControls } from '../shared/StepControls';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

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
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function preorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null) {
    if (!node) return;
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return result;
}`,

  python: `def preorderTraversal(root):
    result = []
    def dfs(node):
        if not node:
            return
        result.append(node.val)
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return result`,

  java: `public static class Solution {
    private void dfs(TreeNode node, List<Integer> result) {
        if (node == null) {
            return;
        }
        result.add(node.val);
        dfs(node.left, result);
        dfs(node.right, result);
    }
    public List<Integer> preorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, result);
        return result;
    }
}`,

  cpp: `class Solution {
public:
     vector < int > preorderTraversal(TreeNode * root) {
          vector < int > result;
          dfs(root, result);
          return result;
        }
        void dfs(TreeNode * node, vector<int> & result) {
          if (!node) return;
          result.push_back(node -> val);
          dfs(node -> left, result);
          dfs(node -> right, result);
        }
};`,
};

export const DFSPreorderVisualization = () => {
  // Tree structure: 1 -> 2,3 -> 4,5,6,7
  const tree: TreeNode = {
    val: 1,
    left: { val: 2, left: { val: 4, left: null, right: null }, right: { val: 5, left: null, right: null } },
    right: { val: 3, left: { val: 6, left: null, right: null }, right: { val: 7, left: null, right: null } }
  };

  const generateSteps = () => {
    const steps: Step[] = [];
    const visited: number[] = [];
    const stack: number[] = [];

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
      steps.push({
        currentNode,
        stack: [...stack],
        visited: [...visited],
        message: msg,
        pseudoStep: pseudo,
        variables: {
          currentNode: currentNode ?? 'null',
          stack: `[${stack.join(', ')}]`,
          visited: `[${visited.join(', ')}]`,
          'preorder result': visited.join(' → ') || 'empty'
        }
      });
      addLines(ts_l, py_l, java_l, cpp_l);
    };

    // 1. Initialize result
    addStep(null, 'Initialize result array.', 'result = []', 2, 2, 11, 4);

    // 2. Call dfs(root)
    addStep(null, 'Invoke dfs(root) to start traversal.', 'dfs(root)', 9, 9, 12, 5);

    const dfs = (node: TreeNode | null, depth: number = 0) => {
      // Check if node is null
      if (!node) {
        addStep(null, 'Node is null. Backtrack.', 'IF node is null → return', 4, 4, 3, 9);
        addStep(null, 'Return from null node.', 'return', 4, 5, 4, 9);
        return;
      }

      // Check if (!node) condition (which evaluates to false)
      addStep(node.val, `Check if node is null: node (${node.val}) is not null.`, 'IF node is null → NO', 4, 4, 3, 9);

      // Visit node (preorder)
      visited.push(node.val);
      stack.push(node.val);
      addStep(node.val, `Visit node ${node.val}. Append it to the result.`, `result.push(${node.val})`, 5, 6, 6, 10);

      // Recurse left
      addStep(node.val, `Recurse into left subtree of node ${node.val}.`, `dfs(node.left)`, 6, 7, 7, 11);
      dfs(node.left, depth + 1);

      // Recurse right
      addStep(node.val, `Recurse into right subtree of node ${node.val}.`, `dfs(node.right)`, 7, 8, 8, 12);
      dfs(node.right, depth + 1);

      // Backtrack
      stack.pop();
      addStep(node.val, `Finished visiting node ${node.val}. Pop from stack and backtrack.`, 'End dfs(node) → Backtrack', 8, 8, 9, 13);
    };

    dfs(tree);

    // Return result
    addStep(null, `Traversal complete. Return preorder result: [${visited.join(', ')}]`, 'return result', 10, 10, 13, 6);

    return { steps, stepLineNumbers };
  };

  const [{ steps, stepLineNumbers }] = useState(generateSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  };

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

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
        <text x={x} y={y} textAnchor="middle" dy=".3em" className="text-sm font-semibold" fill={isVisited || isCurrent ? 'white' : 'hsl(var(--foreground))'}>
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
        {/* Left: visual tree + commentary box + variable panel */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <svg viewBox="0 0 400 250" className="w-full h-64">
              {renderTree(tree, 200, 30, 80)}
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-yellow-600">Call Stack</h4>
              <div className="flex flex-col-reverse gap-1">
                {currentStep.stack.map((val, i) => (
                  <div key={i} className="bg-yellow-500 text-white rounded px-2 py-1 text-center font-mono text-xs">
                    dfs({val})
                  </div>
                ))}
                {currentStep.stack.length === 0 && <div className="text-xs text-muted-foreground italic">Empty</div>}
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-green-600">Visited</h4>
              <div className="flex flex-wrap gap-1">
                {currentStep.visited.map((val, i) => (
                  <div key={i} className="bg-green-600 text-white rounded px-2 py-1 font-mono text-xs">
                    {val}
                  </div>
                ))}
                {currentStep.visited.length === 0 && <div className="text-xs text-muted-foreground italic">Empty</div>}
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg border border-accent p-4">
            <p className="text-sm text-foreground font-medium">{currentStep.message}</p>
          </div>

          <VariablePanel
            variables={{
              current: currentStep.currentNode ?? 'null',
              callStackDepth: currentStep.stack.length,
              visitedCount: currentStep.visited.length,
              'preorder result': currentStep.visited.join(' → ') || 'empty'
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
