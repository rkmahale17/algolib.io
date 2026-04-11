import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trees, Binary, GitBranch } from 'lucide-react';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Step {
  pNodeId: string | null;
  qNodeId: string | null;
  pVal: number | string | null;
  qVal: number | string | null;
  checking: string;
  result: boolean | null;
  message: string;
  highlightedLines: number[];
}

interface TestCase {
  id: string;
  name: string;
  icon: any;
  p: (number | null)[];
  q: (number | null)[];
  description: string;
}

const testCases: TestCase[] = [
  {
    id: 'identical',
    name: 'Identical',
    icon: Trees,
    p: [1, 2, 3],
    q: [1, 2, 3],
    description: 'Two identical binary trees'
  },
  {
    id: 'diff-values',
    name: 'Diff Values',
    icon: GitBranch,
    p: [1, 2, 1],
    q: [1, 1, 2],
    description: 'Same structure, different values'
  },
  {
    id: 'diff-structure',
    name: 'Diff Structure',
    icon: Binary,
    p: [1, 2],
    q: [1, null, 2],
    description: 'Different structural shapes'
  }
];

const code = `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  
  if (!p || !q || p.val !== q.val) return false;
  
  return isSameTree(p.left, q.left) && 
         isSameTree(p.right, q.right);
}`;

// Helper to convert BFS array to tree nodes with unique IDs for highlighting
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

// Simple position calculator for tree nodes
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

