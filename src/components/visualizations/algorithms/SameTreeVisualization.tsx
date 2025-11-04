import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  p: (number | null)[];
  q: (number | null)[];
  currentP: number;
  currentQ: number;
  message: string;
  lineNumber: number;
}

export const SameTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { p: [1,2,3], q: [1,2,3], currentP: -1, currentQ: -1, message: "Compare two binary trees p and q", lineNumber: 1 },
    { p: [1,2,3], q: [1,2,3], currentP: 0, currentQ: 0, message: "Root nodes: p=1, q=1. Values match ✓", lineNumber: 3 },
    { p: [1,2,3], q: [1,2,3], currentP: 1, currentQ: 1, message: "Left children: p=2, q=2. Values match ✓", lineNumber: 5 },
    { p: [1,2,3], q: [1,2,3], currentP: 2, currentQ: 2, message: "Right children: p=3, q=3. Values match ✓", lineNumber: 5 },
    { p: [1,2,3], q: [1,2,3], currentP: -1, currentQ: -1, message: "All nodes match! Trees are identical. Time: O(n), Space: O(h)", lineNumber: 7 }
  ];

  const code = `function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;
  
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`;

  const currentStep = steps[currentStepIndex];

  const renderTree = (tree: (number | null)[], label: string, currentIdx: number) => (
    <div>
      <div className="text-sm font-medium mb-2">{label}:</div>
      <div className="flex flex-col items-center p-4 bg-muted/30 rounded">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-4 ${
          currentIdx === 0 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
        }`}>
          {tree[0]}
        </div>
        <div className="flex gap-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            currentIdx === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
          }`}>
            {tree[1]}
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            currentIdx === 2 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
          }`}>
            {tree[2]}
          </div>
        </div>
      </div>
    </div>
  );

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
          <h3 className="text-lg font-semibold mb-4">Same Tree</h3>
          <div className="space-y-4">
            {renderTree(currentStep.p, "Tree p", currentStep.currentP)}
            {renderTree(currentStep.q, "Tree q", currentStep.currentQ)}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Strategy:</strong> Recursively compare nodes at same positions. Trees are identical if all corresponding nodes have same values.
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
