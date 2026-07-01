import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import { Check, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface TreeNode {
  val: number;
  left: number | null;
  right: number | null;
}

interface Step {
  currentNode: number | null;
  leftBound: number | string;
  rightBound: number | string;
  isValid: boolean | null;
  tree: Record<number, TreeNode>;
  message: string;
  pseudoStep: string;
  stackDepth: number;
}

const VALID_TREE: Record<number, TreeNode> = {
  5: { val: 5, left: 3, right: 7 },
  3: { val: 3, left: 2, right: 4 },
  7: { val: 7, left: 6, right: 8 },
  2: { val: 2, left: null, right: null },
  4: { val: 4, left: null, right: null },
  6: { val: 6, left: null, right: null },
  8: { val: 8, left: null, right: null },
};

const INVALID_TREE: Record<number, TreeNode> = {
  5: { val: 5, left: 1, right: 6 },
  1: { val: 1, left: null, right: null },
  6: { val: 6, left: 4, right: 7 },
  4: { val: 4, left: null, right: null },
  7: { val: 7, left: null, right: null },
};

const languages: VisualizationLanguageMap = {
  typescript: `function isValidBST(root: TreeNode | null): boolean {
  function valid(node: TreeNode | null, left: number, right: number): boolean {
    if (!node) return true;
    if (!(node.val > left && node.val < right)) {
      return false;
    }
    return valid(node.left, left, node.val) &&
           valid(node.right, node.val, right);
  }
  return valid(root, -Infinity, Infinity);
}`,
  python: `def isValidBST(root: TreeNode | None) -> bool:
    def valid(node: TreeNode | None, left: float, right: float) -> bool:
        if not node:
            return True
        if not (node.val < right and node.val > left):
            return False
        return (
            valid(node.left, left, node.val) and
            valid(node.right, node.val, right)
        )
    return valid(root, float('-inf'), float('inf'))`,
  java: `public static class Solution {
    public boolean isValidBST(TreeNode root) {
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }
    private boolean valid(TreeNode node, long left, long right) {
        if (node == null) {
            return true;
        }
        if (!(node.val < right && node.val > left)) {
            return false;
        }
        return valid(node.left, left, node.val) &&
               valid(node.right, node.val, right);
    }
}`,
  cpp: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        return valid(root, LONG_MIN, LONG_MAX);
    }
private:
    bool valid(TreeNode* node, long left, long right) {
        if (node == nullptr) {
            return true;
        }
        if (!(node->val < right && node->val > left)) {
            return false;
        }
        return valid(node->left, left, node->val) &&
               valid(node->right, node->val, right);
    }
};`
};

function generateSteps(tree: Record<number, TreeNode>, rootVal: number) {
  const steps: Step[] = [];
  const lineNumbers: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };

  const addStep = (
    node: number | null,
    left: number | string,
    right: number | string,
    isValid: boolean | null,
    msg: string,
    pseudo: string,
    stackDepth: number,
    ts: number, py: number, java: number, cpp: number
  ) => {
    steps.push({
      currentNode: node,
      leftBound: left,
      rightBound: right,
      isValid,
      tree,
      message: msg,
      pseudoStep: pseudo,
      stackDepth
    });
    lineNumbers.typescript!.push(ts);
    lineNumbers.python!.push(py);
    lineNumbers.java!.push(java);
    lineNumbers.cpp!.push(cpp);
  };

  addStep(
    rootVal, '-∞', '∞', null, 
    `Initialize BST validation for the root node ${rootVal} with range (-Infinity, Infinity).`, 
    `CALL isValidBST(root=${rootVal})`, 
    1, 10, 11, 3, 4
  );

  function valid(nodeId: number | null, left: number, right: number, depth: number): boolean {
    const leftStr = left === -Infinity ? '-∞' : left.toString();
    const rightStr = right === Infinity ? '∞' : right.toString();

    addStep(
      nodeId, leftStr, rightStr, null, 
      `Enter valid(${nodeId ?? 'null'}, ${leftStr}, ${rightStr}).`, 
      `CALL valid(node=${nodeId ?? 'null'}, left=${leftStr}, right=${rightStr})`, 
      depth, 2, 2, 5, 7
    );

    if (nodeId === null) {
      addStep(
        null, leftStr, rightStr, true, 
        "Base case: empty node is a valid BST.", 
        "IF node IS NULL RETURN true", 
        depth, 3, 3, 6, 8
      );
      return true;
    }

    const node = tree[nodeId];

    addStep(
      nodeId, leftStr, rightStr, null, 
      `Check if node ${nodeId} is null. It's not, so continue.`, 
      `IF node IS NULL`, 
      depth, 3, 3, 6, 8
    );

    const isValValid = node.val > left && node.val < right;
    if (!isValValid) {
      addStep(
        nodeId, leftStr, rightStr, false, 
        `VIOLATION! Value ${node.val} is NOT within (${leftStr}, ${rightStr}).`, 
        `IF NOT (left < node.val < right)  →  VIOLATES BST`, 
        depth, 4, 5, 9, 11
      );
      addStep(
        nodeId, leftStr, rightStr, false, 
        `Returning false for node ${node.val}.`, 
        `RETURN false`, 
        depth, 5, 6, 10, 12
      );
      return false;
    }

    addStep(
      nodeId, leftStr, rightStr, null, 
      `Check if node value ${node.val} is within range (${leftStr}, ${rightStr}). Yes (${leftStr} < ${node.val} < ${rightStr}).`, 
      `IF (left < node.val < right)  →  VALID ✓`, 
      depth, 4, 5, 9, 11
    );

    addStep(
      nodeId, leftStr, rightStr, null, 
      `Recursive call: Validate the LEFT subtree of node ${node.val}. New range is (${leftStr}, ${node.val}).`, 
      `SET left_valid = CALL valid(node.left, left=${leftStr}, right=${node.val})`, 
      depth, 7, 8, 12, 14
    );

    const leftValid = valid(node.left, left, node.val, depth + 1);
    if (!leftValid) {
      return false;
    }

    addStep(
      nodeId, leftStr, rightStr, null, 
      `Left subtree of ${node.val} is valid. Now validate node ${node.val}'s RIGHT subtree. New range is (${node.val}, ${rightStr}).`, 
      `SET right_valid = CALL valid(node.right, left=${node.val}, right=${rightStr})`, 
      depth, 8, 9, 13, 15
    );

    const rightValid = valid(node.right, node.val, right, depth + 1);
    if (!rightValid) {
      return false;
    }

    addStep(
      nodeId, leftStr, rightStr, true, 
      `Both subtrees of ${node.val} are valid. valid(${node.val}) returns true.`, 
      `RETURN true`, 
      depth, 7, 7, 12, 14
    );
    return true;
  }

  const result = valid(rootVal, -Infinity, Infinity, 1);
  addStep(
    rootVal, '-∞', '∞', result, 
    `Validation complete. Final result: ${result.toString()}.`, 
    `RETURN ${result.toString()}`, 
    1, 10, 11, 3, 4
  );

  return { steps, stepLineNumbers: lineNumbers };
}

