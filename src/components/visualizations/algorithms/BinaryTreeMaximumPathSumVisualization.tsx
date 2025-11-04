import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  tree: number[];
  currentNode: number;
  leftGain: number;
  rightGain: number;
  maxSum: number;
  message: string;
  lineNumber: number;
}

export const BinaryTreeMaximumPathSumVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { tree: [-10,9,20,-1,-1,15,7], currentNode: -1, leftGain: 0, rightGain: 0, maxSum: -Infinity, message: "Find maximum path sum in binary tree (path can start/end anywhere)", lineNumber: 1 },
    { tree: [-10,9,20,-1,-1,15,7], currentNode: 1, leftGain: 0, rightGain: 0, maxSum: 9, message: "Node 9 (leaf): max gain = 9, update maxSum = 9", lineNumber: 8 },
    { tree: [-10,9,20,-1,-1,15,7], currentNode: 5, leftGain: 0, rightGain: 0, maxSum: 15, message: "Node 15 (leaf): max gain = 15, update maxSum = 15", lineNumber: 8 },
    { tree: [-10,9,20,-1,-1,15,7], currentNode: 6, leftGain: 0, rightGain: 0, maxSum: 15, message: "Node 7 (leaf): max gain = 7", lineNumber: 8 },
    { tree: [-10,9,20,-1,-1,15,7], currentNode: 2, leftGain: 15, rightGain: 7, maxSum: 42, message: "Node 20: leftGain=15, rightGain=7. Path through node: 15+20+7=42! New max", lineNumber: 11 },
    { tree: [-10,9,20,-1,-1,15,7], currentNode: 0, leftGain: 9, rightGain: 35, maxSum: 42, message: "Root -10: gains from children. maxSum stays 42. Time: O(n), Space: O(h)", lineNumber: 14 }
  ];

  const code = `function maxPathSum(root: TreeNode | null): number {
  let maxSum = -Infinity;
  
  function maxGain(node: TreeNode | null): number {
    if (!node) return 0;
    
    const leftGain = Math.max(maxGain(node.left), 0);
    const rightGain = Math.max(maxGain(node.right), 0);
    
    // Path sum through current node
    const pathSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, pathSum);
    
    // Return max gain from this node upward
    return node.val + Math.max(leftGain, rightGain);
  }
  
  maxGain(root);
  return maxSum;
}`;

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(0)} disabled={currentStepIndex === 0}><RotateCcw className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0}><SkipBack className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1}><SkipForward className="h-4 w-4" /></Button>
          </div>
          <div className="text-sm">Step {currentStepIndex + 1} / {steps.length}</div>
        </div>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Binary Tree Maximum Path Sum</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Tree (values):</div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 ${
                  currentStep.currentNode === 0 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                }`}>
                  {currentStep.tree[0]}
                </div>
                <div className="flex gap-12 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.currentNode === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                  }`}>
                    {currentStep.tree[1]}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.currentNode === 2 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                  }`}>
                    {currentStep.tree[2]}
                  </div>
                </div>
                <div className="flex gap-16">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-xs">—</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-xs">—</div>
                  </div>
                  <div className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentStep.currentNode === 5 ? 'bg-primary text-primary-foreground ring-2 ring-primary' : 'bg-secondary'
                    }`}>
                      {currentStep.tree[5]}
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      currentStep.currentNode === 6 ? 'bg-primary text-primary-foreground ring-2 ring-primary' : 'bg-secondary'
                    }`}>
                      {currentStep.tree[6]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-blue-500/20 rounded text-center">
                <div className="text-xs">Left Gain</div>
                <div className="text-xl font-bold text-blue-600">{currentStep.leftGain}</div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded text-center">
                <div className="text-xs">Right Gain</div>
                <div className="text-xl font-bold text-blue-600">{currentStep.rightGain}</div>
              </div>
              <div className="p-3 bg-green-500/20 rounded text-center">
                <div className="text-xs">Max Sum</div>
                <div className="text-xl font-bold text-green-600">{currentStep.maxSum === -Infinity ? '—' : currentStep.maxSum}</div>
              </div>
            </div>
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Key Insight:</strong> For each node, calculate max path through it (node + left + right). Track global max. Return max gain upward.
            </div>
          </div>
        </Card>
        <Card className="p-6 overflow-hidden flex flex-col">
          <h3 className="text-lg font-semibold mb-4">TypeScript</h3>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter language="typescript" style={vscDarkPlus} showLineNumbers lineProps={(lineNumber) => ({ style: { backgroundColor: lineNumber === currentStep.lineNumber ? 'rgba(255, 255, 0, 0.2)' : 'transparent', display: 'block' } })}>
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </div>
    </div>
  );
};
