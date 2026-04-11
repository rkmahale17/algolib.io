import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { Check, X, ShieldCheck, ShieldAlert } from 'lucide-react';

interface TreeNode {
  val: number;
  left: number | null;
  right: number | null;
}

interface Step {
  currentNode: number | null;
  leftBound: number | string;
  rightBound: number | string;
  comparison?: string;
  isValid: boolean | null;
  tree: Record<number, TreeNode>;
  message: string;
  highlightedLines: number[];
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

export const ValidateBSTVisualization = () => {
  const [testCase, setTestCase] = useState<'valid' | 'invalid'>('valid');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const code = `function isValidBST(root: TreeNode | null): boolean {
  function valid(node: TreeNode | null, left: number, right: number): boolean {
    if (!node) return true;
    
    if (!(node.val > left && node.val < right)) {
      return false;
    }

    return valid(node.left, left, node.val) && 
           valid(node.right, node.val, right);
  }

  return valid(root, -Infinity, Infinity);
}`;

  const validSteps: Step[] = [
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: VALID_TREE, message: "Initialize BST validation for the root node 5 with range (-Infinity, Infinity).", highlightedLines: [13], stackDepth: 1 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: VALID_TREE, message: "Enter valid(5, -∞, ∞).", highlightedLines: [2], stackDepth: 1 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: VALID_TREE, message: "Check if node 5 is null. It's not, so continue.", highlightedLines: [3], stackDepth: 1 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: VALID_TREE, message: "Check if node value 5 is within range (-∞, ∞). Yes (-∞ < 5 < ∞).", highlightedLines: [5, 6, 7], stackDepth: 1 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: VALID_TREE, message: "Recursive call: Validate the LEFT subtree of node 5. New range is (-∞, 5).", highlightedLines: [9], stackDepth: 1 },
    
    // Node 3 (Left child of 5)
    { currentNode: 3, leftBound: '-∞', rightBound: 5, isValid: null, tree: VALID_TREE, message: "Enter valid(3, -∞, 5).", highlightedLines: [2], stackDepth: 2 },
    { currentNode: 3, leftBound: '-∞', rightBound: 5, isValid: null, tree: VALID_TREE, message: "Check value 3: Is -∞ < 3 < 5? Yes.", highlightedLines: [5, 6, 7], stackDepth: 2 },
    { currentNode: 3, leftBound: '-∞', rightBound: 5, isValid: null, tree: VALID_TREE, message: "Validate node 3's LEFT subtree. New range is (-∞, 3).", highlightedLines: [9], stackDepth: 2 },
    
    // Node 2 (Left child of 3)
    { currentNode: 2, leftBound: '-∞', rightBound: 3, isValid: null, tree: VALID_TREE, message: "At node 2: Is -∞ < 2 < 3? Yes.", highlightedLines: [2, 3, 5], stackDepth: 3 },
    { currentNode: 2, leftBound: '-∞', rightBound: 3, isValid: true, tree: VALID_TREE, message: "Node 2 is a leaf. Both children return true.", highlightedLines: [9, 10], stackDepth: 3 },
    
    // Back to Node 3
    { currentNode: 3, leftBound: '-∞', rightBound: 5, isValid: true, tree: VALID_TREE, message: "Left subtree of 3 is valid. Now validate node 3's RIGHT subtree. New range is (3, 5).", highlightedLines: [10], stackDepth: 2 },
    
    // Node 4 (Right child of 3)
    { currentNode: 4, leftBound: 3, rightBound: 5, isValid: null, tree: VALID_TREE, message: "At node 4: Is 3 < 4 < 5? Yes.", highlightedLines: [2, 3, 5], stackDepth: 3 },
    { currentNode: 4, leftBound: 3, rightBound: 5, isValid: true, tree: VALID_TREE, message: "Node 4 is a leaf. Both children return true.", highlightedLines: [9, 10], stackDepth: 3 },
    
    { currentNode: 3, leftBound: '-∞', rightBound: 5, isValid: true, tree: VALID_TREE, message: "Both subtrees of 3 are valid. valid(3) returns true.", highlightedLines: [9, 10], stackDepth: 2 },
    
    // Back to Root 5
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: true, tree: VALID_TREE, message: "Left subtree of 5 is valid. Now validate root 5's RIGHT subtree. New range is (5, ∞).", highlightedLines: [10], stackDepth: 1 },
    
