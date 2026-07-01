import { useEffect, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Card } from '@/components/ui/card';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';
import confetti from 'canvas-confetti';

interface Step {
  currentNodeId: string | null;
  nodeStates: Record<string, 'unvisited' | 'active' | 'visited'>;
  nodeHeights: Record<string, number | null>;
  leftHeight: number | null;
  rightHeight: number | null;
  res: number;
  explanation: string;
  isMatch?: boolean;
  activePath: string[];
  diameterPathEdges: [string, string][];
  pseudoStep: string;
  variables: Record<string, any>;
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

const languages: VisualizationLanguageMap = {
  typescript: `function diameterOfBinaryTree(root: TreeNode | null): number {
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
}`,
  python: `def diameterOfBinaryTree(root):
    res = 0
    def dfs(node):
        nonlocal res
        if not node:
            return -1
        left_height = dfs(node.left)
        right_height = dfs(node.right)
        res = max(res, left_height + right_height + 2)
        return 1 + max(left_height, right_height)
    dfs(root)
    return res`,
  java: `public static class Solution {
    private int maxDiameter = 0;
    public int diameterOfBinaryTree(TreeNode root) {
        maxDiameter = 0;
        dfs(root);
        return maxDiameter;
    }
    private int dfs(TreeNode node) {
        if (node == null) {
            return -1;
        }
        int leftHeight = dfs(node.left);
        int rightHeight = dfs(node.right);
        maxDiameter = Math.max(maxDiameter, 2 + leftHeight + rightHeight);
        return 1 + Math.max(leftHeight, rightHeight);
    }
}`,
  cpp: `class Solution {
public:
    int diameterOfBinaryTree(TreeNode* root) {
        diameter = 0;
        calculateHeight(root);
        return diameter;
    }
private:
    int diameter;
    int calculateHeight(TreeNode* node) {
        if (!node) {
            return -1;
        }
        int leftHeight = calculateHeight(node->left);
        int rightHeight = calculateHeight(node->right);
        diameter = max(diameter, 2 + leftHeight + rightHeight);
        return 1 + max(leftHeight, rightHeight);
    }
};`
};

export const DiameterOfBinaryTreeVisualization = () => {
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<string>(TEST_CASES[0].id);
  const selectedTestCase = useMemo(() => TEST_CASES.find(t => t.id === selectedTestCaseId) || TEST_CASES[0], [selectedTestCaseId]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const rootId = selectedTestCase.rootId;
    const newSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
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
      explanation: string,
      pseudo: string,
      currentNodeId: string | null,
      leftHeight: number | null,
      rightHeight: number | null,
      isMatch = false,
      variablesExtra: Record<string, any> = {},
      ts: number, py: number, jv: number, cp: number
    ) => {
      newSteps.push({
        currentNodeId,
        nodeStates: { ...nodeStates },
        nodeHeights: { ...nodeHeights },
        leftHeight,
        rightHeight,
        res: currentRes,
        explanation,
        pseudoStep: pseudo,
        isMatch,
        activePath: [...activePath],
        diameterPathEdges: [...maxDiameterPathEdges],
        variables: getVariables(currentNodeId, leftHeight, rightHeight, variablesExtra)
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

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

    pushStep(
      `Start diameterOfBinaryTree. We want to find the length of the longest path (number of edges) between any two nodes.`,
      "diameterOfBinaryTree(root)",
      null, null, null, false, {},
      1, 1, 3, 3
    );

    pushStep(
      `Initialize res = 0 to track the maximum diameter found so far.`,
      "SET res = 0",
      null, null, null, false, {},
      2, 2, 4, 4
    );

    pushStep(
      `Begin DFS traversal from the root node.`,
      `dfs(root)  →  dfs(node=1)`,
      null, null, null, false, {},
      12, 11, 5, 5
    );

    const dfs = (nodeId: string | null): number => {
      if (!nodeId) {
        pushStep(
          `Node is null (leaf child). Return height = -1.`,
          "IF NOT node  →  RETURN -1",
          null, null, null, false, {},
          5, 6, 10, 12
        );
        return -1;
      }

      nodeStates[nodeId] = 'active';
      activePath.push(nodeId);
      const val = selectedTestCase.treeData[nodeId].val;

      pushStep(
        `dfs(node) called: visiting Node ${val}.`,
        `dfs(node=${val})`,
        nodeId, null, null, false, {},
        3, 3, 8, 10
      );

      pushStep(
        `Check if Node ${val} is null. It is not, so continue.`,
        `IF NOT node  →  False`,
        nodeId, null, null, false, {},
        4, 5, 9, 11
      );

      const node = selectedTestCase.treeData[nodeId];
      
      pushStep(
        `Recurse into left child of Node ${val}.`,
        `dfs(node.left)  →  dfs(node=${node.left ? selectedTestCase.treeData[node.left].val : 'null'})`,
        nodeId, null, null, false, {},
        7, 7, 12, 14
      );
      
      const leftHeight = dfs(node.left);
      
      nodeStates[nodeId] = 'active';
      if (node.left && !activePath.includes(nodeId)) activePath.push(nodeId);
      pushStep(
        `Back to Node ${val}. Left height calculated: leftHeight = ${leftHeight}.`,
        `left_height = ${leftHeight}`,
        nodeId, leftHeight, null, false, {},
        7, 7, 12, 14
      );

      pushStep(
        `Recurse into right child of Node ${val}.`,
        `dfs(node.right)  →  dfs(node=${node.right ? selectedTestCase.treeData[node.right].val : 'null'})`,
        nodeId, leftHeight, null, false, {},
        8, 8, 13, 15
      );
      
      const rightHeight = dfs(node.right);
      
      nodeStates[nodeId] = 'active';
      if (node.right && !activePath.includes(nodeId)) activePath.push(nodeId);
      pushStep(
        `Back to Node ${val}. Right height calculated: rightHeight = ${rightHeight}.`,
        `right_height = ${rightHeight}`,
        nodeId, leftHeight, rightHeight, false, {},
        8, 8, 13, 15
      );

      const currentDiameter = 2 + leftHeight + rightHeight;
      const willUpdate = currentDiameter > currentRes;
      if (willUpdate) {
        currentRes = currentDiameter;
        maxDiameterPathEdges = getDiameterPathEdges(nodeId, leftHeight, rightHeight);
      }

      pushStep(
        `Calculate diameter through Node ${val}: 2 + leftHeight (${leftHeight}) + rightHeight (${rightHeight}) = ${currentDiameter}. Max diameter (res) becomes Math.max(${currentRes - (willUpdate ? (currentDiameter - currentRes) : 0)}, ${currentDiameter}) = ${currentRes}.${willUpdate ? ' This is our new longest path! 🎉' : ''}`,
        `res = max(res, left_height + right_height + 2)  →  ${currentRes}`,
        nodeId, leftHeight, rightHeight, willUpdate, {},
        9, 9, 14, 16
      );

      const height = 1 + Math.max(leftHeight, rightHeight);
      nodeHeights[nodeId] = height;
      nodeStates[nodeId] = 'visited';
      const idx = activePath.indexOf(nodeId);
      if (idx !== -1) activePath.splice(idx, 1);

      pushStep(
        `Return subtree height for Node ${val}: 1 + max(leftHeight=${leftHeight}, rightHeight=${rightHeight}) = ${height}. Node is marked completed.`,
        `RETURN 1 + max(${leftHeight}, ${rightHeight})  →  ${height}`,
        nodeId, leftHeight, rightHeight, false, {},
        10, 10, 15, 17
      );

      return height;
    };

    dfs(rootId);

    pushStep(
      `DFS traversal finished. The maximum diameter found in the tree is ${currentRes}.`,
      `RETURN res  →  ${currentRes}`,
      null, null, null, true, {},
      13, 12, 6, 6
    );

    return { steps: newSteps, stepLineNumbers: lines };
  }, [selectedTestCase]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

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

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            {/* Tree Visualization */}
            <Card className="p-4 bg-card border border-border shadow-sm flex flex-col items-center relative overflow-hidden min-h-[300px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Binary Tree & Subtree Heights
              </span>

              <div className="w-full flex justify-center items-center">
                <svg viewBox="0 0 400 210" className="w-full max-w-[400px] h-auto overflow-visible">
                  {selectedTestCase.edges.map((edge, i) => {
                    const fromPos = selectedTestCase.positions[edge.from];
                    const toPos = selectedTestCase.positions[edge.to];
                    
                    const isDiameter = isEdgeDiameter(edge.from, edge.to);
                    const isActive = isEdgeActive(edge.from, edge.to);

                    let color = '#e2e8f0';
                    let strokeWidth = '1.8';
                    let strokeDash = '0';

                    if (isDiameter) {
                      color = '#ef4444';
                      strokeWidth = '3.5';
                    } else if (isActive) {
                      color = '#3b82f6';
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
                        <circle
                          cx={pos.x} cy={pos.y} r="14"
                          className={`transition-all duration-300 ${borderStyle} ${fillStyle}`}
                        />
                        
                        <text
                          x={pos.x} y={pos.y} dy=".3em"
                          textAnchor="middle" fontSize="10" fontWeight="bold"
                          className={`transition-all duration-300 ${textStyle}`}
                        >
                          {nodeVal}
                        </text>

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

              <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-slate-300 bg-white" /> Unvisited</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-blue-500 bg-blue-500/5 animate-pulse" /> Active Path</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-green-500 bg-green-500/5" /> Height Computed</span>
                <span className="flex items-center gap-1"><span className="w-3.5 h-0.5 bg-red-500" /> Max Diameter Path</span>
              </div>
            </Card>

            {/* Explanation Text */}
            <Card className={`p-4 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm flex items-center ${
              currentStep.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'
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
            <VisualizationCodePanel
              languages={languages}
              stepLineNumbers={stepLineNumbers}
              pseudoSteps={pseudoSteps}
              activeStepIndex={currentStepIndex}
              onLanguageChange={() => setCurrentStepIndex(0)}
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
    </div>
  );
};
export default DiameterOfBinaryTreeVisualization;
