import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trees, GitBranch, Binary, Search } from 'lucide-react';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Step {
  rootNodeId: string | null;
  subRootNodeId: string | null;
  rootVal: number | string | null;
  subRootVal: number | string | null;
  checking: string;
  result: boolean | null;
  message: string;
  highlightedLines: number[];
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

const code = `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
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
}`;

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

  const steps = useMemo(() => {
    const s: Step[] = [];

    const rootTree = buildTreeWithIds(testCase.root, 'root');
    const subRootTree = buildTreeWithIds(testCase.subRoot, 'subRoot');

    const checkSame = (p: any, q: any, rootNodeId: string): boolean => {
      const pVal = p?.val ?? 'null';
      const qVal = q?.val ?? 'null';
      const pId = p?.id || null;
      const qId = q?.id || null;

      s.push({
        rootNodeId,
        subRootNodeId: qId,
        rootVal: pVal,
        subRootVal: qVal,
        checking: 'sameTree-entry',
        result: null,
        message: `Calling sameTree to compare nodes: ${pVal} and ${qVal}`,
        highlightedLines: [8],
        found: false
      });

      if (!p && !q) {
        s.push({
          rootNodeId,
          subRootNodeId: qId,
          rootVal: pVal,
          subRootVal: qVal,
          checking: 'sameTree-null-base',
          result: true,
          message: "Both nodes are null. They are identical.",
          highlightedLines: [9],
          found: false
        });
        return true;
      }

      if (p && q && p.val === q.val) {
        s.push({
          rootNodeId,
          subRootNodeId: qId,
          rootVal: pVal,
          subRootVal: qVal,
          checking: 'sameTree-val-match',
          result: null,
          message: `Values both match (${pVal}). Now recursively checking left and right children.`,
          highlightedLines: [10, 11],
          found: false
        });

        const left = checkSame(p.left, q.left, rootNodeId);
        if (!left) return false;
        const right = checkSame(p.right, q.right, rootNodeId);

        if (right) {
          s.push({
            rootNodeId,
            subRootNodeId: qId,
            rootVal: pVal,
            subRootVal: qVal,
            checking: 'sameTree-result-true',
            result: true,
            message: `Node ${pVal} and its children match completely with the subtree fragment.`,
            highlightedLines: [11],
            found: false
          });
        }
        return right;
      }

      s.push({
        rootNodeId,
        subRootNodeId: qId,
        rootVal: pVal,
        subRootVal: qVal,
        checking: 'sameTree-false',
        result: false,
        message: p && q
          ? `Values differ: ${pVal} !== ${qVal}. Not the same tree.`
          : `One node is null while the other is not. Not the same tree.`,
        highlightedLines: [13],
        found: false
      });
      return false;
    };

    const findSubtree = (node: any, subRoot: any): boolean => {
      const nodeVal = node?.val ?? 'null';
      const nodeId = node?.id || null;
      const subRootVal = subRoot?.val ?? 'null';

      s.push({
        rootNodeId: nodeId,
        subRootNodeId: subRoot?.id || null,
        rootVal: nodeVal,
        subRootVal: subRootVal,
        checking: 'isSubtree-entry',
        result: null,
        message: `Checking if subtree exists starting from node ${nodeVal}`,
        highlightedLines: [1],
        found: false
      });

      if (!subRoot) {
        s.push({
          rootNodeId: nodeId,
          subRootNodeId: null,
          rootVal: nodeVal,
          subRootVal: 'null',
          checking: 'isSubtree-null-sub',
          result: true,
          message: "subRoot is null. A null tree is a subtree of any tree.",
          highlightedLines: [2],
          found: false
        });
        return true;
      }

      if (!node) {
        s.push({
          rootNodeId: nodeId,
          subRootNodeId: subRoot.id,
          rootVal: 'null',
          subRootVal: subRootVal,
          checking: 'isSubtree-null-root',
          result: false,
          message: "Reached null in main tree, but subRoot is not null. Cannot be a subtree here.",
          highlightedLines: [3],
          found: false
        });
        return false;
      }

      s.push({
        rootNodeId: nodeId,
        subRootNodeId: subRoot.id,
        rootVal: nodeVal,
        subRootVal: subRootVal,
        checking: 'isSubtree-check-same',
        result: null,
        message: `Comparing current root node ${nodeVal} with subtree root ${subRootVal}.`,
        highlightedLines: [4],
        found: false
      });

      if (checkSame(node, subRoot, nodeId)) {
        s.push({
          rootNodeId: nodeId,
          subRootNodeId: subRoot.id,
          rootVal: nodeVal,
          subRootVal: subRootVal,
          checking: 'isSubtree-found',
          result: true,
          message: `Match found! Subtree exists starting at node ${nodeVal}.`,
          highlightedLines: [4],
          found: true
        });
        return true;
      }

      s.push({
        rootNodeId: nodeId,
        subRootNodeId: subRoot.id,
        rootVal: nodeVal,
        subRootVal: subRootVal,
        checking: 'isSubtree-recurse',
        result: null,
        message: `Node ${nodeVal} matched partially or not at all. Now checking left or right subtrees.`,
        highlightedLines: [5],
        found: false
      });

      const left = findSubtree(node.left, subRoot);
      if (left) return true;
      const right = findSubtree(node.right, subRoot);

      if (right) {
        s.push({
          rootNodeId: nodeId,
          subRootNodeId: subRoot.id,
          rootVal: nodeVal,
          subRootVal: subRootVal,
          checking: 'isSubtree-found-recursive',
          result: true,
          message: "Subtree found in one of the lower branches!",
          highlightedLines: [5],
          found: true
        });
      }

      return right;
    };

    findSubtree(rootTree, subRootTree);
    return s;
  }, [testCase]);

  const currentStep = steps[currentStepIndex];

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
    <div className="flex flex-col gap-6">

      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
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
        </div>

        <Card className="border-primary/10 shadow-xl overflow-hidden bg-[#1e1e1e]">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={currentStep.highlightedLines}
          />
        </Card>
      </div>
    </div>
  );
};
