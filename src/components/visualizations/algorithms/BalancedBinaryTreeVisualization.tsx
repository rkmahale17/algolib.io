import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { VisualizationCodePanel } from '../shared/VisualizationCodePanel';
import { VisualizationLayout } from '../shared/VisualizationLayout';
import type { VisualizationLanguageMap, StepLineNumberMap } from '@/types/visualization';

interface Step {
  currentNodeId: string | null;
  callStack: string[];
  nodeResults: Record<string, { balanced: boolean; height: number }>;
  explanation: string;
  pseudoStep: string;
  variables: Record<string, any>;
}

const languages: VisualizationLanguageMap = {
  typescript: `function isBalanced(root: TreeNode | null): boolean {
  function dfs(node: TreeNode | null): [boolean, number] {
    if (!node) {
      return [true, 0];
    }
    const [leftBalanced, leftHeight] = dfs(node.left);
    const [rightBalanced, rightHeight] = dfs(node.right);
    const balanced = leftBalanced && rightBalanced && Math.abs(leftHeight - rightHeight) <= 1;
    const height = 1 + Math.max(leftHeight, rightHeight);
    return [balanced, height];
  }
  return dfs(root)[0];
}`,
  python: `def isBalanced(root: TreeNode | None) -> bool:
    def dfs(node: TreeNode | None) -> tuple[bool, int]:
        if not node:
            return True, 0
        left_balanced, left_height = dfs(node.left)
        right_balanced, right_height = dfs(node.right)
        current_node_balanced = (
            left_balanced and
            right_balanced and
            abs(left_height - right_height) <= 1
        )
        current_node_height = 1 + max(left_height, right_height)
        return current_node_balanced, current_node_height
    return dfs(root)[0]`,
  java: `public static class Solution {
    public boolean isBalanced(TreeNode root) {
        return dfs(root)[0] == 1;
    }
    private int[] dfs(TreeNode node) {
        if (node == null) {
            return new int[]{1, 0};
        }
        int[] leftResult = dfs(node.left);
        boolean leftBalanced = (leftResult[0] == 1);
        int leftHeight = leftResult[1];
        int[] rightResult = dfs(node.right);
        boolean rightBalanced = (rightResult[0] == 1);
        int rightHeight = rightResult[1];
        boolean currentBalanced = leftBalanced && rightBalanced && Math.abs(leftHeight - rightHeight) <= 1;
        int currentHeight = 1 + Math.max(leftHeight, rightHeight);
        return new int[]{(currentBalanced ? 1 : 0), currentHeight};
    }
}`,
  cpp: `class Solution {
public:
    bool isBalanced(TreeNode* root) {
        return dfs(root).first;
    }
    pair<bool, int> dfs(TreeNode* node) {
        if (!node) {
            return {true, 0};
        }
        pair<bool, int> left_result = dfs(node->left);
        pair<bool, int> right_result = dfs(node->right);
        bool current_node_balanced =
            left_result.first && 
            right_result.first && 
            abs(left_result.second - right_result.second) <= 1;
        int current_node_height = 1 + max(left_result.second, right_result.second);
        return {current_node_balanced, current_node_height};
    }
};`
};