    // Node 7 (Right child of 5)
    { currentNode: 7, leftBound: 5, rightBound: '∞', isValid: null, tree: VALID_TREE, message: "At node 7: Is 5 < 7 < ∞? Yes.", highlightedLines: [2, 3, 5], stackDepth: 2 },
    { currentNode: 7, leftBound: 5, rightBound: '∞', isValid: null, tree: VALID_TREE, message: "Validating children of 7 (nodes 6 and 8). Both satisfy their respective bounds.", highlightedLines: [9, 10], stackDepth: 2 },
    { currentNode: 7, leftBound: 5, rightBound: '∞', isValid: true, tree: VALID_TREE, message: "Node 7 and its subtree are valid.", highlightedLines: [9, 10], stackDepth: 2 },
    
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: true, tree: VALID_TREE, message: "All nodes satisfy the BST properties. Final result: true.", highlightedLines: [13], stackDepth: 1 }
  ];

  const invalidSteps: Step[] = [
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: INVALID_TREE, message: "Initialize BST validation for root 5 with range (-∞, ∞).", highlightedLines: [13], stackDepth: 1 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: INVALID_TREE, message: "Node 5 is within range (-∞ < 5 < ∞). Checking left subtree.", highlightedLines: [2, 3, 5], stackDepth: 1 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: null, tree: INVALID_TREE, message: "Recursive call: Validate LEFT subtree of 5. Range: (-∞, 5).", highlightedLines: [9], stackDepth: 1 },
    
    { currentNode: 1, leftBound: '-∞', rightBound: 5, isValid: true, tree: INVALID_TREE, message: "Node 1 is valid. Returning true.", highlightedLines: [2, 3, 5, 9, 10], stackDepth: 2 },
    
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: true, tree: INVALID_TREE, message: "Left subtree valid. Now validate root 5's RIGHT subtree. Range: (5, ∞).", highlightedLines: [10], stackDepth: 1 },
    
    { currentNode: 6, leftBound: 5, rightBound: '∞', isValid: null, tree: INVALID_TREE, message: "At node 6: Is 5 < 6 < ∞? Yes.", highlightedLines: [2, 3, 5], stackDepth: 2 },
    { currentNode: 6, leftBound: 5, rightBound: '∞', isValid: null, tree: INVALID_TREE, message: "Checking node 6's LEFT subtree. Range: (5, 6).", highlightedLines: [9], stackDepth: 2 },
    
    { currentNode: 4, leftBound: 5, rightBound: 6, isValid: null, tree: INVALID_TREE, message: "At node 4: Check if it's within range (5, 6).", highlightedLines: [2, 3, 5], stackDepth: 3 },
    { currentNode: 4, leftBound: 5, rightBound: 6, isValid: false, tree: INVALID_TREE, message: "VIOLATION! 4 is NOT > 5. This node is in the right subtree of 5, so it must be greater than 5.", highlightedLines: [5, 6], stackDepth: 3 },
    { currentNode: 4, leftBound: 5, rightBound: 6, isValid: false, tree: INVALID_TREE, message: "Returning false for node 4.", highlightedLines: [6], stackDepth: 3 },
    
    { currentNode: 6, leftBound: 5, rightBound: '∞', isValid: false, tree: INVALID_TREE, message: "Node 6's left subtree failed. valid(6) returns false.", highlightedLines: [9], stackDepth: 2 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: false, tree: INVALID_TREE, message: "Root 5's right subtree failed. Final result: false.", highlightedLines: [10], stackDepth: 1 },
    { currentNode: 5, leftBound: '-∞', rightBound: '∞', isValid: false, tree: INVALID_TREE, message: "The tree is NOT a valid BST.", highlightedLines: [13], stackDepth: 1 }
  ];

  const steps = testCase === 'valid' ? validSteps : invalidSteps;
  const currentStep = steps[currentStepIndex];

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
    const tree = currentStep.tree;
    const isInvalidCase = testCase === 'invalid';

    // Positions for tree nodes
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
          {/* Edges */}
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

          {/* Nodes */}
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
                    fill: isViolator ? '#ef4444' : isCurrent ? '#eab308' : 'hsl(var(--card))',
                    scale: isCurrent ? 1.15 : 1,
                    stroke: isCurrent ? '#eab308' : 'hsl(var(--border))'
                  }}
                  strokeWidth="2"
                  transition={{ duration: 0.3 }}
                />
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-foreground select-none"
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
    <div className="space-y-6">

      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-2 mx-auto">

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="lg:h-[calc(100vh-250px)] min-h-[500px]">
          <AnimatedCodeEditor
            code={code}
            language="typescript"
            highlightedLines={currentStep.highlightedLines}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
};
