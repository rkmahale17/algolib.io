import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  mainTree: number[];
  subTree: number[];
  currentNode: number;
  comparing: boolean;
  match: boolean | null;
  message: string;
  lineNumber: number;
}

export const SubtreeOfAnotherTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { mainTree: [3,4,5,1,2], subTree: [4,1,2], currentNode: -1, comparing: false, match: null, message: "Check if subTree exists as a subtree in mainTree", lineNumber: 1 },
    { mainTree: [3,4,5,1,2], subTree: [4,1,2], currentNode: 0, comparing: false, match: null, message: "At root 3: Does subtree match here? No (3 ≠ 4)", lineNumber: 3 },
    { mainTree: [3,4,5,1,2], subTree: [4,1,2], currentNode: 1, comparing: true, match: null, message: "At node 4: Values match! Check if entire subtrees match", lineNumber: 7 },
    { mainTree: [3,4,5,1,2], subTree: [4,1,2], currentNode: 1, comparing: true, match: true, message: "Node 4 and children (1,2) match subTree structure! ✓", lineNumber: 10 },
    { mainTree: [3,4,5,1,2], subTree: [4,1,2], currentNode: -1, comparing: false, match: true, message: "Found matching subtree! Time: O(m*n), Space: O(h)", lineNumber: 12 }
  ];

  const code = `function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
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
          <h3 className="text-lg font-semibold mb-4">Subtree of Another Tree</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Main Tree:</div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep.currentNode === 0 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                }`}>3</div>
                <div className="flex gap-12">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.currentNode === 1 && currentStep.comparing ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                  }`}>4</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">5</div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">1</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">2</div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">SubTree to Find:</div>
              <div className="flex flex-col items-center p-4 bg-green-500/10 rounded gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-green-500/30 text-green-700">4</div>
                <div className="flex gap-8">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-green-500/30 text-green-700">1</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-green-500/30 text-green-700">2</div>
                </div>
              </div>
            </div>
            {currentStep.match !== null && (
              <div className={`p-4 rounded text-center ${currentStep.match ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className={`text-lg font-bold ${currentStep.match ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStep.match ? '✓ Subtree Found!' : '✗ No Match'}
                </div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Approach:</strong> For each node in main tree, check if subtree rooted at that node matches subTree using isSameTree().
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