export const BalancedBinaryTreeVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseType, setCaseType] = useState<'case1' | 'case2'>('case1');

  const { steps, stepLineNumbers, positions, edges, nodes } = useMemo(() => {
    const case1Nodes: Record<string, any> = {
      '3': { val: 3, left: '9', right: '20' },
      '9': { val: 9, left: null, right: null },
      '20': { val: 20, left: '15', right: '7' },
      '15': { val: 15, left: null, right: null },
      '7': { val: 7, left: null, right: null }
    };
    const case1Positions: Record<string, { x: number; y: number }> = {
      '3': { x: 200, y: 40 },
      '9': { x: 100, y: 120 },
      '20': { x: 300, y: 120 },
      '15': { x: 240, y: 200 },
      '7': { x: 360, y: 200 }
    };
    const case1Edges = [
      ['3', '9'], ['3', '20'], ['20', '15'], ['20', '7']
    ];

    const case2Nodes: Record<string, any> = {
      '1': { val: 1, left: '2L', right: '2R' },
      '2L': { val: 2, left: '3L', right: '3R' },
      '2R': { val: 2, left: null, right: null },
      '3L': { val: 3, left: '4L', right: '4R' },
      '3R': { val: 3, left: null, right: null },
      '4L': { val: 4, left: null, right: null },
      '4R': { val: 4, left: null, right: null }
    };
    const case2Positions: Record<string, { x: number; y: number }> = {
      '1': { x: 200, y: 40 },
      '2L': { x: 120, y: 90 },
      '2R': { x: 280, y: 90 },
      '3L': { x: 60, y: 150 },
      '3R': { x: 180, y: 150 },
      '4L': { x: 30, y: 210 },
      '4R': { x: 90, y: 210 }
    };
    const case2Edges = [
      ['1', '2L'], ['1', '2R'],
      ['2L', '3L'], ['2L', '3R'],
      ['3L', '4L'], ['3L', '4R']
    ];

    const activeNodes = caseType === 'case1' ? case1Nodes : case2Nodes;
    const activePositions = caseType === 'case1' ? case1Positions : case2Positions;
    const activeEdges = caseType === 'case1' ? case1Edges : case2Edges;
    const rootId = caseType === 'case1' ? '3' : '1';

    const generatedSteps: Step[] = [];
    const lines: StepLineNumberMap = { typescript: [], python: [], java: [], cpp: [] };
    const nodeResults: Record<string, { balanced: boolean; height: number }> = {};
    const currentStack: string[] = [];

    const pushStep = (
      nodeId: string | null,
      exp: string,
      pseudo: string,
      vars: any,
      ts: number, py: number, java: number, cpp: number
    ) => {
      generatedSteps.push({
        currentNodeId: nodeId,
        callStack: [...currentStack],
        nodeResults: { ...nodeResults },
        explanation: exp,
        pseudoStep: pseudo,
        variables: { ...vars }
      });
      lines.typescript!.push(ts);
      lines.python!.push(py);
      lines.java!.push(java);
      lines.cpp!.push(cpp);
    };

    const dfs = (nodeId: string | null, direction: string): [boolean, number] => {
      const isNull = nodeId === null;
      const val = isNull ? null : activeNodes[nodeId].val;

      if (!isNull) currentStack.push(nodeId);

      pushStep(
        nodeId, 
        `dfs called on ${direction}. ${isNull ? 'Node is null.' : `Node value is ${val}.`}`,
        `CALL dfs(node=${isNull ? 'null' : val})`,
        {},
        2, 2, 5, 6
      );

      if (isNull) {
        pushStep(
          nodeId,
          `Base case: null node is implicitly balanced and has height 0.`,
          "RETURN [true, 0]",
          {},
          4, 4, 7, 8
        );
        return [true, 0];
      }

      pushStep(
        nodeId,
        `Recursively calculate left subtree for node ${val}.`,
        "CALL dfs(node.left)",
        {},
        6, 5, 9, 10
      );
      const [leftBalanced, leftHeight] = dfs(activeNodes[nodeId].left, 'left child of ' + val);

      pushStep(
        nodeId,
        `Recursively calculate right subtree for node ${val}.`,
        "CALL dfs(node.right)",
        {},
        7, 6, 12, 11
      );
      const [rightBalanced, rightHeight] = dfs(activeNodes[nodeId].right, 'right child of ' + val);

      const balanced = leftBalanced && rightBalanced && Math.abs(leftHeight - rightHeight) <= 1;
      pushStep(
        nodeId,
        `Check if balanced: leftBalanced(${leftBalanced}) && rightBalanced(${rightBalanced}) && |${leftHeight} - ${rightHeight}| <= 1. Result: ${balanced}`,
        `SET balanced = left_balanced && right_balanced && |left_height - right_height| <= 1 → ${balanced}`,
        { leftBalanced, rightBalanced, leftHeight, rightHeight, diff: Math.abs(leftHeight - rightHeight), balanced },
        8, 7, 15, 12
      );

      const height = 1 + Math.max(leftHeight, rightHeight);
      pushStep(
        nodeId,
        `Calculate height: 1 + max(${leftHeight}, ${rightHeight}) = ${height}.`,
        `SET height = 1 + max(left_height, right_height) → ${height}`,
        { height },
        9, 12, 16, 16
      );

      nodeResults[nodeId] = { balanced, height };

      pushStep(
        nodeId,
        `Return [${balanced}, ${height}] for node ${val}.`,
        `RETURN [${balanced}, ${height}]`,
        {},
        10, 13, 17, 17
      );
      currentStack.pop();

      return [balanced, height];
    };

    pushStep(
      null,
      `Start post-order DFS traversal from the root.`,
      "isBalanced(root)",
      {},
      12, 14, 2, 3
    );
    const [isBal] = dfs(rootId, 'root');
    pushStep(
      null,
      `DFS completed. The tree is ${isBal ? 'balanced' : 'NOT balanced'}.`,
      `RETURN ${isBal}`,
      { isBalanced: isBal },
      12, 14, 3, 4
    );

    return { steps: generatedSteps, stepLineNumbers: lines, positions: activePositions, edges: activeEdges, nodes: activeNodes };
  }, [caseType]);

  const handleCaseToggle = (type: 'case1' | 'case2') => {
    setCaseType(type);
    setCurrentStep(0);
  };

  const step = steps[currentStep];
  const pseudoSteps = useMemo(() => steps.map(s => s.pseudoStep), [steps]);

  const renderTree = () => {
    const nodeIds = Object.keys(positions);

    return (
      <div className="w-full aspect-[400/260] relative bg-card/60 backdrop-blur rounded-xl border border-border/50 shadow-sm flex items-center justify-center p-4">
        <svg viewBox="0 0 400 260" className="w-full h-full overflow-visible">
          {edges.map(([u, v], i) => (
            <line
              key={i}
              x1={positions[u].x} y1={positions[u].y}
              x2={positions[v].x} y2={positions[v].y}
              stroke="currentColor" className="text-border" strokeWidth="2"
            />
          ))}
          
          {nodeIds.map(id => {
            const isCurrent = id === step.currentNodeId;
            const inStack = step.callStack.includes(id);
            const hasResult = id in step.nodeResults;
            const result = step.nodeResults[id];

            let fill = 'hsl(var(--card))';
            let stroke = 'hsl(var(--border))';
            let textColor = 'fill-foreground';

            if (isCurrent) {
              fill = '#3b82f6';
              stroke = '#3b82f6';
              textColor = 'fill-white';
            } else if (inStack) {
              fill = '#3b82f620';
              stroke = '#3b82f6';
            } else if (hasResult) {
              if (result.balanced) {
                fill = '#22c55e20';
                stroke = '#22c55e';
              } else {
                fill = '#ef444420';
                stroke = '#ef4444';
              }
            }

            return (
              <g key={id}>
                <circle
                  cx={positions[id].x} cy={positions[id].y} r="18"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="2"
                  className="transition-colors duration-200"
                />
                <text
                  x={positions[id].x} y={positions[id].y + 5} textAnchor="middle"
                  className={`text-[12px] font-bold select-none \${textColor} transition-colors duration-200`}
                >
                  {nodes[id].val}
                </text>
                {hasResult && !isCurrent && (
                  <text
                    x={positions[id].x + 22} y={positions[id].y - 12}
                    className={`text-[10px] font-bold \${result.balanced ? 'fill-green-500' : 'fill-red-500'}`}
                  >
                    h:{result.height}
                  </text>
                )}
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
        <div className="flex items-center gap-4 w-full justify-between">
          <SimpleStepControls
            currentStep={currentStep}
            totalSteps={steps.length}
            onStepChange={setCurrentStep}
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleCaseToggle('case1')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case1' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Balanced Tree
            </button>
            <button
              onClick={() => handleCaseToggle('case2')}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                caseType === 'case2' ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Unbalanced Tree
            </button>
          </div>
        </div>
      }
      leftContent={
        <div className="space-y-4">
          {renderTree()}

          <Card className="p-4 bg-muted/50 border-l-4 border-l-primary">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-primary">Current Step Explanation:</div>
              <div className="text-sm text-foreground pt-1 leading-relaxed">
                {step.explanation}
              </div>
            </div>
          </Card>

          <VariablePanel variables={step.variables} />
        </div>
      }
      rightContent={
        <VisualizationCodePanel
          languages={languages}
          stepLineNumbers={stepLineNumbers}
          pseudoSteps={pseudoSteps}
          activeStepIndex={currentStep}
          onLanguageChange={() => setCurrentStep(0)}
        />
      }
    />
  );
};
export default BalancedBinaryTreeVisualization;
