import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';

interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id: string;
  x?: number;
  y?: number;
}

interface Step {
  message: string;
  highlightedLines: number[];
  variables: Record<string, any>;
  builtNodes: Set<string>;
  currentNodeId: string | null;
  preorderRange: [number, number];
  inorderRange: [number, number];
  tree: TreeNode | null;
}

export const ConstructBinaryTreeVisualization = () => {
  const code = `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    if (!preorder.length || !inorder.length) return null;

    const rootVal = preorder[0];
    const root = new TreeNode(rootVal);
    const mid = inorder.indexOf(rootVal);

    root.left = buildTree(
        preorder.slice(1, mid + 1), 
        inorder.slice(0, mid)
    );
    root.right = buildTree(
        preorder.slice(mid + 1), 
        inorder.slice(mid + 1)
    );

    return root;
}`;

  const steps = useMemo(() => {
    const preorder = [3, 9, 20, 15, 7];
    const inorder = [9, 3, 15, 20, 7];
    const generatedSteps: Step[] = [];
    const builtNodes = new Set<string>();
    let idCounter = 0;

    function build(pre: number[], ino: number[]): TreeNode | null {
      const preStr = `[${pre.join(',')}]`;
      const inoStr = `[${ino.join(',')}]`;

      generatedSteps.push({
        message: `Calling buildTree with preorder=${preStr} and inorder=${inoStr}`,
        highlightedLines: [1],
        variables: { preorder: preStr, inorder: inoStr },
        builtNodes: new Set(builtNodes),
        currentNodeId: null,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null // Tree will be updated later
      });

      if (!pre.length || !ino.length) {
        generatedSteps.push({
          message: "Check if arrays are empty. They are!",
          highlightedLines: [2],
          variables: { 'pre.length': pre.length, 'ino.length': ino.length },
          builtNodes: new Set(builtNodes),
          currentNodeId: null,
          preorderRange: [0, pre.length],
          inorderRange: [0, ino.length],
          tree: null
        });
        return null;
      }

      generatedSteps.push({
        message: "Arrays not empty, continuing with construction.",
        highlightedLines: [2],
        variables: { 'pre.length': pre.length, 'ino.length': ino.length },
        builtNodes: new Set(builtNodes),
        currentNodeId: null,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null
      });

      const rootVal = pre[0];
      const nodeId = `node-${idCounter++}`;

      generatedSteps.push({
        message: `Root value is the first element of preorder: ${rootVal}`,
        highlightedLines: [4],
        variables: { rootVal, preorder: preStr },
        builtNodes: new Set(builtNodes),
        currentNodeId: nodeId,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null
      });

      const root: TreeNode = { val: rootVal, left: null, right: null, id: nodeId };
      builtNodes.add(nodeId);

      generatedSteps.push({
        message: `Create new TreeNode with value ${rootVal}`,
        highlightedLines: [5],
        variables: { rootVal, root: `Node(${rootVal})` },
        builtNodes: new Set(builtNodes),
        currentNodeId: nodeId,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null
      });

      const mid = ino.indexOf(rootVal);
      generatedSteps.push({
        message: `Find ${rootVal} in inorder to partition left and right subtrees. Found at index ${mid}.`,
        highlightedLines: [6],
        variables: { rootVal, mid, inorder: inoStr },
        builtNodes: new Set(builtNodes),
        currentNodeId: nodeId,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null
      });

      generatedSteps.push({
        message: `Recursively build the left subtree.`,
        highlightedLines: [8, 9, 10, 11],
        variables: {
          'leftPreorder': `[${pre.slice(1, mid + 1).join(',')}]`,
          'leftInorder': `[${ino.slice(0, mid).join(',')}]`
        },
        builtNodes: new Set(builtNodes),
        currentNodeId: nodeId,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null
      });

      root.left = build(pre.slice(1, mid + 1), ino.slice(0, mid));

      generatedSteps.push({
        message: `Left subtree for node ${rootVal} is built. Now building current node's right subtree.`,
        highlightedLines: [12, 13, 14, 15],
        variables: {
          rootVal,
          'rightPreorder': `[${pre.slice(mid + 1).join(',')}]`,
          'rightInorder': `[${ino.slice(mid + 1).join(',')}]`
        },
        builtNodes: new Set(builtNodes),
        currentNodeId: nodeId,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null
      });

      root.right = build(pre.slice(mid + 1), ino.slice(mid + 1));

      generatedSteps.push({
        message: `Successfully constructed tree rooted at ${rootVal}. Returning node.`,
        highlightedLines: [17],
        variables: { rootVal, 'root.left': root.left?.val ?? 'null', 'root.right': root.right?.val ?? 'null' },
        builtNodes: new Set(builtNodes),
        currentNodeId: nodeId,
        preorderRange: [0, pre.length],
        inorderRange: [0, ino.length],
        tree: null
      });

      return root;
    }

    const finalTree = build(preorder, inorder);

    // Patch steps with the partial tree state for better visualization
    // In a real implementation, we'd build the tree incrementally and capture state.
    // For this visualization, we'll use the final tree structure but dim nodes not yet built.
    const calculatePositions = (node: TreeNode | null, x: number, y: number, spacing: number) => {
      if (!node) return;
      node.x = x;
      node.y = y;
      calculatePositions(node.left, x - spacing, y + 60, spacing / 2);
      calculatePositions(node.right, x + spacing, y + 60, spacing / 2);
    };
    calculatePositions(finalTree, 200, 40, 100);

    return generatedSteps.map(s => ({ ...s, tree: finalTree }));
  }, []);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];

  const renderTree = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    const isBuilt = currentStep.builtNodes.has(node.id);
    const isActive = currentStep.currentNodeId === node.id;

    return (
      <g key={node.id}>
        {node.left && node.left.x !== undefined && node.left.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-all duration-300 ${isBuilt && currentStep.builtNodes.has(node.left.id) ? 'text-primary' : 'text-border opacity-20'}`}
          />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-all duration-300 ${isBuilt && currentStep.builtNodes.has(node.right.id) ? 'text-primary' : 'text-border opacity-20'}`}
          />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          className={`transition-all duration-300 ${isActive ? 'fill-primary stroke-primary scale-110 shadow-lg' : isBuilt ? 'fill-primary/20 stroke-primary' : 'fill-muted/20 stroke-border opacity-20'}`}
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          className={`text-xs font-medium transition-all duration-300 ${isBuilt || isActive ? 'fill-foreground' : 'fill-muted-foreground opacity-20'}`}
        >
          {node.val}
        </text>
        {renderTree(node.left)}
        {renderTree(node.right)}
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <SimpleStepControls
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onStepChange={setCurrentStepIndex}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Visualization & Details */}
        <div className="space-y-4">
          <Card className="p-6 bg-muted/30">
            <svg viewBox="0 0 400 240" className="w-full h-auto overflow-visible">
              {renderTree(currentStep.tree)}
            </svg>
          </Card>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-primary/5 border border-primary/20 rounded-lg p-4 shadow-sm"
            >
              <p className="text-sm font-medium text-foreground">
                {currentStep.message}
              </p>
            </motion.div>
          </AnimatePresence>

          <VariablePanel variables={currentStep.variables} />
        </div>

        {/* Right Column: Code Editor */}
        <Card className="overflow-hidden border-none shadow-none">
          <AnimatedCodeEditor
            code={code}
            highlightedLines={currentStep.highlightedLines}
            language="typescript"
          />
        </Card>
      </div>
    </div>
  );
};