export const SameTreeVisualization = () => {
  const [testCase, setTestCase] = useState<TestCase>(testCases[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = useMemo(() => {
    const s: Step[] = [];
    
    const pRoot = buildTreeWithIds(testCase.p, 'p');
    const qRoot = buildTreeWithIds(testCase.q, 'q');

    const check = (p: any, q: any) => {
      const pId = p?.id || null;
      const qId = q?.id || null;
      const pVal = p?.val ?? 'null';
      const qVal = q?.val ?? 'null';

      // Step 1: Comparing current nodes
      s.push({
        pNodeId: pId,
        qNodeId: qId,
        pVal,
        qVal,
        checking: 'nodes',
        result: null,
        message: `Comparing node p(${pVal}) and q(${qVal})`,
        highlightedLines: [1]
      });

      // Step 2: Null check
      if (!p && !q) {
        s.push({
          pNodeId: pId,
          qNodeId: qId,
          pVal,
          qVal,
          checking: 'null-base-case',
          result: true,
          message: "Both nodes are null. This subtree represents the 'same tree'.",
          highlightedLines: [2]
        });
        return true;
      }
      s.push({
        pNodeId: pId,
        qNodeId: qId,
        pVal,
        qVal,
        checking: 'null-base-case',
        result: null,
        message: "Nodes are not both null, continuing check.",
        highlightedLines: [2]
      });

      // Step 3: Different null state or different values
      if (!p || !q || p.val !== q.val) {
        let reason = "";
        if (!p) reason = "Node p is null while q is not.";
        else if (!q) reason = "Node q is null while p is not.";
        else reason = `Values differ: p(${p.val}) !== q(${q.val})`;

        s.push({
          pNodeId: pId,
          qNodeId: qId,
          pVal,
          qVal,
          checking: 'diff-case',
          result: false,
          message: `${reason} Returning false.`,
          highlightedLines: [4]
        });
        return false;
      }

      s.push({
        pNodeId: pId,
        qNodeId: qId,
        pVal,
        qVal,
        checking: 'value-check',
        result: null,
        message: `Values both match (${pVal}). Now checking children.`,
        highlightedLines: [4]
      });

      // Step 4: Recurse left
      s.push({
        pNodeId: pId,
        qNodeId: qId,
        pVal,
        qVal,
        checking: 'recurse-left',
        result: null,
        message: `Recursively checking left children of p(${pVal}) and q(${qVal}).`,
        highlightedLines: [6]
      });
      const leftSame = check(p.left, q.left);
      
      if (!leftSame) {
        s.push({
          pNodeId: pId,
          qNodeId: qId,
          pVal,
          qVal,
          checking: 'left-result',
          result: false,
          message: "Left children were different, so these trees are not the same.",
          highlightedLines: [6]
        });
        return false;
      }

      // Step 5: Recurse right
      s.push({
        pNodeId: pId,
        qNodeId: qId,
        pVal,
        qVal,
        checking: 'recurse-right',
        result: null,
        message: "Left children match! Now checking right children.",
        highlightedLines: [7]
      });
      const rightSame = check(p.right, q.right);

      const finalResult = rightSame;
      s.push({
        pNodeId: pId,
        qNodeId: qId,
        pVal,
        qVal,
        checking: 'final-result',
        result: finalResult,
        message: finalResult 
          ? "Both left and right children match! This subtree is the same."
          : "Right children were different.",
        highlightedLines: [6, 7]
      });

      return finalResult;
    };

    check(pRoot, qRoot);
    return s;
  }, [testCase]);

  const currentStep = steps[currentStepIndex];

  const pTreeData = useMemo(() => getTreePositions(buildTreeWithIds(testCase.p, 'p')), [testCase.p]);
  const qTreeData = useMemo(() => getTreePositions(buildTreeWithIds(testCase.q, 'q')), [testCase.q]);

  const resetState = () => {
    setCurrentStepIndex(0);
  };

  const handleTestCaseChange = (tc: TestCase) => {
    setTestCase(tc);
    resetState();
  };

  const TreeDisplay = ({ data, activeNodeId, title }: { data: any, activeNodeId: string | null, title: string }) => (
    <div className="flex flex-col items-center">
      <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase mb-4 tracking-widest">{title}</h4>
      <div className="relative w-full h-[200px] bg-primary/5 rounded-xl border border-primary/10 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 300 200" className="overflow-visible">
          {data.edges.map((edge: any, i: number) => (
            <line
              key={i}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="currentColor"
              className="text-primary/20"
              strokeWidth="2"
            />
          ))}
          {data.nodes.map((node: any) => {
            const isActive = node.id === activeNodeId;
            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    strokeWidth: isActive ? 3 : 1.5,
                  }}
                  className={`${
                    isActive 
                      ? 'fill-primary/20 stroke-primary' 
                      : 'fill-card stroke-muted-foreground/30'
                  }`}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[12px] font-mono font-bold ${
                    isActive ? 'fill-primary' : 'fill-muted-foreground'
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
      {/* Test Case Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-muted/50 p-1 rounded-xl border border-border shadow-sm">
          {testCases.map((tc) => {
            const Icon = tc.icon;
            const isSelected = testCase.id === tc.id;
            return (
              <button
                key={tc.id}
                onClick={() => handleTestCaseChange(tc)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                {tc.name}
              </button>
            );
          })}
        </div>
        <SimpleStepControls
          currentStep={currentStepIndex}
          totalSteps={steps.length}
          onStepChange={setCurrentStepIndex}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6 overflow-hidden border-primary/10 shadow-xl bg-gradient-to-b from-background to-primary/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Recursive Comparison</h3>
                <p className="text-xs text-muted-foreground mt-1">{testCase.description}</p>
              </div>
              <AnimatePresence mode="wait">
                {currentStep.result !== null && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${
                      currentStep.result 
                        ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}
                  >
                    {currentStep.result ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Same Tree</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Different</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-6 mb-8">
              <TreeDisplay 
                data={pTreeData} 
                activeNodeId={currentStep.pNodeId} 
                title="Tree P" 
              />
              <TreeDisplay 
                data={qTreeData} 
                activeNodeId={currentStep.qNodeId} 
                title="Tree Q" 
              />
            </div>

            <div className="space-y-4">
              <Card className="p-4 bg-primary/5 border-primary/20 shadow-inner">
                <p className="text-sm leading-relaxed text-foreground/90 font-medium">
                  {currentStep.message}
                </p>
              </Card>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <div className="max-h-[400px] overflow-hidden rounded-xl border border-primary/10 shadow-xl">
            <AnimatedCodeEditor
              code={code}
              language="typescript"
              highlightedLines={currentStep.highlightedLines}
            />
          </div>

          <VariablePanel
            variables={{
              'p.val': currentStep.pVal,
              'q.val': currentStep.qVal,
              'checking': currentStep.checking,
              'step': `${currentStepIndex + 1} / ${steps.length}`
            }}
          />
        </div>
      </div>
    </div>
  );
};

