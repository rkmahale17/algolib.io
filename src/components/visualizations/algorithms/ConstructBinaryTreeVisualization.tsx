import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
  preorder: number[];
  inorder: number[];
  tree: (number | null)[];
  rootIdx: number;
  message: string;
  lineNumber: number;
}

export const ConstructBinaryTreeVisualization = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], tree: [], rootIdx: -1, message: "Build tree from preorder and inorder traversals", lineNumber: 1 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], tree: [3], rootIdx: 0, message: "Preorder[0]=3 is root. Find 3 in inorder at index 1", lineNumber: 8 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], tree: [3,9,null], rootIdx: 0, message: "Inorder left of 3: [9]. Build left subtree with preorder[1]=9", lineNumber: 11 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], tree: [3,9,20], rootIdx: 0, message: "Inorder right of 3: [15,20,7]. Build right subtree starting with preorder[2]=20", lineNumber: 12 },
    { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7], tree: [3,9,20,null,null,15,7], rootIdx: 0, message: "Complete tree! Time: O(n), Space: O(n)", lineNumber: 14 }
  ];

  const code = `function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  if (preorder.length === 0) return null;
  
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  
  // Find root in inorder
  const rootIdx = inorder.indexOf(rootVal);
  
  // Split arrays
  const leftInorder = inorder.slice(0, rootIdx);
  const rightInorder = inorder.slice(rootIdx + 1);
  const leftPreorder = preorder.slice(1, 1 + leftInorder.length);
  const rightPreorder = preorder.slice(1 + leftInorder.length);
  
  root.left = buildTree(leftPreorder, leftInorder);
  root.right = buildTree(rightPreorder, rightInorder);
  
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
          <h3 className="text-lg font-semibold mb-4">Construct Binary Tree</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Preorder (Root→Left→Right):</div>
              <div className="flex gap-2">
                {currentStep.preorder.map((val, idx) => (
                  <div key={idx} className={`px-3 py-2 rounded font-mono ${
                    idx === 0 && currentStepIndex > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>{val}</div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Inorder (Left→Root→Right):</div>
              <div className="flex gap-2">
                {currentStep.inorder.map((val, idx) => (
                  <div key={idx} className={`px-3 py-2 rounded font-mono ${
                    idx === currentStep.rootIdx && currentStepIndex > 0 ? 'bg-green-500/20 text-green-600' : 'bg-muted'
                  }`}>{val}</div>
                ))}
              </div>
            </div>
            {currentStep.tree.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Constructed Tree:</div>
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded gap-3">
                  {currentStep.tree[0] !== undefined && (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">
                      {currentStep.tree[0]}
                    </div>
                  )}
                  {currentStep.tree.length > 1 && (
                    <div className="flex gap-12">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">
                        {currentStep.tree[1] || '—'}
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-secondary">
                        {currentStep.tree[2] || '—'}
                      </div>
                    </div>
                  )}
                  {currentStep.tree.length > 3 && (
                    <div className="flex gap-4">
                      {currentStep.tree.slice(5, 7).map((val, idx) => (
                        <div key={idx} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-secondary">
                          {val || '—'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="p-4 bg-muted/50 rounded text-sm">{currentStep.message}</div>
            <div className="p-3 bg-blue-500/10 rounded text-xs">
              <strong>Key Insight:</strong> First element of preorder is root. Find it in inorder to split left/right subtrees. Recursively build.
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
