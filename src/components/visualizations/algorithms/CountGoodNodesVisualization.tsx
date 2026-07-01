import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { Info, CheckCircle2, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StepLineNumberMap, VisualizationLanguageMap } from '@/types/visualization';

interface Step {
  currentNodeId: string | null;
  nodeStates: Record<string, 'unvisited' | 'active' | 'good' | 'bad'>;
  maxVal: number | null;
  goodNodesCount: number;
  explanation: string;
  isMatch?: boolean;
  activePath: string[];
  pseudoStep: string;
}

const languages: VisualizationLanguageMap = {
  typescript: `function goodNodes(root: TreeNode | null): number {
  if (!root) return 0;
  const dfs = (node: TreeNode | null, maxVal: number): number => {
    if (!node) return 0;
    let goodNodesCount = node.val >= maxVal ? 1 : 0;
    const newMaxVal = Math.max(maxVal, node.val);
    goodNodesCount += dfs(node.left, newMaxVal);
    goodNodesCount += dfs(node.right, newMaxVal);
    return goodNodesCount;
  };
  return dfs(root, root.val);
}`,
  python: `def goodNodes(root: TreeNode | None) -> int:
    def dfs(node: TreeNode | None, max_val_on_path: int) -> int:
        if not node:
            return 0
        is_current_node_good = 1 if node.val >= max_val_on_path else 0
        new_max_val_for_children = max(max_val_on_path, node.val)
        total_good_nodes = is_current_node_good
        total_good_nodes += dfs(node.left, new_max_val_for_children)
        total_good_nodes += dfs(node.right, new_max_val_for_children)
        return total_good_nodes
    if not root:
        return 0
    return dfs(root, root.val)`,
  java: `public static class Solution {
    public int goodNodes(TreeNode root) {
        if (root == null) {
            return 0;
        }
        return dfs(root, root.val);
    }
    private int dfs(TreeNode node, int maxVal) {
        if (node == null) {
            return 0;
        }
        int goodNodesCount = 0;
        if (node.val >= maxVal) {
            goodNodesCount = 1;
        }
        int newMaxVal = Math.max(maxVal, node.val);
        goodNodesCount += dfs(node.left, newMaxVal);
        goodNodesCount += dfs(node.right, newMaxVal);
        return goodNodesCount;
    }
}`,
  cpp: `class Solution {
public:
    int dfs(TreeNode* node, int maxValSoFar) {
        if (!node) {
            return 0;
        }
        int goodNodesCount = 0;
        if (node->val >= maxValSoFar) {
            goodNodesCount = 1;
        }
        maxValSoFar = max(maxValSoFar, node->val);
        goodNodesCount += dfs(node->left, maxValSoFar);
        goodNodesCount += dfs(node->right, maxValSoFar);
        return goodNodesCount;
    }
    int goodNodes(TreeNode* root) {
        if (!root) {
            return 0;
        }
        return dfs(root, root->val);
    }
};`
};