export const ValidateBSTVisualization = () => {
  const [testCase, setTestCase] = useState<'valid' | 'invalid'>('valid');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const { steps, stepLineNumbers } = useMemo(() => {
    return generateSteps(testCase === 'valid' ? VALID_TREE : INVALID_TREE, 5);
  }, [testCase]);

  const currentStep = steps[currentStepIndex];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const variables = useMemo(() => ({
    node: currentStep.currentNode ? currentStep.currentNode : 'null',
    range: `(${currentStep.leftBound}, ${currentStep.rightBound})`,
    'node.val': currentStep.currentNode ?? 'N/A',
    isValid: currentStep.isValid === null ? 'Checking...' : currentStep.isValid.toString(),
    stackDepth: currentStep.stackDepth
  }), [currentStep]);

  const handleCaseChange = (newCase: 'valid' | 'invalid') => {
    setTestCase(newCase);
    setCurrentStepIndex(0);
  };

  const renderTree = () => {
    const isInvalidCase = testCase === 'invalid';

    const positions: Record<number, { x: number, y: number }> = isInvalidCase
      ? {
        5: { x: 200, y: 40 },
        1: { x: 120, y: 100 },
        6: { x: 280, y: 100 },
        4: { x: 240, y: 160 },
        7: { x: 320, y: 160 }
      }
      : {
        5: { x: 200, y: 40 },
        3: { x: 100, y: 100 },
        7: { x: 300, y: 100 },
        2: { x: 60, y: 160 },
        4: { x: 140, y: 160 },
        6: { x: 260, y: 160 },
        8: { x: 340, y: 160 }
      };

    const edges = isInvalidCase
      ? [
        { from: 5, to: 1 }, { from: 5, to: 6 },
        { from: 6, to: 4 }, { from: 6, to: 7 }
      ]
      : [
        { from: 5, to: 3 }, { from: 5, to: 7 },
        { from: 3, to: 2 }, { from: 3, to: 4 },
        { from: 7, to: 6 }, { from: 7, to: 8 }
      ];

    return (
      <div className="w-full aspect-[400/220] relative">
        <svg viewBox="0 0 400 220" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {edges.map((edge, i) => (
            <line
              key={i}
              x1={positions[edge.from].x}
              y1={positions[edge.from].y}
              x2={positions[edge.to].x}
              y2={positions[edge.to].y}
              stroke="currentColor"
              className="text-border"
              strokeWidth="2"
            />
          ))}

          {Object.entries(positions).map(([val, pos]) => {
            const value = parseInt(val);
            const isCurrent = currentStep.currentNode === value;
            const isViolator = currentStep.isValid === false && currentStep.currentNode === value;

            return (
              <g key={val}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  animate={{
                    fill: isViolator ? '#ef4444' : isCurrent ? '#3b82f6' : 'hsl(var(--card))',
                    scale: isCurrent ? 1.15 : 1,
                    stroke: isCurrent ? '#3b82f6' : 'hsl(var(--border))'
                  }}
                  strokeWidth="2"
                  transition={{ duration: 0 }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className={`text-[10px] font-bold select-none ${isCurrent ? 'fill-white' : 'fill-foreground'}`}
                >
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <VisualizationLayout
      controls={
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <SimpleStepControls
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            onStepChange={setCurrentStepIndex}
          />
          <div className="flex bg-muted rounded-lg p-1 shadow-inner border">
            <button
              onClick={() => handleCaseChange('valid')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all text-sm font-medium ${testCase === 'valid'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {testCase === 'valid' ? <ShieldCheck className="w-4 h-4 text-green-500" /> : <Check className="w-4 h-4" />}
              Valid BST
            </button>
            <button
              onClick={() => handleCaseChange('invalid')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all text-sm font-medium ${testCase === 'invalid'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {testCase === 'invalid' ? <ShieldAlert className="w-4 h-4 text-red-500" /> : <X className="w-4 h-4" />}
              Invalid Case
            </button>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 border-primary/5 shadow-lg overflow-hidden">
            {renderTree()}
          </Card>

          <div className="space-y-4">
            <Card className="p-4 bg-primary/5 border-2 border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={`${testCase}-${currentStepIndex}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-sm font-medium leading-relaxed"
                  >
                    {currentStep.message}
                  </motion.p>
                </AnimatePresence>
              </div>
            </Card>

            <VariablePanel variables={variables} />
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
  );
};
