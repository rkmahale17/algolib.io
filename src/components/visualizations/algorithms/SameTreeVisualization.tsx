import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Trees, Binary, GitBranch } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  pNodeId: string | null;
  qNodeId: string | null;
  pVal: number | string | null;
  qVal: number | string | null;
  checking: string;
  result: boolean | null;
  explanation: string;
  pseudoStep: string;
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

const languages: VisualizationLanguageMap = {
  python: `def isSameTree(p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,

  typescript: `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,

  java: `public class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if (p == null && q == null) {
            return true;
        }
        if (p == null || q == null || p.val != q.val) {
            return false;
        }
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,

  cpp: `class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p && !q) {
            return true;
        }
        if (!p || !q) {
            return false;
        }
        if (p->val != q->val) {
            return false;
        }
        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
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

export const SameTreeVisualization = () => {
  const [testCase, setTestCase] = useState<TestCase>(testCases[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    const steps: Step[] = [];
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

    const addStep = (msg: string, pseudo: string, tsLine: number, pyLine: number, javaLine: number, cppLine: number, extra: Partial<Step> = {}) => {
      steps.push({
        pNodeId: extra.pNodeId || null,
        qNodeId: extra.qNodeId || null,
        pVal: extra.hasOwnProperty('pVal') ? extra.pVal : null,
        qVal: extra.hasOwnProperty('qVal') ? extra.qVal : null,
        checking: extra.checking || 'nodes',
        result: extra.hasOwnProperty('result') ? extra.result : null,
        explanation: msg,
        pseudoStep: pseudo
      });
      addLines(tsLine, pyLine, javaLine, cppLine);
    };

    const pRoot = buildTreeWithIds(testCase.p, 'p');
    const qRoot = buildTreeWithIds(testCase.q, 'q');

    const check = (p: any, q: any) => {
      const pId = p?.id || null;
      const qId = q?.id || null;
      const pVal = p?.val ?? 'null';
      const qVal = q?.val ?? 'null';

      // Step 1: Comparing current nodes
      addStep(
        `Comparing node p(${pVal}) and q(${qVal})`,
        `isSameTree(p, q)`,
        1, 1, 2, 3,
        { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'nodes' }
      );

      // Step 2: Null check
      if (!p && !q) {
        addStep(
          "Both nodes are null. This subtree represents the 'same tree'.",
          "IF p == null AND q == null → RETURN true",
          2, 2, 3, 4,
          { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'null-base-case', result: true }
        );
        return true;
      }
      addStep(
        "Nodes are not both null, continuing check.",
        "IF p == null AND q == null → FALSE",
        2, 2, 3, 4,
        { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'null-base-case' }
      );

      // Step 3: Different null state or different values
      if (!p || !q || p.val !== q.val) {
        let reason = "";
        let lineCpp = 10;
        let lineJava = 6;
        if (!p) {
          reason = "Node p is null while q is not.";
          lineCpp = 7;
        } else if (!q) {
          reason = "Node q is null while p is not.";
          lineCpp = 7;
        } else {
          reason = `Values differ: p(${p.val}) !== q(${q.val})`;
          lineCpp = 10;
          lineJava = 6;
        }

        addStep(
          `${reason} Returning false.`,
          "IF p == null OR q == null OR p.val != q.val → RETURN false",
          3, 4, lineJava, lineCpp,
          { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'diff-case', result: false }
        );
        return false;
      }

      addStep(
        `Values both match (${pVal}). Now checking children.`,
        "IF p == null OR q == null OR p.val != q.val → FALSE",
        3, 4, 6, 10,
        { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'value-check' }
      );

      // Step 4: Recurse left
      addStep(
        `Recursively checking left children of p(${pVal}) and q(${qVal}).`,
        "isSameTree(p.left, q.left)",
        4, 6, 9, 13,
        { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'recurse-left' }
      );
      const leftSame = check(p.left, q.left);
      
      if (!leftSame) {
        addStep(
          "Left children were different, so these trees are not the same.",
          "RETURN false",
          4, 6, 9, 13,
          { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'left-result', result: false }
        );
        return false;
      }

      // Step 5: Recurse right
      addStep(
        "Left children match! Now checking right children.",
        "isSameTree(p.right, q.right)",
        4, 6, 9, 13,
        { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'recurse-right' }
      );
      const rightSame = check(p.right, q.right);

      const finalResult = rightSame;
      addStep(
        finalResult 
          ? "Both left and right children match! This subtree is the same."
          : "Right children were different.",
        `RETURN ${finalResult}`,
        4, 6, 9, 13,
        { pNodeId: pId, qNodeId: qId, pVal, qVal, checking: 'final-result', result: finalResult }
      );

      return finalResult;
    };

    check(pRoot, qRoot);
    return { steps, stepLineNumbers };
  }, [testCase]);

  const currentStep = steps[currentStepIndex] || steps[steps.length - 1];
  const pseudoSteps = steps.map(s => s.pseudoStep);

  const pTreeData = useMemo(() => getTreePositions(buildTreeWithIds(testCase.p, 'p')), [testCase.p]);
  const qTreeData = useMemo(() => getTreePositions(buildTreeWithIds(testCase.q, 'q')), [testCase.q]);

  const handleTestCaseChange = (tc: TestCase) => {
    setTestCase(tc);
    setCurrentStepIndex(0);
  };

  const TreeDisplay = ({ data, activeNodeId, title }: { data: any, activeNodeId: string | null, title: string }) => (
    <div className="flex flex-col items-center">
      <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase mb-2 tracking-widest">{title}</h4>
      <div className="relative w-full h-[160px] bg-primary/5 rounded-xl border border-primary/10 overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 300 160" className="overflow-visible">
          {data.edges.map((edge: any, i: number) => (
            <line
              key={i}
              x1={edge.x1}
              y1={edge.y1 - 10}
              x2={edge.x2}
              y2={edge.y2 - 10}
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
                  cy={node.y - 10}
                  r="15"
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
                  y={node.y - 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-[10px] font-mono font-bold ${
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
      {/* Case selections / Controls at Top */}
      <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="flex p-0.5 bg-muted rounded-lg border border-border w-fit shadow-inner">
          {testCases.map((tc) => {
            const Icon = tc.icon;
            const isSelected = testCase.id === tc.id;
            return (
              <button
                key={tc.id}
                onClick={() => handleTestCaseChange(tc)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-background text-foreground border border-border/50 shadow-sm font-bold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                {tc.name}
              </button>
            );
          })}
        </div>
        <div className="w-full pt-4 border-t border-border">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
        </div>
      </div>

      <VisualizationLayout
        leftContent={
          <div className="space-y-6">
            <Card className="p-6 overflow-hidden bg-gradient-to-b from-background to-primary/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Recursive Comparison</h3>
                  <p className="text-[10px] text-muted-foreground mt-1">{testCase.description}</p>
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
                          <Check className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Same Tree</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Different</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-6">
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
            </Card>

            {/* Descriptive Commentary Box (at the bottom) */}
            <div className="p-3 bg-muted/50 rounded-lg text-xs leading-relaxed text-foreground border border-border shadow-inner">
              <div className="flex items-center gap-2 mb-1 text-primary font-bold text-[10px] uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Process Step
              </div>
              {currentStep.explanation}
            </div>

            {/* Variable Panel (below the commentary box) */}
            <div className="pt-2">
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
    </div>
  );
};