export const CountGoodNodesVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const initialTree = useMemo(() => ({
    n0: { val: 3, left: 'n1', right: 'n2', label: 'Root (3)' },
    n1: { val: 1, left: 'n3', right: null, label: 'Child (1)' },
    n2: { val: 4, left: 'n4', right: 'n5', label: 'Child (4)' },
    n3: { val: 3, left: null, right: null, label: 'G-Child (3)' },
    n4: { val: 1, left: null, right: null, label: 'G-Child (1)' },
    n5: { val: 5, left: null, right: null, label: 'G-Child (5)' }
  }), []);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const states: Record<string, 'unvisited' | 'active' | 'good' | 'bad'> = {
      n0: 'unvisited',
      n1: 'unvisited',
      n2: 'unvisited',
      n3: 'unvisited',
      n4: 'unvisited',
      n5: 'unvisited'
    };

    const addStep = (
      nodeId: string | null,
      maxVal: number | null,
      count: number,
      msg: string,
      pseudo: string,
      isMatch: boolean = false,
      path: string[] = [],
      ts: number, py: number, jv: number, cp: number
    ) => {
      s.push({
        currentNodeId: nodeId,
        nodeStates: { ...states },
        maxVal,
        goodNodesCount: count,
        explanation: msg,
        pseudoStep: pseudo,
        isMatch,
        activePath: [...path]
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(jv);
      lines.cpp!.push(cp);
    };

    addStep(
      null, null, 0,
      "Start goodNodes algorithm. Check if the root node exists.",
      "goodNodes(root)",
      false, [],
      2, 11, 3, 17
    );
    addStep(
      null, null, 0,
      "Root exists. Initiate DFS starting from the root node with value 3.",
      "dfs(root, root.val)  →  dfs(root, 3)",
      false, [],
      11, 13, 6, 20
    );

    states.n0 = 'active';
    addStep(
      'n0', 3, 0,
      "dfs(root, 3) called. Visiting root node 3. Current path maximum is 3.",
      "dfs(node=3, maxVal=3)",
      false, ['n0'],
      4, 3, 9, 4
    );
    states.n0 = 'good';
    addStep(
      'n0', 3, 1,
      "Evaluate: node.val (3) >= maxVal (3)? Yes! Root node is always a Good Node. Total Good Nodes = 1.",
      "goodNodesCount = node.val >= maxVal ? 1 : 0  →  1",
      true, ['n0'],
      5, 5, 13, 8
    );
    addStep(
      'n0', 3, 1,
      "Calculate new path maximum: Math.max(3, 3) = 3.",
      "newMaxVal = max(maxVal, node.val)  →  3",
      false, ['n0'],
      6, 6, 16, 11
    );

    addStep(
      'n0', 3, 1,
      "Recurse into left child node (value 1) passing newMaxVal = 3.",
      "dfs(node.left, 3)",
      false, ['n0'],
      7, 8, 17, 12
    );
    states.n1 = 'active';
    addStep(
      'n1', 3, 1,
      "dfs(node_1, 3) called. Visiting node 1. Current path maximum is 3.",
      "dfs(node=1, maxVal=3)",
      false, ['n0', 'n1'],
      4, 3, 9, 4
    );
    states.n1 = 'bad';
    addStep(
      'n1', 3, 1,
      "Evaluate: node.val (1) >= maxVal (3)? No. (Root 3 on this path is larger). This is NOT a Good Node. Total Good Nodes remains 1.",
      "goodNodesCount = node.val >= maxVal ? 1 : 0  →  0",
      false, ['n0', 'n1'],
      5, 5, 13, 8
    );
    addStep(
      'n1', 3, 1,
      "Calculate new path maximum: Math.max(3, 1) = 3.",
      "newMaxVal = max(3, 1)  →  3",
      false, ['n0', 'n1'],
      6, 6, 16, 11
    );

    addStep(
      'n1', 3, 1,
      "Recurse into left child node (value 3) passing newMaxVal = 3.",
      "dfs(node.left, 3)",
      false, ['n0', 'n1'],
      7, 8, 17, 12
    );
    states.n3 = 'active';
    addStep(
      'n3', 3, 1,
      "dfs(node_3, 3) called. Visiting node 3. Current path maximum is 3.",
      "dfs(node=3, maxVal=3)",
      false, ['n0', 'n1', 'n3'],
      4, 3, 9, 4
    );
    states.n3 = 'good';
    addStep(
      'n3', 3, 2,
      "Evaluate: node.val (3) >= maxVal (3)? Yes! This is a Good Node. Total Good Nodes = 2.",
      "goodNodesCount = node.val >= maxVal ? 1 : 0  →  1",
      true, ['n0', 'n1', 'n3'],
      5, 5, 13, 8
    );
    addStep(
      'n3', 3, 2,
      "Calculate new path maximum: Math.max(3, 3) = 3.",
      "newMaxVal = max(3, 3)  →  3",
      false, ['n0', 'n1', 'n3'],
      6, 6, 16, 11
    );

    addStep(
      'n3', 3, 2,
      "Recurse into left child of node 3 (null).",
      "dfs(node.left, 3)",
      false, ['n0', 'n1', 'n3'],
      7, 8, 17, 12
    );
    addStep(
      null, 3, 2,
      "Child is null. Return 0 good nodes.",
      "RETURN 0",
      false, ['n0', 'n1', 'n3'],
      4, 3, 9, 4
    );

    addStep(
      'n3', 3, 2,
      "Recurse into right child of node 3 (null).",
      "dfs(node.right, 3)",
      false, ['n0', 'n1', 'n3'],
      8, 9, 18, 13
    );
    addStep(
      null, 3, 2,
      "Child is null. Return 0 good nodes.",
      "RETURN 0",
      false, ['n0', 'n1', 'n3'],
      4, 3, 9, 4
    );

    addStep(
      'n3', 3, 2,
      "Subtree at node 3 complete. Return goodNodesCount = 1 (this node) + 0 + 0 = 1.",
      "RETURN goodNodesCount  →  1",
      false, ['n0', 'n1', 'n3'],
      9, 10, 19, 14
    );
    states.n3 = 'good';

    states.n1 = 'active';
    addStep(
      'n1', 3, 2,
      "Back at node 1. Now recurse into right child of node 1 (null).",
      "dfs(node.right, 3)",
      false, ['n0', 'n1'],
      8, 9, 18, 13
    );
    addStep(
      null, 3, 2,
      "Child is null. Return 0 good nodes.",
      "RETURN 0",
      false, ['n0', 'n1'],
      4, 3, 9, 4
    );

    addStep(
      'n1', 3, 2,
      "Subtree at node 1 complete. Return goodNodesCount = 0 (this node) + 1 (left subtree) + 0 = 1.",
      "RETURN goodNodesCount  →  1",
      false, ['n0', 'n1'],
      9, 10, 19, 14
    );
    states.n1 = 'bad';

    states.n0 = 'active';
    addStep(
      'n0', 3, 2,
      "Back at root node 3. Now recurse into right child node (value 4) passing newMaxVal = 3.",
      "dfs(node.right, 3)",
      false, ['n0'],
      8, 9, 18, 13
    );
    states.n2 = 'active';
    addStep(
      'n2', 3, 2,
      "dfs(node_2, 3) called. Visiting node 4. Current path maximum is 3.",
      "dfs(node=4, maxVal=3)",
      false, ['n0', 'n2'],
      4, 3, 9, 4
    );
    states.n2 = 'good';
    addStep(
      'n2', 3, 3,
      "Evaluate: node.val (4) >= maxVal (3)? Yes! This is a Good Node. Total Good Nodes = 3.",
      "goodNodesCount = node.val >= maxVal ? 1 : 0  →  1",
      true, ['n0', 'n2'],
      5, 5, 13, 8
    );
    addStep(
      'n2', 4, 3,
      "Calculate new path maximum: Math.max(3, 4) = 4.",
      "newMaxVal = max(3, 4)  →  4",
      false, ['n0', 'n2'],
      6, 6, 16, 11
    );

    addStep(
      'n2', 4, 3,
      "Recurse into left child node (value 1) passing newMaxVal = 4.",
      "dfs(node.left, 4)",
      false, ['n0', 'n2'],
      7, 8, 17, 12
    );
    states.n4 = 'active';
    addStep(
      'n4', 4, 3,
      "dfs(node_4, 4) called. Visiting node 1. Current path maximum is 4.",
      "dfs(node=1, maxVal=4)",
      false, ['n0', 'n2', 'n4'],
      4, 3, 9, 4
    );
    states.n4 = 'bad';
    addStep(
      'n4', 4, 3,
      "Evaluate: node.val (1) >= maxVal (4)? No. (Node 4 on this path is larger). This is NOT a Good Node. Total Good Nodes remains 3.",
      "goodNodesCount = node.val >= maxVal ? 1 : 0  →  0",
      false, ['n0', 'n2', 'n4'],
      5, 5, 13, 8
    );
    addStep(
      'n4', 4, 3,
      "Calculate new path maximum: Math.max(4, 1) = 4.",
      "newMaxVal = max(4, 1)  →  4",
      false, ['n0', 'n2', 'n4'],
      6, 6, 16, 11
    );

    addStep(
      'n4', 4, 3,
      "Recurse left child of node 1 (null).",
      "dfs(node.left, 4)",
      false, ['n0', 'n2', 'n4'],
      7, 8, 17, 12
    );
    addStep(
      null, 4, 3,
      "Child is null. Return 0.",
      "RETURN 0",
      false, ['n0', 'n2', 'n4'],
      4, 3, 9, 4
    );
    addStep(
      'n4', 4, 3,
      "Recurse right child of node 1 (null).",
      "dfs(node.right, 4)",
      false, ['n0', 'n2', 'n4'],
      8, 9, 18, 13
    );
    addStep(
      null, 4, 3,
      "Child is null. Return 0.",
      "RETURN 0",
      false, ['n0', 'n2', 'n4'],
      4, 3, 9, 4
    );

    addStep(
      'n4', 4, 3,
      "Subtree at node 1 complete. Return goodNodesCount = 0 + 0 + 0 = 0.",
      "RETURN goodNodesCount  →  0",
      false, ['n0', 'n2', 'n4'],
      9, 10, 19, 14
    );
    states.n4 = 'bad';

    states.n2 = 'active';
    addStep(
      'n2', 4, 3,
      "Back at node 4. Recurse into right child node (value 5) passing newMaxVal = 4.",
      "dfs(node.right, 4)",
      false, ['n0', 'n2'],
      8, 9, 18, 13
    );
    states.n5 = 'active';
    addStep(
      'n5', 4, 3,
      "dfs(node_5, 4) called. Visiting node 5. Current path maximum is 4.",
      "dfs(node=5, maxVal=4)",
      false, ['n0', 'n2', 'n5'],
      4, 3, 9, 4
    );
    states.n5 = 'good';
    addStep(
      'n5', 4, 4,
      "Evaluate: node.val (5) >= maxVal (4)? Yes! This is a Good Node. Total Good Nodes = 4.",
      "goodNodesCount = node.val >= maxVal ? 1 : 0  →  1",
      true, ['n0', 'n2', 'n5'],
      5, 5, 13, 8
    );
    addStep(
      'n5', 5, 4,
      "Calculate new path maximum: Math.max(4, 5) = 5.",
      "newMaxVal = max(4, 5)  →  5",
      false, ['n0', 'n2', 'n5'],
      6, 6, 16, 11
    );

    addStep(
      'n5', 5, 4,
      "Recurse left child of node 5 (null).",
      "dfs(node.left, 5)",
      false, ['n0', 'n2', 'n5'],
      7, 8, 17, 12
    );
    addStep(
      null, 5, 4,
      "Child is null. Return 0.",
      "RETURN 0",
      false, ['n0', 'n2', 'n5'],
      4, 3, 9, 4
    );
    addStep(
      'n5', 5, 4,
      "Recurse right child of node 5 (null).",
      "dfs(node.right, 5)",
      false, ['n0', 'n2', 'n5'],
      8, 9, 18, 13
    );
    addStep(
      null, 5, 4,
      "Child is null. Return 0.",
      "RETURN 0",
      false, ['n0', 'n2', 'n5'],
      4, 3, 9, 4
    );

    addStep(
      'n5', 5, 4,
      "Subtree at node 5 complete. Return goodNodesCount = 1 (this node) + 0 + 0 = 1.",
      "RETURN goodNodesCount  →  1",
      false, ['n0', 'n2', 'n5'],
      9, 10, 19, 14
    );
    states.n5 = 'good';

    states.n2 = 'active';
    addStep(
      'n2', 4, 4,
      "Subtree at node 4 complete. Return goodNodesCount = 1 (this node) + 0 (left subtree) + 1 (right subtree) = 2.",
      "RETURN goodNodesCount  →  2",
      false, ['n0', 'n2'],
      9, 10, 19, 14
    );
    states.n2 = 'good';

    states.n0 = 'active';
    addStep(
      'n0', 3, 4,
      "Subtree at root node 3 complete. Return goodNodesCount = 1 (this node) + 1 (left subtree) + 2 (right subtree) = 4.",
      "RETURN goodNodesCount  →  4",
      false, ['n0'],
      9, 10, 19, 14
    );
    states.n0 = 'good';

    addStep(
      null, 3, 4,
      "Algorithm execution complete! Total Good Nodes in the binary tree is 4.",
      "RETURN 4",
      true, [],
      11, 13, 6, 20
    );

    return { steps: s, stepLineNumbers: lines };
  }, [initialTree]);

  const step = steps[currentStepIndex] || steps[0];
  const pseudoSteps = useMemo(() => steps.map((s) => s.pseudoStep), [steps]);

  const positions: Record<string, { x: number; y: number }> = {
    n0: { x: 200, y: 40 },
    n1: { x: 110, y: 100 },
    n2: { x: 290, y: 100 },
    n3: { x: 65, y: 160 },
    n4: { x: 245, y: 160 },
    n5: { x: 335, y: 160 }
  };

  const edges = [
    { from: 'n0', to: 'n1' },
    { from: 'n0', to: 'n2' },
    { from: 'n1', to: 'n3' },
    { from: 'n2', to: 'n4' },
    { from: 'n2', to: 'n5' }
  ];

  const isEdgeActive = (u: string, v: string) => {
    const uIdx = step.activePath.indexOf(u);
    const vIdx = step.activePath.indexOf(v);
    return uIdx !== -1 && vIdx !== -1 && Math.abs(uIdx - vIdx) === 1;
  };

  return (
    <VisualizationLayout
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 relative overflow-hidden min-h-[350px] flex flex-col shadow-lg shadow-primary/5">
            <h3 className="text-sm font-semibold mb-6 flex items-center justify-center gap-2 text-muted-foreground uppercase tracking-widest">
              <CircleDot className="w-4 h-4 text-primary animate-pulse" /> Good Nodes Tree Simulation
            </h3>

            <div className="flex-1 flex justify-center items-center">
              <div className="w-full max-w-[400px] aspect-[400/220] relative">
                <svg viewBox="0 0 400 220" className="w-full h-full overflow-visible">
                  {/* Edges */}
                  {edges.map((edge, i) => {
                    const fromPos = positions[edge.from];
                    const toPos = positions[edge.to];
                    const active = isEdgeActive(edge.from, edge.to);

                    return (
                      <line
                        key={i}
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        strokeWidth={active ? "3.5" : "2"}
                        className={`transition-all duration-300 ${
                          active 
                            ? "stroke-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                            : "stroke-muted-foreground/20 dark:stroke-muted-foreground/35"
                        }`}
                      />
                    );
                  })}

                  {/* Nodes */}
                  {Object.entries(positions).map(([id, pos]) => {
                    const nodeVal = initialTree[id as keyof typeof initialTree].val;
                    const nodeState = step.nodeStates[id];
                    const isCurrent = step.currentNodeId === id;

                    let fillClass = "fill-card stroke-border text-foreground";
                    if (nodeState === 'active') {
                      fillClass = "fill-blue-500/25 stroke-blue-500 text-blue-700 dark:text-blue-300 font-bold";
                    } else if (nodeState === 'good') {
                      fillClass = "fill-emerald-500/25 stroke-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold";
                    } else if (nodeState === 'bad') {
                      fillClass = "fill-slate-100/50 stroke-slate-300 text-slate-400 dark:fill-slate-800/50 dark:stroke-slate-700 dark:text-slate-500 line-through";
                    }

                    return (
                      <g key={id}>
                        <motion.circle
                          cx={pos.x}
                          cy={pos.y}
                          r="18"
                          animate={{
                            scale: isCurrent ? 1.25 : 1,
                            strokeWidth: isCurrent ? 3 : 2
                          }}
                          transition={{ duration: 0.2 }}
                          className={`transition-all duration-300 cursor-default ${fillClass}`}
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 4}
                          textAnchor="middle"
                          className={`text-xs font-bold font-mono transition-all duration-300 select-none ${
                            isCurrent ? 'fill-blue-600 dark:fill-blue-400 scale-110 font-black' : 
                            nodeState === 'good' ? 'fill-emerald-600 dark:fill-emerald-400' :
                            nodeState === 'bad' ? 'fill-slate-400 dark:fill-slate-500' :
                            'fill-foreground'
                          }`}
                        >
                          {nodeVal}
                        </text>

                        {isCurrent && (
                          <motion.circle
                            cx={pos.x}
                            cy={pos.y}
                            r="24"
                            stroke="#3b82f6"
                            strokeWidth="1.5"
                            fill="none"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: [0, 0.8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
                <div className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-600 shrink-0"></div> Unvisited
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-600 shrink-0 animate-pulse">
                <div className="w-3 h-3 rounded bg-blue-500/40 shrink-0"></div> Current / Active
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 shrink-0">
                <div className="w-3 h-3 rounded bg-emerald-500/40 shrink-0"></div> Good Node (val &ge; max)
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-200/50 dark:bg-slate-900 border border-slate-300/40 text-xs font-semibold text-slate-400 shrink-0">
                <div className="w-3 h-3 rounded bg-slate-400/40 shrink-0"></div> Muted Node (val &lt; max)
              </div>
            </div>
          </Card>

          <Card className={`p-5 border-l-4 relative overflow-hidden transition-all duration-300 shadow-sm min-h-[120px] flex items-center ${step?.isMatch ? 'bg-primary/10 border-primary' : 'bg-accent/30 border-primary'}`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${step?.isMatch ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                {step?.isMatch ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary/80">
                  Step Logic
                </h4>
                <p className="text-[14px] font-medium leading-relaxed text-foreground/90">
                  {step?.explanation || ''}
                </p>
              </div>
            </div>
          </Card>

          <VariablePanel
            variables={{
              current_node_val: step?.currentNodeId !== null ? initialTree[step.currentNodeId as keyof typeof initialTree].val : 'N/A',
              path_max_val: step?.maxVal ?? 'N/A',
              good_nodes_count: step?.goodNodesCount ?? 0,
              call_stack_depth: step?.activePath?.length || 0,
              active_path: step?.activePath?.map(id => initialTree[id as keyof typeof initialTree].val).join(' -> ') || 'None'
            }}
          />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStepIndex}
          onLanguageChange={() => setCurrentStepIndex(0)}
        />
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
export default CountGoodNodesVisualization;
