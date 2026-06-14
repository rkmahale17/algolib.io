import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { SimpleStepControls } from '../shared/SimpleStepControls';
import { VariablePanel } from '../shared/VariablePanel';
import { AnimatedCodeEditor } from '../shared/AnimatedCodeEditor';
import { VisualizationLayout } from '../shared/VisualizationLayout';

interface Step {
  currentNodeId: string | null;
  callStack: string[];
  nodeResults: Record<string, { balanced: boolean; height: number }>;
  highlightedLines: number[];
  explanation: string;
  variables: Record<string, any>;
}

export const BalancedBinaryTreeVisualization: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [caseType, setCaseType] = useState<'case1' | 'case2'>('case1');

  const { steps, positions, edges, nodes } = useMemo(() => {
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
    const nodeResults: Record<string, { balanced: boolean; height: number }> = {};
    const currentStack: string[] = [];

    const pushStep = (nodeId: string | null, lines: number[], exp: string, vars: any = {}) => {
      generatedSteps.push({
        currentNodeId: nodeId,
        callStack: [...currentStack],
        nodeResults: { ...nodeResults },
        highlightedLines: lines,
        explanation: exp,
        variables: { ...vars }
      });
    };

    const dfs = (nodeId: string | null, direction: string): [boolean, number] => {
      const isNull = nodeId === null;
      const val = isNull ? null : activeNodes[nodeId].val;

      if (!isNull) currentStack.push(nodeId);

      pushStep(nodeId, [2, 3], `dfs called on ${direction}. ${isNull ? 'Node is null.' : `Node value is ${val}.`}`);

      if (isNull) {
        pushStep(nodeId, [4], `Base case: null node is implicitly balanced and has height 0.`);
        return [true, 0];
      }

      pushStep(nodeId, [7], `Recursively calculate left subtree for node ${val}.`);
      const [leftBalanced, leftHeight] = dfs(activeNodes[nodeId].left, 'left child of ' + val);

      pushStep(nodeId, [8], `Recursively calculate right subtree for node ${val}.`);
      const [rightBalanced, rightHeight] = dfs(activeNodes[nodeId].right, 'right child of ' + val);

      const balanced = leftBalanced && rightBalanced && Math.abs(leftHeight - rightHeight) <= 1;
      pushStep(nodeId, [10], `Check if balanced: leftBalanced(${leftBalanced}) && rightBalanced(${rightBalanced}) && |${leftHeight} - ${rightHeight}| <= 1. Result: ${balanced}`, { leftBalanced, rightBalanced, leftHeight, rightHeight, diff: Math.abs(leftHeight - rightHeight), balanced });

      const height = 1 + Math.max(leftHeight, rightHeight);
      pushStep(nodeId, [11], `Calculate height: 1 + max(${leftHeight}, ${rightHeight}) = ${height}.`, { height });

      nodeResults[nodeId] = { balanced, height };

      pushStep(nodeId, [13], `Return [${balanced}, ${height}] for node ${val}.`);
      currentStack.pop();

      return [balanced, height];
    };

    pushStep(null, [16], `Start post-order DFS traversal from the root.`);
    const [isBal] = dfs(rootId, 'root');
    pushStep(null, [16], `DFS completed. The tree is ${isBal ? 'balanced' : 'NOT balanced'}.`, { isBalanced: isBal });

    return { steps: generatedSteps, positions: activePositions, edges: activeEdges, nodes: activeNodes };
  }, [caseType]);

  const handleCaseToggle = (type: 'case1' | 'case2') => {
    setCaseType(type);
    setCurrentStep(0);
  };

  const code = `function isBalanced(root: TreeNode | null): boolean {
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
}`;

  const step = steps[currentStep];

  const renderTree = () => {
    const nodeIds = Object.keys(positions);

    return (
      <div className="w-full aspect-[400/260] relative bg-card/60 backdrop-blur rounded-xl border border-border/50 shadow-sm flex items-center justify-center p-4">
        <svg viewBox="0 0 400 260" className="w-full h-full overflow-visible">
          {/* Edges */}
          {edges.map(([u, v], i) => (
            <line
              key={i}
              x1={positions[u].x} y1={positions[u].y}
              x2={positions[v].x} y2={positions[v].y}
              stroke="currentColor" className="text-border" strokeWidth="2"
            />
          ))}
          
          {/* Nodes */}
          {nodeIds.map(id => {
            const isCurrent = id === step.currentNodeId;
            const inStack = step.callStack.includes(id);
            const hasResult = id in step.nodeResults;
            const result = step.nodeResults[id];

            let fill = 'hsl(var(--card))';
            let stroke = 'hsl(var(--border))';
            let textColor = 'fill-foreground';

            if (isCurrent) {
              fill = '#3b82f6'; // primary
              stroke = '#3b82f6';
              textColor = 'fill-white';
            } else if (inStack) {
              fill = '#3b82f620';
              stroke = '#3b82f6';
            } else if (hasResult) {
              if (result.balanced) {
                fill = '#22c55e20'; // green
                stroke = '#22c55e';
              } else {
                fill = '#ef444420'; // red
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
                  className={`text-[12px] font-bold select-none ${textColor} transition-colors duration-200`}
                >
                  {nodes[id].val}
                </text>
                {/* Result Label */}
                {hasResult && !isCurrent && (
                  <text
                    x={positions[id].x + 22} y={positions[id].y - 12}
                    className={`text-[10px] font-bold ${result.balanced ? 'fill-green-500' : 'fill-red-500'}`}
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
        <AnimatedCodeEditor
          code={code}
          language="typescript"
          highlightedLines={step.highlightedLines}
        />
      }
    />
  );
};
