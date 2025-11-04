import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  tree: (number | null)[];
  k: number;
  currentNode: number;
  inorderList: number[];
  result: number | null;
  message: string;
  lineNumber: number;
}

export const KthSmallestInBSTVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { tree: [3,1,4,null,2], k: 1, currentNode: -1, inorderList: [], result: null, message: "Find 1st smallest element in BST. Strategy: Inorder traversal gives sorted order", lineNumber: 1 },
    { tree: [3,1,4,null,2], k: 1, currentNode: 0, inorderList: [], result: null, message: "Start at root 3, traverse left first (BST property)", lineNumber: 3 },
    { tree: [3,1,4,null,2], k: 1, currentNode: 1, inorderList: [], result: null, message: "At node 1, go left to null, then visit 1", lineNumber: 5 },
    { tree: [3,1,4,null,2], k: 1, currentNode: 1, inorderList: [1], result: 1, message: "k=1, count=1. Found! 1st smallest = 1", lineNumber: 8 },
    { tree: [3,1,4,null,2], k: 1, currentNode: -1, inorderList: [1], result: 1, message: "Complete! Inorder traversal stops early at kth element. Time: O(H+k), Space: O(H)", lineNumber: 10 }
  ];

  const code = `function kthSmallest(root: TreeNode | null, k: number): number {
  let count = 0;
  let result = 0;
  
  function inorder(node: TreeNode | null): void {
    if (!node) return;
    
    inorder(node.left);
    count++;
    if (count === k) {
      result = node.val;
      return;
    }
    inorder(node.right);
  }
  
  inorder(root);
  return result;
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
          <h3 className="text-lg font-semibold mb-4">Kth Smallest in BST</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Binary Search Tree:</div>
              <div className="flex flex-col items-center p-4 bg-muted/30 rounded gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStep.currentNode === 0 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                }`}>3</div>
                <div className="flex gap-12">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep.currentNode === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary' : 'bg-secondary'
                  }`}>1</div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">4</div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-xs">∅</div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">2</div>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded">
              <div className="text-sm"><strong>k = {currentStep.k}</strong> (find {currentStep.k}st smallest)</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Inorder Traversal (sorted):</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.inorderList.map((val, idx) => (
                  <div key={idx} className="px-4 py-2 rounded font-mono bg-green-500/20 text-green-700 font-bold">
                    {val}
                  </div>
                ))}
                {currentStep.inorderList.length === 0 && <span className="text-muted-foreground text-sm">—</span>}
              </div>
            </div>
            {currentStep.result !== null && (
              <div className="p-4 bg-green-500/20 rounded text-center">
                <div className="text-lg font-bold text-green-600">Result: {currentStep.result}</div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
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
