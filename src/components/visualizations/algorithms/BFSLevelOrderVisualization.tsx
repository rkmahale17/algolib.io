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
  level?: number;
}

interface Step {
  visited: number[];
  queue: number[];
  currentNode: number | null;
  currentLevel: number;
  message: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function levelOrder(root: TreeNode | null): number[][] {
    if (!root) return [];
    const result: number[][] = [];
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
        const levelSize = queue.length;
        const level: number[] = [];
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
}`,

  python: `from collections import deque
def levelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result`,

  java: `public static class Solution{
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) {
            return result;
        }
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                currentLevel.add(node.val);
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            result.add(currentLevel);
        }
        return result;
    }
}`,

  cpp: `class Solution {
public:
      vector < vector < int >> levelOrder(TreeNode * root) {
        if (!root) return {};
        vector < vector < int >> result;
        queue < TreeNode *> q;
        q.push(root);
        while (!q.empty()) {
          int levelSize = q.size();
          vector < int > level;
          for (int i = 0; i < levelSize; i++) {
            TreeNode * node = q.front();
            q.pop();
            level.push_back(node -> val);
            if (node -> left) q.push(node -> left);
            if (node -> right) q.push(node -> right);
          }
          result.push_back(level);
        }
        return result;
      }
};`,
};

export const BFSLevelOrderVisualization = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);

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

    const steps: Step[] = [];
    const visited: number[] = [];
    const queue: TreeNode[] = [root];

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

    const addStep = (currentNode: number | null, lvl: number, msg: string, pseudo: string, ts_l: number, py_l: number, java_l: number, cpp_l: number) => {
      steps.push({
        currentNode,
        currentLevel: lvl,
        queue: queue.map(n => n.val),
        visited: [...visited],
        message: msg,
        pseudoStep: pseudo,
        variables: {
          currentNode: currentNode ?? 'null',
          level: lvl,
          queue: `[${queue.map(n => n.val).join(', ')}]`,
          visited: `[${visited.join(', ')}]`
        }
      });
      addLines(ts_l, py_l, java_l, cpp_l);
    };

    // Initial root check
    addStep(null, 0, 'Check if tree root is null (it is not).', 'if (!root) → NO', 2, 3, 4, 4);
    // Initialize result
    addStep(null, 0, 'Initialize result array.', 'result = []', 3, 5, 3, 5);
    // Enqueue root
    addStep(null, 0, 'Enqueue the root node to start BFS.', 'queue = [root]', 4, 6, 8, 7);

    let level = 0;
    while (queue.length > 0) {
      addStep(null, level, `Queue is not empty. Process level ${level}.`, 'while (queue not empty) → YES', 5, 7, 9, 8);

      const levelSize = queue.length;
      addStep(null, level, `Level size is ${levelSize}. We will process ${levelSize} nodes at this level.`, `levelSize = ${levelSize}`, 6, 8, 10, 9);

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        visited.push(node.val);

        addStep(node.val, level, `Dequeue node ${node.val} from queue.`, 'node = queue.shift()', 9, 11, 13, 12);
        addStep(node.val, level, `Add node ${node.val} value to current level list.`, `level.push(${node.val})`, 10, 12, 14, 14);

        if (node.left) {
          queue.push(node.left);
          addStep(node.val, level, `Enqueue left child node ${node.left.val}.`, `queue.push(node.left)`, 11, 14, 16, 15);
        }

        if (node.right) {
          queue.push(node.right);
          addStep(node.val, level, `Enqueue right child node ${node.right.val}.`, `queue.push(node.right)`, 12, 16, 19, 16);
        }
      }

      addStep(null, level, `Level ${level} traversal finished. Append current level list to result.`, 'result.push(level)', 14, 17, 22, 18);
      level++;
    }

    addStep(null, level, `Queue is empty. Return final level order traversal: [${visited.join(', ')}]`, 'return result', 16, 18, 24, 20);

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
    const isInQueue = currentStep.queue.includes(node.val);

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
            ? 'fill-primary stroke-primary animate-pulse'
            : isVisited
              ? 'fill-green-600 stroke-green-600'
              : isInQueue
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
          className={`text-sm font-semibold ${isVisited || isCurrent || isInQueue ? 'fill-white' : 'fill-foreground'}`}
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
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-blue-600">Queue</h4>
              <div className="flex gap-2 flex-wrap">
                {currentStep.queue.map((val, idx) => (
                  <div key={idx} className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center font-mono text-xs">
                    {val}
                  </div>
                ))}
                {currentStep.queue.length === 0 && <div className="text-xs text-muted-foreground italic">Empty</div>}
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider text-green-600">Visited</h4>
              <div className="flex flex-wrap gap-1">
                {currentStep.visited.map((val, idx) => (
                  <div key={idx} className="bg-green-600 text-white rounded px-2 py-1 font-mono text-xs">
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

        </div>

        {/* Right: code / pseudocode panel and variables */}
        <div className="space-y-4">
          <VisualizationCodePanel
            languages={languages}
            stepLineNumbers={stepLineNumbers}
            pseudoSteps={pseudoSteps}
            activeStepIndex={currentStepIndex}
            onLanguageChange={handleReset}
          />
          <VariablePanel
            variables={{
              current: currentStep.currentNode ?? 'null',
              level: currentStep.currentLevel,
              'queue.length': currentStep.queue.length,
              'visited.length': currentStep.visited.length
            }}
          />
        </div>
      </div>
    </div>
  );
};
