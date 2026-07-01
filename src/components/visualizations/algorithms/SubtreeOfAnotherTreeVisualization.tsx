import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trees, Search } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id?: string;
  index?: number;
}

interface Step {
  rootNodeId: string | null;
  subRootNodeId: string | null;
  rootVal: number | string | null;
  subRootVal: number | string | null;
  checking: string;
  result: boolean | null;
  message: string;
  pseudoStep: string;
  found: boolean;
}

interface TestCase {
  id: string;
  name: string;
  icon: any;
  root: (number | null)[];
  subRoot: (number | null)[];
  description: string;
}

const testCases: TestCase[] = [
  {
    id: 'found-subtree',
    name: 'Subtree Found',
    icon: Search,
    root: [3, 4, 5, 1, 2],
    subRoot: [4, 1, 2],
    description: 'The subtree exists starting at node 4'
  },
  {
    id: 'not-found',
    name: 'Not Found',
    icon: X,
    root: [3, 4, 5, 1, 2, null, null, null, null, 0],
    subRoot: [4, 1, 2],
    description: 'Values match but structure differs (node 2 has a child)'
  },
  {
    id: 'identical',
    name: 'Identical',
    icon: Trees,
    root: [1, 2, 3],
    subRoot: [1, 2, 3],
    description: 'The trees are identical'
  }
];

const languages: VisualizationLanguageMap = {
  typescript: `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!subRoot) return true;
  if (!root) return false;
  if (sameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function sameTree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root && !subRoot) return true;
  if (root && subRoot && root.val === subRoot.val) {
    return sameTree(root.left, subRoot.left) && sameTree(root.right, subRoot.right);
  }
  return false;
}`,
  python: `def isSubtree(root: TreeNode | None, subRoot: TreeNode | None) -> bool:
    if not subRoot:
        return True
    if not root:
        return False
    if sameTree(root, subRoot):
        return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)

def sameTree(root1: TreeNode | None, root2: TreeNode | None) -> bool:
    if not root1 and not root2:
        return True
    if root1 and root2 and root1.val == root2.val:
        return sameTree(root1.left, root2.left) and sameTree(root1.right, root2.right)
    return False`,
  java: `public static class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        if (subRoot == null) return true;
        if (root == null) return false;
        if (sameTree(root, subRoot)) return true;
        return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }
    private boolean sameTree(TreeNode root, TreeNode subRoot) {
        if (root == null && subRoot == null) return true;
        if (root != null && subRoot != null && root.val == subRoot.val) {
            return sameTree(root.left, subRoot.left) && sameTree(root.right, subRoot.right);
        }
        return false;
    }
}`,
  cpp: `class Solution {
public:
    bool isSubtree(TreeNode* root, TreeNode* subRoot) {
        if (subRoot == nullptr) return true;
        if (root == nullptr) return false;
        if (sameTree(root, subRoot)) return true;
        return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
    }
private:
    bool sameTree(TreeNode* root, TreeNode* subRoot) {
        if (root == nullptr && subRoot == nullptr) return true;
        if (root != nullptr && subRoot != nullptr && root->val == subRoot->val) {
            return sameTree(root->left, subRoot->left) && sameTree(root->right, subRoot->right);
        }
        return false;
    }
};`
};

