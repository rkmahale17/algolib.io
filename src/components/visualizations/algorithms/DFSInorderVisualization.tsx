import { useEffect, useRef, useState } from 'react';
import { StepControls } from '../shared/StepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

interface Step {
  visited: number[];
  currentNode: number | null;
  stack: number[];
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  function dfs(node: TreeNode | null) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}`,

  python: `def inorderTraversal(root):
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    dfs(root)
    return result`,

  java: `public static class Solution {
      private void dfs(TreeNode node, List<Integer> result) {
            if (node == null) {
                return;
            }
            dfs(node.left, result);
            result.add(node.val);
            dfs(node.right, result);
        }
        public List<Integer> inorderTraversal(TreeNode root) {
            List<Integer> result = new ArrayList<>();
            dfs(root, result);
            return result;
        }
 }`,

  cpp: `class Solution {
public:
      vector < int > inorderTraversal(TreeNode * root) {
        vector < int > result;
        dfs(root, result);
        return result;
      }
      void dfs(TreeNode * node, vector<int> & result) {
        if (!node) return;
        dfs(node -> left, result);
        result.push_back(node -> val);
        dfs(node -> right, result);
      }
};`,
};

export const DFSInorderVisualization = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);

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
          'inorder result': visited.join(' → ') || 'empty'
        }
      });
      addLines(ts_l, py_l, java_l, cpp_l);
    };

    // 1. Initialize result
    addStep(null, 'Initialize result array.', 'result = []', 2, 2, 11, 4);

    // 2. Call dfs(root)
    addStep(null, 'Invoke dfs(root) to start traversal.', 'dfs(root)', 9, 9, 12, 5);

    const dfs = (node: TreeNode | null) => {
      if (!node) {
        addStep(null, 'Node is null. Backtrack.', 'IF node is null → return', 4, 4, 3, 9);
        addStep(null, 'Return from null node.', 'return', 4, 5, 4, 9);
        return;
      }

      // Check if (!node) evaluates to false
      stack.push(node.val);
      addStep(node.val, `Check if node is null: node (${node.val}) is not null.`, 'IF node is null → NO', 4, 4, 3, 9);

      // Recurse left
      addStep(node.val, `Recurse into left subtree of node ${node.val}.`, `dfs(node.left)`, 5, 6, 6, 10);
      dfs(node.left);

      // Visit node (inorder)
      visited.push(node.val);
      addStep(node.val, `Visit node ${node.val}. Append it to the result.`, `result.push(${node.val})`, 6, 7, 7, 11);

      // Recurse right
      addStep(node.val, `Recurse into right subtree of node ${node.val}.`, `dfs(node.right)`, 7, 8, 8, 12);
      dfs(node.right);

      // Backtrack
      stack.pop();
      addStep(node.val, `Finished visiting node ${node.val}. Pop from stack and backtrack.`, 'End dfs(node) → Backtrack', 8, 8, 9, 13);
    };

    dfs(root);

    // Return result
    addStep(null, `Traversal complete. Return inorder result: [${visited.join(', ')}]`, 'return result', 10, 10, 13, 6);

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

  if (steps.length === 0 || !tree) return null;

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    const isVisited = currentStep.visited.includes(node.val);
    const isCurrent = currentStep.currentNode === node.val;
    const isInStack = currentStep.stack.includes(node.val);

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
          r="20"
          className={`transition-all duration-300 ${isCurrent
            ? 'fill-primary stroke-primary'
            : isVisited
              ? 'fill-green-600 stroke-green-600'
              : isInStack
                ? 'fill-yellow-500 stroke-yellow-500'
                : 'fill-muted stroke-border'
            }`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`text-sm font-semibold ${isVisited || isCurrent ? 'fill-white' : 'fill-foreground'}`}
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
        {/* Left: visual tree + commentary box + variable panel */}
        <div className="space-y-4">
          <div className="bg-muted/30 rounded-lg border border-border/50 p-6">
            <svg viewBox="0 0 400 250" className="w-full h-64">
              {renderTree(tree)}
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
              'inorder result': currentStep.visited.join(' → ') || 'empty'
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
