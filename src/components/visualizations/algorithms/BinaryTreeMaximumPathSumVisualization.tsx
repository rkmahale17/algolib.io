import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: number;
}

interface Step {
  line: number;
  vars: {
    node: string;
    leftMax: string;
    rightMax: string;
    res: string;
    returnVal: string;
  };
  msg: string;
  activeNodeId: number | null;
  highlightedPath: number[];
  completedNodes: Set<number>;
}

export const BinaryTreeMaximumPathSumVisualization = () => {
  const code = `function maxPathSum(root: TreeNode | null): number {
  let res = -Infinity;

  function dfs(node: TreeNode | null): number {
    if (!node) return 0;

    let leftMax = dfs(node.left);
    let rightMax = dfs(node.right);

    leftMax = Math.max(leftMax, 0);
    rightMax = Math.max(rightMax, 0);

    res = Math.max(res, node.val + leftMax + rightMax);

    return node.val + Math.max(leftMax, rightMax);
  }

  dfs(root);
  return res;
}`;

  // Define a demo tree
  //      -10(0)
  //      /    \
  //    9(1)  20(2)
  //          /   \
  //        15(3) 7(4)
  const tree: TreeNode = {
    val: -10,
    id: 0,
    left: { val: 9, id: 1, left: null, right: null },
    right: {
      val: 20,
      id: 2,
      left: { val: 15, id: 3, left: null, right: null },
      right: { val: 7, id: 4, left: null, right: null },
    },
  };

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = [];
    let res = -Infinity;
    const completedNodes = new Set<number>();

    function addStep(line: number, node: TreeNode | null, leftMax: any, rightMax: any, currRes: any, returnVal: any, msg: string, activeNodeId: number | null = null, path: number[] = []) {
      s.push({
        line,
        vars: {
          node: node ? `${node.val}` : (node === null ? 'null' : '-'),
          leftMax: leftMax !== undefined ? `${leftMax}` : '-',
          rightMax: rightMax !== undefined ? `${rightMax}` : '-',
          res: currRes === -Infinity ? '-∞' : `${currRes}`,
          returnVal: returnVal !== undefined ? `${returnVal}` : '-',
        },
        msg,
        activeNodeId: activeNodeId ?? (node ? node.id : null),
        highlightedPath: path,
        completedNodes: new Set(completedNodes),
      });
    }

    addStep(2, null, undefined, undefined, res, undefined, "Initialize result res = -Infinity");
    addStep(18, tree, undefined, undefined, res, undefined, "Start DFS from the root node (-10)");

    function dfs(node: TreeNode | null): number {
      const nodeId = node ? node.id : -1;
      
      if (!node) {
        addStep(5, null, undefined, undefined, res, 0, "Base case: Node is null, return 0");
        return 0;
      }

      addStep(5, node, undefined, undefined, res, undefined, `Enter DFS for node ${node.val}`);
      
      addStep(7, node, undefined, undefined, res, undefined, `Visit left child of ${node.val}`);
      const leftRaw = dfs(node.left);
      let leftMax = leftRaw;
      addStep(7, node, leftMax, undefined, res, undefined, `Left child returned ${leftMax}`);

      addStep(8, node, leftMax, undefined, res, undefined, `Visit right child of ${node.val}`);
      const rightRaw = dfs(node.right);
      let rightMax = rightRaw;
      addStep(8, node, leftMax, rightMax, res, undefined, `Right child returned ${rightMax}`);

      leftMax = Math.max(leftMax, 0);
      addStep(10, node, leftMax, rightMax, res, undefined, `Adjust leftMax: max(${leftRaw}, 0) = ${leftMax}`);

      rightMax = Math.max(rightMax, 0);
      addStep(11, node, leftMax, rightMax, res, undefined, `Adjust rightMax: max(${rightRaw}, 0) = ${rightMax}`);

      const currentSum = node.val + leftMax + rightMax;
      const oldRes = res;
      res = Math.max(res, currentSum);
      
      let path: number[] = [];
      if (res === 42 && node.id === 2) {
         path = [3, 2, 4]; // 15 -> 20 -> 7
      }

      const resMsg = res > oldRes 
        ? `New global maximum found! max(${oldRes === -Infinity ? '-∞' : oldRes}, ${node.val} + ${leftMax} + ${rightMax}) = ${res}`
        : `Global maximum stays ${res}. currentSum at this node = ${currentSum}`;
      
      addStep(13, node, leftMax, rightMax, res, undefined, resMsg, node.id, path);

      const returnVal = node.val + Math.max(leftMax, rightMax);
      addStep(15, node, leftMax, rightMax, res, returnVal, `Return max path through this node without split: ${node.val} + max(${leftMax}, ${rightMax}) = ${returnVal}`);
      
      completedNodes.add(node.id);
      return returnVal;
    }

    dfs(tree);
    addStep(19, null, undefined, undefined, res, res, `Final result: ${res}`);

    return s;
  }, []);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const step = steps[currentStepIdx];

  const nodePositions: Record<number, { x: number; y: number }> = {
    0: { x: 50, y: 15 },
    1: { x: 25, y: 45 },
    2: { x: 75, y: 45 },
    3: { x: 65, y: 75 },
    4: { x: 85, y: 75 },
  };

  const renderEdges = (node: TreeNode | null, parentX?: number, parentY?: number): JSX.Element[] => {
    if (!node) return [];
    const pos = nodePositions[node.id];
    let edges: JSX.Element[] = [];

    if (parentX !== undefined && parentY !== undefined) {
      const isInPath = step.highlightedPath.includes(node.id) && step.highlightedPath.includes(node.id === 1 ? 0 : node.id === 2 ? 0 : node.id === 3 ? 2 : 2);
      // Simplified path logic for demo tree
      const isActuallyInPath = (node.id === 3 && step.highlightedPath.includes(3) && step.highlightedPath.includes(2)) ||
                               (node.id === 4 && step.highlightedPath.includes(4) && step.highlightedPath.includes(2)) ||
                               (node.id === 1 && step.highlightedPath.includes(1) && step.highlightedPath.includes(0)) ||
                               (node.id === 2 && step.highlightedPath.includes(2) && step.highlightedPath.includes(0));

      edges.push(
        <motion.line
          key={`edge-${node.id}`}
          x1={parentX}
          y1={parentY}
          x2={pos.x}
          y2={pos.y}
          stroke="currentColor"
          strokeWidth="2"
          className={isActuallyInPath ? "text-green-500" : "text-slate-300 dark:text-slate-700"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
        />
      );
    }

    return [
      ...edges,
      ...renderEdges(node.left, pos.x, pos.y),
      ...renderEdges(node.right, pos.x, pos.y),
    ];
  };

  const renderNodes = (node: TreeNode | null): JSX.Element[] => {
    if (!node) return [];
    const pos = nodePositions[node.id];
    const isActive = step.activeNodeId === node.id;
    const isCompleted = step.completedNodes.has(node.id);
    const isInPath = step.highlightedPath.includes(node.id);

    return [
      <motion.g
        key={`node-${node.id}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
      >
        <circle
          cx={pos.x}
          cy={pos.y}
          r="8"
          className={`transition-colors duration-300 fill-card stroke-2 ${
            isInPath
              ? "stroke-green-500 fill-green-500/10"
              : isActive
              ? "stroke-yellow-500 fill-yellow-500/10"
              : isCompleted
              ? "stroke-blue-500 fill-blue-500/5"
              : "stroke-slate-300 dark:stroke-slate-700"
          }`}
        />
        <text
          x={pos.x}
          y={pos.y}
          dy="0.32em"
          textAnchor="middle"
          className={`text-[4px] font-bold ${
            isInPath ? "fill-green-600 dark:fill-green-400" : "fill-foreground"
          }`}
        >
          {node.val}
        </text>
      </motion.g>,
      ...renderNodes(node.left),
      ...renderNodes(node.right),
    ];
  };

  return (
    <div className="flex flex-col gap-6">
      <SimpleStepControls
        currentStep={currentStepIdx}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIdx}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
            <div className="absolute top-2 left-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Tree Visualization
            </div>
            <svg viewBox="0 0 100 80" className="w-full h-[300px]" preserveAspectRatio="xMidYMin meet">
              {renderEdges(tree)}
              {renderNodes(tree)}
            </svg>
            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border-2 border-yellow-500 bg-yellow-500/10" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-500/5" />
                <span>Processed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-green-500/10" />
                <span>Max Path</span>
              </div>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="p-4 bg-primary/5 border-primary/10 min-h-[80px] flex items-center">
              <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                {step.msg}
              </p>
            </Card>

            <VariablePanel
              variables={{
                "Node": step.vars.node,
                "Left Max Path": step.vars.leftMax,
                "Right Max Path": step.vars.rightMax,
                "Global Max (res)": step.vars.res,
                "Return Value": step.vars.returnVal,
              }}
            />
          </div>
        </div>

        <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={[step.line]}
          />
        </Card>
      </div>
    </div>
  );
};