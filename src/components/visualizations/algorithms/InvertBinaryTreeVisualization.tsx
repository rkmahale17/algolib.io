import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  tree: (number | null)[];
  currentNode: number;
  swapped: boolean;
  message: string;
  lineNumber: number;
}

export const InvertBinaryTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { tree: [4,2,7,1,3,6,9], currentNode: -1, swapped: false, message: "Invert binary tree by swapping left and right children", lineNumber: 1 },
    { tree: [4,2,7,1,3,6,9], currentNode: 0, swapped: false, message: "At root (4): swap children 2 ↔ 7", lineNumber: 4 },
    { tree: [4,7,2,1,3,6,9], currentNode: 0, swapped: true, message: "Swapped! Tree now: [4,7,2,...]", lineNumber: 4 },
    { tree: [4,7,2,9,6,3,1], currentNode: 1, swapped: false, message: "At node 7: swap children 6 ↔ 9", lineNumber: 5 },
    { tree: [4,7,2,9,6,3,1], currentNode: 2, swapped: false, message: "At node 2: swap children 1 ↔ 3", lineNumber: 6 },
    { tree: [4,7,2,9,6,3,1], currentNode: -1, swapped: false, message: "Complete! Tree fully inverted. Time: O(n), Space: O(h)", lineNumber: 7 }
  ];

  const code = `function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null;
  
  // Swap left and right children
  [root.left, root.right] = [root.right, root.left];
  
  invertTree(root.left);
  invertTree(root.right);
  
  return root;
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
          <h3 className="text-lg font-semibold mb-4">Invert Binary Tree</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Tree Structure:</div>
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
                <div className="flex gap-4">
                  {currentStep.tree.slice(3, 7).map((val, idx) => (
                    <div key={idx} className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-secondary text-xs">
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {currentStep.swapped && (
              <div className="p-4 bg-green-500/20 rounded text-center">
                <div className="text-lg font-bold text-green-600">Children Swapped! ↔</div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Pattern:</strong> For each node, swap its left and right children, then recursively invert subtrees.
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