const buildTreeWithIds = (arr: (number | null)[], prefix: string) => {
  if (!arr.length || arr[0] === null) return null;

  const root = { id: `${prefix}-0`, val: arr[0]!, left: null, right: null, index: 0 };
  const queue: any[] = [root];
  let i = 1;

  while (i < arr.length) {
    const current = queue.shift();
    if (i < arr.length && arr[i] !== null) {
      current.left = { id: `${prefix}-${i}`, val: arr[i]!, left: null, right: null, index: i };
      queue.push(current.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      current.right = { id: `${prefix}-${i}`, val: arr[i]!, left: null, right: null, index: i };
      queue.push(current.right);
    }
    i++;
  }
  return root;
};

const getTreePositions = (root: any, width: number = 300, rowHeight: number = 60) => {
  const nodes: any[] = [];
  const edges: any[] = [];

  const traverse = (node: any, depth: number, xRange: [number, number]) => {
    if (!node) return;
    const x = (xRange[0] + xRange[1]) / 2;
    const y = depth * rowHeight + 30;
    nodes.push({ ...node, x, y });

    if (node.left) {
      edges.push({ x1: x, y1: y, x2: (xRange[0] + x) / 2, y2: (depth + 1) * rowHeight + 30 });
      traverse(node.left, depth + 1, [xRange[0], x]);
    }
    if (node.right) {
      edges.push({ x1: x, y1: y, x2: (x + xRange[1]) / 2, y2: (depth + 1) * rowHeight + 30 });
      traverse(node.right, depth + 1, [x, xRange[1]]);
    }
  };

  traverse(root, 0, [0, width]);
  return { nodes, edges };
};

export const SubtreeOfAnotherTreeVisualization = () => {
  const [testCase, setTestCase] = useState<TestCase>(testCases[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const s: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

    const rootTree = buildTreeWithIds(testCase.root, 'root');
    const subRootTree = buildTreeWithIds(testCase.subRoot, 'subRoot');

    const addStep = (
      rootNodeId: string | null,
      subRootNodeId: string | null,
      rootVal: number | string | null,
      subRootVal: number | string | null,
      checking: string,
      result: boolean | null,
      message: string,
      found: boolean,
      pseudo: string,
      ts: number, py: number, java: number, cpp: number
    ) => {
      s.push({
        rootNodeId,
        subRootNodeId,
        rootVal,
        subRootVal,
        checking,
        result,
        message,
        found,
        pseudoStep: pseudo
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    const checkSame = (p: any, q: any, rootNodeId: string): boolean => {
      const pVal = p?.val ?? 'null';
      const qVal = q?.val ?? 'null';
      const pId = p?.id || null;
      const qId = q?.id || null;

      addStep(
        rootNodeId,
        qId,
        pVal,
        qVal,
        'sameTree-entry',
        null,
        `Calling sameTree to compare nodes: ${pVal} and ${qVal}`,
        false,
        `CALL sameTree(root=${pVal}, subRoot=${qVal})`,
        8, 10, 8, 10
      );

      if (!p && !q) {
        addStep(
          rootNodeId,
          qId,
          pVal,
          qVal,
          'sameTree-null-base',
          true,
          "Both nodes are null. They are identical.",
          false,
          "IF root IS NULL AND subRoot IS NULL RETURN true",
          9, 11, 9, 11
        );
        return true;
      }

      if (p && q && p.val === q.val) {
        addStep(
          rootNodeId,
          qId,
          pVal,
          qVal,
          'sameTree-val-match',
          null,
          `Values both match (${pVal}). Now recursively checking left and right children.`,
          false,
          `IF root.val == subRoot.val (${pVal} == ${qVal})  →  YES ✓`,
          10, 13, 10, 12
        );

        const left = checkSame(p.left, q.left, rootNodeId);
        if (!left) return false;
        const right = checkSame(p.right, q.right, rootNodeId);

        if (right) {
          addStep(
            rootNodeId,
            qId,
            pVal,
            qVal,
            'sameTree-result-true',
            true,
            `Node ${pVal} and its children match completely with the subtree fragment.`,
            false,
            "RETURN sameTree(left) AND sameTree(right)  →  true",
            11, 14, 11, 13
          );
        }
        return right;
      }

      addStep(
        rootNodeId,
        qId,
        pVal,
        qVal,
        'sameTree-false',
        false,
        p && q
          ? `Values differ: ${pVal} !== ${qVal}. Not the same tree.`
          : `One node is null while the other is not. Not the same tree.`,
        false,
        "RETURN false",
        13, 15, 13, 15
      );
      return false;
    };

    const findSubtree = (node: any, subRoot: any): boolean => {
      const nodeVal = node?.val ?? 'null';
      const nodeId = node?.id || null;
      const subRootVal = subRoot?.val ?? 'null';

      addStep(
        nodeId,
        subRoot?.id || null,
        nodeVal,
        subRootVal,
        'isSubtree-entry',
        null,
        `Checking if subtree exists starting from node ${nodeVal}`,
        false,
        `CALL isSubtree(root=${nodeVal}, subRoot=${subRootVal})`,
        1, 1, 2, 3
      );

      if (!subRoot) {
        addStep(
          nodeId,
          null,
          nodeVal,
          'null',
          'isSubtree-null-sub',
          true,
          "subRoot is null. A null tree is a subtree of any tree.",
          false,
          "IF subRoot IS NULL RETURN true",
          2, 2, 3, 4
        );
        return true;
      }

      if (!node) {
        addStep(
          nodeId,
          subRoot.id,
          'null',
          subRootVal,
          'isSubtree-null-root',
          false,
          "Reached null in main tree, but subRoot is not null. Cannot be a subtree here.",
          false,
          "IF root IS NULL RETURN false",
          3, 4, 4, 5
        );
        return false;
      }

      addStep(
        nodeId,
        subRoot.id,
        nodeVal,
        subRootVal,
        'isSubtree-check-same',
        null,
        `Comparing current root node ${nodeVal} with subtree root ${subRootVal}.`,
        false,
        "IF sameTree(root, subRoot)  →  CALL sameTree",
        4, 6, 5, 6
      );

      if (checkSame(node, subRoot, nodeId)) {
        addStep(
          nodeId,
          subRoot.id,
          nodeVal,
          subRootVal,
          'isSubtree-found',
          true,
          `Match found! Subtree exists starting at node ${nodeVal}.`,
          true,
          "IF sameTree(root, subRoot)  →  RETURN true",
          4, 7, 5, 6
        );
        return true;
      }

      addStep(
        nodeId,
        subRoot.id,
        nodeVal,
        subRootVal,
        'isSubtree-recurse',
        null,
        `Node ${nodeVal} matched partially or not at all. Now checking left or right subtrees.`,
        false,
        "RETURN isSubtree(root.left) OR isSubtree(root.right)",
        5, 8, 6, 7
      );

      const left = findSubtree(node.left, subRoot);
      if (left) return true;
      const right = findSubtree(node.right, subRoot);

      if (right) {
        addStep(
          nodeId,
          subRoot.id,
          nodeVal,
          subRootVal,
          'isSubtree-found-recursive',
          true,
          "Subtree found in one of the lower branches!",
          true,
          "RETURN true",
          5, 8, 6, 7
        );
      }

      return right;
    };

    findSubtree(rootTree, subRootTree);
    return { steps: s, stepLineNumbers: lines };
  }, [testCase]);

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const rootTreeData = useMemo(() => getTreePositions(buildTreeWithIds(testCase.root, 'root')), [testCase.root]);
  const subRootTreeData = useMemo(() => getTreePositions(buildTreeWithIds(testCase.subRoot, 'subRoot')), [testCase.subRoot]);

  const resetState = () => {
    setCurrentStepIndex(0);
  };

  const handleTestCaseChange = (tc: TestCase) => {
    setTestCase(tc);
    resetState();
  };

  const TreeDisplay = ({ data, activeNodeId, title, subActiveNodeId }: { data: any, activeNodeId: string | null, title: string, subActiveNodeId?: string | null }) => (
    <div className="flex flex-col items-center flex-1">
      <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase mb-2 tracking-widest">{title}</h4>
      <div className="relative w-full h-[180px] bg-primary/5 rounded-xl border border-primary/10 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 300 180" className="overflow-visible">
          {data.edges.map((edge: any, i: number) => (
            <line
              key={i}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="currentColor"
              className="text-primary/10"
              strokeWidth="1.5"
            />
          ))}
          {data.nodes.map((node: any) => {
            const isActive = node.id === activeNodeId;
            const isSubActive = node.id === subActiveNodeId;
            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="15"
                  animate={{
                    scale: (isActive || isSubActive) ? 1.2 : 1,
                    strokeWidth: (isActive || isSubActive) ? 3 : 1.5,
                  }}
                  className={`${isActive
                      ? 'fill-primary/20 stroke-primary'
                      : isSubActive
                        ? 'fill-purple-500/20 stroke-purple-500'
                        : 'fill-card stroke-muted-foreground/30'
                    }`}
                  transition={{ duration: 0 }}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[10px] font-mono font-bold ${isActive ? 'fill-primary' : isSubActive ? 'fill-purple-500' : 'fill-muted-foreground'
                    }`}
                >
                  {node.val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );

  return (
    <VisualizationLayout
      controls={
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
          <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
            {testCases.map((tc) => {
              const Icon = tc.icon;
              const isSelected = testCase.id === tc.id;
              return (
                <button
                  key={tc.id}
                  onClick={() => handleTestCaseChange(tc)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isSelected
                      ? 'bg-background text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  {tc.name}
                </button>
              );
            })}
          </div>
        </div>
      }
      leftContent={
        <Card className="p-6 border-primary/10 shadow-xl bg-gradient-to-b from-background to-primary/5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Tree Comparison</h3>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{testCase.description}</p>
            </div>
            <AnimatePresence mode="wait">
              {currentStep.found && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Subtree Found</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 mb-8">
            <TreeDisplay
              data={rootTreeData}
              activeNodeId={currentStep.rootNodeId}
              title="Main Tree (root)"
            />
            <TreeDisplay
              data={subRootTreeData}
              activeNodeId={currentStep.subRootNodeId}
              title="Subtree (subRoot)"
            />
          </div>

          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-primary/20 shadow-inner">
              <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                {currentStep.message}
              </p>
            </Card>

            <VariablePanel
              variables={{
                'root': currentStep.rootVal,
                'subRoot': currentStep.subRootVal,
                'status': currentStep.checking,
                'step': `${currentStepIndex + 1} / ${steps.length}`
              }}
            />
          </div>
        </Card>
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
    />
  );
};
