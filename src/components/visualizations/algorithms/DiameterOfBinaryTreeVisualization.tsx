import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, Check, Trophy, Play, Pause, SkipForward, SkipBack, RotateCcw, Info } from 'lucide-react';
import { AnimatedCodeEditor } from "../shared/AnimatedCodeEditor";
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  currentNodeId: string | null;
  nodeStates: Record<string, 'unvisited' | 'active' | 'visited'>;
  nodeHeights: Record<string, number | null>;
  leftHeight: number | null;
  rightHeight: number | null;
  res: number;
  explanation: string;
  lineNumber: number;
  isMatch?: boolean;
  activePath: string[];
  diameterPathEdges: [string, string][];
}

interface TreeNodeData {
  val: number;
  left: string | null;
  right: string | null;
}

interface TestCase {
  id: string;
  name: string;
  nodeIds: string[];
  rootId: string;
  treeData: Record<string, TreeNodeData>;
  positions: Record<string, { x: number; y: number }>;
  edges: { from: string; to: string }[];
  expected: number;
}

const TEST_CASES: TestCase[] = [
  {
    id: 'ex1',
    name: 'Standard Tree',
    nodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
    rootId: 'n1',
    treeData: {
      'n1': { val: 1, left: 'n2', right: 'n3' },
      'n2': { val: 2, left: 'n4', right: 'n5' },
      'n3': { val: 3, left: null, right: null },
      'n4': { val: 4, left: null, right: null },
      'n5': { val: 5, left: null, right: null }
    },
    positions: {
      'n1': { x: 200, y: 35 },
      'n2': { x: 110, y: 95 },
      'n3': { x: 290, y: 95 },
      'n4': { x: 60, y: 155 },
      'n5': { x: 160, y: 155 }
    },
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n1', to: 'n3' },
      { from: 'n2', to: 'n4' },
      { from: 'n2', to: 'n5' }
    ],
    expected: 3
  },
  {
    id: 'ex2',
    name: 'Linear Path',
    nodeIds: ['n1', 'n2'],
    rootId: 'n1',
    treeData: {
      'n1': { val: 1, left: 'n2', right: null },
      'n2': { val: 2, left: null, right: null }
    },
    positions: {
      'n1': { x: 200, y: 45 },
      'n2': { x: 200, y: 135 }
    },
    edges: [
      { from: 'n1', to: 'n2' }
    ],
    expected: 1
  },
  {
    id: 'ex3',
    name: 'Skewed Tree',
    nodeIds: ['n1', 'n2', 'n3', 'n4', 'n5'],
    rootId: 'n1',
    treeData: {
      'n1': { val: 1, left: 'n2', right: 'n3' },
      'n2': { val: 2, left: null, right: 'n4' },
      'n3': { val: 3, left: null, right: 'n5' },
      'n4': { val: 4, left: null, right: null },
      'n5': { val: 5, left: null, right: null }
    },
    positions: {
      'n1': { x: 200, y: 35 },
      'n2': { x: 120, y: 95 },
      'n3': { x: 280, y: 95 },
      'n4': { x: 160, y: 155 },
      'n5': { x: 320, y: 155 }
    },
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n1', to: 'n3' },
      { from: 'n2', to: 'n4' },
      { from: 'n3', to: 'n5' }
    ],
    expected: 4
  }
];

export const DiameterOfBinaryTreeVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0];

  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const code = `function diameterOfBinaryTree(root: TreeNode | null): number {
    let res = 0;

    function dfs(node: TreeNode | null): number {
        if (!node) {
            return -1;
        }

        const leftHeight = dfs(node.left);
        const rightHeight = dfs(node.right);

        res = Math.max(res, 2 + leftHeight + rightHeight);

        return 1 + Math.max(leftHeight, rightHeight);
    }

    dfs(root);
    return res;
}`;

  const generateSteps = useCallback(() => {
    const rootId = selectedTestCase.rootId;
    const newSteps: Step[] = [];
    let currentRes = 0;

    const nodeStates: Record<string, 'unvisited' | 'active' | 'visited'> = {};
    const nodeHeights: Record<string, number | null> = {};
    selectedTestCase.nodeIds.forEach(id => {
      nodeStates[id] = 'unvisited';
      nodeHeights[id] = null;
    });

    const activePath: string[] = [];
    let maxDiameterPathEdges: [string, string][] = [];

    const getVariables = (currentNodeId: string | null, leftHeight: number | null, rightHeight: number | null, extra: Record<string, any> = {}) => {
      const nodeVal = currentNodeId ? selectedTestCase.treeData[currentNodeId].val : 'null';
      return {
        'res (max diameter)': currentRes,
        'node': currentNodeId ? `Node(${nodeVal})` : 'null',
        'leftHeight': leftHeight !== null ? leftHeight : 'undefined',
        'rightHeight': rightHeight !== null ? rightHeight : 'undefined',
        'call_stack_depth': activePath.length,
        ...extra
      };
    };

    const pushStep = (
      lineNumber: number,
      explanation: string,
      currentNodeId: string | null,
      leftHeight: number | null,
      rightHeight: number | null,
      isMatch = false,
      variablesExtra: Record<string, any> = {}
    ) => {
      newSteps.push({
        currentNodeId,
        nodeStates: { ...nodeStates },
        nodeHeights: { ...nodeHeights },
        leftHeight,
        rightHeight,
        res: currentRes,
        explanation,
        lineNumber,
        isMatch,
        activePath: [...activePath],
        diameterPathEdges: [...maxDiameterPathEdges],
        variables: getVariables(currentNodeId, leftHeight, rightHeight, variablesExtra)
      });
    };

    // Helper to calculate diameter path for visual highlighting
    const getDiameterPathEdges = (nodeId: string, leftH: number, rightH: number): [string, string][] => {
      const getDeepestPath = (currId: string): string[] => {
        const node = selectedTestCase.treeData[currId];
        if (!node) return [];
        const leftPath = node.left ? getDeepestPath(node.left) : [];
        const rightPath = node.right ? getDeepestPath(node.right) : [];
        if (leftPath.length >= rightPath.length) {
          return [currId, ...leftPath];
        } else {
          return [currId, ...rightPath];
        }
      };

      const node = selectedTestCase.treeData[nodeId];
      const leftPath = node.left ? getDeepestPath(node.left) : [];
      const rightPath = node.right ? getDeepestPath(node.right) : [];

      const edges: [string, string][] = [];
      
      let curr = nodeId;
      for (const next of leftPath) {
        edges.push([curr, next]);
        curr = next;
      }
      curr = nodeId;
      for (const next of rightPath) {
        edges.push([curr, next]);
        curr = next;
      }

      return edges;
    };

    // Step 1: Init / line 1
    pushStep(1, `Start diameterOfBinaryTree. We want to find the length of the longest path (number of edges) between any two nodes.`, null, null, null);

    // Step 2: res init / line 2
    pushStep(2, `Initialize res = 0 to track the maximum diameter found so far.`, null, null, null);

    // Step 3: dfs call / line 17
    pushStep(17, `Begin DFS traversal from the root node.`, null, null, null);

    const dfs = (nodeId: string | null): number => {
      if (!nodeId) {
        // Line 5-6: node is null
        pushStep(5, `Node is null (leaf child). Return height = -1.`, null, null, null);
        return -1;
      }

      nodeStates[nodeId] = 'active';
      activePath.push(nodeId);
      const val = selectedTestCase.treeData[nodeId].val;

      // Line 4: dfs called
      pushStep(4, `dfs(node) called: visiting Node ${val}.`, nodeId, null, null);

      // Line 5: null check
      pushStep(5, `Check if Node ${val} is null. It is not, so continue.`, nodeId, null, null);

      // Line 9: recurse left
      const node = selectedTestCase.treeData[nodeId];
      if (node.left) {
        pushStep(9, `Recurse into left child of Node ${val}.`, nodeId, null, null);
      } else {
        pushStep(9, `Left child of Node ${val} is null. Recurse into it.`, nodeId, null, null);
      }
      
      const leftHeight = dfs(node.left);
      
      // Back to this node
      nodeStates[nodeId] = 'active';
      if (node.left && !activePath.includes(nodeId)) activePath.push(nodeId);
      pushStep(9, `Back to Node ${val}. Left height calculated: leftHeight = ${leftHeight}.`, nodeId, leftHeight, null);

      // Line 10: recurse right
      if (node.right) {
        pushStep(10, `Recurse into right child of Node ${val}.`, nodeId, leftHeight, null);
      } else {
        pushStep(10, `Right child of Node ${val} is null. Recurse into it.`, nodeId, leftHeight, null);
      }
      
      const rightHeight = dfs(node.right);
      
      // Back to this node
      nodeStates[nodeId] = 'active';
      if (node.right && !activePath.includes(nodeId)) activePath.push(nodeId);
      pushStep(10, `Back to Node ${val}. Right height calculated: rightHeight = ${rightHeight}.`, nodeId, leftHeight, rightHeight);

      // Line 12: res update
      const currentDiameter = 2 + leftHeight + rightHeight;
      const willUpdate = currentDiameter > currentRes;
      if (willUpdate) {
        currentRes = currentDiameter;
        maxDiameterPathEdges = getDiameterPathEdges(nodeId, leftHeight, rightHeight);
      }

      pushStep(
        12,
        `Calculate diameter through Node ${val}: 2 + leftHeight (${leftHeight}) + rightHeight (${rightHeight}) = ${currentDiameter}. Max diameter (res) becomes Math.max(${currentRes - (willUpdate ? (currentDiameter - currentRes) : 0)}, ${currentDiameter}) = ${currentRes}.${willUpdate ? ' This is our new longest path! 🎉' : ''}`,
        nodeId,
        leftHeight,
        rightHeight,
        willUpdate
      );

      // Line 14: return height
      const height = 1 + Math.max(leftHeight, rightHeight);
      nodeHeights[nodeId] = height;
      nodeStates[nodeId] = 'visited';
      const idx = activePath.indexOf(nodeId);
      if (idx !== -1) activePath.splice(idx, 1);

      pushStep(
        14,
        `Return subtree height for Node ${val}: 1 + max(leftHeight=${leftHeight}, rightHeight=${rightHeight}) = ${height}. Node is marked completed.`,
        nodeId,
        leftHeight,
        rightHeight
      );

      return height;
    };

    dfs(rootId);

    // Line 19: return res
    pushStep(19, `DFS traversal finished. The maximum diameter found in the tree is ${currentRes}.`, null, null, null, true);

    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, [selectedTestCase]);

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

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
      }, 1500 / speed);
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

  // Trigger confetti when visual finishes successfully
  useEffect(() => {
    if (currentStepIndex === steps.length - 1 && steps.length > 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
  }, [currentStepIndex, steps]);

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const { currentNodeId, nodeStates, nodeHeights, activePath, diameterPathEdges } = currentStep;

  const isEdgeActive = (u: string, v: string) => {
    const uIdx = activePath.indexOf(u);
    const vIdx = activePath.indexOf(v);
    return uIdx !== -1 && vIdx !== -1 && Math.abs(uIdx - vIdx) === 1;
  };

  const isEdgeDiameter = (u: string, v: string) => {
    return diameterPathEdges.some(de => 
      (de[0] === u && de[1] === v) || (de[0] === v && de[1] === u)
    );
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          {/* Test Cases Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
            <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
              Test Cases
            </h3>
            <div className="flex flex-wrap gap-2 bg-background p-1 rounded-lg border border-border shadow-sm">
              {TEST_CASES.map(tc => (
                <button
                  key={tc.id}
                  onClick={() => {
                    setSelectedTestCaseId(tc.id);
                    setIsPlaying(false);
                    setCurrentStepIndex(0);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-300 ${
                    selectedTestCaseId === tc.id 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {tc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tree Visualization */}
          <Card className="p-4 bg-card border border-border shadow-sm flex flex-col items-center relative overflow-hidden min-h-[300px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Binary Tree & Subtree Heights
            </span>

            <div className="w-full flex justify-center items-center">
              <svg viewBox="0 0 400 210" className="w-full max-w-[400px] h-auto overflow-visible">
                {/* Draw edges */}
                {selectedTestCase.edges.map((edge, i) => {
                  const fromPos = selectedTestCase.positions[edge.from];
                  const toPos = selectedTestCase.positions[edge.to];
                  
                  const isDiameter = isEdgeDiameter(edge.from, edge.to);
                  const isActive = isEdgeActive(edge.from, edge.to);

                  let color = '#e2e8f0'; // unprocessed
                  let strokeWidth = '1.8';
                  let strokeDash = '0';

                  if (isDiameter) {
                    color = '#ef4444'; // Red diameter
                    strokeWidth = '3.5';
                  } else if (isActive) {
                    color = '#3b82f6'; // Blue active DFS
                    strokeWidth = '2.5';
                  }

                  return (
                    <line
                      key={i}
                      x1={fromPos.x} y1={fromPos.y}
                      x2={toPos.x} y2={toPos.y}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={strokeDash}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Draw nodes */}
                {selectedTestCase.nodeIds.map(nodeId => {
                  const pos = selectedTestCase.positions[nodeId];
                  const nodeVal = selectedTestCase.treeData[nodeId].val;
                  
                  const state = nodeStates[nodeId];
                  const height = nodeHeights[nodeId];
                  const isCurrent = currentNodeId === nodeId;

                  const parentNode = selectedTestCase.edges.find(e => e.to === nodeId)?.from;
                  const isLeftChild = parentNode ? selectedTestCase.treeData[parentNode].left === nodeId : false;

                  let borderStyle = 'stroke-slate-300';
                  let fillStyle = 'fill-white dark:fill-slate-900';
                  let textStyle = 'fill-slate-700 dark:fill-slate-200';

                  if (isCurrent) {
                    borderStyle = 'stroke-amber-500 stroke-[2.5]';
                    fillStyle = 'fill-amber-500/10';
                    textStyle = 'fill-amber-600 dark:fill-amber-400 font-extrabold';
                  } else if (state === 'visited') {
                    borderStyle = 'stroke-green-500 stroke-2';
                    fillStyle = 'fill-green-500/5';
                    textStyle = 'fill-green-600 dark:fill-green-400 font-bold';
                  } else if (state === 'active') {
                    borderStyle = 'stroke-blue-500 stroke-2';
                    fillStyle = 'fill-blue-500/5';
                    textStyle = 'fill-blue-600 dark:fill-blue-400';
                  }

                  return (
                    <g key={nodeId} className="cursor-default">
                      {/* Node circle */}
                      <circle
                        cx={pos.x} cy={pos.y} r="14"
                        className={`transition-all duration-300 ${borderStyle} ${fillStyle}`}
                      />
                      
                      {/* Node value */}
                      <text
                        x={pos.x} y={pos.y} dy=".3em"
                        textAnchor="middle" fontSize="10" fontWeight="bold"
                        className={`transition-all duration-300 ${textStyle}`}
                      >
                        {nodeVal}
                      </text>

                      {/* Height badge next to node */}
                      {height !== null && (
                        <g>
                          <rect
                            x={isLeftChild ? pos.x - 36 : pos.x + 18}
                            y={pos.y - 8}
                            width="20" height="12"
                            rx="3"
                            className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700 stroke"
                          />
                          <text
                            x={isLeftChild ? pos.x - 26 : pos.x + 28}
                            y={pos.y} dy=".3em"
                            textAnchor="middle" fontSize="7" fontWeight="bold"
                            className="fill-slate-500 dark:fill-slate-400"
                          >
                            H:{height}
                          </text>
                        </g>
                      )}

                      {/* Pulsing ring for current active node */}
                      {isCurrent && (
                        <circle
                          cx={pos.x} cy={pos.y} r="19"
                          stroke="#f59e0b"
                          strokeWidth="1"
                          fill="none"
                          className="animate-ping opacity-60"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Sizing & Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-slate-300 bg-white" /> Unvisited</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-blue-500 bg-blue-500/5 animate-pulse" /> Active Path</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-green-500 bg-green-500/5" /> Height Computed</span>
              <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-red-500" /> Max Diameter Path</span>
            </div>
          </Card>

          {/* Explanation Text */}
          <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${
            currentStep.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/40 border-primary'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl shrink-0 ${
                currentStep.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
              }`}>
                <Info className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Narrative
                </h4>
                <p className="text-xs font-medium leading-relaxed text-foreground/90">
                  {currentStep.explanation}
                </p>
              </div>
            </div>
          </Card>
        </div>
      }
      rightContent={
        <div className="space-y-4 h-full flex flex-col">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={[currentStep.lineNumber]}
            language="typescript"
          />
          <VariablePanel variables={currentStep.variables} />
        </div>
      }
      controls={
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      }
    />
  );
};
