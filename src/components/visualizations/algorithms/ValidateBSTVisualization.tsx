import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  tree: number[];
  currentNode: number;
  min: number;
  max: number;
  isValid: boolean | null;
  message: string;
  lineNumber: number;
}

export const ValidateBSTVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { tree: [2,1,3], currentNode: -1, min: -Infinity, max: Infinity, isValid: null, message: "Validate BST: left < root < right for ALL nodes", lineNumber: 1 },
    { tree: [2,1,3], currentNode: 0, min: -Infinity, max: Infinity, isValid: null, message: "Root 2: Check if -∞ < 2 < ∞. Valid! ✓", lineNumber: 4 },
    { tree: [2,1,3], currentNode: 1, min: -Infinity, max: 2, isValid: null, message: "Left child 1: Check if -∞ < 1 < 2. Valid! ✓", lineNumber: 6 },
    { tree: [2,1,3], currentNode: 2, min: 2, max: Infinity, isValid: null, message: "Right child 3: Check if 2 < 3 < ∞. Valid! ✓", lineNumber: 7 },
    { tree: [2,1,3], currentNode: -1, min: -Infinity, max: Infinity, isValid: true, message: "All nodes satisfy BST property! Time: O(n), Space: O(h)", lineNumber: 9 }
  ];

  const code = `function isValidBST(root: TreeNode | null, min = -Infinity, max = Infinity): boolean {
  if (!root) return true;
  
  // Check current node
  if (root.val <= min || root.val >= max) return false;
  
  // Check left subtree (all values < root.val)
  // Check right subtree (all values > root.val)
  return isValidBST(root.left, min, root.val) && 
         isValidBST(root.right, root.val, max);
}`;

  const currentStep = steps[currentStepIndex];

  const formatBound = (val: number) => {
    if (val === -Infinity) return '-∞';
    if (val === Infinity) return '∞';
    return val.toString();
  };

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
          <h3 className="text-lg font-semibold mb-4">Validate Binary Search Tree</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Tree:</div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  currentStep.currentNode === 0 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                }`}>
                  {currentStep.tree[0]}
                </div>
                <div className="flex gap-16">
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
              </div>
            </div>
            {currentStep.currentNode >= 0 && (
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-blue-500/20 rounded text-center">
                  <div className="text-xs">Min Bound</div>
                  <div className="text-xl font-bold text-blue-600">{formatBound(currentStep.min)}</div>
                </div>
                <div className="p-3 bg-blue-500/20 rounded text-center">
                  <div className="text-xs">Max Bound</div>
                  <div className="text-xl font-bold text-blue-600">{formatBound(currentStep.max)}</div>
                </div>
              </div>
            )}
            {currentStep.isValid !== null && (
              <div className={`p-4 rounded text-center ${currentStep.isValid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <div className={`text-lg font-bold ${currentStep.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStep.isValid ? '✓ Valid BST!' : '✗ Invalid BST'}
                </div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>BST Property:</strong> For each node, ALL left descendants &lt; node &lt; ALL right descendants. Use min/max bounds to validate.
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
