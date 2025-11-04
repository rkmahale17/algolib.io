import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  tree: number[];
  p: number;
  q: number;
  currentNode: number;
  result: number | null;
  message: string;
  lineNumber: number;
}

export const LowestCommonAncestorBSTVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { tree: [6,2,8,0,4,7,9,null,null,3,5], p: 2, q: 8, currentNode: -1, result: null, message: "Find LCA of p=2 and q=8 in BST. Use BST property to traverse", lineNumber: 1 },
    { tree: [6,2,8,0,4,7,9,null,null,3,5], p: 2, q: 8, currentNode: 0, result: null, message: "At root 6: p=2 < 6 < q=8. Split point! 6 is LCA", lineNumber: 3 },
    { tree: [6,2,8,0,4,7,9,null,null,3,5], p: 2, q: 8, currentNode: 0, result: 6, message: "Found LCA = 6. Both nodes are in different subtrees", lineNumber: 5 },
    { tree: [6,2,8,0,4,7,9,null,null,3,5], p: 2, q: 8, currentNode: -1, result: 6, message: "Complete! Time: O(H), Space: O(1). BST property guides traversal", lineNumber: 7 }
  ];

  const code = `function lowestCommonAncestor(
  root: TreeNode | null, 
  p: TreeNode, 
  q: TreeNode
): TreeNode | null {
  let current = root;
  
  while (current) {
    if (p.val < current.val && q.val < current.val) {
      current = current.left;
    } else if (p.val > current.val && q.val > current.val) {
      current = current.right;
    } else {
      return current;
    }
  }
  
  return null;
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
          <h3 className="text-lg font-semibold mb-4">Lowest Common Ancestor of BST</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Binary Search Tree:</div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep.currentNode === 0 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 
                  currentStep.result === 6 ? 'bg-green-500/30 text-green-700' : 'bg-secondary'
                }`}>6</div>
                <div className="flex gap-12">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.p === 2 ? 'bg-blue-500/30 text-blue-700 ring-2 ring-blue-500' : 'bg-secondary'
                  }`}>2</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.q === 8 ? 'bg-purple-500/30 text-purple-700 ring-2 ring-purple-500' : 'bg-secondary'
                  }`}>8</div>
                </div>
                <div className="flex gap-20">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">0</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">4</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">7</div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">9</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="p-3 bg-blue-500/10 rounded flex-1">
                <div className="text-sm"><strong>p = {currentStep.p}</strong></div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded flex-1">
                <div className="text-sm"><strong>q = {currentStep.q}</strong></div>
              </div>
            </div>
            {currentStep.result !== null && (
              <div className="p-4 bg-green-500/20 rounded text-center">
                <div className="text-lg font-bold text-green-600">LCA: {currentStep.result}</div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Key Insight:</strong> In BST, LCA is the split point where p and q diverge to different subtrees.
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
